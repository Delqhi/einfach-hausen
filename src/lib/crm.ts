import fs from 'node:fs';
import path from 'node:path';
import { db } from './db';

export const CRM_STATUSES=['collected','contact_ready','contacted','replied','qualified','invited','converted','not_interested','invalid','do_not_contact'] as const;
export const CRM_PERMISSIONS=['unknown','allowed','consented','denied','do_not_contact'] as const;
export const CRM_LEAD_TYPES=['provider','homeowner','public_intent','property','other'] as const;
export const CRM_SOURCES=['business_research','business_research_intent','business_research_property','website','referral','facebook_group','forum','community','campaign','manual','existing_customer'] as const;

type LeadStatus=(typeof CRM_STATUSES)[number];
type Permission=(typeof CRM_PERMISSIONS)[number];
type LeadType=(typeof CRM_LEAD_TYPES)[number];

export type CrmLead={
  id:string; lead_type:LeadType; name:string; company_name:string; category:string; address:string; locality:string; postcode:string; region:string; country:string;
  email:string; phone:string; website:string; profile_url:string; socials_json:string; status:LeadStatus; contact_permission:Permission; source_type:string; source_detail:string;
  source_external_id:string; notes:string; created_at:string; updated_at:string; last_contacted_at:string|null;
};

let crmReady=false;
export function ensureCrmSchema(){
  if(crmReady)return;
  db.exec(`
    CREATE TABLE IF NOT EXISTS crm_leads (
      id TEXT PRIMARY KEY,
      lead_type TEXT NOT NULL DEFAULT 'provider',
      name TEXT NOT NULL,
      company_name TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      locality TEXT NOT NULL DEFAULT '',
      postcode TEXT NOT NULL DEFAULT '',
      region TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT 'DE',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      website TEXT NOT NULL DEFAULT '',
      profile_url TEXT NOT NULL DEFAULT '',
      socials_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'collected',
      contact_permission TEXT NOT NULL DEFAULT 'unknown',
      source_type TEXT NOT NULL DEFAULT 'manual',
      source_detail TEXT NOT NULL DEFAULT '',
      source_external_id TEXT NOT NULL DEFAULT '',
      source_payload_json TEXT NOT NULL DEFAULT '{}',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_contacted_at TEXT,
      converted_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
    );
    CREATE INDEX IF NOT EXISTS idx_crm_status ON crm_leads(status,updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_crm_type ON crm_leads(lead_type,status);
    CREATE INDEX IF NOT EXISTS idx_crm_location ON crm_leads(country,postcode,locality);
    CREATE INDEX IF NOT EXISTS idx_crm_category ON crm_leads(category);
    CREATE INDEX IF NOT EXISTS idx_crm_source_external ON crm_leads(source_type,source_external_id);
    CREATE TABLE IF NOT EXISTS crm_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT '',
      direction TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_crm_events_lead ON crm_events(lead_id,created_at DESC);
  `);
  crmReady=true;
}

function stableManualId(input:{leadType:string;name:string;email?:string;phone?:string;profileUrl?:string;sourceType:string}){
  const raw=[input.leadType,input.name,input.email||'',input.phone||'',input.profileUrl||'',input.sourceType].join('|').toLowerCase();
  let h=2166136261; for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619);} return `manual:${(h>>>0).toString(16)}:${Buffer.from(raw).toString('base64url').slice(0,28)}`;
}

export function crmStats(){
  ensureCrmSchema();
  const total=(db.prepare('SELECT count(*) n FROM crm_leads').get() as {n:number}).n;
  const byStatus=db.prepare('SELECT status,count(*) count FROM crm_leads GROUP BY status ORDER BY count DESC').all() as Array<{status:string;count:number}>;
  const byType=db.prepare('SELECT lead_type,count(*) count FROM crm_leads GROUP BY lead_type ORDER BY count DESC').all() as Array<{lead_type:string;count:number}>;
  const contact=db.prepare(`SELECT count(*) FILTER(WHERE email!='') email,count(*) FILTER(WHERE phone!='') phone,count(*) FILTER(WHERE website!='') website,count(*) FILTER(WHERE profile_url!='' OR socials_json!='[]') social FROM crm_leads`).get() as {email:number;phone:number;website:number;social:number};
  return {total,byStatus,byType,...contact};
}

export function listCrmLeads(input:{q?:string;status?:string;type?:string;category?:string;page?:number;limit?:number}){
  ensureCrmSchema();
  const where:string[]=[]; const params:any[]=[];
  if(input.status&&CRM_STATUSES.includes(input.status as any)){where.push('status=?');params.push(input.status);}
  if(input.type&&CRM_LEAD_TYPES.includes(input.type as any)){where.push('lead_type=?');params.push(input.type);}
  if(input.category){where.push('category=?');params.push(input.category);}
  if(input.q){const q=`%${input.q}%`;where.push('(name LIKE ? OR company_name LIKE ? OR locality LIKE ? OR postcode LIKE ? OR email LIKE ? OR phone LIKE ?)');params.push(q,q,q,q,q,q);}
  const limit=Math.max(20,Math.min(input.limit||60,200)); const page=Math.max(1,input.page||1); const offset=(page-1)*limit;
  const clause=where.length?` WHERE ${where.join(' AND ')}`:'';
  const total=(db.prepare(`SELECT count(*) n FROM crm_leads${clause}`).get(...params) as {n:number}).n;
  const rows=db.prepare(`SELECT * FROM crm_leads${clause} ORDER BY CASE status WHEN 'replied' THEN 0 WHEN 'qualified' THEN 1 WHEN 'contact_ready' THEN 2 WHEN 'collected' THEN 3 ELSE 4 END,updated_at DESC LIMIT ? OFFSET ?`).all(...params,limit,offset) as CrmLead[];
  return {rows,total,page,limit,pages:Math.max(1,Math.ceil(total/limit))};
}

export function crmCategories(limit=80){ensureCrmSchema();return db.prepare("SELECT category,count(*) count FROM crm_leads WHERE category!='' GROUP BY category ORDER BY count DESC LIMIT ?").all(limit) as Array<{category:string;count:number}>;}

export function addCrmLead(input:{leadType:LeadType;name:string;companyName?:string;category?:string;locality?:string;postcode?:string;country?:string;email?:string;phone?:string;website?:string;profileUrl?:string;status?:LeadStatus;permission?:Permission;sourceType:string;sourceDetail?:string;notes?:string}){
  ensureCrmSchema();
  const id=stableManualId({leadType:input.leadType,name:input.name,email:input.email,phone:input.phone,profileUrl:input.profileUrl,sourceType:input.sourceType});
  db.prepare(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,locality,postcode,country,email,phone,website,profile_url,status,contact_permission,source_type,source_detail,notes)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET updated_at=CURRENT_TIMESTAMP,last_seen_at=CURRENT_TIMESTAMP,notes=CASE WHEN excluded.notes!='' THEN excluded.notes ELSE crm_leads.notes END`).run(
      id,input.leadType,input.name,input.companyName||'',input.category||'',input.locality||'',input.postcode||'',input.country||'DE',input.email||'',input.phone||'',input.website||'',input.profileUrl||'',input.status||'collected',input.permission||'unknown',input.sourceType,input.sourceDetail||'',input.notes||'');
  db.prepare("INSERT INTO crm_events(lead_id,event_type,note) VALUES(?,'created',?)").run(id,input.sourceDetail||'');
  return id;
}

export function updateCrmLead(id:string,input:{status:LeadStatus;permission:Permission;notes?:string;channel?:string}){
  ensureCrmSchema();
  const previous=db.prepare('SELECT status,contact_permission FROM crm_leads WHERE id=?').get(id) as {status:string;contact_permission:string}|undefined;
  if(!previous)throw new Error('Lead nicht gefunden');
  const permission=input.status==='do_not_contact'?'do_not_contact':input.permission;
  const last=input.status==='contacted'?',last_contacted_at=CURRENT_TIMESTAMP':'';
  db.prepare(`UPDATE crm_leads SET status=?,contact_permission=?,notes=?,updated_at=CURRENT_TIMESTAMP${last} WHERE id=?`).run(input.status,permission,input.notes||'',id);
  db.prepare("INSERT INTO crm_events(lead_id,event_type,channel,direction,note,metadata_json) VALUES(?,'status_changed',?,?,?,?)").run(id,input.channel||'',input.status==='contacted'?'outbound':'',input.notes||'',JSON.stringify({from:previous.status,to:input.status,permission}));
}

function attachedTableExists(name:string){
  return Boolean(db.prepare("SELECT 1 FROM sin_research.sqlite_master WHERE type='table' AND name=?").get(name));
}

const CRM_REFRESH=`name=excluded.name,company_name=excluded.company_name,category=excluded.category,address=excluded.address,locality=excluded.locality,postcode=excluded.postcode,region=excluded.region,country=excluded.country,
  email=CASE WHEN excluded.email!='' THEN excluded.email ELSE crm_leads.email END,
  phone=CASE WHEN excluded.phone!='' THEN excluded.phone ELSE crm_leads.phone END,
  website=CASE WHEN excluded.website!='' THEN excluded.website ELSE crm_leads.website END,
  profile_url=CASE WHEN excluded.profile_url!='' THEN excluded.profile_url ELSE crm_leads.profile_url END,
  socials_json=CASE WHEN excluded.socials_json!='[]' THEN excluded.socials_json ELSE crm_leads.socials_json END,
  source_detail=excluded.source_detail,source_payload_json=excluded.source_payload_json,last_seen_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP`;

export function importBusinessResearchLeads(sourcePath:string){
  ensureCrmSchema();
  const absolute=path.resolve(sourcePath.replace(/^~/,process.env.HOME||''));
  if(!fs.existsSync(absolute))throw new Error(`SIN-Business-Research DB fehlt: ${absolute}`);

  const before=new Map((db.prepare("SELECT source_type,count(*) n FROM crm_leads WHERE source_type LIKE 'business_research%' GROUP BY source_type").all() as Array<{source_type:string;n:number}>).map(x=>[x.source_type,x.n]));
  let businesses=0,intents=0,properties=0;
  try{
    try{db.exec('DETACH DATABASE sin_research');}catch{}
    db.prepare('ATTACH DATABASE ? AS sin_research').run(absolute);
    const tx=db.transaction(()=>{
      if(attachedTableExists('leads')){
        businesses=(db.prepare("SELECT count(*) n FROM sin_research.leads WHERE entity_type='business'").get() as {n:number}).n;
        db.exec(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
          SELECT 'research:'||id,'provider',name,name,coalesce(category,''),coalesce(address,''),coalesce(locality,''),coalesce(postcode,''),coalesce(region,''),coalesce(country,'DE'),
            coalesce(primary_email,''),coalesce(primary_phone,''),coalesce(primary_website,''),
            CASE WHEN json_valid(coalesce(socials_json,'[]')) THEN coalesce(json_extract(socials_json,'$[0]'),'') ELSE '' END,
            CASE WHEN json_valid(coalesce(socials_json,'[]')) THEN socials_json ELSE '[]' END,
            coalesce(status,'collected'),coalesce(contact_permission,'unknown'),'business_research',coalesce(source_provider,'overture'),id,
            json_object('provider',source_provider,'externalId',source_external_id,'release',source_release,'provenance',CASE WHEN json_valid(coalesce(provenance_json,'[]')) THEN json(provenance_json) ELSE json('[]') END),coalesce(notes,'')
          FROM sin_research.leads WHERE entity_type='business'
          ON CONFLICT(id) DO UPDATE SET ${CRM_REFRESH}`);
      }
      if(attachedTableExists('public_intents')){
        intents=(db.prepare('SELECT count(*) n FROM sin_research.public_intents').get() as {n:number}).n;
        db.exec(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
          SELECT 'research-intent:'||id,'public_intent',coalesce(nullif(trim(title),''),'Öffentliches Bedarfssignal'),' ',coalesce(topic,''),'',coalesce(locality,''),'','','DE','','','',coalesce(source_url,''),'[]',
            CASE status WHEN 'qualified' THEN 'qualified' WHEN 'converted' THEN 'converted' WHEN 'ignored' THEN 'not_interested' ELSE 'collected' END,
            coalesce(contact_permission,'unknown'),'business_research_intent',coalesce(nullif(source_provider,''),nullif(source_kind,''),'public_web'),id,
            json_object('provider',source_provider,'kind',source_kind,'url',source_url,'authorHandle',author_handle,'publishedAt',published_at,'intentScore',intent_score,'excerpt',body_excerpt,'provenance',CASE WHEN json_valid(coalesce(provenance_json,'{}')) THEN json(provenance_json) ELSE json('{}') END),
            printf('Öffentliches Bedarfssignal · Intent-Score %.1f',coalesce(intent_score,0))
          FROM sin_research.public_intents WHERE 1
          ON CONFLICT(id) DO UPDATE SET ${CRM_REFRESH}`);
      }
      if(attachedTableExists('property_opportunities')){
        properties=(db.prepare('SELECT count(*) n FROM sin_research.property_opportunities').get() as {n:number}).n;
        db.exec(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
          SELECT 'research-property:'||id,'property',coalesce(nullif(trim(address),''),nullif(trim(coalesce(building_type,'')||' '||coalesce(postcode,'')||' '||coalesce(locality,'')),''),'Objektchance'),' ',coalesce(building_type,''),coalesce(address,''),coalesce(locality,''),coalesce(postcode,''),'',coalesce(country,'DE'),'','','','','[]',
            CASE status WHEN 'target_area' THEN 'qualified' WHEN 'inbound' THEN 'replied' WHEN 'converted' THEN 'converted' WHEN 'excluded' THEN 'not_interested' ELSE 'collected' END,
            'unknown','business_research_property',coalesce(source_provider,'open_data'),id,
            json_object('provider',source_provider,'externalId',source_external_id,'lat',lat,'lon',lon,'attributes',CASE WHEN json_valid(coalesce(attributes_json,'{}')) THEN json(attributes_json) ELSE json('{}') END,'provenance',CASE WHEN json_valid(coalesce(provenance_json,'{}')) THEN json(provenance_json) ELSE json('{}') END),
            'Nicht-personenbezogene Objektchance aus offenen Daten'
          FROM sin_research.property_opportunities WHERE 1
          ON CONFLICT(id) DO UPDATE SET ${CRM_REFRESH}`);
      }
    });
    tx();
  } finally {
    try{db.exec('DETACH DATABASE sin_research');}catch{}
  }

  const after=new Map((db.prepare("SELECT source_type,count(*) n FROM crm_leads WHERE source_type LIKE 'business_research%' GROUP BY source_type").all() as Array<{source_type:string;n:number}>).map(x=>[x.source_type,x.n]));
  const inserted=['business_research','business_research_intent','business_research_property'].reduce((n,k)=>n+Math.max(0,(after.get(k)||0)-(before.get(k)||0)),0);
  const total=businesses+intents+properties;
  return {inserted,updated:Math.max(0,total-inserted),total,businesses,intents,properties,source:absolute};
}
