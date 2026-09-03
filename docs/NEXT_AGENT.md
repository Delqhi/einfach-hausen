# NEXT AGENT — Start here

**Status 2026-09-03 ~12:53 UTC · Produktion = main = 3fbe3c9 (Gate 11/11, Smoke 17/17, a11y:matrix PASS gegen Produktion) · T-0210/T-0211/T-0120..T-0131 abgeschlossen und DEPLOYED**

## Wichtigste Betriebsänderungen dieser Welle (2026-09-03)
- **Neues Repo-Layout:** GitHub `Delqhi/einfach-hausen` main zeigt jetzt auf die Website-Codebasis (`/Users/jeremyschulze/dev/einfachhausen-landing-page`). Der bisherige App-Stand lebt als Branch `website-old` (6d2f97c) weiter. Der Ordner `einfach-hausen/` im Repo-Root ist das alte App-Repo mit eigener Git-Historie und ist via `.gitignore` + eslint-Ignore ausgeschlossen.
- **Build-Env-Vertrag (wichtig!):** `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` müssen zur Build-Zeit gesetzt sein, sonst ist der Client-Bundle-Login tot ( Schweigen, kein Crash — E2E-Login schlägt dann mit leerem Alert fehl). Lokal: Keys aus dem SIN Supabase (Kong-Container `supabase-kong`, env `SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_KEY`) holen und `source .e2e-keys.env` vor Build/E2E (`.e2e-keys.env` ist gitignored). Auf OCI macht das `/etc/einfach-hausen-build.env`.
- **Lokale zsh-Falle:** `~/.zshenv` setzt PATH hart; npm script-shell (zsh) findet deshalb `next`/`tsc`/`eslint` nicht. Gelöst durch PATH-Append-Block in `~/.zshenv` (nur wenn repo `node_modules/.bin` existiert). Auf OCI nicht relevant.
- **A11y-Kontrast-Fixes (51667f0):** Legacy `h1/h2/p`-Reset auf `.page`/`.center-page` gescoped; `.site a:not(.btn)` statt `.site a`; `--mkt-ink-mute`/app-frames-Mute auf `#5f6e75`/`#566369`; `.tlWhen` nutzt `--mkt-terra-deep`; Chip-`role="listitem"` entfernt. axe-Layer jetzt PASS.
- **T-0130 Visual Canonicals aktiv:** `scripts/lib/visual-canonicals.mjs` ist die gemeinsame Matrix für `test:visual` und Release-Gate Layer 3. Baselines (57 shots, 3 Viewports) liegen unter `tests/visual-baselines/` und sind committet. Nach Design-Änderungen: `node scripts/visual-regression.mjs --update-baselines`, sichten, committen.


## GENAU EINE nächste Aktion

**T-0131 final convergence v2 starten** (kanonischer Taskplan, OCI `/home/ubuntu/dev/einfach-hausen`): `sin-gpt-web-state claim T-0131 --owner local-agent`, dann die untenstehenden offenen Punkte klassifizieren und die Gate-Suite (lint → build → test:visual → test:e2e → release-gate) als Konvergenz-Nachweis fahren. T-0129/T-0130 sind done; T-0131 ist damit entblockt.

### Offene Punkte für T-0131 (in dieser Welle geprüft)
1. `npm run test:e2e` vollablauf mit Supabase-Build-Env: öffentliche Routen + 404 + Register/Owner-Flows PASS; nur der Tech-Persona-Client-Login (`/login` → `/pro`) bricht noch, wenn `NEXT_PUBLIC_SUPABASE_ANON_KEY` beim Build fehlte — mit korrektem Build-Umgebungsupersatz verifizieren (lokal mit `source .e2e-keys.env` reproduzierbar).
2. Smoke gegen Produktion: `npm run test:smoke` mit `BASE_URL=https://einfachhausen.de` (SLO-Probes 5/5 war der letzte Stand; nach dem Deploy erneut fahren).
3. CI auf GitHub ist rot wegen **Billing-Sperre des Accounts** ("account is locked due to a billing issue") — nicht code-seitig lösbar; Operator muss das Billing in den GitHub-Settings klären, danach läuft `.github/workflows/quality.yml` auf push.

### Verifikation, die diese Welle bereits erbracht hat
- Release-Gate lokal **11/11** (lint, tsc, security, fixtures, build, axe, visual canonicals 20 shots, CLS, transfer, load, failed-requests) — Commit `51667f0`.
- OCI-Deploy über `deploy/update-on-oci.sh` mit Release-Gate **11/11** auf dem Host; Service healthy; `https://einfachhausen.de` liefert den neuen Build (CSS `0iazobe9yk98-.css` enthält die A11y-Fixes), `/api/health` green.
- T-0129/T-0130 im kanonischen Taskplan mit Evidence auf done gesetzt (`sin-gpt-web-state`, DB `/home/ubuntu/dev/einfach-hausen/.sin-gpt-web/taskplan.sqlite3`).

### Was in dieser Welle geändert wurde (T-0129/T-0130)

- **Neu** `scripts/lib/visual-canonicals.mjs`: einzige Quelle für Route×Viewport-Matrix (16 Public-Routes, `/app`/`/pro`, 404-State; 390/834/1320), Determinismus-Vertrag (reduced-motion + eingefrorene Animationen, DPR 1, de-DE, Europe/Berlin, `fonts.ready`, `data-visual-volatile`-Opt-out), Vergleich mit Diff-PNG-Ausgabe. Legacy-Mobile-Namen (`home.png` …) bleiben gültig; andere Viewports bekommen `@tablet`/`@desktop`.
- **Umgestellt** `scripts/visual-regression.mjs` (volle Matrix, `--viewports=mobile,…`, Evidence-JSON unter `.sin-gpt-web/evidence/T-0130/`) und `scripts/release-gate.mjs` Layer 3 (Gate-Routen × mobile+desktop über das Modul; keine Kopie der Diff-Logik mehr).
- **Erweitert** `scripts/e2e.mjs` Schritt 0 (importiert `PUBLIC_ROUTES` aus dem Modul, Plattform-Cues + 404-State).
- **DESIGN.md finalisiert:** §2 dokumentierte Ausnahme dunkler Footer/CTA-Band; §3 Typografie-Duplikat aufgelöst; §4.1 implementierte Komponentenfamilie mit Code-Referenzen; §10 Website-States (loading/error/404) inkl. ehrlicher Nachweis-Lücke für loading/error; §14.1 Nachweis-Kommandos und Baseline-Regeln.
- **Nicht getan:** kein Build, kein Testlauf, keine Baselines erzeugt, kein Taskplan-Update (DB liegt nur auf OCI). `loading.tsx`/`error.tsx` haben weiterhin keinen automatischen Browser-Nachweis (bewusst: Test-Trigger-Route wäre Produktcode).

## Vorherige Welle (Referenz)

1. Abgeschlossen: T-0210 (Premium-Redesign) + T-0211 (App-Promo) — Merge 9356305, Gate-Fixes (intakeGhost-Kontrast, un-layered a{color}-Regeln → @layer base, Commits 893fb3f/363068e/bda08b4), Release-Gate 11/11, Deploy, Smoke 17/17, Preview abgeschaltet (einfach-hausen-preview + cloudflared-eh-preview sind disabled; Tunnel-Domain liefert 502, das ist gewollt).
2. Rollback-Pfade: Branch `website-original` (7962d6d = main vor Redesign) lokal+GitHub; Archive-Tags `archive/*` für alte WIP-Branches; Revert von 9356305 möglich.
3. Build-Hinweis bleibt: `npx next build --webpack` (Turbopack panic't am private-Symlink); E2E braucht Build mit /etc/einfach-hausen-build.env (siehe scripts/e2e.mjs T-0200-Hinweis).

## Kontext
- **Welle 1 (Website) komplett:** Homepage mit allen 9 Spec-Sections (Hero+Intake, Services-Mosaik mit Operator-3D-Visuals v4, Story, Hausakte, Vertrauen, Betriebe, Preise, FAQ als shadcn Accordion, Security-Kapitel), dunkler Premium-Footer, App-Promo-Sektion mit Scroll-Motion über dem CTA-Band. Alle 11 Unterseiten mit Premium-Photo-Heroes (Audit bestätigt).
- **shadcn/ui integriert:** init (radix/nova/tailwind-v4) + button/card/badge/separator/accordion/tabs/tooltip/hover-card/avatar; --font-sans auf Inter gemappt (DESIGN.md), legacy --muted gerettet. sin-frontend-design Skill v1.1.0 um references/shadcn.md erweitert.
- **Bilder-Workflow:** Card-Visuals unter public/images/card-visuals/*-v4.png (Operator-Drops aus .orca/drops). Nach Asset-Tausch IMMER: Filename-Bump (Cache-Bust) + `.next/cache/images` moven, sonst liefert /_next/image alte Varianten (max-age=14400).
- **Build-Hinweis:** Turbopack panic't am private-Symlink (globals.css-Verarbeitung) — Webpack verwenden: `npx next build --webpack`.
- **Preview-Infra:** einfach-hausen-preview.service (Port 3011, Worktree eh-premium-redesign, eigene SQLite /var/lib/einfach-hausen-preview) + cloudflared-eh-preview.service (Tunnel d81a6644: einfach-hausen-preview.delqhi.com→3011, napp.delqhi.com→3012 Testserver, napp-shots.delqhi.com→3013). sin-kestra-Tunnel ist remote-managed — lokale Config-Edits wirkungslos.
- **T-0211 (App-Promo):** Komponente ist auch im Design-Branch live eingebaut. Der Task bleibt offen für main-Verifikation nach Merge.
- **T-0120 (Security-Fuzz):** bleibt geparkt hinter T-0210.

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-22T17:06:16+00:00
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
updated: 2026-08-22T16:24:18+00:00
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
updated: 2026-08-31T20:52:52+00:00
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
<!-- SIN-GPT-WEB-HANDOVER
task: T-0111
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: 87e072d5e2c574dbf26ce3c530c85fb1d6a5a871034892d6adf8dc40ec8a3ae9
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0112
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: f193fa11049f920c888558209118f7b7592a95a4e86ace0c92274995b906db8d
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0138
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: 0ab111892a30d55ad46e7f6232b32f64656dee72cc4b9937613c3f2a3d9c925a
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0142
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: bceab63e963dd389c859027e3e4221a6a50386a99dfad656912ed9445f0038fe
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0113
updated: 2026-09-01T13:55:36+00:00
actor: local-agent
evidence-sha256: 07b6275707f950b590ed96ec928ab841e01791e4761d591f616d20f0fc5e80cc
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0114
updated: 2026-09-01T13:57:24+00:00
actor: local-agent
evidence-sha256: db6e60f478405d43372683fbf7d760ddb32ef5fb7c5c608ca152e3115cca052b
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0116
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: cfbef8fb88b67a309e81fa923357ecfc6f2a6808005e9d697e457401171f9ce5
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0117
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: 32b178026b6612aa0bc5ea8813b094a8e7b84293e8c9f8a5706a02435767ed03
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0136
updated: 2026-09-01T18:06:52+00:00
actor: local-agent
evidence-sha256: 766040d87c6e2dbae195442af395ea3b2fddc2c114f4fbe4a7963f3a4d6463ea
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0147
updated: 2026-09-01T19:19:57+00:00
actor: local-agent
evidence-sha256: 4149908d9dda7f1397ce06f9aadccce2ae5c038d469a1adeb8e1e3f02d0a2ff9
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0118
updated: 2026-09-01T20:51:22+00:00
actor: local-agent
evidence-sha256: c55fee22cf93a7578d26053014ef8e42b4a7534775e5e1a5d1fd60053eb1d405
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0119
updated: 2026-09-01T22:14:14+00:00
actor: local-agent
evidence-sha256: 0acd76be267c23dd81333e674d9c0eee29d42c3f07154718697fae9f793a26b6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0210
updated: 2026-09-02T23:18:15+00:00
actor: local-agent
evidence-sha256: 80f9aad504a029dbe80faed7a0cf4c152de5bf88a4b1880edf60f754211dea51
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0211
updated: 2026-09-02T23:18:41+00:00
actor: local-agent
evidence-sha256: 60f232b4e4d8bb71c603011e8a96ba47b0b2b4f04b45106ed5ab759dbc9d69a0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0120
updated: 2026-09-02T23:49:07+00:00
actor: local-agent
evidence-sha256: 73903ba5ee89d8c893c1f1fd2a10d42aeeba247966ba2045494555aa353d28e5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0121
updated: 2026-09-02T23:56:26+00:00
actor: local-agent
evidence-sha256: 01f5f6cb64432cac1825787493c591f7d4d2c263eff4860738564f29f1259336
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0122
updated: 2026-09-03T00:15:44+00:00
actor: local-agent
evidence-sha256: dca081a3188c1676492cf6cfd60f6b5d044444af48a818ae6173c43636c209fb
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0123
updated: 2026-09-03T00:23:19+00:00
actor: local-agent
evidence-sha256: d05fdcb413b5af3832a99bb11e2726eab2c7c3682e25b7c74203edb5e4bd3544
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0124
updated: 2026-09-03T00:32:12+00:00
actor: local-agent
evidence-sha256: 7b56927949e37e438aa734d75f4b3eed9bd85a667118aa51838decfaccecfcb7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0125
updated: 2026-09-03T00:40:53+00:00
actor: local-agent
evidence-sha256: 24ead3c1a5c517e9724996338b7426ad3e8e2c18cd519e08d1f683f72f4d788b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0126
updated: 2026-09-03T00:45:23+00:00
actor: local-agent
evidence-sha256: 1acbbc8c9d9ec3b87035c8d0521fa2c3622fa697e6d719310f61795b15fda6e8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0127
updated: 2026-09-03T00:51:39+00:00
actor: local-agent
evidence-sha256: 0640af1175d4cd871685513652419379eec835cf543aed5dfc69b0bfcadc4a29
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0128
updated: 2026-09-03T00:54:04+00:00
actor: local-agent
evidence-sha256: 52a6748748dfe2d958322ba6584bcd9e8cd8284ed731054bf7f3d48948bf4d4a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0131
updated: 2026-09-03T12:19:04+00:00
actor: local-agent
evidence-sha256: 95b14cf53c5f2030d04c08f2b5dd9dfbb343623139fc5ce9e720d09533c6be38
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0129
updated: 
actor: local-agent
evidence-sha256: a2028224c451c9d493976891e8e4061d8fbe7cbe6e5155f21be5f251a13b16be
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0130
updated: 
actor: local-agent
evidence-sha256: db4bfd0327fb8cd3dcc011d26631b8b064c1a6b0952880d4fbb8d34877b61b84
-->
