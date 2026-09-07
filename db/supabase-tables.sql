-- Einfach Hausen — Supabase-Tabellenluecke (App-Daten in Postgres).
-- Stand: 2026-09-03. NUR Supabase/Postgres auf OCI. NICHT gegen SQLite fahren.
-- SQLite bleibt App-Datenbank laut docs/DB_MIGRATIONS.md; diese Datei schliesst
-- ausschliesslich die Luecke zwischen App-Code (.from("...")) und Supabase.
--
-- Befund: GoTrue gesund. Von 4 referenzierten Tabellen existiert nur
-- public.messages — und das ist die Agent-Chat-Tabelle (chat_id/role/content),
-- NICHT der App-Chat (anfrage_id/sender_id/empfaenger_id/text). De facto fehlen
-- alle 4 App-Tabellen. Details + Apply-Anleitung: docs/SUPABASE_TABLES.md.
--
-- KEIN DDL wurde von hier ausgefuehrt (kein DB-Zugang). Apply per psql im
-- Postgres-Container auf OCI (siehe docs/SUPABASE_TABLES.md).
-- Idempotent: CREATE TABLE IF NOT EXISTS + DROP POLICY IF EXISTS.
-- Keine offenen Policies: kein Zugriff fuer anon, nur eigene Zeilen via auth.uid().

-- ============================================================
-- 1) anfragen (src/app/anfrage/neu, src/app/anfrage/[id],
--    src/app/chat/[anfrageId], src/lib/anfragen.ts)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.anfragen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kategorie text NOT NULL DEFAULT '',
  unterkategorie text NOT NULL DEFAULT '',
  titel text NOT NULL DEFAULT '',
  beschreibung text NOT NULL DEFAULT '',
  fotos jsonb NOT NULL DEFAULT '[]'::jsonb,
  plz text NOT NULL DEFAULT '',
  ort text NOT NULL DEFAULT '',
  wunschtermin text,
  budget text,
  dringend boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'offen',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS anfragen_user_id_idx ON public.anfragen (user_id);
CREATE INDEX IF NOT EXISTS anfragen_status_idx ON public.anfragen (status);

ALTER TABLE public.anfragen ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anfragen_select ON public.anfragen;
CREATE POLICY anfragen_select ON public.anfragen FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR status = 'offen');
DROP POLICY IF EXISTS anfragen_insert ON public.anfragen;
CREATE POLICY anfragen_insert ON public.anfragen FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS anfragen_update ON public.anfragen;
CREATE POLICY anfragen_update ON public.anfragen FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 2) angebote (src/app/anfrage/[id], src/app/chat/[anfrageId],
--    src/lib/anfragen.ts) — inkl. FK fuer PostgREST-Embed
--    angebote + anfragen(titel,plz,ort,status)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.angebote (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL REFERENCES public.anfragen (id) ON DELETE CASCADE,
  pro_id uuid NOT NULL,
  firma text NOT NULL DEFAULT '',
  text text NOT NULL DEFAULT '',
  preis numeric NOT NULL DEFAULT 0,
  bewertung numeric NOT NULL DEFAULT 0,
  entfernung numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'offen',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS angebote_anfrage_id_idx ON public.angebote (anfrage_id);
CREATE INDEX IF NOT EXISTS angebote_pro_id_idx ON public.angebote (pro_id);

ALTER TABLE public.angebote ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS angebote_select ON public.angebote;
CREATE POLICY angebote_select ON public.angebote FOR SELECT TO authenticated
  USING (
    auth.uid() = pro_id
    OR EXISTS (SELECT 1 FROM public.anfragen a WHERE a.id = angebote.anfrage_id AND a.user_id = auth.uid())
  );
DROP POLICY IF EXISTS angebote_insert ON public.angebote;
CREATE POLICY angebote_insert ON public.angebote FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = pro_id);
DROP POLICY IF EXISTS angebote_update ON public.angebote;
CREATE POLICY angebote_update ON public.angebote FOR UPDATE TO authenticated
  USING (
    auth.uid() = pro_id
    OR EXISTS (SELECT 1 FROM public.anfragen a WHERE a.id = angebote.anfrage_id AND a.user_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = pro_id
    OR EXISTS (SELECT 1 FROM public.anfragen a WHERE a.id = angebote.anfrage_id AND a.user_id = auth.uid())
  );

-- ============================================================
-- 3) ansprechpartner (src/app/ansprechpartner/page.tsx)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ansprechpartner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT '',
  rolle text NOT NULL DEFAULT '',
  telefon text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  notiz text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ansprechpartner_user_id_idx ON public.ansprechpartner (user_id);

ALTER TABLE public.ansprechpartner ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ansprechpartner_select ON public.ansprechpartner;
CREATE POLICY ansprechpartner_select ON public.ansprechpartner FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
DROP POLICY IF EXISTS ansprechpartner_insert ON public.ansprechpartner;
CREATE POLICY ansprechpartner_insert ON public.ansprechpartner FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS ansprechpartner_update ON public.ansprechpartner;
CREATE POLICY ansprechpartner_update ON public.ansprechpartner FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS ansprechpartner_delete ON public.ansprechpartner;
CREATE POLICY ansprechpartner_delete ON public.ansprechpartner FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- 4) App-Chat: NEUE Tabelle public.anfrage_messages (NICHT public.messages!).
-- Begruendung: public.messages existiert bereits als Agent-Infra-Tabelle
-- (Spalten chat_id/role/content/tool_calls) und ist inkompatibel zum App-Chat
-- (anfrage_id/sender_id/empfaenger_id/text). Wiederverwendung wuerde beide
-- Systeme korrumpieren. Der Code (src/app/chat/[anfrageId]/page.tsx) liest
-- aktuell .from("messages") — das zeigt auf die falsche Tabelle und braucht
-- einen separaten Code-Task (Umpointen auf anfrage_messages). Bis dahin bleibt
-- der Chat leer, fail-soft via catch (siehe Kommentar in der Page).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.anfrage_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anfrage_id uuid NOT NULL REFERENCES public.anfragen (id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  empfaenger_id uuid NOT NULL,
  text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS anfrage_messages_anfrage_id_idx ON public.anfrage_messages (anfrage_id);

ALTER TABLE public.anfrage_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anfrage_messages_select ON public.anfrage_messages;
CREATE POLICY anfrage_messages_select ON public.anfrage_messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = empfaenger_id);
DROP POLICY IF EXISTS anfrage_messages_insert ON public.anfrage_messages;
CREATE POLICY anfrage_messages_insert ON public.anfrage_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Realtime fuer den Chat (postgres_changes auf INSERT): Tabelle in die
-- supabase_realtime-Publikation aufnehmen. Fehler "already member" ignorieren.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.anfrage_messages;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- ============================================================
-- NICHT EMPFOHLENE Alternative (nur Doku, NICHT ausfuehren):
-- Spalten an public.messages anzuflicken wuerde die Agent-Tabelle
-- verschmutzen. Falls Operator trotzdem einen Single-Table-Weg will,
-- separaten Entscheid + Backup nachweisen, dann:
--   ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS anfrage_id uuid;
--   ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS sender_id uuid;
--   ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS empfaenger_id uuid;
--   ALTER TABLE public.messages ADD COLUMN IF EXISTS content ... -- KONFLIKT mit text
-- (Deshalb: anfrage_messages verwenden.)
-- ============================================================
