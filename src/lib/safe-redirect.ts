// Open-redirect guard for `?next=` style post-login targets. Only same-origin,
// absolute-path URLs are accepted; protocol-relative (`//evil`), backslash
// tricks, scheme prefixes and control characters fall back to the default.
// Safe to import from both server and client components (no Node APIs).
const DEFAULT_TARGET = '/app';
const MAX_LENGTH = 512;

export function safeNextPath(candidate: string | null | undefined, fallback: string = DEFAULT_TARGET): string {
  if (typeof candidate !== 'string') return fallback;
  const value = candidate.trim();
  if (!value || value.length > MAX_LENGTH) return fallback;
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//') || value.startsWith('/\\')) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;
  // Never bounce back into the auth pages themselves (redirect loops).
  if (/^\/(login|register|register-owner|register-pro|role)(\/|\?|$)/.test(value)) return fallback;
  try {
    const parsed = new URL(value, 'http://localhost');
    if (parsed.origin !== 'http://localhost') return fallback;
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallback;
  }
}
