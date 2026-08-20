const CATEGORY_RULES: Array<[string, RegExp]> = [
  ['Garten & Außenbereich', /hecke|rasen|garten|baum|bäume|beet|laub|zaun|terrasse/i],
  ['Reinigung', /reinig|putz|fenster|treppenhaus|glas|grundreinigung/i],
  ['Elektro', /strom|steckdose|elektr|lampe|licht|sicherung/i],
  ['Sanitär & Heizung', /wasser|hahn|toilette|wc|heizung|therme|rohr|abfluss/i],
  ['Maler & Ausbau', /maler|streichen|tapete|wand|decke|trockenbau/i],
  ['Montage & Reparatur', /montage|reparatur|tür|schloss|möbel|schrank|regal|bohren/i],
  ['Dach & Fassade', /dach|rinne|fassade|ziegel/i],
  ['Umzug & Transport', /umzug|transport|tragen|möbeltransport/i],
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
];

const DAY_INDEX: Record<string, number> = {
  sonntag: 0, montag: 1, dienstag: 2, mittwoch: 3, donnerstag: 4, freitag: 5, samstag: 6,
};

function nextWeekday(name: string) {
  const target = DAY_INDEX[name.toLowerCase()];
  if (target === undefined) return null;
  const now = new Date();
  let delta = (target - now.getDay() + 7) % 7;
  if (delta === 0) delta = 7;
  const d = new Date(now);
  d.setDate(now.getDate() + delta);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseRequest(text: string) {
  const category = CATEGORY_RULES.find(([, re]) => re.test(text))?.[0] ?? 'Hausmeister & Sonstiges';
  const fallbackTitles: Record<string, string> = {
    'Garten & Außenbereich': 'Gartenarbeit', 'Reinigung': 'Reinigung', 'Elektro': 'Elektroarbeit',
    'Sanitär & Heizung': 'Sanitär-/Heizungsarbeit', 'Maler & Ausbau': 'Maler-/Ausbauarbeit',
    'Montage & Reparatur': 'Montage oder Reparatur', 'Dach & Fassade': 'Dach-/Fassadenarbeit',
    'Umzug & Transport': 'Transportauftrag', 'Hausmeister & Sonstiges': 'Hausmeisterauftrag',
  };
  const title = TITLE_RULES.find(([, re]) => re.test(text))?.[0] ?? fallbackTitles[category];

  const budget = text.match(/(?:budget|bis|max(?:imal)?)[^0-9]{0,8}(\d{2,5})\s*€?/i);
  const range = text.match(/(\d{2,5})\s*(?:€)?\s*(?:-|–|bis)\s*(\d{2,5})\s*€/i);
  const postcode = text.match(/\b(\d{5})\b/)?.[1] ?? null;
  const timeMatch = text.match(/\b(?:um\s*)?(\d{1,2})(?::(\d{2}))?\s*(?:uhr)?\b/i);
  const preferredTime = timeMatch && Number(timeMatch[1]) <= 23
    ? `${String(timeMatch[1]).padStart(2, '0')}:${String(timeMatch[2] ?? '00').padStart(2, '0')}`
    : null;
  const weekday = text.match(/\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b/i)?.[1] ?? null;
  const explicitDate = text.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})?\b/);
  let preferredDate = weekday ? nextWeekday(weekday) : null;
  if (explicitDate) {
    const now = new Date();
    const year = explicitDate[3] ? Number(explicitDate[3]) : now.getFullYear();
    preferredDate = `${year}-${String(explicitDate[2]).padStart(2, '0')}-${String(explicitDate[1]).padStart(2, '0')}`;
  }

  return {
    category, title, postcode, preferredDate, preferredTime,
    budgetMin: range ? Number(range[1]) : null,
    budgetMax: range ? Number(range[2]) : budget ? Number(budget[1]) : null,
  };
}
