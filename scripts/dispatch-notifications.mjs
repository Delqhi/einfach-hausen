import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

// Einfach Hausen notification outbox dispatcher (EH T-0201).
// Runs as a systemd oneshot every few minutes: delivers every due pending
// notification through its channel adapter (in_app receipt, SMTP email) with
// retry/backoff and dead-lettering handled by the outbox itself.
// Emits one JSON line: {"sent":N,"retried":N,"dead":N}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-dispatch-src-'));
fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
for (const rel of ['src/lib/db.ts', 'src/lib/mailer.ts', 'src/lib/notifications.ts']) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8');
  const stripped = stripTypeScriptTypes(src).replace(/(from\s*['"])(\.\.?\/[^'"]+)(['"])/g, (_m, a, s, b) => `${a}${s}.mjs${b}`);
  const dest = path.join(scratch, rel.replace(/\.ts$/, '.mjs'));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, stripped);
}

try {
  const n = await import(pathToFileURL(path.join(scratch, 'src/lib/notifications.mjs')).href);
  const result = await n.dispatchDueNotifications();
  console.log(JSON.stringify(result));
} finally {
  try { fs.rmSync(scratch, { recursive: true, force: true }); } catch {}
}
