#!/usr/bin/env python3
"""Poll configured CRM inboxes and reconcile replies into Einfach Hausen CRM.

Built-in adapters: Gmail/SIN-Gmail account config, YouTube comments, optional
Mastodon notifications/conversations, optional Bluesky notifications/chat,
optional Reddit inbox, plus executable JSON hooks for other SIN connectors.
Unsupported/unconfigured adapters fail soft and are reported, never guessed.
"""
from __future__ import annotations
import argparse, email, importlib.util, json, os, re, subprocess, sys, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

HERE=Path(__file__).resolve().parent
AGENT_PATH=HERE/'crm-agent.py'
spec=importlib.util.spec_from_file_location('crm_agent',AGENT_PATH); agent=importlib.util.module_from_spec(spec); assert spec.loader; spec.loader.exec_module(agent)

OPT_OUT=('unsubscribe','abbestellen','nicht mehr anschreiben','keine werbung','kein interesse','bitte löschen','bitte loeschen','widerspreche','widerrufe')
BOUNCE=('delivery status notification','undeliverable','mail delivery subsystem','zustellung fehlgeschlagen','unzustellbar','delivery failure')


def run(argv,timeout=45):
    return subprocess.run(argv,text=True,capture_output=True,timeout=timeout,check=False)

def classify(subject:str,body:str,default='reply'):
    text=(subject+' '+body).casefold()
    if any(x in text for x in BOUNCE): return 'bounce'
    if any(x in text for x in OPT_OUT): return 'optout'
    return default

def ingest(db,event):
    ns=argparse.Namespace(provider=event.get('provider','unknown'),account=event.get('account',''),external_id=str(event['external_id']),lead_id=event.get('lead_id'),platform=event.get('platform',''),kind=event.get('kind','reply'),sender_key=event.get('sender_key',''),sender_label=event.get('sender_label',''),subject=event.get('subject',''),body=event.get('body',''),url=event.get('url',''),received_at=event.get('received_at',''))
    return agent.ingest_inbox(db,ns)

def gmail_accounts():
    p=run(['himalaya','account','list','-o','json'])
    if p.returncode: return []
    try: return [x['name'] for x in json.loads(p.stdout)]
    except Exception: return []

def watch_gmail(db,limit):
    out={'provider':'gmail','accounts':{},'events':0,'matched':0,'errors':[]}
    if not shutil_which('himalaya'):
        out['errors'].append('himalaya-missing'); return out
    for acct in gmail_accounts():
        p=run(['himalaya','envelope','list','-a',acct,'-s',str(limit),'-o','json'])
        if p.returncode:
            out['errors'].append(f'{acct}:list-failed'); continue
        try: envs=json.loads(p.stdout)
        except Exception:
            out['errors'].append(f'{acct}:json-invalid'); continue
        seen=matched=0
        for e in envs:
            mid=str(e.get('id','')); sender=(e.get('from') or {}).get('addr',''); subj=e.get('subject') or ''
            if not mid or not sender: continue
            existing=db.execute("SELECT 1 FROM crm_inbox_events WHERE provider='gmail' AND account=? AND external_id=?",(acct,mid)).fetchone()
            if existing: continue
            lead_id=agent.find_lead(db,sender,'')
            is_bounce=any(x in (sender+' '+subj).casefold() for x in ('mailer-daemon','postmaster','delivery','unzustell'))
            if not lead_id and not is_bounce: continue
            body=''
            rp=run(['himalaya','message','read',mid,'-a',acct,'-o','json'])
            if rp.returncode==0:
                try: body=json.loads(rp.stdout)
                except Exception: body=rp.stdout
            kind=classify(subj,body)
            # Bounce messages originate from a daemon; recover destination from body.
            if kind=='bounce' and not lead_id:
                emails=re.findall(r'[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}',body,re.I)
                for addr in emails:
                    candidate=agent.find_lead(db,addr,'')
                    if candidate: lead_id=candidate; sender=addr; break
            result=ingest(db,{'provider':'gmail','account':acct,'external_id':mid,'lead_id':lead_id,'kind':kind,'sender_key':sender,'sender_label':(e.get('from') or {}).get('name',''),'subject':subj,'body':body,'received_at':e.get('date','')})
            seen+=1; matched+=int(bool(result.get('leadId')))
        out['accounts'][acct]={'newEvents':seen,'matched':matched}; out['events']+=seen; out['matched']+=matched
    return out

def shutil_which(name):
    import shutil; return shutil.which(name)

def load_youtube_api():
    candidates=[os.environ.get('SIN_YOUTUBE_API_PY',''),str(Path.home()/'.wow-my-zsh/shared/skills/sin-youtube/scripts/youtube_api.py'),str(Path.home()/'dev/wow-my-zsh-runtime/shared/skills/sin-youtube/scripts/youtube_api.py')]
    for raw in candidates:
        if raw and Path(raw).is_file():
            s=importlib.util.spec_from_file_location('sin_youtube_api',raw); m=importlib.util.module_from_spec(s); assert s.loader; s.loader.exec_module(m); return m
    return None

def watch_youtube(db,limit):
    out={'provider':'youtube','events':0,'matched':0,'errors':[]}
    mod=load_youtube_api()
    token=os.environ.get('YOUTUBE_OAUTH_TOKEN',str(Path.home()/'.config/sin-youtube/accounts/systemfehler-nach-din-oauth-token.json'))
    client=os.environ.get('YOUTUBE_OAUTH_CLIENT_SECRETS',str(Path.home()/'.config/google/sin-google-apps-oauth-client.json'))
    if not mod or not Path(token).is_file() or not Path(client).is_file():
        out['errors'].append('youtube-oauth-unconfigured'); return out
    try:
        api=mod.YouTubeApi(client,token); ch=api.channel(); channel_id=ch['id']
        params={'part':'snippet','allThreadsRelatedToChannelId':channel_id,'maxResults':min(100,limit),'order':'time','textFormat':'plainText'}
        data=api.request_json('GET',f"{mod.API_ROOT}/commentThreads?{urllib.parse.urlencode(params)}")
        for th in data.get('items',[]):
            top=((th.get('snippet') or {}).get('topLevelComment') or {}); cid=str(top.get('id','')); sn=top.get('snippet') or {}
            author_id=((sn.get('authorChannelId') or {}).get('value') or '')
            if not cid or author_id==channel_id: continue
            if db.execute("SELECT 1 FROM crm_inbox_events WHERE provider='youtube' AND external_id=?",(cid,)).fetchone(): continue
            profile=sn.get('authorChannelUrl') or (f'https://www.youtube.com/channel/{author_id}' if author_id else '')
            platform,handle,key=agent.social_parts(profile)
            lead_id=agent.find_lead(db,key or profile,'youtube')
            body=sn.get('textDisplay') or sn.get('textOriginal') or ''
            video_id=(th.get('snippet') or {}).get('videoId','')
            result=ingest(db,{'provider':'youtube','account':channel_id,'external_id':cid,'lead_id':lead_id,'platform':'youtube','kind':'comment','sender_key':key or profile,'sender_label':sn.get('authorDisplayName',''),'body':body,'url':f'https://www.youtube.com/watch?v={video_id}&lc={cid}' if video_id else profile,'received_at':sn.get('publishedAt','')})
            out['events']+=1; out['matched']+=int(bool(result.get('leadId')))
    except Exception as exc: out['errors'].append(str(exc)[:240])
    return out

def http_json(url,headers=None,data=None,timeout=30):
    req=urllib.request.Request(url,data=data,headers={'User-Agent':'SIN-Lead-Outreach/1.0',**(headers or {})})
    with urllib.request.urlopen(req,timeout=timeout) as r: return json.loads(r.read().decode())

def watch_mastodon(db,limit):
    base=os.environ.get('MASTODON_BASE_URL','').rstrip('/'); token=os.environ.get('MASTODON_ACCESS_TOKEN','')
    out={'provider':'mastodon','events':0,'matched':0,'errors':[]}
    if not base or not token: out['errors'].append('mastodon-token-unconfigured'); return out
    try:
        data=http_json(base+'/api/v1/notifications?'+urllib.parse.urlencode({'limit':min(80,limit)}),{'Authorization':'Bearer '+token})
        for n in data:
            eid=str(n.get('id','')); account=n.get('account') or {}; status=n.get('status') or {}; sender=account.get('acct',''); url=status.get('url') or account.get('url','')
            if not eid or db.execute("SELECT 1 FROM crm_inbox_events WHERE provider='mastodon' AND external_id=?",(eid,)).fetchone(): continue
            kind='dm' if status.get('visibility')=='direct' else 'mention' if n.get('type')=='mention' else 'reply'
            lead_id=agent.find_lead(db,sender,'mastodon')
            body=re.sub('<[^>]+>',' ',status.get('content',''))
            result=ingest(db,{'provider':'mastodon','external_id':eid,'lead_id':lead_id,'platform':'mastodon','kind':kind,'sender_key':sender.casefold(),'sender_label':account.get('display_name') or sender,'body':body,'url':url,'received_at':n.get('created_at','')})
            out['events']+=1; out['matched']+=int(bool(result.get('leadId')))
    except Exception as exc: out['errors'].append(str(exc)[:240])
    return out

def watch_bluesky(db,limit):
    ident=os.environ.get('BLUESKY_IDENTIFIER',''); password=os.environ.get('BLUESKY_APP_PASSWORD','')
    out={'provider':'bluesky','events':0,'matched':0,'errors':[]}
    if not ident or not password: out['errors'].append('bluesky-auth-unconfigured'); return out
    try:
        session=http_json('https://bsky.social/xrpc/com.atproto.server.createSession',{'Content-Type':'application/json'},json.dumps({'identifier':ident,'password':password}).encode())
        token=session['accessJwt']; headers={'Authorization':'Bearer '+token}
        data=http_json('https://bsky.social/xrpc/app.bsky.notification.listNotifications?'+urllib.parse.urlencode({'limit':min(100,limit)}),headers)
        for n in data.get('notifications',[]):
            uri=n.get('uri',''); author=n.get('author') or {}; handle=author.get('handle',''); reason=n.get('reason','')
            eid=uri+'|'+reason
            if not uri or db.execute("SELECT 1 FROM crm_inbox_events WHERE provider='bluesky' AND external_id=?",(eid,)).fetchone(): continue
            record=n.get('record') or {}; text=record.get('text',''); lead_id=agent.find_lead(db,handle,'bluesky')
            result=ingest(db,{'provider':'bluesky','external_id':eid,'lead_id':lead_id,'platform':'bluesky','kind':'mention' if reason=='mention' else 'reply','sender_key':handle.casefold(),'sender_label':author.get('displayName') or handle,'body':text,'url':author.get('handle') and f'https://bsky.app/profile/{handle}' or '','received_at':n.get('indexedAt','')})
            out['events']+=1; out['matched']+=int(bool(result.get('leadId')))
    except Exception as exc: out['errors'].append(str(exc)[:240])
    return out

def watch_reddit(db,limit):
    token=os.environ.get('REDDIT_ACCESS_TOKEN',''); ua=os.environ.get('REDDIT_USER_AGENT','SIN-Lead-Outreach/1.0')
    out={'provider':'reddit','events':0,'matched':0,'errors':[]}
    if not token: out['errors'].append('reddit-oauth-unconfigured'); return out
    try:
        data=http_json('https://oauth.reddit.com/message/inbox?'+urllib.parse.urlencode({'limit':min(100,limit)}),{'Authorization':'Bearer '+token,'User-Agent':ua})
        for child in ((data.get('data') or {}).get('children') or []):
            x=child.get('data') or {}; eid=x.get('name') or x.get('id',''); sender=x.get('author') or ''
            if not eid or db.execute("SELECT 1 FROM crm_inbox_events WHERE provider='reddit' AND external_id=?",(eid,)).fetchone(): continue
            lead_id=agent.find_lead(db,sender.casefold(),'reddit'); body=x.get('body') or ''; kind=classify(x.get('subject') or '',body,'dm' if x.get('was_comment') is False else 'comment')
            result=ingest(db,{'provider':'reddit','external_id':eid,'lead_id':lead_id,'platform':'reddit','kind':kind,'sender_key':sender.casefold(),'sender_label':sender,'subject':x.get('subject') or '','body':body,'url':'https://reddit.com'+(x.get('context') or '') if x.get('context') else '','received_at':datetime.fromtimestamp(x.get('created_utc') or 0,tz=timezone.utc).isoformat() if x.get('created_utc') else ''})
            out['events']+=1; out['matched']+=int(bool(result.get('leadId')))
    except Exception as exc: out['errors'].append(str(exc)[:240])
    return out

def watch_hooks(db):
    root=Path(os.environ.get('SIN_LEAD_INBOX_HOOKS',str(Path.home()/'.config/sin/lead-outreach/inbox-hooks.d'))).expanduser(); out={'provider':'hooks','events':0,'matched':0,'errors':[]}
    if not root.is_dir(): return out
    for hook in sorted(root.iterdir()):
        if not hook.is_file() or not os.access(hook,os.X_OK): continue
        p=run([str(hook)],60)
        if p.returncode: out['errors'].append(f'{hook.name}:exit-{p.returncode}'); continue
        try: events=json.loads(p.stdout); events=events if isinstance(events,list) else events.get('events',[])
        except Exception: out['errors'].append(f'{hook.name}:invalid-json'); continue
        for event in events:
            if not isinstance(event,dict) or not event.get('external_id'): continue
            result=ingest(db,event); out['events']+=int(not result.get('duplicate')); out['matched']+=int(bool(result.get('leadId')))
    return out

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--db',default=agent.DB_DEFAULT); ap.add_argument('--limit',type=int,default=60); ap.add_argument('--providers',default='gmail,youtube,mastodon,bluesky,reddit,hooks'); args=ap.parse_args()
    db=agent.conn(args.db)
    try:
        if db.execute('SELECT count(*) FROM crm_identity_keys').fetchone()[0]==0: agent.rebuild_keys(db)
        wanted={x.strip() for x in args.providers.split(',') if x.strip()}; results=[]
        for name,fn in [('gmail',watch_gmail),('youtube',watch_youtube),('mastodon',watch_mastodon),('bluesky',watch_bluesky),('reddit',watch_reddit)]:
            if name in wanted: results.append(fn(db,args.limit))
        if 'hooks' in wanted: results.append(watch_hooks(db))
        print(json.dumps({'ok':True,'checkedAt':datetime.now(timezone.utc).isoformat(),'results':results,'crm':agent.stats(db)},ensure_ascii=False,indent=2))
    finally: db.close()

if __name__=='__main__': main()
