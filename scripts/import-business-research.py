#!/usr/bin/env python3
"""Fast, idempotent SIN-Business-Research -> Einfach Hausen CRM sync.

Uses set-based SQLite operations. It imports business leads, public intent
signals, and non-personal property opportunities. Existing CRM workflow state,
contact permission, notes, and contact history are never reset by a refresh.
This command never sends messages and never creates application users.
"""
from __future__ import annotations

import argparse
import json
import os
import sqlite3
from pathlib import Path

DEFAULT_SOURCE = os.path.expanduser(os.environ.get("BUSINESS_RESEARCH_DB_PATH", "~/.local/share/sin-business-research/leads.sqlite3"))
DEFAULT_TARGET = os.path.abspath(os.environ.get("DATABASE_PATH", "data/einfach-hausen.db"))

SCHEMA = """
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

REFRESH = """name=excluded.name,company_name=excluded.company_name,category=excluded.category,address=excluded.address,locality=excluded.locality,
postcode=excluded.postcode,region=excluded.region,country=excluded.country,
email=CASE WHEN excluded.email!='' THEN excluded.email ELSE crm_leads.email END,
phone=CASE WHEN excluded.phone!='' THEN excluded.phone ELSE crm_leads.phone END,
website=CASE WHEN excluded.website!='' THEN excluded.website ELSE crm_leads.website END,
profile_url=CASE WHEN excluded.profile_url!='' THEN excluded.profile_url ELSE crm_leads.profile_url END,
socials_json=CASE WHEN excluded.socials_json!='[]' THEN excluded.socials_json ELSE crm_leads.socials_json END,
source_detail=excluded.source_detail,source_payload_json=excluded.source_payload_json,last_seen_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP"""


def table_exists(c: sqlite3.Connection, name: str) -> bool:
    return c.execute("SELECT 1 FROM research.sqlite_master WHERE type='table' AND name=?", (name,)).fetchone() is not None


def count_by_source(c: sqlite3.Connection) -> dict[str, int]:
    return dict(c.execute("SELECT source_type,count(*) FROM crm_leads WHERE source_type LIKE 'business_research%' GROUP BY source_type"))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default=DEFAULT_SOURCE)
    ap.add_argument("--target", default=DEFAULT_TARGET)
    ap.add_argument("--limit", type=int, default=0, help="0 = all rows per source table")
    args = ap.parse_args()
    if args.limit < 0:
        raise SystemExit("--limit must be >= 0")

    source = Path(args.source).expanduser().resolve()
    target = Path(args.target).expanduser().resolve()
    if not source.exists():
        raise SystemExit(f"source DB not found: {source}")
    target.parent.mkdir(parents=True, exist_ok=True)

    c = sqlite3.connect(target)
    c.execute("PRAGMA journal_mode=WAL")
    c.execute("PRAGMA synchronous=NORMAL")
    c.execute("PRAGMA temp_store=MEMORY")
    c.execute("PRAGMA foreign_keys=ON")
    c.executescript(SCHEMA)
    before = count_by_source(c)
    c.execute("ATTACH DATABASE ? AS research", (str(source),))

    lim = f" LIMIT {int(args.limit)}" if args.limit else ""
    counts = {"businesses": 0, "intents": 0, "properties": 0}
    try:
        with c:
            if table_exists(c, "leads"):
                counts["businesses"] = c.execute("SELECT count(*) FROM (SELECT 1 FROM research.leads WHERE entity_type='business'" + lim + ")").fetchone()[0]
                c.execute(f"""INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
                  SELECT 'research:'||id,'provider',name,name,coalesce(category,''),coalesce(address,''),coalesce(locality,''),coalesce(postcode,''),coalesce(region,''),coalesce(country,'DE'),
                    coalesce(primary_email,''),coalesce(primary_phone,''),coalesce(primary_website,''),CASE WHEN json_valid(coalesce(socials_json,'[]')) THEN coalesce(json_extract(socials_json,'$[0]'),'') ELSE '' END,
                    CASE WHEN json_valid(coalesce(socials_json,'[]')) THEN socials_json ELSE '[]' END,coalesce(status,'collected'),coalesce(contact_permission,'unknown'),
                    'business_research',coalesce(source_provider,'overture'),id,json_object('provider',source_provider,'externalId',source_external_id,'release',source_release),coalesce(notes,'')
                  FROM research.leads WHERE entity_type='business'{lim} ON CONFLICT(id) DO UPDATE SET {REFRESH}""")
            if table_exists(c, "public_intents"):
                counts["intents"] = c.execute("SELECT count(*) FROM (SELECT 1 FROM research.public_intents" + lim + ")").fetchone()[0]
                c.execute(f"""INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
                  SELECT 'research-intent:'||id,'public_intent',coalesce(nullif(trim(title),''),'Öffentliches Bedarfssignal'),'',coalesce(topic,''),'',coalesce(locality,''),'','','DE','','','',coalesce(source_url,''),'[]',
                    CASE status WHEN 'qualified' THEN 'qualified' WHEN 'converted' THEN 'converted' WHEN 'ignored' THEN 'not_interested' ELSE 'collected' END,coalesce(contact_permission,'unknown'),
                    'business_research_intent',coalesce(nullif(source_provider,''),nullif(source_kind,''),'public_web'),id,
                    json_object('provider',source_provider,'kind',source_kind,'url',source_url,'authorHandle',author_handle,'publishedAt',published_at,'intentScore',intent_score,'excerpt',body_excerpt),
                    printf('Öffentliches Bedarfssignal · Intent-Score %.1f',coalesce(intent_score,0))
                  FROM research.public_intents WHERE 1{lim} ON CONFLICT(id) DO UPDATE SET {REFRESH}""")
            if table_exists(c, "property_opportunities"):
                counts["properties"] = c.execute("SELECT count(*) FROM (SELECT 1 FROM research.property_opportunities" + lim + ")").fetchone()[0]
                c.execute(f"""INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
                  SELECT 'research-property:'||id,'property',coalesce(nullif(trim(address),''),nullif(trim(coalesce(building_type,'')||' '||coalesce(postcode,'')||' '||coalesce(locality,'')),''),'Objektchance'),'',
                    coalesce(building_type,''),coalesce(address,''),coalesce(locality,''),coalesce(postcode,''),'',coalesce(country,'DE'),'','','','','[]',
                    CASE status WHEN 'target_area' THEN 'qualified' WHEN 'inbound' THEN 'replied' WHEN 'converted' THEN 'converted' WHEN 'excluded' THEN 'not_interested' ELSE 'collected' END,
                    'unknown','business_research_property',coalesce(source_provider,'open_data'),id,json_object('provider',source_provider,'externalId',source_external_id,'lat',lat,'lon',lon),
                    'Nicht-personenbezogene Objektchance aus offenen Daten'
                  FROM research.property_opportunities WHERE 1{lim} ON CONFLICT(id) DO UPDATE SET {REFRESH}""")
        after = count_by_source(c)
    finally:
        c.execute("DETACH DATABASE research")

    inserted = sum(max(0, after.get(k, 0) - before.get(k, 0)) for k in ("business_research", "business_research_intent", "business_research_property"))
    seen = sum(counts.values())
    total = c.execute("SELECT count(*) FROM crm_leads").fetchone()[0]
    by_type = dict(c.execute("SELECT lead_type,count(*) FROM crm_leads GROUP BY lead_type"))
    contact = c.execute("SELECT count(*) FILTER(WHERE email!=''),count(*) FILTER(WHERE phone!=''),count(*) FILTER(WHERE website!=''),count(*) FILTER(WHERE profile_url!='') FROM crm_leads").fetchone()
    c.close()
    print(json.dumps({"ok": True, "source": str(source), "target": str(target), "seen": seen, "inserted": inserted, "updated": max(0, seen-inserted), "sourceCounts": counts, "crmTotal": total, "crmByType": by_type, "withEmail": contact[0], "withPhone": contact[1], "withWebsite": contact[2], "withProfile": contact[3]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
