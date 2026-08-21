#!/usr/bin/env python3
"""Import project-neutral SIN-Business-Research leads into Einfach Hausen CRM.

This performs data synchronization only. It never sends email, DMs, calls, or
creates real provider/user accounts.
"""
from __future__ import annotations
import argparse, json, os, sqlite3
from pathlib import Path

DEFAULT_SOURCE=os.path.expanduser(os.environ.get('BUSINESS_RESEARCH_DB_PATH','~/.local/share/sin-business-research/leads.sqlite3'))
DEFAULT_TARGET=os.path.abspath(os.environ.get('DATABASE_PATH','data/einfach-hausen.db'))

SCHEMA="""
CREATE TABLE IF NOT EXISTS crm_leads (
  id TEXT PRIMARY KEY, lead_type TEXT NOT NULL DEFAULT 'provider', name TEXT NOT NULL, company_name TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '', locality TEXT NOT NULL DEFAULT '', postcode TEXT NOT NULL DEFAULT '', region TEXT NOT NULL DEFAULT '', country TEXT NOT NULL DEFAULT 'DE',
  email TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '', website TEXT NOT NULL DEFAULT '', profile_url TEXT NOT NULL DEFAULT '', socials_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'collected', contact_permission TEXT NOT NULL DEFAULT 'unknown', source_type TEXT NOT NULL DEFAULT 'manual', source_detail TEXT NOT NULL DEFAULT '',
  source_external_id TEXT NOT NULL DEFAULT '', source_payload_json TEXT NOT NULL DEFAULT '{}', notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, last_contacted_at TEXT, converted_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_crm_status ON crm_leads(status,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_type ON crm_leads(lead_type,status);
CREATE INDEX IF NOT EXISTS idx_crm_location ON crm_leads(country,postcode,locality);
CREATE INDEX IF NOT EXISTS idx_crm_category ON crm_leads(category);
CREATE INDEX IF NOT EXISTS idx_crm_source_external ON crm_leads(source_type,source_external_id);
CREATE TABLE IF NOT EXISTS crm_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE, event_type TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT '', direction TEXT NOT NULL DEFAULT '', note TEXT NOT NULL DEFAULT '', metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_crm_events_lead ON crm_events(lead_id,created_at DESC);
"""

UPSERT="""
INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
ON CONFLICT(id) DO UPDATE SET
 name=excluded.name, company_name=excluded.company_name, category=excluded.category, address=excluded.address, locality=excluded.locality,
 postcode=excluded.postcode, region=excluded.region, country=excluded.country,
 email=CASE WHEN excluded.email!='' THEN excluded.email ELSE crm_leads.email END,
 phone=CASE WHEN excluded.phone!='' THEN excluded.phone ELSE crm_leads.phone END,
 website=CASE WHEN excluded.website!='' THEN excluded.website ELSE crm_leads.website END,
 profile_url=CASE WHEN excluded.profile_url!='' THEN excluded.profile_url ELSE crm_leads.profile_url END,
 socials_json=CASE WHEN excluded.socials_json!='[]' THEN excluded.socials_json ELSE crm_leads.socials_json END,
 source_payload_json=excluded.source_payload_json,last_seen_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP
"""

def main()->int:
    ap=argparse.ArgumentParser()
    ap.add_argument('--source',default=DEFAULT_SOURCE)
    ap.add_argument('--target',default=DEFAULT_TARGET)
    ap.add_argument('--limit',type=int,default=0,help='0 = all')
    args=ap.parse_args()
    source=Path(args.source).expanduser().resolve(); target=Path(args.target).expanduser().resolve()
    if not source.exists(): raise SystemExit(f'source DB not found: {source}')
    target.parent.mkdir(parents=True,exist_ok=True)
    src=sqlite3.connect(f'file:{source}?mode=ro',uri=True); src.row_factory=sqlite3.Row
    dst=sqlite3.connect(target); dst.execute('PRAGMA journal_mode=WAL'); dst.execute('PRAGMA foreign_keys=ON'); dst.executescript(SCHEMA)
    existing={r[0] for r in dst.execute("SELECT source_external_id FROM crm_leads WHERE source_type='business_research' AND source_external_id!=''")}
    sql="SELECT * FROM leads WHERE entity_type='business' ORDER BY id" + (" LIMIT ?" if args.limit>0 else "")
    rows=src.execute(sql,(args.limit,) if args.limit>0 else ())
    inserted=updated=seen=0
    for r in rows:
        seen+=1
        try: socials=json.loads(r['socials_json'] or '[]')
        except Exception: socials=[]
        profile=socials[0] if socials else ''
        ext=r['id']; rid=f'research:{ext}'
        payload=json.dumps({'provider':r['source_provider'],'externalId':r['source_external_id'],'release':r['source_release'],'provenance':r['provenance_json']},ensure_ascii=False)
        dst.execute(UPSERT,(rid,'provider',r['name'],r['name'],r['category'] or '',r['address'] or '',r['locality'] or '',r['postcode'] or '',r['region'] or '',r['country'] or 'DE',r['primary_email'] or '',r['primary_phone'] or '',r['primary_website'] or '',profile,json.dumps(socials,ensure_ascii=False),r['status'] or 'collected',r['contact_permission'] or 'unknown','business_research',r['source_provider'] or 'overture',ext,payload,r['notes'] or ''))
        if ext in existing: updated+=1
        else: inserted+=1; existing.add(ext)
        if seen%2000==0: dst.commit()
    dst.commit()
    total=dst.execute("SELECT count(*) FROM crm_leads").fetchone()[0]
    stats=dst.execute("SELECT count(*) FILTER(WHERE email!=''),count(*) FILTER(WHERE phone!=''),count(*) FILTER(WHERE website!=''),count(*) FILTER(WHERE profile_url!='') FROM crm_leads").fetchone()
    src.close(); dst.close()
    print(json.dumps({'ok':True,'source':str(source),'target':str(target),'seen':seen,'inserted':inserted,'updated':updated,'crmTotal':total,'withEmail':stats[0],'withPhone':stats[1],'withWebsite':stats[2],'withSocial':stats[3]},ensure_ascii=False,indent=2))
    return 0

if __name__=='__main__': raise SystemExit(main())
