export type DispatchService={slug:string;title:string;category:string;keywords:string};

const SERVICE_ALIASES:Record<string,readonly string[]>={
  heckenschnitt:['hecke','heckenpflege','hecke schneiden','heckenschnitt'],
  rasenpflege:['rasen','rasen maehen','rasen mähen','rasenpflege'],
  terrassenreinigung:['terrasse','terrassenreinigung','terrasse reinigen','hochdruckreinigung'],
  grundreinigung:['grundreinigung','hausreinigung','gebaeudereinigung','gebäudereinigung','putzen','reinigung'],
  fensterreinigung:['fenster','fenster putzen','fenster reinigen','fensterreinigung','glasreinigung'],
  elektro:['elektro','elektrik','elektriker','elektroreparatur','steckdose','sicherung'],
  sanitaer:['sanitaer','sanitär','shk','heizung','sanitaerreparatur','sanitärreparatur','abfluss','rohr'],
  montage:['montage','reparatur','hausmeister','moebelmontage','möbelmontage','tuer','tür','schloss'],
  dach:['dach','dachdecker','dachrinne','fassade','sturm'],
  maler:['maler','malerarbeiten','streichen','tapete','trockenbau','ausbau'],
  umzug:['umzug','transport','moebeltransport','möbeltransport','entruempelung','entrümpelung','spedition'],
  energie:['energie','photovoltaik','pv','solar','speicher','wallbox','smart home','waermepumpe','wärmepumpe'],
  sonstiges:['hausservice','sonstiges','allround'],
};

const SLUG_ALIASES:Record<string,string>={
  hecke:'heckenschnitt',heckenpflege:'heckenschnitt',
  rasen:'rasenpflege',rasenmaehen:'rasenpflege',
  terrasse:'terrassenreinigung',hochdruckreinigung:'terrassenreinigung',
  reinigung:'grundreinigung',hausreinigung:'grundreinigung',gebaeudereinigung:'grundreinigung',
  fenster:'fensterreinigung',glasreinigung:'fensterreinigung',fensterputzen:'fensterreinigung',
  elektrik:'elektro',elektriker:'elektro',
  sanitär:'sanitaer',sanitaerreparatur:'sanitaer',shk:'sanitaer',heizung:'sanitaer',
  reparatur:'montage',hausmeister:'montage',
  dachdecker:'dach',dachrinne:'dach',
  malerarbeiten:'maler',trockenbau:'maler',
  transport:'umzug',entruempelung:'umzug',
  pv:'energie',photovoltaik:'energie',solar:'energie',smarthome:'energie',
  hausservice:'sonstiges',allround:'sonstiges',
};

export function normalizeDispatchText(value:string){
  return String(value||'').toLocaleLowerCase('de-DE').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9]+/g,' ').trim();
}

function compact(value:string){return normalizeDispatchText(value).replace(/\s+/g,'');}

export function canonicalServiceSlug(value:string){
  const normalized=normalizeDispatchText(value);
  if(!normalized)return '';
  const direct=normalized.replace(/\s+/g,'-');
  if(SERVICE_ALIASES[direct])return direct;
  return SLUG_ALIASES[normalized]||SLUG_ALIASES[compact(normalized)]||direct;
}

function containsTerm(haystack:string,term:string){
  const normalized=normalizeDispatchText(term);
  if(!normalized)return false;
  if(normalized.length<=3&&!normalized.includes(' '))return haystack.split(' ').includes(normalized);
  return haystack.includes(normalized);
}

export function serviceSearchTerms(service:DispatchService){
  const keywords=String(service.keywords||'').split(',').map(v=>v.trim()).filter(Boolean);
  return Array.from(new Set([service.title,service.slug,...keywords,...(SERVICE_ALIASES[service.slug]||[])]));
}

export function resolveDispatchService(services:DispatchService[],text:string,parsedCategory:string){
  if(!services.length)throw new Error('No active services configured');
  const normalized=normalizeDispatchText(text);
  const generic=services.find(service=>service.slug==='sonstiges')||services[0];
  let best:{service:DispatchService;score:number}|null=null;
  for(const service of services){
    let score=0;
    for(const term of serviceSearchTerms(service))if(containsTerm(normalized,term))score+=4;
    if(parsedCategory&&service.category===parsedCategory)score+=2;
    if(service.slug==='sonstiges'&&score===2)score=0;
    if(!best||score>best.score||(score===best.score&&service.slug.localeCompare(best.service.slug,'de')<0))best={service,score};
  }
  return best&&best.score>0?best.service:generic;
}

export function offeringMatchesService(offeringSlug:string,service:DispatchService){
  const canonical=canonicalServiceSlug(offeringSlug);
  return canonical===service.slug;
}
