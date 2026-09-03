# SQLite-Schema / Migrationen (2026-09-03)

Kein `supabase/`-, `migrations/`-, Prisma- oder Drizzle-Setup im Repo — begründet:

- **Schemaquelle ist `src/lib/db.ts`** (deklarativ): ~68 Tabellen via
  `CREATE TABLE IF NOT EXISTS` beim Boot, spätere Spalten nur via
  `addColumnIfMissing()` (idempotent, kein Datenverlust). SQLite ist
  explizit App-Datenbank (Produktion) + Local-Dev-Fallback für Auth.
- **Baseline:** `db/migrations/0001-baseline.sql` — eingefrorener Stand,
  generiert mit `node scripts/dump-sqlite-schema.mjs` (läuft nur gegen den
  Quelltext, fasst keine DB an). Nach jeder Schemaänderung in `db.ts` das
  Script erneut fahren und die neue Baseline (`0002-…`, fortlaufend)
  committen, damit Reviews einen Diff haben.
- **Änderungsprozess:** (1) `CREATE TABLE IF NOT EXISTS` für neue Tabellen,
  (2) `addColumnIfMissing()` für neue Spalten — niemals destruktive
  `ALTER`/`DROP` ohne Backup-Nachweis, (3) Baseline regenerieren,
  (4) `npm run test:fixtures` fahren. Rollback = vorheriges Release +
  SQLite-Backup aus `/var/backups/einfach-hausen` (siehe `docs/OPERATIONS.md`).
- **Kein Rewrite:** `db.ts` bleibt die einzige Autorität; die `.sql`-Dateien
  werden nie direkt gegen eine DB appliziert.
