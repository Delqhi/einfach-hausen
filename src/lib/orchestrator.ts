import { db } from './db';
import { analyzeRequest, answerHouseQuestion } from './request-ai';
import { geocodePostcode, distanceKm, regionalPostcodeGeo } from './geocode';
import { emergencyResponseScore, preferredRequestWindow } from './matching';
import { createNotification } from './notifications';
import { getProviderManagerIds } from './provider';
import { primaryProperty } from './properties';

export type HausmeisterIntent='service'|'contact';
export type HausmeisterResult = { jobId:number; threadId:number; reply:string; providerCount:number; intent:HausmeisterIntent };
export type HausmeisterAnswer = { threadId:number; reply:string };

type ServiceRow={slug:string;title:string;category:string;keywords:string;estimate_min:number;estimate_max:number;requires_license:number};

function findService(text:string, parsedCategory:string):ServiceRow{
  const services=db.prepare('SELECT * FROM service_catalog WHERE active=1').all() as ServiceRow[];
  const normalized=text.toLowerCase();
  let best:{row:ServiceRow;score:number}|null=null;
  for(const row of services){
    const words=row.keywords.split(',').map(x=>x.trim()).filter(Boolean);
    let score=words.reduce((n,w)=>n+(normalized.includes(w)?3:0),0);
    if(parsedCategory && row.category===parsedCategory) score+=2;
    if(!best||score>best.score)best={row,score};
  }
  return best?.score ? best.row : (services.find(s=>s.slug==='sonstiges')||services[0]);
}

function partnerTradeMatch(trades:string,service:ServiceRow){
  const text=(trades||'').toLowerCase();
  if(!text)return false;
  const category=service.category.toLowerCase();
  const words=service.keywords.split(',').map(x=>x.trim().toLowerCase());
  const aliases:Record<string,string[]>= {
    'garten & außenbereich':['garten','galabau','landschaft','grünpflege','hausmeister'],
    'reinigung':['reinigung','gebäudereinigung','putz','clean','fensterreinigung'],
    'elektro':['elektro','elektrik','elektriker'],
    'sanitär & heizung':['sanitär','shk','heizung','wärmepumpe'],
    'montage & reparatur':['montage','reparatur','handwerk','hausmeister'],
    'dach & fassade':['dach','dachdecker','fassade'],
    'maler & ausbau':['maler','malerei','trockenbau','ausbau','renovierung'],
    'umzug & transport':['umzug','transport','entrümpelung','spedition'],
    'energie & smart home':['pv','photovoltaik','solar','energie','smart home','wallbox'],
    'hausmeister & sonstiges':['hausmeister','service','allround','montage']
  };
  return text.includes(category)||[...(aliases[category]||[]),...words].some(w=>text.includes(w));
}

function berlinMinutesNow(){
  const parts=new Intl.DateTimeFormat('de-DE',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const hour=Number(parts.find(p=>p.type==='hour')?.value||0); const minute=Number(parts.find(p=>p.type==='minute')?.value||0);
  return hour*60+minute;
}

function berlinWeekday(){
  const short=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Berlin',weekday:'short'}).format(new Date());
  return ({Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6} as Record<string,number>)[short] ?? 0;
}

function timeToMinutes(value:string|undefined|null){
  const match=String(value||'').match(/^(\d{1,2}):(\d{2})$/); if(!match)return null;
  const hour=Number(match[1]),minute=Number(match[2]); if(hour>23||minute>59)return null; return hour*60+minute;
}

function emergencyAvailableNow(p:any){
  if(p.emergency_mode==='24_7')return true;
  const days=String(p.emergency_days||'1,2,3,4,5,6,0').split(',').map(Number).filter(Number.isInteger);
  if(!days.includes(berlinWeekday()))return false;
  const start=timeToMinutes(p.emergency_start),end=timeToMinutes(p.emergency_end); if(start===null||end===null)return false;
  const now=berlinMinutesNow(); if(start===end)return true;
  return start<end ? now>=start&&now<=end : now>=start||now<=end;
}

function getThread(userId:number,channel:'app'|'whatsapp'){
  let row=db.prepare('SELECT id FROM assistant_threads WHERE user_id=? AND channel=? ORDER BY updated_at DESC LIMIT 1').get(userId,channel) as {id:number}|undefined;
  if(!row){const r=db.prepare('INSERT INTO assistant_threads(user_id,channel) VALUES(?,?)').run(userId,channel);row={id:Number(r.lastInsertRowid)};}
  return row.id;
}

function addAgentMessage(threadId:number,role:'user'|'assistant'|'event',body:string,metadata:Record<string,unknown>={}){
  db.prepare('INSERT INTO assistant_messages(thread_id,role,body,metadata_json) VALUES(?,?,?,?)').run(threadId,role,body,JSON.stringify(metadata));
  db.prepare('UPDATE assistant_threads SET updated_at=CURRENT_TIMESTAMP WHERE id=?').run(threadId);
}

export function appendJobEvent(jobId:number,body:string,metadata:Record<string,unknown>={}){
  const thread=db.prepare('SELECT id FROM assistant_threads WHERE active_job_id=? ORDER BY updated_at DESC LIMIT 1').get(jobId) as {id:number}|undefined;
  if(thread)addAgentMessage(thread.id,'event',body,metadata);
}

async function dispatchJob(jobId:number,homeownerId:number,service:ServiceRow,jobPostcode:string,jobGeo:{lat:number;lon:number}|null,requestKind:HausmeisterIntent|'emergency'='service'){
  const partners=db.prepare(`SELECT p.*,c.status contract_status,c.insurance_verified,c.qualification_verified,c.contract_verified,c.quality_standard_verified,c.customer_discount_bps,c.response_target_minutes,pref.accepts_normal_jobs,pref.accepts_short_notice,pref.accepts_consultation,pref.accepts_emergencies,pref.emergency_mode,pref.emergency_markup_bps,pref.emergency_start,pref.emergency_end,pref.emergency_days,
      (SELECT AVG((julianday(d2.responded_at)-julianday(d2.sent_at))*1440.0) FROM job_dispatches d2 WHERE d2.provider_id=p.user_id AND d2.responded_at IS NOT NULL AND d2.sent_at>=datetime('now','-90 days')) average_response_minutes,
      (SELECT COUNT(*) FROM job_dispatches d3 WHERE d3.provider_id=p.user_id AND d3.responded_at IS NOT NULL AND d3.sent_at>=datetime('now','-90 days')) response_samples,
      CASE WHEN ps.id IS NULL THEN free.monthly_lead_limit ELSE paid.monthly_lead_limit END monthly_lead_limit,
      CASE WHEN ps.id IS NULL THEN 'free' ELSE ps.plan_slug END partner_plan
    FROM provider_profiles p JOIN partner_contracts c ON c.provider_id=p.user_id
    LEFT JOIN provider_preferences pref ON pref.provider_id=p.user_id
    LEFT JOIN partner_subscriptions ps ON ps.provider_id=p.user_id AND ps.status IN ('active','trialing')
    LEFT JOIN partner_plans paid ON paid.slug=ps.plan_slug
    LEFT JOIN partner_plans free ON free.slug='free'
    WHERE p.verified=1 AND c.status='active'`).all() as any[];
  const preferredProviders=new Set((db.prepare('SELECT DISTINCT provider_id FROM homeowner_contacts WHERE homeowner_id=?').all(homeownerId) as Array<{provider_id:number}>).map(r=>r.provider_id));
  const jobTiming=db.prepare('SELECT preferred_date,preferred_time FROM jobs WHERE id=?').get(jobId) as {preferred_date:string|null;preferred_time:string|null}|undefined;
  const timingWindow=preferredRequestWindow({preferredDate:jobTiming?.preferred_date,preferredTime:jobTiming?.preferred_time});
  const shortNotice=timingWindow.shortNotice;
  const matches:{p:any;distance:number|null;score:number}[]=[];
  const jobPoint=jobGeo||regionalPostcodeGeo(jobPostcode);
  for(const p of partners){
    const offerings=(db.prepare(`SELECT service_slug FROM provider_service_offerings WHERE provider_id=? AND active=1`).all(p.user_id) as Array<{service_slug:string}>).map(r=>r.service_slug);
    if(offerings.length){if(!offerings.includes(service.slug)&&!offerings.includes('sonstiges'))continue;}else if(!partnerTradeMatch(p.trades,service))continue;
    if(requestKind==='contact'&&p.accepts_consultation===0)continue;
    if(requestKind==='service'&&p.accepts_normal_jobs===0)continue;
    if(requestKind==='service'&&shortNotice&&p.accepts_short_notice===0)continue;
    if(requestKind==='emergency'&&(p.accepts_emergencies!==1||!emergencyAvailableNow(p)))continue;
    if(Number.isFinite(p.monthly_lead_limit)){
      const used=(db.prepare(`SELECT COUNT(*) c FROM job_dispatches WHERE provider_id=? AND sent_at>=datetime('now','start of month')`).get(p.user_id) as {c:number}).c;
      if(used>=Number(p.monthly_lead_limit))continue;
    }
    let distance:number|null=null;
    const providerPoint=Number.isFinite(p.lat)&&Number.isFinite(p.lon)?{lat:Number(p.lat),lon:Number(p.lon)}:regionalPostcodeGeo(String(p.postcode||''));
    if(jobPoint&&providerPoint)distance=distanceKm(jobPoint,providerPoint);
    if(distance!==null&&distance>p.radius_km)continue;
    // If neither an exact nor a regional centroid can be resolved, fail closed for narrow-radius matching.
    if(distance===null&&Number(p.radius_km)<50)continue;
    const quality=[p.insurance_verified,p.qualification_verified,p.contract_verified,p.quality_standard_verified].filter(Boolean).length;
    const distanceScore=distance===null?10:Math.max(0,30-distance);
    const ratingScore=(Number(p.rating)||0)*8;
    const existingRelationship=preferredProviders.has(p.user_id)?30:0;
    const openJobs=(db.prepare(`SELECT COUNT(*) c FROM job_dispatches d JOIN jobs j ON j.id=d.job_id WHERE d.provider_id=? AND d.status='accepted' AND j.status IN ('accepted','in_progress')`).get(p.user_id) as {c:number}).c;
    const capacityScore=Math.max(-20,10-openJobs*2);
    const emergencyScore=requestKind==='emergency'?emergencyResponseScore({averageResponseMinutes:p.average_response_minutes,responseSamples:p.response_samples,responseTargetMinutes:p.response_target_minutes,emergencyMode:p.emergency_mode}):0;
    const score=quality*15+distanceScore+ratingScore+existingRelationship+capacityScore+emergencyScore;
    matches.push({p,distance,score});
  }
  matches.sort((a,b)=>b.score-a.score);
  const insert=db.prepare(`INSERT OR IGNORE INTO job_dispatches(job_id,provider_id,status,match_score,distance_km) VALUES(?,?,'sent',?,?)`);
  let created=0;
  const limit=requestKind==='contact'?8:requestKind==='emergency'?12:30;
  for(const m of matches.slice(0,limit)){
    const result=insert.run(jobId,m.p.user_id,m.score,m.distance);
    if(result.changes){
      created++;
      const title=requestKind==='contact'?'Neue Beratungsanfrage':requestKind==='emergency'?'🚨 Neue Notfallanfrage':'Neue passende Anfrage';
      const body=requestKind==='contact'?`Ein Eigentümer sucht einen fachlichen Ansprechpartner für ${service.title} in ${jobPostcode||'deiner Region'}. Kein Auftrag nötig.`:requestKind==='emergency'?`Dringende ${service.title}-Anfrage in ${jobPostcode||'deiner Region'}. Bitte nur annehmen, wenn du kurzfristig helfen kannst.`:`${service.title} in ${jobPostcode||'deiner Region'} wartet auf deine Rückmeldung.`;
      for(const managerId of getProviderManagerIds(m.p.user_id))createNotification(managerId,title,body,`/pro/jobs/${jobId}`,'dispatch');
    }
  }
  return created;
}

export async function answerHausmeisterQuestion(userId:number,body:string,channel:'app'|'whatsapp'='app',photoPath?:string|null):Promise<HausmeisterAnswer>{
  const user=db.prepare(`SELECT u.id,u.first_name,h.postcode,h.address,h.house_type,h.build_year,h.living_area,h.plot_area FROM users u JOIN homeowner_profiles h ON h.user_id=u.id WHERE u.id=? AND u.role='homeowner'`).get(userId) as any;
  if(!user)throw new Error('Homeowner not found');
  const threadId=getThread(userId,channel);
  addAgentMessage(threadId,'user',body,photoPath?{photo:photoPath}:{});
  const property=primaryProperty(userId);
  const assets=property?db.prepare(`SELECT kind,name,details,installed_year FROM house_assets WHERE property_id=? ORDER BY created_at DESC LIMIT 8`).all(property.id) as any[]:[];
  const maintenance=property?db.prepare(`SELECT title,category,due_date,status FROM maintenance_tasks WHERE property_id=? AND status='open' ORDER BY due_date ASC LIMIT 8`).all(property.id) as any[]:[];
  const contacts=property?db.prepare(`SELECT hc.category,u.first_name,u.last_name,p.business_name FROM homeowner_contacts hc JOIN users u ON u.id=hc.contact_user_id JOIN provider_profiles p ON p.user_id=hc.provider_id WHERE hc.property_id=? ORDER BY hc.updated_at DESC LIMIT 8`).all(property.id) as any[]:[];
  const recent=db.prepare(`SELECT title,category,status,updated_at FROM jobs WHERE homeowner_id=? ORDER BY updated_at DESC LIMIT 6`).all(userId) as any[];
  const history=property?db.prepare(`SELECT category,title,performed_at,company_name,cost_amount,guarantee_until,maintenance_due FROM house_history_entries WHERE property_id=? ORDER BY performed_at DESC LIMIT 10`).all(property.id) as any[]:[];
  const context=JSON.stringify({house:property?{postcode:property.postcode,address:property.address,houseType:property.property_type,buildYear:property.build_year,livingArea:property.living_area,plotArea:property.plot_area,estimatedValueMin:property.estimated_value_min,estimatedValueMax:property.estimated_value_max}:{postcode:user.postcode,address:user.address,houseType:user.house_type,buildYear:user.build_year,livingArea:user.living_area,plotArea:user.plot_area},assets,maintenance,contacts,history,recentJobs:recent});
  const reply=await answerHouseQuestion(body,context);
  addAgentMessage(threadId,'assistant',reply,{assistantOnly:true});
  return {threadId,reply};
}

export async function createHausmeisterRequest(userId:number,body:string,channel:'app'|'whatsapp'='app',photoPath?:string|null,intent:HausmeisterIntent='service',recordUserMessage=true,threadIdOverride?:number):Promise<HausmeisterResult>{
  const user=db.prepare(`SELECT u.id,u.first_name,h.postcode,h.address,h.lat,h.lon FROM users u JOIN homeowner_profiles h ON h.user_id=u.id WHERE u.id=? AND u.role='homeowner'`).get(userId) as any;
  if(!user)throw new Error('Homeowner not found');
  const threadId=threadIdOverride??getThread(userId,channel);
  if(recordUserMessage)addAgentMessage(threadId,'user',body,photoPath?{photo:photoPath}:{});

  const draft=db.prepare('SELECT combined_text,photo_path,intent FROM assistant_drafts WHERE thread_id=?').get(threadId) as {combined_text:string;photo_path:string|null;intent:HausmeisterIntent}|undefined;
  const effectiveIntent=draft?.intent||intent;
  const combined=draft?`${draft.combined_text}\nErgänzung: ${body}`:body;
  const effectivePhoto=photoPath||draft?.photo_path||null;
  const parsed=await analyzeRequest(combined);
  const service=findService(combined,parsed.category);
  const postcode=parsed.postcode||user.postcode||'';

  const hasLength=/\b\d+(?:[,.]\d+)?\s*(?:m|meter)\b/i.test(combined);
  let question:string|null=null;
  if(!postcode)question='Für welche Postleitzahl bzw. Adresse soll ich einen passenden regionalen Ansprechpartner suchen?';
  else if(effectiveIntent==='service'&&service.slug==='heckenschnitt'&&!hasLength)question='Wie lang ist die Hecke ungefähr? Eine grobe Angabe in Metern reicht.';
  else if(effectiveIntent==='service'&&!parsed.preferredDate)question='Wann soll die Arbeit ungefähr erledigt werden? Du kannst z. B. „nächsten Dienstag ab 14 Uhr“ schreiben.';
  else if(service.slug==='sonstiges'&&combined.replace(/\s+/g,' ').trim().length<18)question=effectiveIntent==='contact'?'Worum geht es ungefähr? Ein kurzer Satz reicht, damit ich den passenden fachlichen Ansprechpartner finde.':'Was genau soll an deinem Haus erledigt werden? Ein kurzer Satz reicht.';

  if(question){
    db.prepare(`INSERT INTO assistant_drafts(thread_id,combined_text,photo_path,intent,updated_at) VALUES(?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(thread_id) DO UPDATE SET combined_text=excluded.combined_text,photo_path=COALESCE(excluded.photo_path,assistant_drafts.photo_path),intent=excluded.intent,updated_at=CURRENT_TIMESTAMP`).run(threadId,combined,effectivePhoto,effectiveIntent);
    addAgentMessage(threadId,'assistant',question,{clarification:true,service:service.slug,intent:effectiveIntent});
    return {jobId:0,threadId,reply:question,providerCount:0,intent:effectiveIntent};
  }

  let geo=Number.isFinite(user.lat)&&Number.isFinite(user.lon)?{lat:user.lat,lon:user.lon}:null;
  if(parsed.postcode||!geo) geo=await geocodePostcode(postcode);
  const min=effectiveIntent==='service'?(parsed.budgetMin?parsed.budgetMin*100:service.estimate_min):null;
  const max=effectiveIntent==='service'?(parsed.budgetMax?parsed.budgetMax*100:service.estimate_max):null;
  const baseTitle=service.slug==='sonstiges'?(parsed.title||service.title):service.title;
  const title=effectiveIntent==='contact'?`Ansprechpartner: ${baseTitle}`:baseTitle;
  const property=primaryProperty(userId);
  const result=db.prepare(`INSERT INTO jobs(homeowner_id,title,description,category,postcode,preferred_date,preferred_time,budget_min,budget_max,service_slug,source_channel,request_kind,lat,lon,property_id)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(userId,title,combined,service.category,postcode,effectiveIntent==='service'?parsed.preferredDate:null,effectiveIntent==='service'?parsed.preferredTime:null,min,max,service.slug,channel,effectiveIntent,geo?.lat??null,geo?.lon??null,property?.id??null);
  const jobId=Number(result.lastInsertRowid);
  if(effectivePhoto)db.prepare('INSERT INTO job_photos(job_id,path) VALUES(?,?)').run(jobId,effectivePhoto);
  db.prepare('DELETE FROM assistant_drafts WHERE thread_id=?').run(threadId);
  db.prepare('UPDATE assistant_threads SET active_job_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(jobId,threadId);

  const providerCount=await dispatchJob(jobId,userId,service,postcode,geo,effectiveIntent);
  const euro=(v:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v/100);
  let reply:string;
  if(effectiveIntent==='contact'){
    reply=providerCount>0
      ? `Alles klar. Ich suche dir jetzt einen passenden menschlichen Ansprechpartner für ${service.title}. Ich habe ${providerCount} geprüfte regionale Partner angefragt. Dafür wird noch kein Auftrag vergeben und kein Preis vereinbart. Sobald ein Betrieb übernimmt, kannst du direkt schreiben oder anrufen.`
      : `Alles klar. Ich habe deine Kontaktanfrage für ${service.title} angelegt. In deinem aktuellen Partnergebiet ist gerade kein freigegebener Betrieb automatisch verfügbar. Die Anfrage bleibt offen, bis ein passender Vertragspartner verfügbar ist.`;
  }else{
    const when=parsed.preferredDate?` für ${parsed.preferredDate}${parsed.preferredTime?` ab ${parsed.preferredTime} Uhr`:''}`:'';
    reply=providerCount>0
      ? `Alles klar. Ich habe ${service.title}${when} erkannt. Der Richtpreis liegt aktuell ungefähr bei ${euro(min!)}–${euro(max!)}. Ich habe ${providerCount} passende, vertraglich geprüfte Partner in deiner Region angefragt. Sobald Angebote eintreffen, vergleiche ich Preis, Termin, Entfernung und Qualität und zeige dir meine Empfehlung.`
      : `Alles klar. Ich habe ${service.title}${when} erkannt. Der Richtpreis liegt aktuell ungefähr bei ${euro(min!)}–${euro(max!)}. In deinem aktuellen Partnergebiet ist gerade kein freigegebener Betrieb automatisch verfügbar. Die Anfrage bleibt offen und wird im Partnernetzwerk sichtbar, sobald ein passender Vertragspartner freigeschaltet ist.`;
  }
  addAgentMessage(threadId,'assistant',reply,{jobId,service:service.slug,estimateMin:min,estimateMax:max,providerCount,intent:effectiveIntent});
  return {jobId,threadId,reply,providerCount,intent:effectiveIntent};
}

export async function createEmergencyRequest(userId:number,emergencyType:string,description:string){
  const user=db.prepare(`SELECT u.id,h.postcode,h.lat,h.lon FROM users u JOIN homeowner_profiles h ON h.user_id=u.id WHERE u.id=? AND u.role='homeowner'`).get(userId) as any;
  if(!user)throw new Error('Homeowner not found');
  const labels:Record<string,string>={water:'Wasserrohrbruch / Wasserschaden',heating:'Heizung ausgefallen',electric:'Stromproblem',roof:'Dach- oder Sturmschaden',lock:'Tür / Schloss',sanitary:'Sanitär-Notfall',other:'Sonstiger Notfall'};
  const label=labels[emergencyType]||labels.other; const combined=`${label}. ${description}`.trim(); const parsed=await analyzeRequest(combined); const service=findService(combined,parsed.category); const postcode=parsed.postcode||user.postcode||'';
  let geo=Number.isFinite(user.lat)&&Number.isFinite(user.lon)?{lat:user.lat,lon:user.lon}:null; if(!geo&&postcode)geo=await geocodePostcode(postcode);
  const property=primaryProperty(userId);
  const result=db.prepare(`INSERT INTO jobs(homeowner_id,title,description,category,postcode,preferred_date,preferred_time,budget_min,budget_max,service_slug,source_channel,request_kind,lat,lon,urgency,emergency_type,property_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'emergency',?,?)`).run(userId,`Notfall: ${label}`,combined,service.category,postcode,new Date().toISOString().slice(0,10),new Date().toTimeString().slice(0,5),service.estimate_min,service.estimate_max,service.slug,'app','service',geo?.lat??null,geo?.lon??null,emergencyType,property?.id??null);
  const jobId=Number(result.lastInsertRowid); const providerCount=await dispatchJob(jobId,userId,service,postcode,geo,'emergency');
  createNotification(userId,'Notfallsuche gestartet',providerCount?`${providerCount} passende Helfer in deiner Region wurden sofort angefragt.`:'Aktuell ist kein freigegebener Notfallhelfer automatisch verfügbar. Dein Vorgang bleibt offen.',`/app/jobs/${jobId}`,'emergency');
  return {jobId,providerCount};
}

export async function redispatchOpenJobs(){
  const jobs=db.prepare(`SELECT * FROM jobs WHERE status IN ('open','quoted') ORDER BY created_at DESC LIMIT 200`).all() as any[];
  let created=0;
  for(const job of jobs){
    const requestKind=job.urgency==='emergency'?'emergency':job.request_kind==='contact'?'contact':'service';
    if(requestKind==='service'&&preferredRequestWindow({preferredDate:job.preferred_date,preferredTime:job.preferred_time}).expired)continue;
    const service=(job.service_slug?db.prepare('SELECT * FROM service_catalog WHERE slug=?').get(job.service_slug):null) as ServiceRow|undefined;
    const fallback=(db.prepare("SELECT * FROM service_catalog WHERE slug='sonstiges'").get()) as ServiceRow;
    const geo=Number.isFinite(job.lat)&&Number.isFinite(job.lon)?{lat:job.lat,lon:job.lon}:regionalPostcodeGeo(String(job.postcode||''));
    created+=await dispatchJob(job.id,job.homeowner_id,service||fallback,job.postcode,geo,requestKind);
  }
  return created;
}

export function getQuoteRecommendations(jobId:number){
  const rows=db.prepare(`SELECT q.*,p.business_name,p.rating,p.rating_count,p.verified,p.stripe_onboarded,d.distance_km,c.insurance_verified,c.qualification_verified,c.contract_verified,c.quality_standard_verified,c.customer_discount_bps,pref.accepts_emergencies,pref.emergency_mode,pref.emergency_markup_bps,pref.emergency_start,pref.emergency_end
    FROM quotes q JOIN provider_profiles p ON p.user_id=q.provider_id
    LEFT JOIN job_dispatches d ON d.job_id=q.job_id AND d.provider_id=q.provider_id
    LEFT JOIN partner_contracts c ON c.provider_id=q.provider_id
    LEFT JOIN provider_preferences pref ON pref.provider_id=q.provider_id
    WHERE q.job_id=? AND q.status IN ('pending','accepted') AND p.verified=1 AND c.status='active' ORDER BY q.amount ASC`).all(jobId) as any[];
  if(!rows.length)return [];
  const minAmount=Math.min(...rows.map(r=>r.amount));
  const now=Date.now();
  return rows.map(r=>{
    const priceScore=minAmount/r.amount*45;
    const quality=(Number(r.rating)||0)/5*25 + [r.insurance_verified,r.qualification_verified,r.contract_verified,r.quality_standard_verified].filter(Boolean).length*4;
    const distance=Number.isFinite(r.distance_km)?Math.max(0,15-Math.min(15,r.distance_km/2)):7;
    let availability=5;
    if(r.available_at){const hours=(new Date(r.available_at).getTime()-now)/3600000;availability=Math.max(0,15-Math.min(15,Math.max(0,hours)/24));}
    return {...r,recommendation_score:priceScore+quality+distance+availability};
  }).sort((a,b)=>b.recommendation_score-a.recommendation_score);
}
