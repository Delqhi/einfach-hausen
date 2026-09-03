export const STANDARD_CONTACT_CATEGORIES = [
  'Haus & Allgemein',
  'Garten & Außen',
  'Dach & Fassade',
  'Elektro',
  'Sanitär & Heizung',
  'Fenster & Türen',
  'Reinigung & Pflege',
  'Technik & Energie',
  'Sicherheit & Schloss',
  'Renovierung & Innenausbau',
] as const;

export function normalizeContactCategory(value:string){
  const text=(value||'').trim();
  if(!text)return 'Haus & Allgemein';
  const lower=text.toLowerCase();
  if(lower.includes('garten')||lower.includes('außen'))return 'Garten & Außen';
  if(lower.includes('dach')||lower.includes('fassade'))return 'Dach & Fassade';
  if(lower.includes('elekt'))return 'Elektro';
  if(lower.includes('sanit')||lower.includes('heiz')||lower.includes('shk')||lower.includes('wärmepumpe'))return 'Sanitär & Heizung';
  if(lower.includes('fenster')||lower.includes('tür'))return 'Fenster & Türen';
  if(lower.includes('reinig')||lower.includes('pflege'))return 'Reinigung & Pflege';
  if(lower.includes('energie')||lower.includes('pv')||lower.includes('solar')||lower.includes('wallbox')||lower.includes('smart'))return 'Technik & Energie';
  if(lower.includes('schloss')||lower.includes('sicherheit'))return 'Sicherheit & Schloss';
  if(lower.includes('renov')||lower.includes('innen')||lower.includes('maler')||lower.includes('boden'))return 'Renovierung & Innenausbau';
  if(lower.includes('hausmeister')||lower==='haus'||lower.includes('allgemein')||lower.includes('sonstig'))return 'Haus & Allgemein';
  return text.slice(0,60);
}

export function groupContactsByCategory<T extends {category?:string|null}>(contacts:T[]){
  const groups=new Map<string,T[]>();
  for(const contact of contacts){
    const category=normalizeContactCategory(contact.category||'');
    const list=groups.get(category)||[];
    list.push(contact); groups.set(category,list);
  }
  const order=new Map<string,number>(STANDARD_CONTACT_CATEGORIES.map((v,i)=>[v,i]));
  return [...groups.entries()].sort(([a],[b])=>(order.get(a)??999)-(order.get(b)??999)||a.localeCompare(b,'de'));
}
