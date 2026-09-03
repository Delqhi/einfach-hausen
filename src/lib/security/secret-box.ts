import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

// EH T-0207: at-rest encryption for user-provided API keys (BYOK).
// Key derivation: scrypt over an installation key (EH_DATA_KEY if set,
// otherwise derived from the database path). Fail-closed: without a
// derivable key, BYOK stays disabled.
function dataKey(): Buffer | null {
  const material = process.env.EH_DATA_KEY || process.env.DATABASE_PATH;
  if (!material) return null;
  return scryptSync(material, 'eh-byok-v1', 32);
}

export function encryptSecret(plain: string): string | null {
  const key = dataKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString('base64url')}.${tag.toString('base64url')}.${enc.toString('base64url')}`;
}

export function decryptSecret(payload: string | null | undefined): string | null {
  const key = dataKey();
  if (!key || !payload?.startsWith('v1.')) return null;
  try {
    const [, ivB64, tagB64, encB64] = payload.split('.');
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(encB64, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

export function maskKey(plain: string): string {
  if (plain.length <= 8) return '****';
  return `${plain.slice(0, 4)}…${plain.slice(-4)}`;
}
