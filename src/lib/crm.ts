import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { db } from './db';

export const CRM_STATUSES=['collected','contact_ready','contacted','replied','qualified','invited','converted','not_interested','invalid','do_not_contact'] as const;
export const CRM_PERMISSIONS=['unknown','allowed','consented','denied','do_not_contact'] as const;
export const CRM_LEAD_TYPES=['provider','homeowner','public_intent','property','other'] as const;
export const CRM_SOURCES=['business_research','business_research_intent','business_research_property','website','referral','facebook_group','forum','community','campaign','manual','existing_customer'] as const;
export const CRM_FOLLOW_UP_FILTERS=['due','scheduled','none'] as const;

type LeadStatus=(typeof CRM_STATUSES)[number];
type Permission=(typeof CRM_PERMISSIONS)[number];
type LeadType=(typeof CRM_LEAD_TYPES)[number];
type SourceType=(typeof CRM_SOURCES)[number];

export type CrmLead={
  id:string; lead_type:LeadType; name:string; company_name:string; category:string; address:string; locality:string; postcode:string; region:string; country:string;
  email:string; phone:string; website:string; profile_url:string; socials_json:string; status:LeadStatus; contact_permission:Permission; source_type:string; source_detail:string;
  source_external_id:string; source_payload_json:string; notes:string; created_at:string; updated_at:string; last_seen_at:string; last_contacted_at:string|null;
  next_follow_up_at:string|null; converted_user_id:number|null; normalized_email:string; normalized_phone:string; normalized_profile_url:string;
};

type AddLeadInput={
  leadType:LeadType; name:string; companyName?:string; category?:string; address?:string; locality?:string; postcode?:string; region?:string; country?:string;
  email?:string; phone?:string; website?:string; profileUrl?:string; socialsJson?:string; status?:LeadStatus; permission?:Permission; sourceType:SourceType|string;
  sourceDetail?:string; sourceExternalId?:string; sourcePayloadJson?:string; notes?:string; nextFollowUpAt?:string|null; convertedUserId?:number|null;
};

type UpdateLeadInput={
  status:LeadStatus; permission:Permission; notes?:string; channel?:string; sourceType?:SourceType|string; sourceDetail?:string; nextFollowUpAt?:string|null;
};

type MatchInput={leadType:LeadType;email?:string;phone?:string;profileUrl?:string;sourceType?:string;sourceExternalId?:string};

let crmReady=false;
let lifecycleSyncing=false;

function addColumnIfMissing(name:string,definition:string){
  const columns=db.prepare("PRAGMA table_info('crm_leads')").all() as Array<{name:string}>;
  if(!columns.some(column=>column.name===name))db.exec(`ALTER TABLE crm_leads ADD COLUMN ${definition}`);
}

export function normalizeCrmEmail(value:string|undefined|null){
  const normalized=String(value||'').trim().toLowerCase().replace(/\s+/g,'');
  return normalized.includes('@')?normalized:'';
}

export function normalizeCrmPhone(value:string|undefined|null){
  let normalized=String(value||'').replace(/\D/g,'');
  if(normalized.startsWith('00'))normalized=normalized.slice(2);
  return normalized.length>=7?normalized:'';
}

export function normalizeCrmProfile(value:string|undefined|null){
  const raw=String(value||'').trim();
  if(!raw)return '';
  try{
    const url=new URL(raw);
    url.hash='';
    for(const key of [...url.searchParams.keys()])if(/^utm_/i.test(key))url.searchParams.delete(key);
    url.hostname=url.hostname.toLowerCase();
    url.pathname=url.pathname.replace(/\/+$/,'')||'/';
    return url.toString().replace(/\/$/,'').toLowerCase();
  }catch{
    return raw.replace(/\/+$/,'').toLowerCase();
  }
}

function hashId(value:string){return createHash('sha256').update(value,'utf8').digest('hex').slice(0,24);}

function stableLeadId(input:MatchInput){
  const email=normalizeCrmEmail(input.email);
  const phone=normalizeCrmPhone(input.phone);
  const profile=normalizeCrmProfile(input.profileUrl);
  const external=String(input.sourceExternalId||'').trim();
  const identity=email?`email:${email}`:phone?`phone:${phone}`:profile?`profile:${profile}`:external?`source:${input.sourceType||'manual'}:${external}`:'';
  return identity?`crm:${hashId(`${input.leadType}|${identity}`)}`:`crm:${randomUUID()}`;
}

function permissionRank(permission:string){return ({unknown:0,allowed:1,consented:2,denied:3,do_not_contact:4} as Record<string,number>)[permission]??0;}
function statusRank(status:string){return ({invalid:0,collected:1,not_interested:1,contact_ready:2,contacted:3,replied:4,qualified:5,invited:6,converted:7,do_not_contact:8} as Record<string,number>)[status]??0;}
function earliest(a:string|null|undefined,b:string|null|undefined){if(!a)return b||null;if(!b)return a;return a<=b?a:b;}
function latest(a:string|null|undefined,b:string|null|undefined){if(!a)return b||null;if(!b)return a;return a>=b?a:b;}
function keepText(a:string|undefined|null,b:string|undefined|null){return String(a||'').trim()?String(a):String(b||'');}
function mergeNotes(a:string|undefined|null,b:string|undefined|null){const left=String(a||'').trim();const right=String(b||'').trim();if(!left)return right;if(!right||left===right)return left;return `${left}\n${right}`.slice(0,6000);}

function refreshNormalizedIdentity(){
  const rows=db.prepare('SELECT id,email,phone,profile_url,normalized_email,normalized_phone,normalized_profile_url FROM crm_leads').all() as Array<Record<string,string>>;
  const update=db.prepare('UPDATE crm_leads SET normalized_email=?,normalized_phone=?,normalized_profile_url=? WHERE id=?');
  const tx=db.transaction(()=>{
    for(const row of rows){
      const email=normalizeCrmEmail(row.email),phone=normalizeCrmPhone(row.phone),profile=normalizeCrmProfile(row.profile_url);
      if(email!==row.normalized_email||phone!==row.normalized_phone||profile!==row.normalized_profile_url)update.run(email,phone,profile,row.id);
    }
  });
  tx();
}

function installUserLinkTriggers(){
  db.exec(`
    DROP TRIGGER IF EXISTS crm_link_user_after_insert;
    CREATE TRIGGER crm_link_user_after_insert AFTER INSERT ON users
    WHEN trim(NEW.email)!=''
    BEGIN
      INSERT INTO crm_events(lead_id,event_type,note,metadata_json)
      SELECT id,'converted','Registrierung automatisch verknüpft',json_object('userId',NEW.id,'role',NEW.role,'doNotContactPreserved',CASE WHEN contact_permission='do_not_contact' OR status='do_not_contact' THEN 1 ELSE 0 END)
      FROM crm_leads
      WHERE normalized_email=lower(replace(trim(NEW.email),' ',''))
        AND converted_user_id IS NULL
        AND ((NEW.role='provider' AND lead_type IN ('provider','other')) OR (NEW.role='homeowner' AND lead_type IN ('homeowner','other')));
      UPDATE crm_leads SET
        converted_user_id=NEW.id,
        status=CASE WHEN contact_permission='do_not_contact' OR status='do_not_contact' THEN 'do_not_contact' ELSE 'converted' END,
        contact_permission=CASE WHEN contact_permission='do_not_contact' OR status='do_not_contact' THEN 'do_not_contact' ELSE contact_permission END,
        next_follow_up_at=CASE WHEN contact_permission='do_not_contact' OR status='do_not_contact' THEN NULL ELSE next_follow_up_at END,
        updated_at=CURRENT_TIMESTAMP
      WHERE normalized_email=lower(replace(trim(NEW.email),' ',''))
        AND (converted_user_id IS NULL OR converted_user_id=NEW.id)
        AND ((NEW.role='provider' AND lead_type IN ('provider','other')) OR (NEW.role='homeowner' AND lead_type IN ('homeowner','other')));
    END;
  `);
}

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
      next_follow_up_at TEXT,
      converted_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      normalized_email TEXT NOT NULL DEFAULT '',
      normalized_phone TEXT NOT NULL DEFAULT '',
      normalized_profile_url TEXT NOT NULL DEFAULT ''
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
  addColumnIfMissing('next_follow_up_at','next_follow_up_at TEXT');
  addColumnIfMissing('normalized_email',"normalized_email TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing('normalized_phone',"normalized_phone TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing('normalized_profile_url',"normalized_profile_url TEXT NOT NULL DEFAULT ''");
  db.exec(`CREATE INDEX IF NOT EXISTS idx_crm_normalized_email ON crm_leads(normalized_email) WHERE normalized_email!='';
    CREATE INDEX IF NOT EXISTS idx_crm_normalized_phone ON crm_leads(normalized_phone) WHERE normalized_phone!='';
    CREATE INDEX IF NOT EXISTS idx_crm_normalized_profile ON crm_leads(normalized_profile_url) WHERE normalized_profile_url!='';`);
  refreshNormalizedIdentity();
  installUserLinkTriggers();
  crmReady=true;
}

function matchCandidates(input:MatchInput){
  ensureCrmSchema();
  const email=normalizeCrmEmail(input.email),phone=normalizeCrmPhone(input.phone),profile=normalizeCrmProfile(input.profileUrl),external=String(input.sourceExternalId||'').trim();
  const clauses:string[]=[];const params:string[]=[];
  if(email){clauses.push('normalized_email=?');params.push(email);}
  if(phone){clauses.push('normalized_phone=?');params.push(phone);}
  if(profile){clauses.push('normalized_profile_url=?');params.push(profile);}
  if(external){clauses.push('(source_type=? AND source_external_id=?)');params.push(String(input.sourceType||''),external);}
  if(!clauses.length)return [] as CrmLead[];
  return db.prepare(`SELECT * FROM crm_leads WHERE ${clauses.join(' OR ')} ORDER BY id`).all(...params) as CrmLead[];
}

function leadsCanMerge(a:CrmLead,b:CrmLead){
  if(a.converted_user_id&&b.converted_user_id&&a.converted_user_id!==b.converted_user_id)return false;
  const sameSource=Boolean(a.source_external_id&&b.source_external_id&&a.source_type===b.source_type&&a.source_external_id===b.source_external_id);
  const sameEmail=Boolean(a.normalized_email&&a.normalized_email===b.normalized_email);
  const sameProfile=Boolean(a.normalized_profile_url&&a.normalized_profile_url===b.normalized_profile_url);
  if(a.normalized_email&&b.normalized_email&&a.normalized_email!==b.normalized_email&&!sameSource&&!sameProfile)return false;
  return sameSource||sameEmail||sameProfile||Boolean(a.normalized_phone&&a.normalized_phone===b.normalized_phone);
}

function mergeLeadRows(primary:CrmLead,duplicate:CrmLead){
  if(primary.id===duplicate.id)return primary;
  if(!leadsCanMerge(primary,duplicate))return primary;
  const dnc=primary.status==='do_not_contact'||duplicate.status==='do_not_contact'||primary.contact_permission==='do_not_contact'||duplicate.contact_permission==='do_not_contact';
  const status=dnc?'do_not_contact':statusRank(primary.status)>=statusRank(duplicate.status)?primary.status:duplicate.status;
  const permission=dnc?'do_not_contact':permissionRank(primary.contact_permission)>=permissionRank(duplicate.contact_permission)?primary.contact_permission:duplicate.contact_permission;
  const convertedUserId=primary.converted_user_id||duplicate.converted_user_id||null;
  const update=db.prepare(`UPDATE crm_leads SET lead_type=?,name=?,company_name=?,category=?,address=?,locality=?,postcode=?,region=?,country=?,email=?,phone=?,website=?,profile_url=?,socials_json=?,status=?,contact_permission=?,source_type=?,source_detail=?,source_external_id=?,source_payload_json=?,notes=?,last_seen_at=?,last_contacted_at=?,next_follow_up_at=?,converted_user_id=?,normalized_email=?,normalized_phone=?,normalized_profile_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`);
  update.run(
    primary.lead_type,keepText(primary.name,duplicate.name),keepText(primary.company_name,duplicate.company_name),keepText(primary.category,duplicate.category),keepText(primary.address,duplicate.address),
    keepText(primary.locality,duplicate.locality),keepText(primary.postcode,duplicate.postcode),keepText(primary.region,duplicate.region),keepText(primary.country,duplicate.country)||'DE',
    keepText(primary.email,duplicate.email),keepText(primary.phone,duplicate.phone),keepText(primary.website,duplicate.website),keepText(primary.profile_url,duplicate.profile_url),
    primary.socials_json&&primary.socials_json!=='[]'?primary.socials_json:duplicate.socials_json||'[]',status,permission,primary.source_type,keepText(primary.source_detail,duplicate.source_detail),
    primary.source_external_id,primary.source_payload_json&&primary.source_payload_json!=='{}'?primary.source_payload_json:duplicate.source_payload_json||'{}',mergeNotes(primary.notes,duplicate.notes),
    latest(primary.last_seen_at,duplicate.last_seen_at)||new Date().toISOString(),latest(primary.last_contacted_at,duplicate.last_contacted_at),dnc?null:earliest(primary.next_follow_up_at,duplicate.next_follow_up_at),
    convertedUserId,normalizeCrmEmail(keepText(primary.email,duplicate.email)),normalizeCrmPhone(keepText(primary.phone,duplicate.phone)),normalizeCrmProfile(keepText(primary.profile_url,duplicate.profile_url)),primary.id
  );
  db.prepare('UPDATE crm_events SET lead_id=? WHERE lead_id=?').run(primary.id,duplicate.id);
  db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'deduplicated','Doppelten CRM-Kontakt zusammengeführt',?)").run(primary.id,JSON.stringify({mergedLeadId:duplicate.id,sourceType:duplicate.source_type,sourceExternalId:duplicate.source_external_id||''}));
  db.prepare('DELETE FROM crm_leads WHERE id=?').run(duplicate.id);
  return db.prepare('SELECT * FROM crm_leads WHERE id=?').get(primary.id) as CrmLead;
}

export function collapseCrmDuplicates(){
  ensureCrmSchema();
  refreshNormalizedIdentity();
  const rows=db.prepare('SELECT * FROM crm_leads ORDER BY id').all() as CrmLead[];
  const live=new Map(rows.map(row=>[row.id,row]));
  const ownerByKey=new Map<string,string>();
  let merged=0;
  const keys=(lead:CrmLead)=>[
    lead.normalized_email?`e:${lead.normalized_email}`:'',
    lead.normalized_phone?`p:${lead.normalized_phone}`:'',
    lead.normalized_profile_url?`u:${lead.normalized_profile_url}`:'',
    lead.source_external_id?`s:${lead.source_type}:${lead.source_external_id}`:'',
  ].filter(Boolean);
  const tx=db.transaction(()=>{
    for(const initial of rows){
      let current=live.get(initial.id);if(!current)continue;
      const candidates=[...new Set(keys(current).map(key=>ownerByKey.get(key)).filter((id):id is string=>Boolean(id)))].sort();
      for(const candidateId of candidates){
        const candidate=live.get(candidateId);if(!candidate||!current||!leadsCanMerge(candidate,current))continue;
        const primaryId=[candidate.id,current.id].sort()[0];
        const duplicateId=primaryId===candidate.id?current.id:candidate.id;
        const primary=live.get(primaryId),duplicate=live.get(duplicateId);if(!primary||!duplicate)continue;
        const mergedRow=mergeLeadRows(primary,duplicate);
        live.set(primaryId,mergedRow);live.delete(duplicateId);current=mergedRow;merged++;
        for(const [key,id] of ownerByKey.entries())if(id===duplicateId)ownerByKey.set(key,primaryId);
      }
      if(current)for(const key of keys(current))ownerByKey.set(key,current.id);
    }
  });
  tx();
  return merged;
}

function normalizeAddInput(input:AddLeadInput){
  const permission=input.permission||'unknown';
  const status=input.status||'collected';
  const dnc=permission==='do_not_contact'||status==='do_not_contact';
  return {...input,status:(dnc?'do_not_contact':status) as LeadStatus,permission:(dnc?'do_not_contact':permission) as Permission,nextFollowUpAt:dnc?null:(input.nextFollowUpAt||null)};
}

export function addCrmLead(input:AddLeadInput){
  ensureCrmSchema();
  const normalized=normalizeAddInput(input);
  const incomingMatch:MatchInput={leadType:normalized.leadType,email:normalized.email,phone:normalized.phone,profileUrl:normalized.profileUrl,sourceType:normalized.sourceType,sourceExternalId:normalized.sourceExternalId};
  const candidates=matchCandidates(incomingMatch).filter(candidate=>{
    if(candidate.converted_user_id&&normalized.convertedUserId&&candidate.converted_user_id!==normalized.convertedUserId)return false;
    const incomingEmail=normalizeCrmEmail(normalized.email);
    return !(candidate.normalized_email&&incomingEmail&&candidate.normalized_email!==incomingEmail&&candidate.normalized_phone===normalizeCrmPhone(normalized.phone));
  });
  const tx=db.transaction(()=>{
    if(candidates.length){
      let survivor=candidates[0];
      for(const duplicate of candidates.slice(1))if(leadsCanMerge(survivor,duplicate))survivor=mergeLeadRows(survivor,duplicate);
      const existingDnc=survivor.status==='do_not_contact'||survivor.contact_permission==='do_not_contact';
      const permission=existingDnc?'do_not_contact':permissionRank(survivor.contact_permission)>=permissionRank(normalized.permission)?survivor.contact_permission:normalized.permission;
      const status=existingDnc?'do_not_contact':statusRank(survivor.status)>=statusRank(normalized.status)?survivor.status:normalized.status;
      db.prepare(`UPDATE crm_leads SET name=?,company_name=?,category=?,address=?,locality=?,postcode=?,region=?,country=?,email=?,phone=?,website=?,profile_url=?,socials_json=?,status=?,contact_permission=?,notes=?,last_seen_at=CURRENT_TIMESTAMP,next_follow_up_at=?,converted_user_id=COALESCE(converted_user_id,?),normalized_email=?,normalized_phone=?,normalized_profile_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(
        keepText(survivor.name,normalized.name),keepText(survivor.company_name,normalized.companyName),keepText(survivor.category,normalized.category),keepText(survivor.address,normalized.address),keepText(survivor.locality,normalized.locality),keepText(survivor.postcode,normalized.postcode),keepText(survivor.region,normalized.region),keepText(survivor.country,normalized.country)||'DE',
        keepText(survivor.email,normalized.email),keepText(survivor.phone,normalized.phone),keepText(survivor.website,normalized.website),keepText(survivor.profile_url,normalized.profileUrl),survivor.socials_json&&survivor.socials_json!=='[]'?survivor.socials_json:normalized.socialsJson||'[]',
        status,permission,mergeNotes(survivor.notes,normalized.notes),existingDnc?null:earliest(survivor.next_follow_up_at,normalized.nextFollowUpAt),normalized.convertedUserId||null,
        normalizeCrmEmail(keepText(survivor.email,normalized.email)),normalizeCrmPhone(keepText(survivor.phone,normalized.phone)),normalizeCrmProfile(keepText(survivor.profile_url,normalized.profileUrl)),survivor.id
      );
      db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'duplicate_seen','Erneut erkannter CRM-Kontakt',?)").run(survivor.id,JSON.stringify({sourceType:normalized.sourceType,sourceDetail:normalized.sourceDetail||'',sourceExternalId:normalized.sourceExternalId||'',doNotContactPreserved:existingDnc}));
      return {id:survivor.id,created:false,duplicate:true};
    }
    const id=stableLeadId(incomingMatch);
    db.prepare(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes,next_follow_up_at,converted_user_id,normalized_email,normalized_phone,normalized_profile_url)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
        id,normalized.leadType,normalized.name,normalized.companyName||'',normalized.category||'',normalized.address||'',normalized.locality||'',normalized.postcode||'',normalized.region||'',normalized.country||'DE',normalized.email||'',normalized.phone||'',normalized.website||'',normalized.profileUrl||'',normalized.socialsJson||'[]',
        normalized.status,normalized.permission,normalized.sourceType,normalized.sourceDetail||'',normalized.sourceExternalId||'',normalized.sourcePayloadJson||'{}',normalized.notes||'',normalized.nextFollowUpAt||null,normalized.convertedUserId||null,
        normalizeCrmEmail(normalized.email),normalizeCrmPhone(normalized.phone),normalizeCrmProfile(normalized.profileUrl)
      );
    db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'created',?,?)").run(id,normalized.sourceDetail||'',JSON.stringify({sourceType:normalized.sourceType,sourceExternalId:normalized.sourceExternalId||''}));
    if(normalized.convertedUserId)db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'converted','Plattformkonto beim CRM-Anlegen verknüpft',?)").run(id,JSON.stringify({userId:normalized.convertedUserId,sourceType:normalized.sourceType}));
    return {id,created:true,duplicate:false};
  });
  return tx();
}

export function updateCrmLead(id:string,input:UpdateLeadInput){
  ensureCrmSchema();
  const previous=db.prepare('SELECT * FROM crm_leads WHERE id=?').get(id) as CrmLead|undefined;
  if(!previous)throw new Error('Lead nicht gefunden');
  let status=input.status,permission=input.permission;
  const alreadyDoNotContact=previous.status==='do_not_contact'||previous.contact_permission==='do_not_contact';
  if(alreadyDoNotContact){status='do_not_contact';permission='do_not_contact';}
  else if(status==='do_not_contact'||permission==='do_not_contact'){status='do_not_contact';permission='do_not_contact';}
  if(['contact_ready','contacted','invited'].includes(status)&&!['allowed','consented'].includes(permission))throw new Error('Kontaktfreigabe erforderlich');
  const sourceType=String(input.sourceType||previous.source_type);
  const sourceDetail=input.sourceDetail===undefined?previous.source_detail:String(input.sourceDetail||'');
  const followUp=status==='do_not_contact'?null:(input.nextFollowUpAt||null);
  const notes=input.notes===undefined?previous.notes:String(input.notes||'');
  const last=status==='contacted'&&previous.status!=='contacted'?',last_contacted_at=CURRENT_TIMESTAMP':'';
  const tx=db.transaction(()=>{
    db.prepare(`UPDATE crm_leads SET status=?,contact_permission=?,source_type=?,source_detail=?,notes=?,next_follow_up_at=?,updated_at=CURRENT_TIMESTAMP${last} WHERE id=?`).run(status,permission,sourceType,sourceDetail,notes,followUp,id);
    const common={channel:input.channel||'',note:notes};
    if(previous.status!==status)db.prepare("INSERT INTO crm_events(lead_id,event_type,channel,direction,note,metadata_json) VALUES(?,'status_changed',?,?,?,?)").run(id,common.channel,status==='contacted'?'outbound':'',common.note,JSON.stringify({from:previous.status,to:status}));
    if(previous.contact_permission!==permission)db.prepare("INSERT INTO crm_events(lead_id,event_type,channel,note,metadata_json) VALUES(?,'permission_changed',?,?,?)").run(id,common.channel,common.note,JSON.stringify({from:previous.contact_permission,to:permission}));
    if(previous.source_type!==sourceType||previous.source_detail!==sourceDetail)db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'source_changed',?,?)").run(id,common.note,JSON.stringify({from:{type:previous.source_type,detail:previous.source_detail},to:{type:sourceType,detail:sourceDetail}}));
    if((previous.next_follow_up_at||null)!==followUp)db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'follow_up_changed',?,?)").run(id,common.note,JSON.stringify({from:previous.next_follow_up_at||null,to:followUp}));
    if(previous.status===status&&previous.contact_permission===permission&&previous.source_type===sourceType&&previous.source_detail===sourceDetail&&(previous.next_follow_up_at||null)===followUp&&previous.notes!==notes)db.prepare("INSERT INTO crm_events(lead_id,event_type,note) VALUES(?,'note_changed',?)").run(id,notes);
  });
  tx();
}

type CrmLifecycleUser={
  id:number; email:string; phone:string|null; role:string; first_name:string; last_name:string;
  business_name:string|null; trades:string|null; provider_postcode:string|null; homeowner_postcode:string|null; has_sale:number;
};

function userMatchCandidates(user:CrmLifecycleUser){
  const candidates=matchCandidates({leadType:user.role==='provider'?'provider':'homeowner',email:user.email,phone:user.phone||''});
  return candidates.filter(lead=>user.role==='provider'?['provider','other'].includes(lead.lead_type):['homeowner','other'].includes(lead.lead_type));
}

export function syncCrmLifecycle(){
  ensureCrmSchema();
  if(lifecycleSyncing)return {deduplicated:0,linked:0,created:0};
  lifecycleSyncing=true;
  try{
    let deduplicated=collapseCrmDuplicates();let linked=0,created=0;
    const users=db.prepare(`SELECT u.id,u.email,u.phone,u.role,u.first_name,u.last_name,p.business_name,p.trades,p.postcode provider_postcode,h.postcode homeowner_postcode,
      EXISTS(SELECT 1 FROM sale_leads s WHERE s.homeowner_id=u.id AND s.status!='cancelled') has_sale
      FROM users u LEFT JOIN provider_profiles p ON p.user_id=u.id LEFT JOIN homeowner_profiles h ON h.user_id=u.id ORDER BY u.id`).all() as CrmLifecycleUser[];
    const tx=db.transaction(()=>{
      for(const user of users){
        const matches=userMatchCandidates(user);
        if(matches.length){
          let survivor=matches[0];for(const duplicate of matches.slice(1))if(leadsCanMerge(survivor,duplicate)){survivor=mergeLeadRows(survivor,duplicate);deduplicated++;}
          if(!survivor.converted_user_id){
            const dnc=survivor.status==='do_not_contact'||survivor.contact_permission==='do_not_contact';
            db.prepare(`UPDATE crm_leads SET converted_user_id=?,status=?,contact_permission=?,next_follow_up_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(user.id,dnc?'do_not_contact':'converted',dnc?'do_not_contact':survivor.contact_permission,dnc?null:survivor.next_follow_up_at,survivor.id);
            db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'converted','Bestehendes Plattformkonto automatisch verknüpft',?)").run(survivor.id,JSON.stringify({userId:user.id,role:user.role,doNotContactPreserved:dnc}));
            linked++;
          }
          continue;
        }
        if(user.role!=='provider'&&!user.has_sale)continue;
        const sourceDetail=user.role==='provider'?'Registrierter Partner':'Eigentümer mit aktivem Verkaufsprozess';
        const result=addCrmLead({leadType:user.role==='provider'?'provider':'homeowner',name:`${user.first_name||''} ${user.last_name||''}`.trim()||user.email,companyName:user.business_name||'',category:user.trades||'',postcode:user.provider_postcode||user.homeowner_postcode||'',email:user.email,phone:user.phone||'',status:'converted',permission:'unknown',sourceType:'existing_customer',sourceDetail,sourceExternalId:`user:${user.id}`,convertedUserId:user.id});
        if(result.created)created++;
      }
    });
    tx();
    deduplicated+=collapseCrmDuplicates();
    return {deduplicated,linked,created};
  }finally{lifecycleSyncing=false;}
}

export function crmStats(){
  ensureCrmSchema();
  const total=(db.prepare('SELECT count(*) n FROM crm_leads').get() as {n:number}).n;
  const byStatus=db.prepare('SELECT status,count(*) count FROM crm_leads GROUP BY status ORDER BY count DESC').all() as Array<{status:string;count:number}>;
  const byType=db.prepare('SELECT lead_type,count(*) count FROM crm_leads GROUP BY lead_type ORDER BY count DESC').all() as Array<{lead_type:string;count:number}>;
  const contact=db.prepare(`SELECT count(*) FILTER(WHERE email!='') email,count(*) FILTER(WHERE phone!='') phone,count(*) FILTER(WHERE website!='') website,count(*) FILTER(WHERE profile_url!='' OR socials_json!='[]') social,count(*) FILTER(WHERE next_follow_up_at IS NOT NULL AND date(next_follow_up_at)<=date('now')) dueFollowUps FROM crm_leads`).get() as {email:number;phone:number;website:number;social:number;dueFollowUps:number};
  return {total,byStatus,byType,...contact};
}

export function listCrmLeads(input:{q?:string;status?:string;type?:string;category?:string;followup?:string;page?:number;limit?:number}){
  ensureCrmSchema();
  const where:string[]=[]; const params:any[]=[];
  if(input.status&&CRM_STATUSES.includes(input.status as LeadStatus)){where.push('status=?');params.push(input.status);}
  if(input.type&&CRM_LEAD_TYPES.includes(input.type as LeadType)){where.push('lead_type=?');params.push(input.type);}
  if(input.category){where.push('category=?');params.push(input.category);}
  if(input.followup==='due')where.push("next_follow_up_at IS NOT NULL AND date(next_follow_up_at)<=date('now')");
  if(input.followup==='scheduled')where.push('next_follow_up_at IS NOT NULL');
  if(input.followup==='none')where.push('next_follow_up_at IS NULL');
  if(input.q){const q=`%${input.q.trim()}%`;where.push('(name LIKE ? OR company_name LIKE ? OR locality LIKE ? OR postcode LIKE ? OR email LIKE ? OR phone LIKE ? OR source_type LIKE ? OR source_detail LIKE ? OR notes LIKE ?)');params.push(q,q,q,q,q,q,q,q,q);}
  const limit=Math.max(20,Math.min(input.limit||60,200)); const page=Math.max(1,input.page||1); const offset=(page-1)*limit;
  const clause=where.length?` WHERE ${where.join(' AND ')}`:'';
  const total=(db.prepare(`SELECT count(*) n FROM crm_leads${clause}`).get(...params) as {n:number}).n;
  const rows=db.prepare(`SELECT * FROM crm_leads${clause} ORDER BY CASE WHEN next_follow_up_at IS NOT NULL AND date(next_follow_up_at)<=date('now') THEN 0 ELSE 1 END,CASE status WHEN 'replied' THEN 0 WHEN 'qualified' THEN 1 WHEN 'contact_ready' THEN 2 WHEN 'collected' THEN 3 ELSE 4 END,COALESCE(next_follow_up_at,'9999-12-31') ASC,updated_at DESC LIMIT ? OFFSET ?`).all(...params,limit,offset) as CrmLead[];
  return {rows,total,page,limit,pages:Math.max(1,Math.ceil(total/limit))};
}

export function crmCategories(limit=80){ensureCrmSchema();return db.prepare("SELECT category,count(*) count FROM crm_leads WHERE category!='' GROUP BY category ORDER BY count DESC LIMIT ?").all(limit) as Array<{category:string;count:number}>;}

function attachedTableExists(name:string){return Boolean(db.prepare("SELECT 1 FROM sin_research.sqlite_master WHERE type='table' AND name=?").get(name));}

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
  const beforeTotal=(db.prepare('SELECT count(*) n FROM crm_leads').get() as {n:number}).n;
  const sourceBefore=new Map((db.prepare("SELECT id,source_type,source_detail FROM crm_leads WHERE source_type LIKE 'business_research%'").all() as Array<{id:string;source_type:string;source_detail:string}>).map(row=>[row.id,`${row.source_type}\u0000${row.source_detail}`]));
  let businesses=0,intents=0,properties=0;
  try{
    try{db.exec('DETACH DATABASE sin_research');}catch{}
    db.prepare('ATTACH DATABASE ? AS sin_research').run(absolute);
    const tx=db.transaction(()=>{
      if(attachedTableExists('leads')){
        businesses=(db.prepare("SELECT count(*) n FROM sin_research.leads WHERE entity_type='business'").get() as {n:number}).n;
        db.exec(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
          SELECT 'research:'||id,'provider',name,name,coalesce(category,''),coalesce(address,''),coalesce(locality,''),coalesce(postcode,''),coalesce(region,''),coalesce(country,'DE'),coalesce(primary_email,''),coalesce(primary_phone,''),coalesce(primary_website,''),CASE WHEN json_valid(coalesce(socials_json,'[]')) THEN coalesce(json_extract(socials_json,'$[0]'),'') ELSE '' END,CASE WHEN json_valid(coalesce(socials_json,'[]')) THEN socials_json ELSE '[]' END,coalesce(status,'collected'),coalesce(contact_permission,'unknown'),'business_research',coalesce(source_provider,'overture'),id,json_object('provider',source_provider,'externalId',source_external_id,'release',source_release,'provenance',CASE WHEN json_valid(coalesce(provenance_json,'[]')) THEN json(provenance_json) ELSE json('[]') END),coalesce(notes,'')
          FROM sin_research.leads WHERE entity_type='business' ON CONFLICT(id) DO UPDATE SET ${CRM_REFRESH}`);
      }
      if(attachedTableExists('public_intents')){
        intents=(db.prepare('SELECT count(*) n FROM sin_research.public_intents').get() as {n:number}).n;
        db.exec(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
          SELECT 'research-intent:'||id,'public_intent',coalesce(nullif(trim(title),''),'Öffentliches Bedarfssignal'),'',coalesce(topic,''),'',coalesce(locality,''),'','','DE','','','',coalesce(source_url,''),'[]',CASE status WHEN 'qualified' THEN 'qualified' WHEN 'converted' THEN 'converted' WHEN 'ignored' THEN 'not_interested' ELSE 'collected' END,coalesce(contact_permission,'unknown'),'business_research_intent',coalesce(nullif(source_provider,''),nullif(source_kind,''),'public_web'),id,json_object('provider',source_provider,'kind',source_kind,'url',source_url,'authorHandle',author_handle,'publishedAt',published_at,'intentScore',intent_score,'excerpt',body_excerpt,'provenance',CASE WHEN json_valid(coalesce(provenance_json,'{}')) THEN json(provenance_json) ELSE json('{}') END),printf('Öffentliches Bedarfssignal · Intent-Score %.1f',coalesce(intent_score,0))
          FROM sin_research.public_intents WHERE 1 ON CONFLICT(id) DO UPDATE SET ${CRM_REFRESH}`);
      }
      if(attachedTableExists('property_opportunities')){
        properties=(db.prepare('SELECT count(*) n FROM sin_research.property_opportunities').get() as {n:number}).n;
        db.exec(`INSERT INTO crm_leads(id,lead_type,name,company_name,category,address,locality,postcode,region,country,email,phone,website,profile_url,socials_json,status,contact_permission,source_type,source_detail,source_external_id,source_payload_json,notes)
          SELECT 'research-property:'||id,'property',coalesce(nullif(trim(address),''),nullif(trim(coalesce(building_type,'')||' '||coalesce(postcode,'')||' '||coalesce(locality,'')),''),'Objektchance'),'',coalesce(building_type,''),coalesce(address,''),coalesce(locality,''),coalesce(postcode,''),'',coalesce(country,'DE'),'','','','','[]',CASE status WHEN 'target_area' THEN 'qualified' WHEN 'inbound' THEN 'replied' WHEN 'converted' THEN 'converted' WHEN 'excluded' THEN 'not_interested' ELSE 'collected' END,'unknown','business_research_property',coalesce(source_provider,'open_data'),id,json_object('provider',source_provider,'externalId',source_external_id,'lat',lat,'lon',lon,'attributes',CASE WHEN json_valid(coalesce(attributes_json,'{}')) THEN json(attributes_json) ELSE json('{}') END,'provenance',CASE WHEN json_valid(coalesce(provenance_json,'{}')) THEN json(provenance_json) ELSE json('{}') END),'Nicht-personenbezogene Objektchance aus offenen Daten'
          FROM sin_research.property_opportunities WHERE 1 ON CONFLICT(id) DO UPDATE SET ${CRM_REFRESH}`);
      }
      const refreshed=db.prepare("SELECT id,source_type,source_detail FROM crm_leads WHERE source_type LIKE 'business_research%'").all() as Array<{id:string;source_type:string;source_detail:string}>;
      const event=db.prepare("INSERT INTO crm_events(lead_id,event_type,note,metadata_json) VALUES(?,'source_changed','Research-Quelle aktualisiert',?)");
      for(const row of refreshed){const old=sourceBefore.get(row.id);const next=`${row.source_type}\u0000${row.source_detail}`;if(old&&old!==next)event.run(row.id,JSON.stringify({from:old.split('\u0000'),to:[row.source_type,row.source_detail]}));}
    });
    tx();
  }finally{try{db.exec('DETACH DATABASE sin_research');}catch{}}
  refreshNormalizedIdentity();
  const lifecycle=syncCrmLifecycle();
  const afterTotal=(db.prepare('SELECT count(*) n FROM crm_leads').get() as {n:number}).n;
  const inserted=Math.max(0,afterTotal-beforeTotal);
  const total=businesses+intents+properties;
  return {inserted,updated:Math.max(0,total-inserted),total,businesses,intents,properties,deduplicated:lifecycle.deduplicated,linked:lifecycle.linked,source:absolute};
}
