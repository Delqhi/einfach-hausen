// Dump der deklarativen SQLite-Schemaquelle (src/lib/db.ts) als
// versionierte Baseline unter db/migrations/. Kein Rewrite: db.ts bleibt die
// einzige Schema-Autorität (CREATE TABLE IF NOT EXISTS + addColumnIfMissing);
// diese Datei friert den Stand für Review/Diff ein.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'src/lib/db.ts'), 'utf8');

const tables = [];
for (const m of src.matchAll(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+(\w[\w]*)\s*\(([\s\S]*?)\);/g)) {
  tables.push({ name: m[1], body: m[2].trim() });
}
const indexes = [];
for (const m of src.matchAll(/CREATE\s+(UNIQUE\s+)?INDEX\s+IF\s+NOT\s+EXISTS\s+(\w+)\s+ON\s+([^;]+);/g)) {
  indexes.push(`CREATE ${m[1] ?? ''}INDEX IF NOT EXISTS ${m[2]} ON ${m[3].trim()};`);
}
const addedCols = [];
for (const m of src.matchAll(/addColumnIfMissing\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'/g)) {
  addedCols.push(`-- ${m[1]}.${m[2]}: ${m[3]}`);
}

const out = [
  `-- Einfach Hausen SQLite-Baseline (generiert aus src/lib/db.ts, ${new Date().toISOString().slice(0, 10)}).`,
  `-- Quelle bleibt src/lib/db.ts; diese Datei ist Review-/Diff-Material (siehe docs/DB_MIGRATIONS.md).`,
  `-- Tabellen: ${tables.length}, Indizes: ${indexes.length}, addColumnIfMissing: ${addedCols.length}`,
  '',
  ...tables.flatMap((t) => [`CREATE TABLE IF NOT EXISTS ${t.name} (${t.body});`, '']),
  ...indexes.flatMap((s) => [s, '']),
  '-- Später per addColumnIfMissing ergänzte Spalten:',
  ...addedCols,
  '',
].join('\n');

const dir = path.join(root, 'db/migrations');
fs.mkdirSync(dir, { recursive: true });
const files = fs.readdirSync(dir).filter((f) => /^\d{4}-.*\.sql$/.test(f)).sort();
const next = files.length ? String(Number(files[files.length - 1].slice(0, 4)) + 1).padStart(4, '0') : '0001';
const file = path.join(dir, `${next}-baseline.sql`);
fs.writeFileSync(file, out);
console.log(`wrote ${path.relative(root, file)} (${tables.length} tables, ${indexes.length} indexes)`);
