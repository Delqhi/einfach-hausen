const CATEGORY_RULES:Array<[string,RegExp]>=[
  ['Garten & Außenbereich',/hecke|rasen|garten|baum|bäume|beet|laub|zaun|terrasse/i],
  ['Reinigung',/reinig|putz|fenster|treppenhaus|glas|grundreinigung/i],
  ['Elektro',/strom|steckdose|elektr|lampe|licht|sicherung|wallbox/i],
  ['Sanitär & Heizung',/wasser|hahn|toilette|wc|heizung|therme|rohr|abfluss|wärmepumpe/i],
  ['Maler & Ausbau',/maler|streichen|tapete|wand|decke|trockenbau/i],
  ['Montage & Reparatur',/montage|reparatur|tür|schloss|möbel|schrank|regal|bohren/i],
  ['Dach & Fassade',/dach|rinne|fassade|ziegel/i],
  ['Umzug & Transport',/umzug|transport|tragen|möbeltransport|entrümpel/i],
  ['Energie & Smart Home',/pv|photovoltaik|solar|speicher|wallbox|smart home|energie/i],
];

const TITLE_RULES:Array<[string,RegExp]>=[
  ['Heckenschnitt',/hecke.{0,20}(schneid|schnitt)|heckenschnitt/i],
  ['Rasenpflege',/rasen.{0,20}(mäh|pflege)|rasenmähen/i],
  ['Terrassenreinigung',/terrass.{0,20}reinig/i],
  ['Fensterreinigung',/fenster.{0,20}(reinig|putz)/i],
  ['Elektroreparatur',/strom|steckdose|sicherung|elektr/i],
  ['Sanitärreparatur',/abfluss|wasserhahn|toilette|wc|rohr/i],
  ['Malerarbeiten',/streichen|maler|tapete/i],
  ['Montage & Reparatur',/montage|reparatur|tür|schloss|regal|schrank/i],
  ['Dach-/Dachrinnenarbeit',/dach|dachrinne|rinne/i],
  ['Energie-/Haustechnik',/pv|photovoltaik|wallbox|wärmepumpe|smart home/i],
];

const CATEGORIES=new Set(['Garten & Außenbereich','Reinigung','Elektro','Sanitär & Heizung','Maler & Ausbau','Montage & Reparatur','Dach & Fassade','Umzug & Transport','Energie & Smart Home','Hausmeister & Sonstiges']);
const DAY_INDEX:Record<string,number>={sonntag:0,montag:1,dienstag:2,mittwoch:3,donnerstag:4,freitag:5,samstag:6};
const WEEKDAY_INDEX:Record<string,number>={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};

function berlinToday(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).formatToParts(now);
  const value=(type:string)=>String(parts.find(part=>part.type===type)?.value||'');
  return {year:Number(value('year')),month:Number(value('month')),day:Number(value('day')),weekday:WEEKDAY_INDEX[value('weekday')]??0};
}

function isoDate(year:number,month:number,day:number){
  const date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return null;
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function addCalendarDays(base:{year:number;month:number;day:number},days:number){
  const date=new Date(Date.UTC(base.year,base.month-1,base.day+days));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`;
}

function nextWeekday(name:string,now=new Date()){
  const target=DAY_INDEX[name.toLowerCase()];
  if(target===undefined)return null;
  const today=berlinToday(now);
  let delta=(target-today.weekday+7)%7;
  if(delta===0)delta=7;
  return addCalendarDays(today,delta);
}

function extractPostcode(text:string){
  for(const match of text.matchAll(/\b\d{5}\b/g)){
    const index=match.index??0;
    const before=text.slice(Math.max(0,index-20),index).toLowerCase();
    const after=text.slice(index+5,index+16).toLowerCase();
    if(/(?:budget|max(?:imal)?|höchstens|bis)\s*[:=]?\s*$/.test(before))continue;
    if(/^\s*(?:€|eur\b)/i.test(after))continue;
    if(match[0]!=='00000')return match[0];
  }
  return null;
}

function preferredDateFromText(text:string,now=new Date()){
  const today=berlinToday(now);
  if(/\bübermorgen\b/i.test(text))return addCalendarDays(today,2);
  if(/\bmorgen\b/i.test(text))return addCalendarDays(today,1);
  if(/\bheute\b/i.test(text))return addCalendarDays(today,0);
  const weekday=text.match(/\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b/i)?.[1];
  if(weekday)return nextWeekday(weekday,now);
  const explicit=text.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})?\b/);
  if(!explicit)return null;
  let year=explicit[3]?Number(explicit[3]):today.year;
  let resolved=isoDate(year,Number(explicit[2]),Number(explicit[1]));
  if(!resolved)return null;
  const todayIso=addCalendarDays(today,0);
  if(!explicit[3]&&resolved<todayIso){year+=1;resolved=isoDate(year,Number(explicit[2]),Number(explicit[1]));}
  return resolved;
}

export type ParsedRequest={category:string;title:string;postcode:string|null;preferredDate:string|null;preferredTime:string|null;budgetMin:number|null;budgetMax:number|null};

export function parseRequest(text:string,now=new Date()):ParsedRequest{
  const category=CATEGORY_RULES.find(([,re])=>re.test(text))?.[0]??'Hausmeister & Sonstiges';
  const fallbackTitles:Record<string,string>={'Garten & Außenbereich':'Gartenarbeit','Reinigung':'Reinigung','Elektro':'Elektroarbeit','Sanitär & Heizung':'Sanitär-/Heizungsarbeit','Maler & Ausbau':'Maler-/Ausbauarbeit','Montage & Reparatur':'Montage oder Reparatur','Dach & Fassade':'Dach-/Fassadenarbeit','Umzug & Transport':'Transportauftrag','Energie & Smart Home':'Energie-/Haustechnik','Hausmeister & Sonstiges':'Hausservice'};
  const title=TITLE_RULES.find(([,re])=>re.test(text))?.[0]??fallbackTitles[category];
  const budget=text.match(/(?:budget|max(?:imal)?|höchstens)[^0-9]{0,8}(\d{2,6})(?:[,.]\d{1,2})?\s*(?:€|eur)?/i);
  const range=text.match(/(\d{2,6})(?:[,.]\d{1,2})?\s*(?:€|eur)?\s*(?:-|–|bis)\s*(\d{2,6})(?:[,.]\d{1,2})?\s*(?:€|eur)/i);
  const postcode=extractPostcode(text);
  const timeMatch=text.match(/\b(?:um|ab)\s*(\d{1,2})(?::(\d{2}))?\s*(?:uhr)?\b/i);
  const hour=timeMatch?Number(timeMatch[1]):-1,minute=timeMatch?Number(timeMatch[2]??'00'):-1;
  const preferredTime=timeMatch&&hour>=0&&hour<=23&&minute>=0&&minute<=59?`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`:null;
  const preferredDate=preferredDateFromText(text,now);
  return {category,title,postcode,preferredDate,preferredTime,budgetMin:range?Number(range[1]):null,budgetMax:range?Number(range[2]):budget?Number(budget[1]):null};
}

function jsonObject(text:string){const start=text.indexOf('{'),end=text.lastIndexOf('}');if(start<0||end<=start)return null;try{return JSON.parse(text.slice(start,end+1));}catch{return null;}}
function normalizedWords(value:string){return String(value||'').toLocaleLowerCase('de-DE').normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/ß/g,'ss').match(/[a-z0-9]{4,}/g)||[];}
function groundedTitle(value:unknown,text:string,fallback:string){
  if(typeof value!=='string')return fallback;
  const title=value.replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim().slice(0,100);
  if(!title)return fallback;
  const evidence=new Set(normalizedWords(text));
  const titleWords=normalizedWords(title);
  const titleNumbers=title.match(/\d+/g)||[];
  const textNumbers=new Set(text.match(/\d+/g)||[]);
  if(!titleWords.length||!titleWords.every(word=>evidence.has(word))||titleNumbers.some(value=>!textNumbers.has(value)))return fallback;
  return title;
}

export async function analyzeRequest(text:string):Promise<ParsedRequest>{
  const fallback=parseRequest(text);
  const key=process.env.AI_API_KEY||process.env.OMNIROUTE_MASTER_KEY;
  if(!key)return fallback;
  const base=(process.env.AI_BASE_URL||'http://127.0.0.1:20128/v1').replace(/\/$/,'');
  const model=process.env.AI_MODEL||'auto/best-fast';
  const today=addCalendarDays(berlinToday(),0);
  const system=`Du extrahierst Auftragsdaten für einen deutschen digitalen Hausmeister. Heute ist ${today}. Antworte ausschließlich mit einem JSON-Objekt mit category,title,postcode,preferredDate,preferredTime,budgetMin,budgetMax. category muss eine der folgenden sein: Garten & Außenbereich, Reinigung, Elektro, Sanitär & Heizung, Maler & Ausbau, Montage & Reparatur, Dach & Fassade, Umzug & Transport, Energie & Smart Home, Hausmeister & Sonstiges. preferredDate YYYY-MM-DD oder null, preferredTime HH:mm oder null, Budgets als Euro-Zahl oder null. Erfinde nichts.`;
  try{
    const res=await fetch(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,stream:false,messages:[{role:'system',content:system},{role:'user',content:text}],temperature:0.1,max_tokens:300}),signal:AbortSignal.timeout(8000)});
    if(!res.ok)return fallback;
    const data=await res.json() as any;
    const raw=String(data?.choices?.[0]?.message?.content||'');
    const ai=jsonObject(raw);
    if(!ai)return fallback;
    const category=typeof ai.category==='string'&&CATEGORIES.has(ai.category)&&ai.category===fallback.category?ai.category:fallback.category;
    return {...fallback,category,title:groundedTitle(ai.title,text,fallback.title)};
  }catch{return fallback;}
}

export async function answerHouseQuestion(question:string,context:string):Promise<string>{
  const key=process.env.AI_API_KEY||process.env.OMNIROUTE_MASTER_KEY;
  const fallback='Ich kann dir dabei helfen, das einzuordnen. Wenn du nur eine fachliche Person sprechen möchtest, wähle „Ansprechpartner finden“. Wenn tatsächlich etwas erledigt werden soll, wähle „Auftrag organisieren“.';
  if(!key)return fallback;
  const base=(process.env.AI_BASE_URL||'http://127.0.0.1:20128/v1').replace(/\/$/,'');
  const model=process.env.AI_MODEL||'auto/best-fast';
  const system=`Du bist der digitale Hausmeister von Einfach Hausen für private Hauseigentümer in Deutschland. Antworte knapp, praktisch und verständlich. Nutze die vorhandene Hausakte nur, wenn sie wirklich relevant ist. Erfinde keine Fakten, Preise, Diagnosen oder Termine. Bei potenziell gefährlichen Elektro-, Gas-, Brand-, Wasser- oder Statikproblemen priorisiere sichere Sofortmaßnahmen und professionelle Hilfe. Nach deiner fachlichen Einordnung darfst du in einem kurzen letzten Satz erwähnen, dass der Kunde entweder einen menschlichen Ansprechpartner finden oder einen Auftrag organisieren lassen kann. Die Auswahl trifft immer der Kunde. Hauskontext:\n${context}`;
  try{
    const res=await fetch(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,stream:false,messages:[{role:'system',content:system},{role:'user',content:question}],temperature:0.25,max_tokens:500}),signal:AbortSignal.timeout(10000)});
    if(!res.ok)return fallback;
    const data=await res.json() as any;
    const raw=String(data?.choices?.[0]?.message?.content||'').trim();
    return raw||fallback;
  }catch{return fallback;}
}
