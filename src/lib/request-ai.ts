const CATEGORY_RULES: Array<[string, RegExp]> = [
  ['Garten & Außenbereich', /hecke|rasen|garten|baum|bäume|beet|laub|zaun|terrasse/i],
  ['Reinigung', /reinig|putz|fenster|treppenhaus|glas|grundreinigung/i],
  ['Elektro', /strom|steckdose|elektr|lampe|licht|sicherung|wallbox/i],
  ['Sanitär & Heizung', /wasser|hahn|toilette|wc|heizung|therme|rohr|abfluss|wärmepumpe/i],
  ['Maler & Ausbau', /maler|streichen|tapete|wand|decke|trockenbau/i],
  ['Montage & Reparatur', /montage|reparatur|tür|schloss|möbel|schrank|regal|bohren/i],
  ['Dach & Fassade', /dach|rinne|fassade|ziegel/i],
  ['Umzug & Transport', /umzug|transport|tragen|möbeltransport|entrümpel/i],
  ['Energie & Smart Home', /pv|photovoltaik|solar|speicher|wallbox|smart home|energie/i],
];

const TITLE_RULES: Array<[string, RegExp]> = [
  ['Heckenschnitt', /hecke.{0,20}(schneid|schnitt)|heckenschnitt/i],
  ['Rasenpflege', /rasen.{0,20}(mäh|pflege)|rasenmähen/i],
  ['Terrassenreinigung', /terrass.{0,20}reinig/i],
  ['Fensterreinigung', /fenster.{0,20}(reinig|putz)/i],
  ['Elektroreparatur', /strom|steckdose|sicherung|elektr/i],
  ['Sanitärreparatur', /abfluss|wasserhahn|toilette|wc|rohr/i],
  ['Malerarbeiten', /streichen|maler|tapete/i],
  ['Montage & Reparatur', /montage|reparatur|tür|schloss|regal|schrank/i],
  ['Dach-/Dachrinnenarbeit', /dach|dachrinne|rinne/i],
  ['Energie-/Haustechnik', /pv|photovoltaik|wallbox|wärmepumpe|smart home/i],
];

const DAY_INDEX: Record<string, number> = {sonntag:0,montag:1,dienstag:2,mittwoch:3,donnerstag:4,freitag:5,samstag:6};
function nextWeekday(name:string){const target=DAY_INDEX[name.toLowerCase()];if(target===undefined)return null;const now=new Date();let delta=(target-now.getDay()+7)%7;if(delta===0)delta=7;const d=new Date(now);d.setDate(now.getDate()+delta);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}

export type ParsedRequest={category:string;title:string;postcode:string|null;preferredDate:string|null;preferredTime:string|null;budgetMin:number|null;budgetMax:number|null};

export function parseRequest(text:string):ParsedRequest{
  const category=CATEGORY_RULES.find(([,re])=>re.test(text))?.[0]??'Hausmeister & Sonstiges';
  const fallbackTitles:Record<string,string>={'Garten & Außenbereich':'Gartenarbeit','Reinigung':'Reinigung','Elektro':'Elektroarbeit','Sanitär & Heizung':'Sanitär-/Heizungsarbeit','Maler & Ausbau':'Maler-/Ausbauarbeit','Montage & Reparatur':'Montage oder Reparatur','Dach & Fassade':'Dach-/Fassadenarbeit','Umzug & Transport':'Transportauftrag','Energie & Smart Home':'Energie-/Haustechnik','Hausmeister & Sonstiges':'Hausservice'};
  const title=TITLE_RULES.find(([,re])=>re.test(text))?.[0]??fallbackTitles[category];
  const budget=text.match(/(?:budget|bis|max(?:imal)?)[^0-9]{0,8}(\d{2,5})\s*€?/i); const range=text.match(/(\d{2,5})\s*(?:€)?\s*(?:-|–|bis)\s*(\d{2,5})\s*€/i);
  const postcode=text.match(/\b(\d{5})\b/)?.[1]??null;
  const timeMatch=text.match(/\b(?:um|ab)\s*(\d{1,2})(?::(\d{2}))?\s*(?:uhr)?\b/i); const preferredTime=timeMatch&&Number(timeMatch[1])<=23?`${String(timeMatch[1]).padStart(2,'0')}:${String(timeMatch[2]??'00').padStart(2,'0')}`:null;
  const weekday=text.match(/\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b/i)?.[1]??null; const explicitDate=text.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})?\b/); let preferredDate=weekday?nextWeekday(weekday):null;
  if(explicitDate){const now=new Date();const year=explicitDate[3]?Number(explicitDate[3]):now.getFullYear();preferredDate=`${year}-${String(explicitDate[2]).padStart(2,'0')}-${String(explicitDate[1]).padStart(2,'0')}`;}
  return {category,title,postcode,preferredDate,preferredTime,budgetMin:range?Number(range[1]):null,budgetMax:range?Number(range[2]):budget?Number(budget[1]):null};
}

function jsonObject(text:string){const start=text.indexOf('{'),end=text.lastIndexOf('}');if(start<0||end<=start)return null;try{return JSON.parse(text.slice(start,end+1));}catch{return null;}}

export async function analyzeRequest(text:string):Promise<ParsedRequest>{
  const fallback=parseRequest(text); const key=process.env.AI_API_KEY||process.env.OMNIROUTE_MASTER_KEY; if(!key)return fallback;
  const base=(process.env.AI_BASE_URL||'http://127.0.0.1:20128/v1').replace(/\/$/,''); const model=process.env.AI_MODEL||'auto/best-fast';
  const today=new Date().toISOString().slice(0,10);
  const system=`Du extrahierst Auftragsdaten für einen deutschen digitalen Hausmeister. Heute ist ${today}. Antworte ausschließlich mit einem JSON-Objekt mit category,title,postcode,preferredDate,preferredTime,budgetMin,budgetMax. category muss eine der folgenden sein: Garten & Außenbereich, Reinigung, Elektro, Sanitär & Heizung, Maler & Ausbau, Montage & Reparatur, Dach & Fassade, Umzug & Transport, Energie & Smart Home, Hausmeister & Sonstiges. preferredDate YYYY-MM-DD oder null, preferredTime HH:mm oder null, Budgets als Euro-Zahl oder null. Erfinde nichts.`;
  try{
    const res=await fetch(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'system',content:system},{role:'user',content:text}],temperature:0.1,max_tokens:350}),signal:AbortSignal.timeout(8000)});
    if(!res.ok)return fallback; const data=await res.json() as any; const raw=String(data?.choices?.[0]?.message?.content||''); const ai=jsonObject(raw); if(!ai)return fallback;
    return {category:typeof ai.category==='string'?ai.category:fallback.category,title:typeof ai.title==='string'&&ai.title.trim()?ai.title.trim():fallback.title,postcode:/^\d{5}$/.test(String(ai.postcode||''))?String(ai.postcode):fallback.postcode,preferredDate:/^\d{4}-\d{2}-\d{2}$/.test(String(ai.preferredDate||''))?String(ai.preferredDate):fallback.preferredDate,preferredTime:/^\d{2}:\d{2}$/.test(String(ai.preferredTime||''))?String(ai.preferredTime):fallback.preferredTime,budgetMin:Number.isFinite(Number(ai.budgetMin))?Number(ai.budgetMin):fallback.budgetMin,budgetMax:Number.isFinite(Number(ai.budgetMax))?Number(ai.budgetMax):fallback.budgetMax};
  }catch{return fallback;}
}


export async function answerHouseQuestion(question:string, context:string):Promise<string>{
  const key=process.env.AI_API_KEY||process.env.OMNIROUTE_MASTER_KEY;
  const fallback=`Ich kann dir dabei helfen, das einzuordnen. Wenn du nur eine fachliche Person sprechen möchtest, wähle „Ansprechpartner finden“. Wenn tatsächlich etwas erledigt werden soll, wähle „Auftrag organisieren“.`;
  if(!key)return fallback;
  const base=(process.env.AI_BASE_URL||'http://127.0.0.1:20128/v1').replace(/\/$/,'');
  const model=process.env.AI_MODEL||'auto/best-fast';
  const system=`Du bist der digitale Hausmeister von Einfach Hausen für private Hauseigentümer in Deutschland. Antworte knapp, praktisch und verständlich. Nutze die vorhandene Hausakte nur, wenn sie wirklich relevant ist. Erfinde keine Fakten, Preise, Diagnosen oder Termine. Bei potenziell gefährlichen Elektro-, Gas-, Brand-, Wasser- oder Statikproblemen priorisiere sichere Sofortmaßnahmen und professionelle Hilfe. Nach deiner fachlichen Einordnung darfst du in einem kurzen letzten Satz erwähnen, dass der Kunde entweder einen menschlichen Ansprechpartner finden oder einen Auftrag organisieren lassen kann. Die Auswahl trifft immer der Kunde. Hauskontext:\n${context}`;
  try{
    const res=await fetch(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'system',content:system},{role:'user',content:question}],temperature:0.25,max_tokens:500}),signal:AbortSignal.timeout(10000)});
    if(!res.ok)return fallback;
    const data=await res.json() as any;
    const raw=String(data?.choices?.[0]?.message?.content||'').trim();
    return raw||fallback;
  }catch{return fallback;}
}
