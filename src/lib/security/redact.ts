// T-0132: shared PII scrubbing for error events - same secret patterns as the
// structured logger, exported for the errors sink and deterministic tests.

const REDACTED = '[redacted]';
const SECRET_PATTERNS: Array<[RegExp, string]> = [
  [/password[^\s,&]*/gi, `password=${REDACTED}`],
  [/token[^\s,&]*/gi, `token=${REDACTED}`],
  [/api[_-]?key[^\s,&]*/gi, `api_key=${REDACTED}`],
  [/secret[^\s,&]*/gi, `secret=${REDACTED}`],
  [/authorization:[^\s,]*/gi, 'authorization=[redacted]'],
  [/bearer\s+[^\s,]+/gi, 'bearer=[redacted]'],
  [/sk_(live|test)_[0-9a-zA-Z]+/gi, 'sk_[redacted]'],
  [/whsec_[0-9a-zA-Z]+/gi, 'whsec_[redacted]'],
  [/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, 'jwt=[redacted]'],
];

export function redactDetail(detail: string): string {
  let out = detail;
  for (const [pattern, replacement] of SECRET_PATTERNS) out = out.replace(pattern, replacement);
  return out;
}
