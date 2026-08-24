import { normalizeDispatchText, offeringMatchesService, serviceSearchTerms, type DispatchService } from './dispatch-config';

const CATEGORY_TRADE_ALIASES:Record<string,readonly string[]>={
  'garten aussenbereich':['garten','galabau','landschaft','gruenpflege','hausmeister'],
  reinigung:['reinigung','gebaeudereinigung','putz','clean','fensterreinigung'],
  elektro:['elektro','elektrik','elektriker'],
  'sanitaer heizung':['sanitar','sanitaer','shk','heizung','waermepumpe'],
  'montage reparatur':['montage','reparatur','handwerk','hausmeister'],
  'dach fassade':['dach','dachdecker','fassade'],
  'maler ausbau':['maler','malerei','trockenbau','ausbau','renovierung'],
  'umzug transport':['umzug','transport','entruempelung','spedition'],
  'energie smart home':['pv','photovoltaik','solar','energie','smart home','wallbox'],
  'hausmeister sonstiges':['hausmeister','service','allround','montage'],
};

function containsTradeTerm(haystack:string,term:string){
  const normalized=normalizeDispatchText(term);
  if(!normalized)return false;
  if(normalized.length<=3&&!normalized.includes(' '))return haystack.split(' ').includes(normalized);
  return haystack.includes(normalized);
}

export function providerTradeMatchesService(trades:string,service:DispatchService){
  const text=normalizeDispatchText(trades);
  if(!text)return false;
  const category=normalizeDispatchText(service.category);
  const terms=[category,...(CATEGORY_TRADE_ALIASES[category]||[]),...serviceSearchTerms(service)];
  return terms.some(term=>containsTradeTerm(text,term));
}

export function providerSupportsService(offerings:string[],trades:string,service:DispatchService){
  const explicit=offerings.map(value=>String(value||'').trim()).filter(Boolean);
  if(explicit.length)return explicit.some(offering=>offeringMatchesService(offering,service));
  return providerTradeMatchesService(trades,service);
}
