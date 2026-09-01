# Einfach Hausen — Canonical Next-Agent Contract

**Updated:** 2026-09-01 (morgen) — **Apps-Qualitätswelle Progress: T-0154 (States) + T-0155 (Offline-Resilienz: SubmitButton-Guard auf Workflow-Forms, KI-Draft persistiert) + T-0152/T-0153 (26 App-Visual-Baselines, stable) + T-0156 (63/63 Responsive-Matrix) + T-0115 (A11y-Apps: 0 blocking, Kontrast-Serie gefixt) DONE — alle deployed (f6afe0d), Gate 11/11. Neue Gates: test:responsive / test:a11y:apps / test:visual:apps (+CI). Verbleibend im Goal: Trust (T-0111/T-0112), Datenschutz-Kette (T-0127/T-0128/T-0143/T-0144/T-0145/T-0146), T-0129 WebKit-Fullflow, T-0117..T-0119 Performance, T-0126/T-0142 Admin-Console.****Brand/Truth-Welle DONE (84d7d54, Gate 11/11, deployed): Parallel-Agent-Gateway-Welle konvergiert — Hub-Typo+LOGO_03-Mark gefixt, Pilot-Versprechen (15% für 1.000 Haushalte) jetzt technisch wahr (pilot_cohort, automatischer Abzug in Membership/Paket-Checkouts, Job-Zahlungen bewusst ausgenommen wegen 0%-Provision), Copy präzisiert. apps-quality goal läuft weiter: T-0156 → T-0115 → Trust-Kette → Datenschutz-Kette → T-0129 WebKit → Performance/Admin-Console.****Apps-Qualitätswelle (Operator-Goal) läuft: Welle 1 DONE — Desktop-Workspace-Layout für /app und /pro (Sidebar expanded, 1120px Content, Desktop-Kartenproportionen, FAB hidden; Mobile 390 bleibt 1:1 Notion; Gate 11/11, deployed f1974bd). Betr-Hinweis: auth.users wurde durch shopsin.delqhi.com (geteilter Gateway, service_role) geleert — Demo-Identities neu gebunden, EXTERNAL-BLOCKERS #7. Nächste Wellen: T-0154 Unified States → T-0152/T-0153 App-Visual-Baselines → T-0155 Offline-Resilienz → T-0156 Responsive-Matrix → T-0115 A11y → Trust/Datenschutz-Kette → T-0129 WebKit-Fullflow → Performance/Admin-Console.** **Acceptance-Welle DONE: T-0157 Release-Gate (10/10, Deploy-Pflicht) + T-0160/T-0161/T-0162 Produkt-Final-Acceptance (Website/Homeowner/Partner) mit Evidenz bestanden. Produktionsfixes dieser Welle: /login-Kontrast (WCAG AA), __Host-Cookie-Secure-Skip, sw.js-Härtung (Firefox/WebKit), E2E-Engine-Toleranz dokumentiert. T-0163 finaler Convergence-Gate DONE. Firefox-App-Fullflow nachgeholt und PASS (15/15, zweifach, auch unter Last) — Browser-Matrix chromium+firefox voll green, WebKit via Website-Matrix 12/12. Danach höchste eligible Tasks = T-0152/T-0153 (Visual Regression App-Tiefen), T-0129 (WebKit-App-Fullflow mit 3 dokumentierten Diagnosen + Cross-Surface-Suite), T-0113 i18n-Kette.**

**Website-Wave DONE: `/` ist wieder die öffentliche Lead-Magnet-Homepage (main=1cedf03, gepusht). Höchster eligible Task bleibt T-0006 (e2e tech-persona seam).**

## 0-b. Website-Wave 2026-08-30 (Commit 1cedf03, Operator-Direktiva)

- Root cause gefixt: `/` zeigte die App-Welcome-Seite und der AuthContext-Guard leitete ALLE Marketing-/Legal-Seiten client-seitig auf `/login` → die öffentliche Website war faktisch tot. Neu: `/` = Lead-Magnet-Homepage (DESIGN.md §5.1), `/welcome` = App-Einstieg (mit Server-Redirect für Sessions), explizite PUBLIC_ROUTES/PUBLIC_PREFIXES in `src/components/AuthContext.tsx`.
- Motion-Layer: `src/components/marketing/motion.tsx` (Reveal/Stagger/ScrollShadow, GSAP + @gsap/react, reduced-motion-safe, no-JS-sichtbar). FAQ/Chips/Hover/Scrolled-Header in marketing.module.css; Produktvorschau auf Mobile wieder aktiviert (`display:none` entfernt).
- Lead-Funnel: Hero-Intake (Chips) → `/register?role=homeowner&request=…` → Register zeigt „Dein Anliegen" (verifiziert).
- Verify-Evidenz: lint 0 errors, build 87/87, sin verify security 0, Route-Smoke 17/17=200, impeccable detect [], A11y-Report (Kontrast/Tab-Order/Skip/Reduced-Motion), Screenshots unter /tmp/eh-after (flüchtig; Neuzeuge via `node scripts/dev-shot.mjs "home=/"` + `SHOT_MOBILE=1`).
- E2E: Step 0 (Website) grün modernisiert; verbleibender Fail `/pro/messages` tech-persona seam failed identisch auf pre-wave HEAD = dokumentierter T-0006-Scope, KEINE Regression.
- Premium-Welle 3 (2026-08-31, deployed 7e4d878): Gateway-Sektion (xKiro-Pattern: Handwerker-Links, einfachhaus-Hub, Eigentümer-Rechts, SVG-Linien), /pilotphase Landing (1.000 Haushalte, 15% Dauer-Vorteil), Hero-Pilot-Banner, T-0157 unified Release-Gate mit GATE_UPDATE_BASELINES=1 (Design-Wellen = absichtliche Änderungen, Baselines aktualisiert).
- OCI-Deploys ERFOLGT (2026-08-30, 9x, älter): `/srv/einfach-hausen` @ **96c9566** (Funnel-Retheme: register/role auf Website-Brand mit echtem Logo-Mark, Teal-Buttons, Focus-Rings — auth regression T-0168 + T-0170 (15/15, OCI) grün; vorher 3d57328 (Rhythm-&-Statement-Welle: automatisierter Master-Design-Audit via scripts/design-audit.mjs — Live-Sweep aller 11 Seiten, Befunde als report.json, exit 1 bei critical; Statement-Sektionen auf allen Seiten, Numbered-Werte auf ueber-uns, FeatureGrid data-count fixt leere Zellen, hilfe FAQ 2-spaltig, preise Hero-Redundanz entfernt; AUDIT 0/0/0 lokal + live; parallel T-0206 App-Topbar-Logo (Fremd-Agent, App-only); davor 6309942 (Designer-Boss-Welle: Subpage-Hero-System mit klickbaren themenspezifischen Mockups → Register-Funnel, Hero-Badge-Reihe, Hausakte-Mini-Card, Scroll-Progress-Bar, CTA-Trust-Fakten, Premium-Login-Split-Layout, 404-Brand-Layout, AuthContext-Guard-Invertierung public-first/private-Denylist — Verhalten per Script getestet: 404 bleibt 404, private Routen bouncen, Auth-Regressionen T-0168 + T-0170 (OCI, 15/15) grün; parallel integriert: T-0200 Supabase-Identity-Chain (Fremd-Agent, kein Frontend-Design-Touch, auditiert); davor f6dac99 (Brand-Wave: LOGO_03 als Header-Lockup/Footer/Favicon-Set, Website-Palette auf Logo-Teal #105258 + Charcoal #1C2129 kalibriert; vorher 841891b Inter-Variable-Identity-Wave; davor 7d81872 Master-Design-Wave (Master-Design-Wave: editorialer Hero mit DrawPath-Underline, Ghost-Composer, Floating-Proof-Cards, Scrub-Line-Prozess/Timeline, Gradient-CTA; Motion-Primitives ScrubLine/Activate/DrawPath) via `deploy/update-on-oci.sh`, Production-Smoke 17/17 PASS @ https://einfachhausen.de, Live-HTML enthält alle Design-Marker. Nächster einzelner Schritt: **T-0006** weiterführen (tech-persona `/pro/messages` seam).

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
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-29T08:50:05+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
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
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0042
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: b0522c720f2d26ef171afa4f8b0bd77eb82cd987694ae7791144c8df2c9124fd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0043
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: 7690208a2287a2d7d24bc2b266c299ac0cdbdaac3e76839323fb142c4ea23138
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0049
updated: 2026-08-31T20:52:49+00:00
actor: local-agent
evidence-sha256: 0d6781d978ed15bc779a17b686785e5efe3810adb2563c2731c51acc8f2f82c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-31T20:52:53+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-31T20:52:54+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-31T20:53:01+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-31T20:53:03+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0157
updated: 2026-08-31T21:16:05+00:00
actor: local-agent
evidence-sha256: 7f99e3ef8bfd11d211e6dbda80fa766914a185971e4f6883515209aba957fb5f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0160
updated: 2026-08-31T22:25:51+00:00
actor: local-agent
evidence-sha256: a0374312071e4a6d50a86e2706a720cb563cff292dd03c20102c6c0ac8b63098
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0161
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: 8347892ea96120456d7b66b9aba1440561a66d689fce427bda41928e3e8003b4
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0162
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: ff5ccd0484ed2266c6ce264e4b9f21b41f1bd97f7e8c73ff4c98e9216edf19cd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0163
updated: 2026-08-31T22:56:47+00:00
actor: local-agent
evidence-sha256: fb1882e2df32385413315728fdb2731a84376c39873250aa2cf0335a2c913c98
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0154
updated: 2026-09-01T00:56:58+00:00
actor: local-agent
evidence-sha256: 83e5ed487aff86dee8b825d9f06d859654d292349ec6538442ac1f725c3dbe1b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0152
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 75fc109f1509113951e589eae987093b5e6ae117d9fd29e758a6c673897685d3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0153
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 08da5c23cd9a4bb84512af6dc432989154d9da35f011f18bf9ef15fb7a650193
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0155
updated: 2026-09-01T01:47:14+00:00
actor: local-agent
evidence-sha256: 02c7cb988ff4f3990fdd17d9a4772d50152245ab2becbbd66f768202ec391bc8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0156
updated: 2026-09-01T03:30:24+00:00
actor: local-agent
evidence-sha256: 994ea2169cfa09d65fa7fa4e2b29c4f8e02de905c613b7d24ebd946ec7c7d4b0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0115
updated: 2026-09-01T03:30:25+00:00
actor: local-agent
evidence-sha256: ef7edcae3cf6bd3ad470c34205fa815916c109e4709b0298ac4f0a4068e48968
-->
