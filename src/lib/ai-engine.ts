import { db } from './db';

// EH T-0207 — 3-stage AI cost architecture.
//
// Stage 1 (local intent engine, ~0 €): a deterministic rule engine classifies
// the request (trade/category, urgency, mode service vs consultation, postcode,
// form completeness). If confidence is high enough, the app answers/routes
// WITHOUT any cloud model call.
//
// Stage 2 (BYOK): the user supplies an OpenAI-compatible key (Google AI
// Studio / OpenRouter / ...). Calls run through the server proxy against the
// user's own gateway — unlimited for them, 0 € for the operator. The key is
// never logged and never sent back to any client.
//
// Stage 3 (freemium): without BYOK, cloud calls consume the monthly free
// allowance (FREEMIUM_MONTHLY) first, then granted ai_credits (rewarded ad
// +10 / purchase). Exhausted => honest UX, no dark patterns.

export const FREEMIUM_MONTHLY = 20;
export const AD_CREDIT_GRANT = 10;

export type IntentResult = {
  category: string;
  serviceHint: string | null;
  urgency: 'emergency' | 'short_notice' | 'planned';
  mode: 'service' | 'consultation' | 'unknown';
  postcode: string | null;
  needsCloud: boolean;
  cloudReason: string;
  confidence: number;
  matched: string[];
};

const TRADE_RULES: Array<{ category: string; serviceHint: string; words: string[] }> = [
  { category: 'Garten & Außenbereich', serviceHint: 'gartenpflege', words: ['garten', 'rasen', 'hecke', 'baum', 'sträucher', 'laub', 'zaun (bau|erneuern)?', 'terrasse holz'] },
  { category: 'Reinigung', serviceHint: 'reinigung', words: ['reinigen', 'putzen', 'grundreinigung', 'fensterputzen', 'treppenhaus'] },
  { category: 'Elektro', serviceHint: 'elektroinstallation', words: ['strom', 'steckdose', 'sicherung', 'elektr', 'lampe', 'kabel', 'wallbox', 'lüfter'] },
  { category: 'Sanitär & Heizung', serviceHint: 'rohrbruch', words: ['rohr', 'wasser leckt', 'undicht', 'heizung', 'radiator', 'abfluss', 'klo', 'wc', 'boiler', 'dusche'] },
  { category: 'Maler & Ausbau', serviceHint: 'malerarbeiten', words: ['streichen', 'malern', 'tapete', 'putz', 'spachtel', 'laminat verlegen'] },
  { category: 'Montage & Reparatur', serviceHint: 'montage', words: ['montieren', 'aufbauen', 'hängen', 'regal', 'möbel', 'türschloss', 'türglocke'] },
  { category: 'Dach & Fassade', serviceHint: 'dacharbeiten', words: ['dach', 'fassade', 'rinnen', 'dachrinne', 'ziegel', 'abdichtung'] },
  { category: 'Umzug & Transport', serviceHint: 'umzug', words: ['umzug', 'transport', 'mulde', 'entsorgung', ' Möbel abholen'] },
  { category: 'Energie & Smart Home', serviceHint: 'smart-home', words: ['thermostat', 'smart home', 'photovoltaik', 'pv-anlage', 'wärmepumpe', 'smarthome'] },
  { category: 'Hausmeister & Sonstiges', serviceHint: 'hausmeisterservice', words: ['hausmeister', 'hausmeisterservice', 'kleinkram', 'diverses'] },
];

const EMERGENCY_WORDS = ['sofort', 'dringend', 'notfall', 'wasser läuft', 'rohrbruch', 'brandgeruch', 'strom fällt', 'ausgefallen', 'gefahr', 'unmittelbar'];
const SHORT_NOTICE_WORDS = ['heute', 'morgen', 'diese woche', 'kurzfristig', 'am wochenende', 'bis freitag'];
const CONSULTATION_WORDS = ['beratung', 'beraten', 'frage', 'fragen', 'empfehlung', 'empfehlen', 'was kostet ungefähr', 'information', 'kann ich selbst', 'tipps'];
const MODE_SERVICE_WORDS = ['beauftragen', 'auftrag', 'machen lassen', 'erledigen', 'reparieren', 'installieren', 'bauen', 'umbauen', 'kommt vorbei'];

export function currentPeriod(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function classifyLocally(rawText: string): IntentResult {
  const text = normalize(rawText);
  const matched: string[] = [];

  let best: { category: string; serviceHint: string | null; hits: number } = { category: 'Hausmeister & Sonstiges', serviceHint: null, hits: 0 };
  for (const rule of TRADE_RULES) {
    let hits = 0;
    for (const word of rule.words) {
      if (text.includes(word)) { hits++; matched.push(word); }
    }
    if (hits > best.hits) best = { category: rule.category, serviceHint: rule.serviceHint, hits };
  }

  const isEmergency = EMERGENCY_WORDS.some((word) => text.includes(word));
  const isShortNotice = SHORT_NOTICE_WORDS.some((word) => text.includes(word));
  const wantsConsultation = CONSULTATION_WORDS.some((word) => text.includes(word));
  const wantsService = MODE_SERVICE_WORDS.some((word) => text.includes(word));
  const urgency: IntentResult['urgency'] = isEmergency ? 'emergency' : isShortNotice ? 'short_notice' : 'planned';
  const mode: IntentResult['mode'] = wantsConsultation && !wantsService ? 'consultation' : wantsService ? 'service' : 'unknown';

  const postcode = (rawText.match(/\b\d{5}\b/) || [])[0] ?? null;
  const hasDescription = rawText.trim().length >= 20;

  // Cloud is needed when the local signal is too weak to route confidently:
  // no trade match, unclear mode, or a free-text question that needs actual
  // reasoning/safety judgement.
  const weakCategory = best.hits === 0;
  // A clear trade hit already gives the dispatcher enough structure; the
  // homeowner can still refine mode on the next screen. Open questions and
  // unclassifiable text stay on the cloud path.
  const unclearMode = mode === 'unknown' && !isEmergency && best.hits === 0;
  const openQuestion = /\?\s*$/.test(rawText.trim()) && mode !== 'service';
  const needsCloud = weakCategory || openQuestion;
  const cloudReason = weakCategory ? 'no_trade_match' : openQuestion ? 'open_question' : unclearMode ? 'mode_unclear' : 'not_needed';

  const confidence = Math.min(1, (best.hits * 0.25) + (mode !== 'unknown' ? 0.3 : 0) + (postcode ? 0.2 : 0) + (hasDescription ? 0.15 : 0));

  return {
    category: best.category,
    serviceHint: best.hits > 0 ? best.serviceHint : null,
    urgency,
    mode,
    postcode,
    needsCloud,
    cloudReason,
    confidence: Math.round(confidence * 100) / 100,
    matched: [...new Set(matched)].slice(0, 8),
  };
}

// --- Stage ledger ----------------------------------------------------------

export function byokEnabled(userId: number): boolean {
  const row = db.prepare('SELECT ai_byok_enabled,ai_byok_key_enc FROM user_settings WHERE user_id=?').get(userId) as { ai_byok_enabled?: number; ai_byok_key_enc?: string | null } | undefined;
  return Boolean(row?.ai_byok_enabled && row.ai_byok_key_enc);
}

export function byokKeyEnc(userId: number): string | null {
  const row = db.prepare('SELECT ai_byok_key_enc FROM user_settings WHERE user_id=?').get(userId) as { ai_byok_key_enc?: string | null } | undefined;
  return row?.ai_byok_key_enc ?? null;
}

export function byokGateway(userId: number): { base: string; model: string } {
  const row = db.prepare('SELECT ai_byok_base_url,ai_byok_model FROM user_settings WHERE user_id=?').get(userId) as { ai_byok_base_url?: string; ai_byok_model?: string } | undefined;
  return { base: (row?.ai_byok_base_url || 'https://api.openai.com/v1').replace(/\/$/, ''), model: row?.ai_byok_model || 'gpt-4o-mini' };
}

export function freemiumUsedThisMonth(userId: number, now = new Date()): number {
  const row = db.prepare('SELECT COUNT(*) c FROM ai_usage WHERE user_id=? AND period=?').get(userId, currentPeriod(now)) as { c: number };
  return row.c;
}

export function creditBalance(userId: number): number {
  const granted = (db.prepare('SELECT COALESCE(SUM(granted),0) g FROM ai_credits WHERE user_id=?').get(userId) as { g: number }).g;
  const spent = (db.prepare(`SELECT COUNT(*) c FROM ai_usage WHERE user_id=? AND action='chat' AND credit_id IS NOT NULL`).get(userId) as { c: number }).c;
  return Math.max(0, granted - spent);
}

export function aiQuotaSnapshot(userId: number, now = new Date()) {
  return {
    byok: byokEnabled(userId),
    freemiumAllowed: FREEMIUM_MONTHLY,
    freemiumUsed: freemiumUsedThisMonth(userId, now),
    freemiumRemaining: Math.max(0, FREEMIUM_MONTHLY - freemiumUsedThisMonth(userId, now)),
    credits: creditBalance(userId),
  };
}

// Consume one cloud action: freemium allowance first, then credits.
// Returns false when the user is exhausted (caller answers with honest UX).
export function consumeCloudAction(userId: number, action = 'chat', now = new Date()): { ok: boolean; source: 'freemium' | 'credit' | 'blocked' } {
  if (freemiumUsedThisMonth(userId, now) < FREEMIUM_MONTHLY) {
    db.prepare('INSERT INTO ai_usage(user_id,period,action) VALUES(?,?,?)').run(userId, currentPeriod(now), action);
    return { ok: true, source: 'freemium' };
  }
  const credit = db.prepare('SELECT id FROM ai_credits WHERE user_id=? ORDER BY id ASC LIMIT 1').get(userId) as { id: number } | undefined;
  if (!credit) return { ok: false, source: 'blocked' };
  db.prepare('INSERT INTO ai_usage(user_id,period,action,credit_id) VALUES(?,?,?,?)').run(userId, currentPeriod(now), action, credit.id);
  return { ok: true, source: 'credit' };
}

export function grantAdCredits(userId: number, amount = AD_CREDIT_GRANT, source = 'rewarded-ad'): number {
  const info = db.prepare('INSERT INTO ai_credits(user_id,granted,mode,source) VALUES(?,?,?,?)').run(userId, amount, 'ad', source.slice(0, 60));
  return Number(info.lastInsertRowid);
}
