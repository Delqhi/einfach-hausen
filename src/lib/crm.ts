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
    CREATE TABLE IF NOT EXISTS crm_contact_keys (
      key_type TEXT NOT NULL,
      key_value TEXT NOT NULL,
      lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(key_type,key_value)
    );
    CREATE INDEX IF NOT EXISTS idx_crm_contact_keys_lead ON crm_contact_keys(lead_id);
    CREATE TABLE IF NOT EXISTS crm_duplicates (
      lead_id TEXT PRIMARY KEY REFERENCES crm_leads(id) ON DELETE CASCADE,
      canonical_lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS crm_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      audience TEXT NOT NULL DEFAULT 'mixed',
      status TEXT NOT NULL DEFAULT 'draft',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS crm_contact_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
      campaign_id INTEGER REFERENCES crm_campaigns(id) ON DELETE SET NULL,
      channel TEXT NOT NULL,
      direction TEXT NOT NULL,
      external_id TEXT NOT NULL DEFAULT '',
      message_fingerprint TEXT NOT NULL DEFAULT '',
      outcome TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_history_external ON crm_contact_history(channel,external_id) WHERE external_id!='';
    CREATE UNIQUE INDEX IF NOT EXISTS idx_crm_history_fingerprint ON crm_contact_history(lead_id,channel,message_fingerprint) WHERE message_fingerprint!='';
    CREATE INDEX IF NOT EXISTS idx_crm_history_lead ON crm_contact_history(lead_id,created_at DESC);
    CREATE TABLE IF NOT EXISTS crm_followups (
      lead_id TEXT PRIMARY KEY REFERENCES crm_leads(id) ON DELETE CASCADE,
      due_at TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT '',
      reason TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT 'pending',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_crm_followups_due ON crm_followups(state,due_at);
    CREATE TABLE IF NOT EXISTS crm_work_queue (
      lead_id TEXT PRIMARY KEY REFERENCES crm_leads(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT 'queued',
      due_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      claimed_by TEXT NOT NULL DEFAULT '',
      claimed_until TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_crm_queue_ready ON crm_work_queue(state,due_at,claimed_until);
    CREATE TABLE IF NOT EXISTS crm_inbox_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      external_id TEXT NOT NULL,
      sender_key TEXT NOT NULL DEFAULT '',
      sender_email TEXT NOT NULL DEFAULT '',
      sender_profile TEXT NOT NULL DEFAULT '',
      thread_url TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      preview TEXT NOT NULL DEFAULT '',
      received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lead_id TEXT REFERENCES crm_leads(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'new',
      raw_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(platform,external_id)
    );
    CREATE INDEX IF NOT EXISTS idx_crm_inbox_status ON crm_inbox_items(status,received_at DESC);
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


function normalizeEmail(value:string){return value.trim().toLowerCase();}
function normalizePhone(value:string){const v=value.trim();const plus=v.startsWith('+')?'+':'';return plus+v.replace(/\D/g,'');}
function normalizeDomain(value:string){
  if(!value)return '';
  try{const raw=/^https?:\/\//i.test(value)?value:`https://${value}`;return new URL(raw).hostname.toLowerCase().replace(/^www\./,'');}catch{return '';}
}
function normalizeSocial(value:string){
  if(!value)return '';
  try{const u=new URL(value);const host=u.hostname.toLowerCase().replace(/^www\./,'');const path=u.pathname.replace(/^\/+|\/+$/g,'').toLowerCase();return path?`${host}/${path}`:host;}catch{return value.trim().toLowerCase();}
}

export function rebuildCrmContactIndex(){
  ensureCrmSchema();
  const rows=db.prepare(`SELECT id,email,phone,website,profile_url,socials_json,source_type,source_external_id FROM crm_leads ORDER BY created_at,id`).all() as Array<any>;
  const insertKey=db.prepare('INSERT OR IGNORE INTO crm_contact_keys(key_type,key_value,lead_id) VALUES(?,?,?)');
  const owner=db.prepare('SELECT lead_id FROM crm_contact_keys WHERE key_type=? AND key_value=?');
  const dupe=db.prepare('INSERT OR REPLACE INTO crm_duplicates(lead_id,canonical_lead_id,reason) VALUES(?,?,?)');
  const tx=db.transaction(()=>{
    db.exec('DELETE FROM crm_contact_keys; DELETE FROM crm_duplicates;');
    for(const row of rows){
      const keys:Array<[string,string]>=[];
      const email=normalizeEmail(row.email||'');if(email)keys.push(['email',email]);
      const phone=normalizePhone(row.phone||'');if(phone.length>=7)keys.push(['phone',phone]);
      const domain=normalizeDomain(row.website||'');if(domain)keys.push(['domain',domain]);
      const social=normalizeSocial(row.profile_url||'');if(social)keys.push(['social',social]);
      try{for(const item of JSON.parse(row.socials_json||'[]')){const key=normalizeSocial(String(item||''));if(key)keys.push(['social',key]);}}catch{}
      if(row.source_type&&row.source_external_id)keys.push([`platform:${String(row.source_type).toLowerCase()}`,String(row.source_external_id).trim().toLowerCase()]);
      for(const [kind,value] of keys){
        const existing=owner.get(kind,value) as {lead_id:string}|undefined;
        if(existing&&existing.lead_id!==row.id){dupe.run(row.id,existing.lead_id,`${kind}:${value}`);continue;}
        insertKey.run(kind,value,row.id);
      }
    }
  });tx();
  const duplicates=(db.prepare('SELECT count(*) n FROM crm_duplicates').get() as {n:number}).n;
  const keys=(db.prepare('SELECT count(*) n FROM crm_contact_keys').get() as {n:number}).n;
  return {keys,duplicates};
}

function bestChannel(lead:CrmLead){
  if(lead.email)return 'email';
  if(lead.profile_url||lead.socials_json!=='[]')return 'social';
  if(lead.website)return 'website';
  if(lead.phone)return 'phone';
  return 'research';
}

export function nextCrmAction(lead:CrmLead){
  if(['do_not_contact','invalid','not_interested','converted'].includes(lead.status)||['denied','do_not_contact'].includes(lead.contact_permission))return {action:'none',channel:'',state:'blocked'};
  if(lead.lead_type==='property')return {action:'inbound_campaign',channel:'buffer',state:'queued'};
  if(lead.status==='replied')return {action:'reply_inbox',channel:'inbox',state:'queued'};
  if(lead.status==='qualified')return {action:'invite_or_offer',channel:bestChannel(lead),state:'queued'};
  if(lead.status==='contacted'){
    const follow=db.prepare("SELECT channel FROM crm_followups WHERE lead_id=? AND state='pending' AND due_at<=CURRENT_TIMESTAMP").get(lead.id) as {channel:string}|undefined;
    return follow?{action:'follow_up',channel:follow.channel||bestChannel(lead),state:'queued'}:{action:'wait_reply',channel:'',state:'queued'};
  }
  if(lead.lead_type==='public_intent')return {action:'public_reply',channel:'social',state:'queued'};
  const channel=bestChannel(lead);
  if(lead.status==='contact_ready'&&['allowed','consented'].includes(lead.contact_permission))return {action:channel==='email'?'send_email':channel==='social'?'send_dm':channel==='website'?'contact_form':'call',channel,state:'queued'};
  if(channel==='research')return {action:'enrich',channel:'research',state:'queued'};
  return {action:'review_contact',channel,state:'queued'};
}

export function seedCrmQueue(){
  ensureCrmSchema();
  rebuildCrmContactIndex();
  const rows=db.prepare(`SELECT l.* FROM crm_leads l LEFT JOIN crm_duplicates d ON d.lead_id=l.id WHERE d.lead_id IS NULL`).all() as CrmLead[];
  const up=db.prepare(`INSERT INTO crm_work_queue(lead_id,action,channel,state,due_at,claimed_by,claimed_until,last_error,updated_at)
    VALUES(?,?,?,?,CURRENT_TIMESTAMP,'',NULL,'',CURRENT_TIMESTAMP)
    ON CONFLICT(lead_id) DO UPDATE SET action=excluded.action,channel=excluded.channel,
      state=CASE WHEN crm_work_queue.state='claimed' AND crm_work_queue.claimed_until>CURRENT_TIMESTAMP THEN crm_work_queue.state ELSE excluded.state END,
      due_at=CASE WHEN crm_work_queue.state='claimed' AND crm_work_queue.claimed_until>CURRENT_TIMESTAMP THEN crm_work_queue.due_at ELSE excluded.due_at END,
      updated_at=CURRENT_TIMESTAMP`);
  const tx=db.transaction(()=>{for(const lead of rows){const n=nextCrmAction(lead);up.run(lead.id,n.action,n.channel,n.state);}});tx();
  db.exec(`UPDATE crm_work_queue SET state='blocked',action='duplicate',channel='' WHERE lead_id IN (SELECT lead_id FROM crm_duplicates)`);
  return crmQueueStats();
}

export function crmQueueStats(){
  ensureCrmSchema();
  const byState=db.prepare('SELECT state,count(*) count FROM crm_work_queue GROUP BY state ORDER BY count DESC').all() as Array<{state:string;count:number}>;
  const byAction=db.prepare("SELECT action,count(*) count FROM crm_work_queue WHERE state!='blocked' GROUP BY action ORDER BY count DESC LIMIT 20").all() as Array<{action:string;count:number}>;
  const inbox=(db.prepare("SELECT count(*) n FROM crm_inbox_items WHERE status='new'").get() as {n:number}).n;
  const followups=(db.prepare("SELECT count(*) n FROM crm_followups WHERE state='pending' AND due_at<=CURRENT_TIMESTAMP").get() as {n:number}).n;
  const duplicates=(db.prepare('SELECT count(*) n FROM crm_duplicates').get() as {n:number}).n;
  return {byState,byAction,inbox,followups,duplicates};
}

export function claimCrmWork(agentId:string,leaseMinutes=20){
  ensureCrmSchema();
  const tx=db.transaction(()=>{
    const row=db.prepare(`SELECT q.*,l.name,l.company_name,l.email,l.phone,l.website,l.profile_url,l.status,l.contact_permission,l.lead_type,l.category,l.source_type,l.source_detail
      FROM crm_work_queue q JOIN crm_leads l ON l.id=q.lead_id
      WHERE q.state='queued' AND q.due_at<=CURRENT_TIMESTAMP AND (q.claimed_until IS NULL OR q.claimed_until<=CURRENT_TIMESTAMP)
      ORDER BY CASE q.action WHEN 'reply_inbox' THEN 0 WHEN 'public_reply' THEN 1 WHEN 'follow_up' THEN 2 WHEN 'send_email' THEN 3 WHEN 'send_dm' THEN 4 ELSE 5 END,q.due_at,q.updated_at LIMIT 1`).get() as any;
    if(!row)return null;
    const lease=`+${Math.max(5,Math.min(leaseMinutes,120))} minutes`;
    db.prepare("UPDATE crm_work_queue SET state='claimed',claimed_by=?,claimed_until=datetime('now',?),attempts=attempts+1,updated_at=CURRENT_TIMESTAMP WHERE lead_id=? AND state='queued'").run(agentId,lease,row.lead_id);
    return {...row,claimed_by:agentId};
  });return tx();
}

export function completeCrmWork(input:{leadId:string;outcome:string;channel?:string;externalId?:string;fingerprint?:string;note?:string;followupAt?:string}){
  ensureCrmSchema();
  const lead=db.prepare('SELECT * FROM crm_leads WHERE id=?').get(input.leadId) as CrmLead|undefined;if(!lead)throw new Error('Lead nicht gefunden');
  const channel=input.channel||bestChannel(lead);
  const tx=db.transaction(()=>{
    if(['contacted','replied','qualified','converted','bounce','opt_out'].includes(input.outcome)){
      db.prepare(`INSERT OR IGNORE INTO crm_contact_history(lead_id,channel,direction,external_id,message_fingerprint,outcome,note)
        VALUES(?,?,?, ?,?,?,?)`).run(input.leadId,channel,input.outcome==='replied'?'inbound':'outbound',input.externalId||'',input.fingerprint||'',input.outcome,input.note||'');
    }
    if(input.outcome==='contacted')db.prepare("UPDATE crm_leads SET status='contacted',last_contacted_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE id=?").run(input.leadId);
    else if(input.outcome==='replied')db.prepare("UPDATE crm_leads SET status='replied',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(input.leadId);
    else if(input.outcome==='qualified')db.prepare("UPDATE crm_leads SET status='qualified',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(input.leadId);
    else if(input.outcome==='converted')db.prepare("UPDATE crm_leads SET status='converted',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(input.leadId);
    else if(input.outcome==='opt_out')db.prepare("UPDATE crm_leads SET status='do_not_contact',contact_permission='do_not_contact',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(input.leadId);
    else if(input.outcome==='bounce'&&channel==='email')db.prepare("UPDATE crm_leads SET email='',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(input.leadId);
    if(input.followupAt)db.prepare(`INSERT INTO crm_followups(lead_id,due_at,channel,reason,state,updated_at) VALUES(?,?,?,?, 'pending',CURRENT_TIMESTAMP)
      ON CONFLICT(lead_id) DO UPDATE SET due_at=excluded.due_at,channel=excluded.channel,reason=excluded.reason,state='pending',updated_at=CURRENT_TIMESTAMP`).run(input.leadId,input.followupAt,channel,input.note||'Follow-up');
    db.prepare("UPDATE crm_work_queue SET state='done',claimed_by='',claimed_until=NULL,updated_at=CURRENT_TIMESTAMP WHERE lead_id=?").run(input.leadId);
  });tx();
  const updated=db.prepare('SELECT * FROM crm_leads WHERE id=?').get(input.leadId) as CrmLead;const n=nextCrmAction(updated);
  db.prepare("UPDATE crm_work_queue SET action=?,channel=?,state=?,due_at=CURRENT_TIMESTAMP,claimed_by='',claimed_until=NULL,updated_at=CURRENT_TIMESTAMP WHERE lead_id=?").run(n.action,n.channel,n.state,input.leadId);
  return n;
}

export function listCrmInbox(limit=100){ensureCrmSchema();return db.prepare("SELECT i.*,l.name lead_name,l.company_name FROM crm_inbox_items i LEFT JOIN crm_leads l ON l.id=i.lead_id ORDER BY CASE i.status WHEN 'new' THEN 0 ELSE 1 END,i.received_at DESC LIMIT ?").all(Math.max(1,Math.min(limit,500))) as Array<any>;}
export function listCrmHistory(leadId:string,limit=50){ensureCrmSchema();return db.prepare('SELECT * FROM crm_contact_history WHERE lead_id=? ORDER BY created_at DESC LIMIT ?').all(leadId,Math.max(1,Math.min(limit,200))) as Array<any>;}
export function listDueFollowups(limit=100){ensureCrmSchema();return db.prepare(`SELECT f.*,l.name,l.company_name FROM crm_followups f JOIN crm_leads l ON l.id=f.lead_id WHERE f.state='pending' AND f.due_at<=CURRENT_TIMESTAMP ORDER BY f.due_at LIMIT ?`).all(Math.max(1,Math.min(limit,500))) as Array<any>;}
