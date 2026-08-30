# Einfach Hausen — Canonical Next-Agent Contract

**Updated:** 2026-08-30 — **Website-Wave DONE: `/` ist wieder die öffentliche Lead-Magnet-Homepage (main=1cedf03, gepusht). Höchster eligible Task bleibt T-0006 (e2e tech-persona seam).**

## 0-b. Website-Wave 2026-08-30 (Commit 1cedf03, Operator-Direktiva)

- Root cause gefixt: `/` zeigte die App-Welcome-Seite und der AuthContext-Guard leitete ALLE Marketing-/Legal-Seiten client-seitig auf `/login` → die öffentliche Website war faktisch tot. Neu: `/` = Lead-Magnet-Homepage (DESIGN.md §5.1), `/welcome` = App-Einstieg (mit Server-Redirect für Sessions), explizite PUBLIC_ROUTES/PUBLIC_PREFIXES in `src/components/AuthContext.tsx`.
- Motion-Layer: `src/components/marketing/motion.tsx` (Reveal/Stagger/ScrollShadow, GSAP + @gsap/react, reduced-motion-safe, no-JS-sichtbar). FAQ/Chips/Hover/Scrolled-Header in marketing.module.css; Produktvorschau auf Mobile wieder aktiviert (`display:none` entfernt).
- Lead-Funnel: Hero-Intake (Chips) → `/register?role=homeowner&request=…` → Register zeigt „Dein Anliegen" (verifiziert).
- Verify-Evidenz: lint 0 errors, build 87/87, sin verify security 0, Route-Smoke 17/17=200, impeccable detect [], A11y-Report (Kontrast/Tab-Order/Skip/Reduced-Motion), Screenshots unter /tmp/eh-after (flüchtig; Neuzeuge via `node scripts/dev-shot.mjs "home=/"` + `SHOT_MOBILE=1`).
- E2E: Step 0 (Website) grün modernisiert; verbleibender Fail `/pro/messages` tech-persona seam failed identisch auf pre-wave HEAD = dokumentierter T-0006-Scope, KEINE Regression.
- OCI-Deploys ERFOLGT (2026-08-30, 6x, latest): `/srv/einfach-hausen` @ **6309942** (Designer-Boss-Welle: Subpage-Hero-System mit klickbaren themenspezifischen Mockups → Register-Funnel, Hero-Badge-Reihe, Hausakte-Mini-Card, Scroll-Progress-Bar, CTA-Trust-Fakten, Premium-Login-Split-Layout, 404-Brand-Layout, AuthContext-Guard-Invertierung public-first/private-Denylist — Verhalten per Script getestet: 404 bleibt 404, private Routen bouncen, Auth-Regressionen T-0168 + T-0170 (OCI, 15/15) grün; parallel integriert: T-0200 Supabase-Identity-Chain (Fremd-Agent, kein Frontend-Design-Touch, auditiert); davor f6dac99 (Brand-Wave: LOGO_03 als Header-Lockup/Footer/Favicon-Set, Website-Palette auf Logo-Teal #105258 + Charcoal #1C2129 kalibriert; vorher 841891b Inter-Variable-Identity-Wave; davor 7d81872 Master-Design-Wave (Master-Design-Wave: editorialer Hero mit DrawPath-Underline, Ghost-Composer, Floating-Proof-Cards, Scrub-Line-Prozess/Timeline, Gradient-CTA; Motion-Primitives ScrubLine/Activate/DrawPath) via `deploy/update-on-oci.sh`, Production-Smoke 17/17 PASS @ https://einfachhausen.de, Live-HTML enthält alle Design-Marker. Nächster einzelner Schritt: **T-0006** weiterführen (tech-persona `/pro/messages` seam).

## 0-c. Backend-Hardening-Welle 2026-08-30 (T-0200..T-0205, alle DONE, main=1ac7e90 deployed)

- T-0200 Auth-Kette produktiv: Deploy sourced `/etc/einfach-hausen-build.env` (NEXT_PUBLIC_*) vor dem Build; Runtime-Env um AUTH_MODE/SUPABASE_URL/ANON/SERVICE_ROLE erweitert; registerAction erzeugt die Supabase-Identity zuerst (fail-closed) und bindet users.auth_subject + serverseitige SSR-Session; CSP connect-src enthaelt die Gateway-Origin (live). Beweis: scripts/t0200-register-e2e.mjs 9/9 (Register->Bind->Login->Legacy-Email-Match-Bind), t0170 15/15.
- T-0201 E-Mail + Dispatcher: SMTP via Resend (verify + Send-Proof live), MAIL_FROM, E-Mail-Channel-Adapter im Outbox, systemd-Timer einfach-hausen-dispatch (5 min), GoTrue-SMTP konfiguriert, Fake-Domain entfernt. t0104 24/24.
- T-0202 KI-Chat: /api/ki authentifiziert (401 unauth), ki_chat Rate-Limit (30/15min), OmniRoute mit stream:false (repariert auch den Silent-Fallback in request-ai). t0202 3/3 mit echter Gateway-Antwort.
- T-0203 GDPR: /api/konto-loeschen ersetzt den 410-Legacy-Endpunkt (Session-Identity autorisiert; Anonymisierung, Retention fuer Rechnungen/Zahlungen, File-Unlink, Supabase-Identity-Delete), /api/account/export + UI unter /app/settings. t0203 14/14.
- T-0204 Ops: /api/health gated auth_authority/smtp/storage (keine Pfade/Secrets); Restore-Drill dry-run+staged bewiesen (docs/evidence/T-0204-restore-drill-20260830.md); toter Cron entfernt; Offsite-Ziel als externer Blocker.
- T-0205 Hygiene: 10 verwaiste Client-only-Routen entfernt (dashboard, dashboard-pro, profil, historie, auftraege, notfall, chat, meine-angebote, einstellungen, benachrichtigungen + SideMenu/ActionSheet); Redirects auf /pro, /app, /app/jobs umgebogen; E2E-DB-Isolation bleibt offen fuer T-0006.
- Bekannte Restpunkte: Production-DB enthaelt 6 historische E2E-Test-User (Aug 21-26), bewusst nicht mutiert. E-Mail-Empfangs-Nachweis in einem echten Postfach + Offsite-Backup-Ziel stehen in docs/EXTERNAL-BLOCKERS.md.

## 0. Read this first

- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3` in the **canonical OCI worktree**
  `/home/ubuntu/einfach-hausen-oci-handoff` (branch `oci/t0169` at the time of writing).
  Verify with `sin-gpt-web-state --repo . validate && sin-gpt-web-state --repo . summary`.
  The rendered view is `.sin-gpt-web/TASKPLAN.md`. Historical roadmap prose (T-0100..T-0167)
  in older documents is history, not the current plan — the DB taskplan wins.
- Production Supabase gateway (self-hosted OCI OSS): `https://supabase.delqhi.com`.
  Supabase Cloud is NOT the target architecture.
- Production Node on OCI: use `/home/ubuntu/.local/bin` +
  `/home/ubuntu/.local/opt/node-v22.22.1-linux-arm64/bin` (never system node v20).

### T-0165 presentation continuation

The visual presentation chain is **Notion App Design → `DESIGN.md` → `docs/PRESENTATION_BRAND.md` → `presentation/premium/brand.config.json` → `presentation/premium/deck.html`**. Notion is visual evidence, not an automatic product specification. Any future app-design change must be checked against the presentation brand contract and deck before export.

## 1. Verified architecture facts (2026-08-29, T-0169/T-0004)

- Auth: `AUTH_MODE=supabase` (production) / `local` (dev only; production local auth fails closed).
  Server-side Supabase identity is authoritative (`auth_subject`); `user_metadata.role` never authorizes.
- Login path is CLIENT-side Supabase (`src/app/login/page.tsx` + `@supabase/ssr` browser client).
  **next.config.ts CSP `connect-src` therefore includes the Supabase gateway origin**
  (fix T-0004: previously `connect-src 'self'` broke the real login form in every
  strict-CSP browser — evidence `.sin-gpt-web/evidence/T-0169/oci/csp-defect.txt`).
- App data layer: `src/lib/db.ts` is **better-sqlite3 / `DATABASE_PATH`** (no Postgres
  adapter in the runtime code). Any document claiming "Supabase Postgres primary" for the
  app runtime was aspirational until proven otherwise — T-0171 must reconcile docs↔code.
- `src/lib/storage.ts` does not exist in this tree; docs referencing a Supabase Storage
  adapter are ahead of the implementation (T-0171 audit item).

## 2. Notion visual reference truth (T-0169)

- Authoritative references: `public/notion/notion-originals/` — the 12 ORIGINAL embedded
  images of the owner Notion page "App Design" (recovered 2026-08-29 via authenticated
  session; provenance + SHA256 in that directory).
- Verified absence: NO dedicated full-screen "Haus-Historie" mockup exists on the page;
  Historie is accepted on shared-design-system parity only (docs/T0168_DEEP_RESEARCH.md §7).
- The 12 placeholder files under `public/notion/*.png` are TEXT placeholders — never use
  them as references. `public/notion/recovered-browser-captures/` are historical page-top
  captures (all six pixel-identical) kept for provenance only.
- Fresh 390x844 reference/actual/overlay/diff evidence: `.sin-gpt-web/evidence/T-0169/oci/`
  (`reference-map.json`, `visual-metrics.json`, `overlay-verdict.txt`, `round3/`).
- Harness: `node scripts/t0169-visual-acceptance.mjs` (real Supabase login, throwaway DB,
  ephemeral identity) + `python3 scripts/t0169-visual-diff.py`.

## 3. Taskplan state (2026-08-29, T-0171 DONE & deployed; open: T-0006/T-0007)

- DONE: T-0170 (Supabase auth 15/15), T-0004 (CSP login fix), T-0169 (visual evidence,
  12 original Notion references recovered), T-0005 (Owner screens converged 1:1 to the
  Notion originals: dashboard, drawer, welcome, role, register chrome; no logic changes).
- DONE & DEPLOYED: T-0171 abgeschlossen; main=bdebe9f (GitHub-SHA-Gleichheit bewiesen); Production
  /srv/einfach-hausen @ bdebe9f, Service aktiv, /api/health ready, Smoke 17/17 PASS, Pre-Deploy-Backup erstellt.
- OPEN: **T-0006 e2e modernization** — full-flow e2e auf die konvergierte UI weiterführen
  (Tech-Persona-Login-Seam dokumentiert; alle übrigen Sektionen grün repariert); danach
  **T-0007 Repository hygiene** (Legacy-Worktree/Branch-Inventar klassifizieren + bereinigen).
- Workflow-Kontrakt für Übernahme/Abschluss: Skill **sin-handback** (~/.prime/agent/skills/sin-handback/SKILL.md,
  global registriert in wow-my-zsh registry/skills.yaml) — Teil A Intake (SHAs/Taskplan/Transfer-Grenze
  verifizieren, Safety-Push), Teil B Handback (Gates frisch, Docs↔Code, Handback-Dokument committen+pushen
  BEVOR er als existierend gilt, Taskplan-Sync inkl. Handover-Marker, Main-ff-only + SHA-Beweis, Deploy/Smoke).
  Verkettet mit sin-gpt-web-state (complete/render/validate), sin-never-end (False-Success-Schutz) und
  sin-after-work (Caretaker-Verifikation).
- Verified docs truth (2026-08-29): App DB = SQLite (`DATABASE_PATH`, better-sqlite3);
  `/api/health` checks SQLite; Supabase OSS = Auth authority only; no Storage adapter;
  HA/PITR/Capacitor (T-0166/T-0167) were planning-only and never executed.

## 4. Known pre-existing debt (documented, not introduced by T-0169)

- `npm run lint`: legacy errors were fixed in T-0171 (src pages + stale presentation
  deck-builder scripts removed via documented scope extension). Lint is green again.
- Unrelated OCI worktrees (`/home/ubuntu/dev/einfach-hausen*`, `t0165-premium*`, `t0167`)
  are recovery/history — do not develop or clean them.

## 5. Hard rules (unchanged)

No `git reset --hard`/`clean`/force-push; no direct Mac→OCI file copies for source
(GitHub is the transfer boundary); no production DB/user mutations for tests; never print
`/etc/einfach-hausen.env`, service keys or user secrets; no invented 1:1 visual claims;
no DONE without fresh evidence.

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-29T06:11:34+00:00
actor: local-agent
evidence-sha256: 8a26c7d17a8ec5b52526fb9c2fb1f91e86ba8f1503952d8365e2d2aafe1a1f42
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-29T08:50:05+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-29T18:59:08+00:00
actor: local-agent
evidence-sha256: 626ff1acac221e886d6236648f566609e088d55979546ae44d5287052077e675
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-28T18:44:41+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-29T05:56:51+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0200
updated: 2026-08-30T04:10:43+00:00
actor: local-agent
evidence-sha256: 425e861d61478080b23cc52ad6b64973eb901e909bbe35dd7fb24a555e299358
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0201
updated: 2026-08-30T04:29:48+00:00
actor: local-agent
evidence-sha256: c5758386de9a32943594941ee15b2faf7dd48bcd822565e0419448383e33c180
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0202
updated: 2026-08-30T04:39:54+00:00
actor: local-agent
evidence-sha256: 0bc75649da580b92e8c385c0ce01f150f9b48f18b1ac0d2c9ee40525373e504f
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0203
updated: 2026-08-30T04:59:52+00:00
actor: local-agent
evidence-sha256: b734c3298856af57db7cbd01c11010da44ffcc25472c8142ae1011378a1a4699
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0204
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: 26d2c37b44b0e2ecdd412fa38e9987742b09de7fdb3d65324b840eee1997f5d8
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0205
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: f1288185ef3bec19c87d3ccaf8e935f8a33480e8db7f734bae58d6874f3a4d43
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-26T15:44:24+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->
