#!/usr/bin/env python3
"""Simple multi-channel CRM worker primitives for Einfach Hausen.

Keeps global identity/delivery dedupe, contact history, agent locks and inbox
reconciliation in the existing SQLite CRM. It never invents recipients and
never bypasses platform/account restrictions.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sqlite3
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse

DB_DEFAULT = os.path.abspath(os.environ.get("DATABASE_PATH", "data/einfach-hausen.db"))
SEND_PERMISSIONS = {"allowed", "consented"}
BLOCK_PERMISSIONS = {"denied", "do_not_contact"}
SOCIAL_HOSTS = {
    "instagram.com": "instagram", "www.instagram.com": "instagram",
    "facebook.com": "facebook", "www.facebook.com": "facebook",
    "threads.net": "threads", "www.threads.net": "threads",
    "linkedin.com": "linkedin", "www.linkedin.com": "linkedin",
    "x.com": "x", "twitter.com": "x", "www.x.com": "x", "www.twitter.com": "x",
    "reddit.com": "reddit", "www.reddit.com": "reddit",
    "youtube.com": "youtube", "www.youtube.com": "youtube", "youtu.be": "youtube",
    "bsky.app": "bluesky", "www.bsky.app": "bluesky",
    "mastodon.social": "mastodon",
}

SCHEMA = """
CREATE TABLE IF NOT EXISTS crm_identity_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL,
  key_value TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key_type,key_value,platform)
);
CREATE INDEX IF NOT EXISTS idx_crm_identity_lead ON crm_identity_keys(lead_id);
CREATE TABLE IF NOT EXISTS crm_duplicate_links (
  duplicate_lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  canonical_lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL,
  key_value TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(duplicate_lead_id,canonical_lead_id,key_type,key_value)
);
CREATE TABLE IF NOT EXISTS crm_campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS crm_contact_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT '',
  direction TEXT NOT NULL,
  destination TEXT NOT NULL DEFAULT '',
  destination_key TEXT NOT NULL DEFAULT '',
  contact_kind TEXT NOT NULL DEFAULT 'initial',
  sequence_no INTEGER NOT NULL DEFAULT 0,
  external_message_id TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'recorded',
  message_hash TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_crm_contact_delivery
  ON crm_contact_history(channel,destination_key,contact_kind,sequence_no)
  WHERE direction='outbound' AND destination_key!='';
CREATE INDEX IF NOT EXISTS idx_crm_contact_lead ON crm_contact_history(lead_id,created_at DESC);
CREATE TABLE IF NOT EXISTS crm_agent_locks (
  lead_id TEXT PRIMARY KEY REFERENCES crm_leads(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  claimed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS crm_inbox_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,
  account TEXT NOT NULL DEFAULT '',
  external_id TEXT NOT NULL,
  lead_id TEXT REFERENCES crm_leads(id) ON DELETE SET NULL,
  event_kind TEXT NOT NULL DEFAULT 'reply',
  sender_key TEXT NOT NULL DEFAULT '',
  sender_label TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT '',
  body_excerpt TEXT NOT NULL DEFAULT '',
  message_url TEXT NOT NULL DEFAULT '',
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider,account,external_id)
);
CREATE INDEX IF NOT EXISTS idx_crm_inbox_unprocessed ON crm_inbox_events(processed_at,received_at DESC);
CREATE TABLE IF NOT EXISTS crm_followups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL,
  sequence_no INTEGER NOT NULL,
  due_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lead_id,channel,sequence_no)
);
"""


def conn(path: str) -> sqlite3.Connection:
    db = sqlite3.connect(os.path.abspath(os.path.expanduser(path)), timeout=30)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys=ON")
    db.execute("PRAGMA journal_mode=WAL")
    db.executescript(SCHEMA)
    return db


def norm_email(v: str) -> str:
    return (v or "").strip().lower()


def norm_phone(v: str) -> str:
    raw = re.sub(r"\D+", "", v or "")
    if raw.startswith("00"): raw = raw[2:]
    if raw.startswith("0") and len(raw) >= 8: raw = "49" + raw[1:]
    return raw


def domain_of(v: str) -> str:
    raw = (v or "").strip().lower()
    if "@" in raw and not raw.startswith("http"):
        return raw.rsplit("@", 1)[1]
    if raw and "://" not in raw:
        raw = "https://" + raw
    try:
        host = (urlparse(raw).hostname or "").lower()
        return host[4:] if host.startswith("www.") else host
    except Exception:
        return ""


def social_parts(url: str) -> tuple[str, str, str]:
    raw = (url or "").strip()
    if not raw: return "", "", ""
    try:
        p = urlparse(raw if "://" in raw else "https://" + raw)
    except Exception:
        return "", "", ""
    host = (p.hostname or "").lower()
    platform = SOCIAL_HOSTS.get(host, "mastodon" if "mastodon" in host else "fediverse" if host else "")
    parts = [x for x in p.path.split("/") if x]
    handle = ""
    if platform == "instagram" and parts: handle = parts[0].lstrip("@")
    elif platform == "facebook" and parts: handle = parts[0]
    elif platform == "threads" and parts: handle = parts[0].lstrip("@")
    elif platform == "linkedin" and len(parts) > 1: handle = "/".join(parts[:2])
    elif platform in {"x", "reddit"} and len(parts) > 1 and parts[0] in {"u","user"}: handle = parts[1]
    elif platform == "x" and parts: handle = parts[0]
    elif platform == "bluesky" and len(parts) > 1 and parts[0] == "profile": handle = parts[1]
    elif platform in {"mastodon", "fediverse"} and parts: handle = parts[0].lstrip("@")
    elif platform == "youtube" and parts: handle = "/".join(parts[:2])
    key = (handle or raw).casefold()
    return platform, handle, key


def lead_keys(row: sqlite3.Row) -> list[tuple[str,str,str]]:
    out: list[tuple[str,str,str]] = []
    e = norm_email(row["email"])
    if e: out.append(("email", e, ""))
    p = norm_phone(row["phone"])
    if p: out.append(("phone", p, ""))
    d = domain_of(row["website"] or row["email"])
    if d: out.append(("domain", d, ""))
    social_urls = []
    if row["profile_url"]: social_urls.append(row["profile_url"])
    try:
        social_urls += [x for x in json.loads(row["socials_json"] or "[]") if isinstance(x,str)]
    except Exception: pass
    seen = set()
    for u in social_urls:
        platform, handle, key = social_parts(u)
        if key and (platform,key) not in seen:
            seen.add((platform,key)); out.append(("social_handle", key, platform))
        if platform and u:
            out.append(("platform_id", u.strip().casefold(), platform))
    return out


def rebuild_keys(db: sqlite3.Connection) -> dict:
    db.execute("DELETE FROM crm_identity_keys")
    db.execute("DELETE FROM crm_duplicate_links")
    inserted = duplicates = 0
    rows = db.execute("SELECT id,email,phone,website,profile_url,socials_json FROM crm_leads ORDER BY created_at,id")
    for row in rows:
        for kind, value, platform in lead_keys(row):
            try:
                db.execute("INSERT INTO crm_identity_keys(lead_id,key_type,key_value,platform) VALUES(?,?,?,?)", (row["id"],kind,value,platform))
                inserted += 1
            except sqlite3.IntegrityError:
                canonical = db.execute("SELECT lead_id FROM crm_identity_keys WHERE key_type=? AND key_value=? AND platform=?", (kind,value,platform)).fetchone()
                if canonical and canonical[0] != row["id"]:
                    db.execute("INSERT OR IGNORE INTO crm_duplicate_links(duplicate_lead_id,canonical_lead_id,key_type,key_value) VALUES(?,?,?,?)", (row["id"],canonical[0],kind,value))
                    duplicates += 1
    db.commit()
    return {"identityKeys": inserted, "duplicateLinks": duplicates}


def route_lead(db: sqlite3.Connection, lead_id: str) -> dict:
    row = db.execute("SELECT * FROM crm_leads WHERE id=?", (lead_id,)).fetchone()
    if not row: raise SystemExit("lead not found")
    choices = []
    if row["email"]:
        choices.append({"channel":"email","platform":"gmail","destination":row["email"],"destinationKey":norm_email(row["email"])})
    social_urls=[]
    if row["profile_url"]: social_urls.append(row["profile_url"])
    try: social_urls += json.loads(row["socials_json"] or "[]")
    except Exception: pass
    for u in social_urls:
        if not isinstance(u,str) or not u: continue
        platform, handle, key = social_parts(u)
        if platform:
            choices.append({"channel":"social","platform":platform,"destination":u,"destinationKey":f"{platform}:{key}"})
    if row["phone"]:
        choices.append({"channel":"phone","platform":"phone","destination":row["phone"],"destinationKey":norm_phone(row["phone"])})
    if row["website"]:
        choices.append({"channel":"website","platform":"web","destination":row["website"],"destinationKey":domain_of(row["website"])})
    return {"lead":dict(row),"choices":choices}


def destination_already_contacted(db: sqlite3.Connection, channel: str, key: str, kind: str="initial", sequence: int=0) -> bool:
    return db.execute("SELECT 1 FROM crm_contact_history WHERE direction='outbound' AND channel=? AND destination_key=? AND contact_kind=? AND sequence_no=? LIMIT 1", (channel,key,kind,sequence)).fetchone() is not None


def claim(db: sqlite3.Connection, agent: str, ttl: int, channel: str | None) -> dict:
    now = datetime.now(timezone.utc)
    db.execute("DELETE FROM crm_agent_locks WHERE expires_at<=?", (now.isoformat(),))
    rows = db.execute("SELECT * FROM crm_leads WHERE status IN ('queued','contact_ready','collected') AND contact_permission NOT IN ('denied','do_not_contact') ORDER BY CASE status WHEN 'queued' THEN 0 WHEN 'contact_ready' THEN 1 ELSE 2 END,updated_at LIMIT 500").fetchall()
    for row in rows:
        if db.execute("SELECT 1 FROM crm_duplicate_links WHERE duplicate_lead_id=?",(row["id"],)).fetchone():
            continue
        routed = route_lead(db,row["id"])
        choices=[c for c in routed["choices"] if not channel or c["channel"]==channel]
        choices=[c for c in choices if c["destinationKey"] and not destination_already_contacted(db,c["channel"],c["destinationKey"])]
        if not choices: continue
        expires=(now+timedelta(seconds=max(60,ttl))).isoformat()
        try:
            db.execute("INSERT INTO crm_agent_locks(lead_id,agent_id,expires_at) VALUES(?,?,?)",(row["id"],agent,expires))
            db.execute("UPDATE crm_leads SET status=CASE WHEN status='collected' THEN 'queued' ELSE status END,updated_at=CURRENT_TIMESTAMP WHERE id=?",(row["id"],))
            db.commit()
            return {"ok":True,"leadId":row["id"],"agent":agent,"expiresAt":expires,"route":choices[0],"lead":dict(row)}
        except sqlite3.IntegrityError:
            continue
    db.commit(); return {"ok":True,"leadId":None,"reason":"no-claimable-lead"}


def record_contact(db: sqlite3.Connection,args) -> dict:
    key=args.destination_key or (norm_email(args.destination) if args.channel=="email" else norm_phone(args.destination) if args.channel=="phone" else f"{args.platform}:{social_parts(args.destination)[2]}" if args.channel=="social" else domain_of(args.destination))
    if not key: raise SystemExit("destination key could not be normalized")
    msg_hash=hashlib.sha256((args.message or "").encode()).hexdigest() if args.message else ""
    try:
        cur=db.execute("""INSERT INTO crm_contact_history(lead_id,campaign_id,channel,platform,direction,destination,destination_key,contact_kind,sequence_no,external_message_id,status,message_hash,note)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)""",(args.lead_id,args.campaign or "",args.channel,args.platform or "",args.direction,args.destination or "",key,args.kind,args.sequence,args.external_id or "",args.status,msg_hash,args.note or ""))
    except sqlite3.IntegrityError:
        return {"ok":False,"duplicate":True,"destinationKey":key}
    if args.direction=="outbound":
        db.execute("UPDATE crm_leads SET status='contacted',last_contacted_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?",(args.lead_id,))
        if args.followup_days>0:
            due=(datetime.now(timezone.utc)+timedelta(days=args.followup_days)).isoformat()
            db.execute("INSERT OR IGNORE INTO crm_followups(lead_id,campaign_id,channel,sequence_no,due_at) VALUES(?,?,?,?,?)",(args.lead_id,args.campaign or "",args.channel,args.sequence+1,due))
    db.execute("DELETE FROM crm_agent_locks WHERE lead_id=?",(args.lead_id,))
    db.commit(); return {"ok":True,"historyId":cur.lastrowid,"destinationKey":key}


def find_lead(db: sqlite3.Connection, sender_key: str, platform: str="") -> str | None:
    key=(sender_key or "").strip().casefold()
    if not key: return None
    variants=[]
    if "@" in key and not key.startswith("http"): variants.append(("email",norm_email(key),""))
    if re.fullmatch(r"[+\d() .-]{7,}",key): variants.append(("phone",norm_phone(key),""))
    if platform: variants += [("social_handle",key.removeprefix(platform+":"),platform),("platform_id",key,platform)]
    for kind,val,plat in variants:
        row=db.execute("SELECT lead_id FROM crm_identity_keys WHERE key_type=? AND key_value=? AND platform=?",(kind,val,plat)).fetchone()
        if row: return row[0]
    return None


def ingest_inbox(db: sqlite3.Connection,args) -> dict:
    lead_id=args.lead_id or find_lead(db,args.sender_key,args.platform or "")
    try:
        db.execute("""INSERT INTO crm_inbox_events(provider,account,external_id,lead_id,event_kind,sender_key,sender_label,subject,body_excerpt,message_url,received_at)
          VALUES(?,?,?,?,?,?,?,?,?,?,?)""",(args.provider,args.account or "",args.external_id,lead_id,args.kind,args.sender_key or "",args.sender_label or "",args.subject or "",(args.body or "")[:4000],args.url or "",args.received_at or datetime.now(timezone.utc).isoformat()))
    except sqlite3.IntegrityError:
        return {"ok":True,"duplicate":True,"leadId":lead_id}
    if lead_id:
        if args.kind in {"reply","dm","mention","comment"}:
            db.execute("UPDATE crm_leads SET status='replied',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status NOT IN ('converted','do_not_contact')",(lead_id,))
            db.execute("UPDATE crm_followups SET status='cancelled' WHERE lead_id=? AND status='queued'",(lead_id,))
        elif args.kind=="optout":
            db.execute("UPDATE crm_leads SET status='do_not_contact',contact_permission='do_not_contact',updated_at=CURRENT_TIMESTAMP WHERE id=?",(lead_id,))
            db.execute("UPDATE crm_followups SET status='cancelled' WHERE lead_id=? AND status='queued'",(lead_id,))
        elif args.kind=="bounce":
            db.execute("UPDATE crm_leads SET status='invalid',updated_at=CURRENT_TIMESTAMP WHERE id=?",(lead_id,))
            db.execute("UPDATE crm_followups SET status='cancelled' WHERE lead_id=? AND status='queued'",(lead_id,))
    db.commit(); return {"ok":True,"duplicate":False,"leadId":lead_id}


def stats(db: sqlite3.Connection) -> dict:
    def one(q,*p): return db.execute(q,p).fetchone()[0]
    return {
        "ok":True,
        "leads":one("SELECT count(*) FROM crm_leads"),
        "identityKeys":one("SELECT count(*) FROM crm_identity_keys"),
        "duplicateLinks":one("SELECT count(*) FROM crm_duplicate_links"),
        "contacts":one("SELECT count(*) FROM crm_contact_history"),
        "inboxEvents":one("SELECT count(*) FROM crm_inbox_events"),
        "unprocessedInbox":one("SELECT count(*) FROM crm_inbox_events WHERE processed_at IS NULL"),
        "activeLocks":one("SELECT count(*) FROM crm_agent_locks WHERE expires_at>CURRENT_TIMESTAMP"),
        "dueFollowups":one("SELECT count(*) FROM crm_followups WHERE status='queued' AND due_at<=?",datetime.now(timezone.utc).isoformat()),
    }


def main() -> int:
    ap=argparse.ArgumentParser(); ap.add_argument("--db",default=DB_DEFAULT)
    sub=ap.add_subparsers(dest="cmd",required=True)
    sub.add_parser("init"); sub.add_parser("stats"); sub.add_parser("dedupe")
    r=sub.add_parser("route"); r.add_argument("lead_id")
    c=sub.add_parser("claim"); c.add_argument("--agent",required=True); c.add_argument("--ttl",type=int,default=900); c.add_argument("--channel",choices=["email","social","phone","website"])
    rel=sub.add_parser("release"); rel.add_argument("lead_id"); rel.add_argument("--agent")
    rc=sub.add_parser("record-contact"); rc.add_argument("--lead-id",required=True); rc.add_argument("--campaign",default=""); rc.add_argument("--channel",required=True,choices=["email","social","phone","website"]); rc.add_argument("--platform",default=""); rc.add_argument("--direction",choices=["outbound","inbound"],default="outbound"); rc.add_argument("--destination",required=True); rc.add_argument("--destination-key",default=""); rc.add_argument("--kind",choices=["initial","followup"],default="initial"); rc.add_argument("--sequence",type=int,default=0); rc.add_argument("--external-id",default=""); rc.add_argument("--status",default="sent"); rc.add_argument("--message",default=""); rc.add_argument("--note",default=""); rc.add_argument("--followup-days",type=int,default=0)
    ii=sub.add_parser("ingest-inbox"); ii.add_argument("--provider",required=True); ii.add_argument("--account",default=""); ii.add_argument("--external-id",required=True); ii.add_argument("--lead-id"); ii.add_argument("--platform",default=""); ii.add_argument("--kind",choices=["reply","dm","mention","comment","bounce","optout"],default="reply"); ii.add_argument("--sender-key",default=""); ii.add_argument("--sender-label",default=""); ii.add_argument("--subject",default=""); ii.add_argument("--body",default=""); ii.add_argument("--url",default=""); ii.add_argument("--received-at",default="")
    fu=sub.add_parser("followups"); fu.add_argument("--limit",type=int,default=100)
    args=ap.parse_args(); db=conn(args.db)
    try:
        if args.cmd in {"init","dedupe"}: payload={"ok":True,**rebuild_keys(db)}
        elif args.cmd=="stats": payload=stats(db)
        elif args.cmd=="route": payload=route_lead(db,args.lead_id)
        elif args.cmd=="claim": payload=claim(db,args.agent,args.ttl,args.channel)
        elif args.cmd=="release":
            q="DELETE FROM crm_agent_locks WHERE lead_id=?"; p=[args.lead_id]
            if args.agent: q+=" AND agent_id=?"; p.append(args.agent)
            cur=db.execute(q,p); db.commit(); payload={"ok":True,"released":cur.rowcount}
        elif args.cmd=="record-contact": payload=record_contact(db,args)
        elif args.cmd=="ingest-inbox": payload=ingest_inbox(db,args)
        elif args.cmd=="followups":
            rows=[dict(x) for x in db.execute("SELECT f.*,l.name,l.company_name,l.email,l.phone,l.profile_url,l.contact_permission,l.status FROM crm_followups f JOIN crm_leads l ON l.id=f.lead_id WHERE f.status='queued' AND f.due_at<=? AND l.status='contacted' ORDER BY f.due_at LIMIT ?",(datetime.now(timezone.utc).isoformat(),max(1,min(args.limit,500))))]
            payload={"ok":True,"count":len(rows),"records":rows}
        else: raise SystemExit(2)
        print(json.dumps(payload,ensure_ascii=False,indent=2)); return 0
    finally: db.close()

if __name__=="__main__": raise SystemExit(main())
