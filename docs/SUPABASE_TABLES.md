# Supabase-Tabellenluecke — Inventar, Proben, Apply-Anleitung (2026-09-03)

Supabase wird **nur fuer Auth (GoTrue)** + direkte Tabellen-Zugriffe via
anon-Browser-Client (`getSupabase()` aus `src/lib/supabase.ts`) genutzt.
Service-Role-Key verlaesst den Server nie (nur `supabaseAdmin()` in
`src/lib/auth.ts`, kein direkter Tabellen-Zugriff damit).

## 1) Vollstaendige Tabelle: Seite x Tabelle x Operation x Key

| Seite / Modul | Tabelle | Operationen | Key |
|---|---|---|---|
| `src/app/anfrage/neu/page.tsx` (submit) | `anfragen` | insert | anon (Browser) |
| `src/app/anfrage/[id]/page.tsx` (load) | `anfragen` | select | anon (Browser) |
| `src/app/anfrage/[id]/page.tsx` (annehmen) | `anfragen` | update | anon (Browser) |
| `src/app/anfrage/[id]/page.tsx` (load/Angebote) | `angebote` | select | anon (Browser) |
| `src/app/anfrage/[id]/page.tsx` (annehmen) | `angebote` | update | anon (Browser) |
| `src/app/anfrage/[id]/page.tsx` (angebotSenden) | `angebote` | insert | anon (Browser) |
| `src/app/chat/[anfrageId]/page.tsx` (load) | `anfragen` | select | anon (Browser) |
| `src/app/chat/[anfrageId]/page.tsx` (load) | `angebote` | select | anon (Browser) |
| `src/app/chat/[anfrageId]/page.tsx` (load/send + Realtime INSERT) | `messages` ⚠️ | select / insert | anon (Browser) |
| `src/app/ansprechpartner/page.tsx` (load/save) | `ansprechpartner` | select / insert | anon (Browser) |
| `src/lib/anfragen.ts` (`getEigeneAnfragen`) | `anfragen` | select | anon (Browser) |
| `src/lib/anfragen.ts` (`getOffeneAnfragenFuerPro`) | `anfragen` | select (`status=offen`, `kategorie IN`, `plz ILIKE`) | anon (Browser) |
| `src/lib/anfragen.ts` (`getMeineAnfragen`) | `anfragen` | select (`user_id=`) | anon (Browser) |
| `src/lib/anfragen.ts` (`getAngeboteFuerAnfrage`) | `angebote` | select | anon (Browser) |
| `src/lib/anfragen.ts` (`getMeineAngebote`, mit Embed `anfragen(titel,plz,ort,status)`) | `angebote` + `anfragen` (FK-Join) | select | anon (Browser) |

Kein `.from()` mit Service-Key im Repo. `src/lib/auth.ts` nutzt Service-Key nur
fuer Identity-Lifecycle (kein Tabellen-DDL/DML).

## 2) API-Proben (2026-09-03, `GET /rest/v1/<tabelle>?select=*&limit=1`, UA Mozilla/5.0)

| Tabelle | anon | service | Deutung |
|---|---|---|---|
| `anfragen` | 404 `PGRST205` (Tabelle nicht im Schema-Cache) | 404 `PGRST205` | **fehlt** (kein RLS-Thema, wirklich absent) |
| `angebote` | 404 `PGRST205` | 404 `PGRST205` | **fehlt** |
| `ansprechpartner` | 404 `PGRST205` | 404 `PGRST205` | **fehlt** |
| `messages` | 200 `[]` | 200 `[]` | **existiert, aber FALSCHE Tabelle**: OpenAPI-Shape ist `id/chat_id/role/content/tool_calls` (Agent-Infra), Code braucht `anfrage_id/sender_id/empfaenger_id/text`. Anon-Insert-Probe: `400 PGRST204` (Spalte `anfrage_id` unbekannt). Achtung: anon-Read auf `messages` ist offen (200) — Agent-Tabelle, App-seitig out of scope, aber als Finding vermerkt. |
| GoTrue | `GET /auth/v1/health` → 200 `GoTrue v2.184.0` | — | Auth gesund |

RLS-Status existierender Tabellen: mangels DB-Direktzugang nicht per
`pg_tables` pruefbar; `messages` antwortet anon lesbar (RLS offen oder aus —
Fremdsystem, nicht angefasst). Alle NEUEN Tabellen in `db/supabase-tables.sql`
bekommen `ENABLE ROW LEVEL SECURITY` + Policies **nur `TO authenticated`**,
Bedingung `auth.uid() = user_id` (bzw. Teilnehmer), **keine anon-Policies,
kein `USING (true)`**.

## 3) Luecke geschlossen per SQL (kein DDL ausgefuehrt)

Datei: **`db/supabase-tables.sql`** (idempotent, Postgres/Supabase-Dialekt —
**nicht** gegen SQLite fahren!). Inhalt: `anfragen`, `angebote` (mit
`anfrage_id → anfragen(id)`-FK fuer den PostgREST-Embed), `ansprechpartner`,
sowie NEU `anfrage_messages` statt `messages` (Namens-Kollision, siehe oben).
Offener Folge-Task (Code, ausserhalb dieses Auftrags, keine Logik geaendert):
`src/app/chat/[anfrageId]/page.tsx` von `.from("messages")` auf
`.from("anfrage_messages")` umpointen.

## 4) Apply-Anleitung fuer OCI (psql in den Postgres-Container)

Voraussetzung: SSH auf OCI-VM, Supabase-Postgres-Container laeuft.

```bash
# 1. SQL-Datei auf die VM bringen (aus Repo-Root, Mac -> OCI via GitHub-Grenze,
#    kein dirty-copy; Datei ist committet/geprueft):
git pull  # Release-SHA pruefen
scp db/supabase-tables.sql <user>@<oci-vm>:/tmp/supabase-tables.sql

# 2. Auf der VM: Container + DB-Zugang finden (Namen ggf. anpassen):
ssh <user>@<oci-vm>
docker ps --format '{{.Names}}' | grep -i -E 'postgres|db|supabase'
# Service-Key/DB-Passwort NUR aus Infisical/Container-Env lesen, nie in Git:
docker exec <postgres-container> env | grep -i -E 'POSTGRES_|SUPABASE_' | cut -d= -f1

# 3. Trockenlauf (Transaktion + ROLLBACK schreibt nichts):
docker cp /tmp/supabase-tables.sql <postgres-container>:/tmp/supabase-tables.sql
docker exec <postgres-container> psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'BEGIN;' -f /tmp/supabase-tables.sql -c 'ROLLBACK;'

# 4. Echt-Apply:
docker exec <postgres-container> psql -U postgres -d postgres -v ON_ERROR_STOP=1 --single-transaction -f /tmp/supabase-tables.sql

# 5. Verifikation (wieder mit Mozilla/5.0-UA, anon + service aus Infisical):
curl -s -A 'Mozilla/5.0' "$SUPABASE_URL/rest/v1/anfragen?select=*&limit=1" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" -w '\n%{http_code}\n'
# Erwartung: 200 (leeres Array bei RLS ohne Login) statt 404 PGRST205.
# Gleiches fuer angebote, ansprechpartner, anfrage_messages.
# PostgREST-Schema-Cache ggf. neu laden: POST /rest/v1/ mit Service-Key
# oder Supabase-Neustart, falls neue Tabellen noch 404 liefern.
```

## 5) Code-Seite

Seiten mit leer-schluckendem `catch` (bleiben still leer) verweisen per Kommentar
auf `db/supabase-tables.sql`; Chat-Page zusaetzlich auf `anfrage_messages` umgepointet (Commit b127984).

## 6) Backup (Stand 2026-09-03, OCI)
- Nightly `pg_dump --data-only` (custom): `/home/ubuntu/backup-sin-supabase.sh`, Cron 03:30, Rotation 7 Tage unter `/home/ubuntu/backups/sin-supabase/`.
- Warum data-only: `pg_dump` mit Schema segfaultet im Container (pg 15.8, rc=139). Schema liegt versioniert vor: `/opt/sin-supabase` Init-Skripte + Repo-`db/supabase-tables.sql`.
- Restore: Schema aufsetzen, dann `pg_restore --disable-triggers` (zirkulaere FKs anderer SIN-DBs im Cluster beachten).
`src/app/chat/[anfrageId]/page.tsx`, `src/app/ansprechpartner/page.tsx`,
`src/app/anfrage/[id]/page.tsx`. `npm run lint` nach den Kommentar-Edits.
