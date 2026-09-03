// T-0122 deterministic regression: taxonomy stability, redaction, correlation ids.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const mod = await (async () => {
  // observability.ts imports './security/redact' extensionless; provide a .ts
  // target for the strip-types runtime the same way as the feature-flags test.
  const redactPath = new URL('../src/lib/security/redact.ts', import.meta.url).pathname;
  const redactText = fs.readFileSync(redactPath, 'utf8');
  fs.writeFileSync(redactPath, redactText.replace(/(from\s*['"])(\.\.?\/[^'"]+)(['"])/g, (_m, a, s, b) => `${a}${s}.ts${b}`));
  const obsPath = new URL('../src/lib/observability.ts', import.meta.url).pathname;
  const obsText = fs.readFileSync(obsPath, 'utf8');
  fs.writeFileSync(obsPath, obsText.replace(/(from\s*['"])(\.\.?\/[^'"]+)(['"])/g, (_m, a, s, b) => `${a}${s}.ts${b}`));
  try { return await import('../src/lib/observability.ts'); }
  finally {
    fs.writeFileSync(obsPath, obsText);
    fs.writeFileSync(redactPath, redactText);
  }
})();
const { structuredLog, newCorrelationId } = mod;

// capture console lines
const captured = [];
const orig = { log: console.log, warn: console.warn, error: console.error };
for (const k of ['log','warn','error']) console[k] = (...args) => captured.push(String(args[0]));

structuredLog.info('validation', 'invalid input test');
structuredLog.warn('rate_limit', 'too many attempts');
structuredLog.error('payment', 'checkout failed with password=abc123 and api_key=xyz');
const cid = newCorrelationId();
structuredLog.info('auth', 'login flow', { correlation_id: cid, user_id: 42 });

console.log = orig.log; console.warn = orig.warn; console.error = orig.error;

const lines = captured.map(l => JSON.parse(l));
// 1) every line is valid JSON with stable keys
for (const l of lines) {
  assert.ok(l.ts && l.level && l.error_class && l.message, 'stable schema');
}
// 2) taxonomy: error_class must be one of the stable classes
const classes = new Set(['auth','validation','authorization','rate_limit','payment','storage','external_service','database','internal']);
for (const l of lines) assert.ok(classes.has(l.error_class), 'taxonomy class');
// 3) redaction: no secret values leak
const paymentLine = lines.find(l => l.error_class === 'payment');
assert.ok(!paymentLine.message.includes('abc123'), 'password redacted');
assert.ok(!paymentLine.message.includes('xyz'), 'api_key redacted');
assert.ok(paymentLine.message.includes('[redacted]'), 'redaction marker present');
// 4) correlation id flows through context
const authLine = lines.find(l => l.error_class === 'auth');
assert.equal(authLine.correlation_id, cid, 'correlation id preserved');
assert.equal(authLine.user_id, 42);
// 5) correlation ids unique
assert.notEqual(newCorrelationId(), newCorrelationId());
console.log(JSON.stringify({ ok: true, checks: 5 }));
