import { createHmac, timingSafeEqual } from 'node:crypto';

// Rewarded-ad receipt verification (EH T-0207 production hardening).
//
// The ad SDK posts a JSON receipt `{ provider, nonce, ts }` plus an
// HMAC-SHA256 signature over the raw receipt string. The secret is
// `AD_RECEIPT_SECRET` (dedicated) with `WEBHOOK_SECRET` as fallback — both
// server-only, never committed. Replay protection happens at the grant site
// via `grantAdCreditsOnce()` (exact source match incl. nonce).
//
// Until a real ad SDK is wired, the settings UI cannot produce a signed
// receipt. Grants without a secret configured are therefore fail-closed in
// production; outside production (or with ALLOW_UNSIGNED_AD_CREDITS=1) they
// are accepted as `unsigned-dev` so local dev/E2E keep working.

export type AdReceiptVerdict =
  | { ok: true; provider: string; nonce: string }
  | { ok: false; reason: string; status: number };

const RECEIPT_SKEW_MS = 10 * 60 * 1000;

export function adReceiptSecret(): string {
  return process.env.AD_RECEIPT_SECRET || process.env.WEBHOOK_SECRET || '';
}

export function verifyAdReceipt(body: unknown): AdReceiptVerdict {
  const secret = adReceiptSecret();
  const payload = (body ?? {}) as { receipt?: unknown; signature?: unknown };
  if (!secret) {
    if (process.env.ALLOW_UNSIGNED_AD_CREDITS === '1' || process.env.NODE_ENV !== 'production') {
      return { ok: true, provider: 'unsigned-dev', nonce: `dev-${Date.now()}` };
    }
    return { ok: false, reason: 'Werbe-Gutschrift ist gerade nicht verfügbar.', status: 503 };
  }
  if (typeof payload.receipt !== 'string' || typeof payload.signature !== 'string' || !payload.receipt || !payload.signature) {
    return { ok: false, reason: 'Werbenachweis fehlt oder ist ungültig.', status: 403 };
  }
  let receipt: { provider?: unknown; nonce?: unknown; ts?: unknown };
  try {
    receipt = JSON.parse(payload.receipt);
  } catch {
    return { ok: false, reason: 'Werbenachweis fehlt oder ist ungültig.', status: 403 };
  }
  if (typeof receipt.provider !== 'string' || !receipt.provider || typeof receipt.nonce !== 'string' || !receipt.nonce || typeof receipt.ts !== 'number') {
    return { ok: false, reason: 'Werbenachweis fehlt oder ist ungültig.', status: 403 };
  }
  if (!Number.isFinite(receipt.ts) || Math.abs(Date.now() - receipt.ts) > RECEIPT_SKEW_MS) {
    return { ok: false, reason: 'Werbenachweis ist abgelaufen.', status: 403 };
  }
  const expected = createHmac('sha256', secret).update(payload.receipt, 'utf8').digest();
  const hex = payload.signature.replace(/^sha256=/i, '');
  if (!/^[a-f0-9]{64}$/i.test(hex)) {
    return { ok: false, reason: 'Werbenachweis fehlt oder ist ungültig.', status: 403 };
  }
  const actual = Buffer.from(hex, 'hex');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return { ok: false, reason: 'Werbenachweis fehlt oder ist ungültig.', status: 403 };
  }
  return { ok: true, provider: receipt.provider.slice(0, 40), nonce: receipt.nonce.slice(0, 80) };
}
