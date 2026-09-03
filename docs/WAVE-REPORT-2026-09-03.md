# Wave-Report 2026-09-03 — Website-Repo-Umzug, Gate-Verifikation, Live-Deploy

**Ergebnis in einem Satz:** GitHub `main` = neue Website-Codebasis (`51667f0`), alter App-Stand archiviert als `website-old`, Release-Gate 11/11 lokal und auf OCI grün, https://einfachhausen.de liefert den neuen Build live, T-0129/T-0130 im kanonischen Taskplan auf done.

## Timeline (Commits)
| Commit | Inhalt |
|---|---|
| `500b60a` | Repo-Init: Website-Codebasis aus lokalem Stand (alter main vorher als `website-old` = `6d2f97c` gesichert) |
| `059f543` | v0-Chat-Welle: `PublicState`-Komponente für root loading/error boundaries |
| `0fb768a` | Lint-Fix (Apostroph /leistungen) |
| `6e30389` | repository-analysis-Welle 1:1 gespiegelt: Fail-soft Supabase, Redirect-Timer-Cleanup, T-0129 E2E v2, T-0130 Visual-Canonicals-System, DESIGN.md/NEXT_AGENT.md |
| `55e0839` | T-0130 Baselines (57 shots, mobile/tablet/desktop) + E2E-Login-Diag + gitignore `.e2e-keys.env` |
| `51667f0` | A11y-Kontrast-Fixes (axe-Layer PASS), zsh-sicheres fixtures-Script, eslint ignoriert nested App-Repo |

## Was produktionstauglich verifiziert ist
1. **Release-Gate 11/11** lokal UND auf OCI (lint, tsc, security regressions, fixtures, build, axe a11y, visual canonicals, CLS, transfer budget, load time, failed requests).
2. **Live-Deploy:** `deploy/update-on-oci.sh` auf sin-supabase, Service healthy, https://einfachhausen.de 200, `/api/health` green, neue CSS-Build-Datei live ausgeliefert.
3. **T-0130 Visual Canonicals:** 57/57 shots PASS lokal (3 Viewports), 20-Shot-Gate-Matrix PASS auf OCI. Baselines committed.
4. **T-0129 E2E v2:** alle 16 öffentlichen Routen (200 + Title + Skip-Link + Footer-Rechtsnavi), 404-State, Register-/Owner-Flows gegen echte OCI-SIN-Supabase.

## Was noch zu tun ist (genaue Anweisungen)

### 1. T-0131 "Final technical completion v2" (kanonischer nächster Task)
- Ort: OCI `/home/ubuntu/dev/einfach-hausen` (kanonischer Taskplan-DB-Pfad: `.sin-gpt-web/taskplan.sqlite3` dort)
- Start: `sin-gpt-web-state claim T-0131 --owner local-agent`
- Inhalt: Konvergenz-Nachweis fahren (`npm run release-gate` + `npm run test:e2e` + `npm run test:smoke`), Restgaps klassifizieren, dann `sin-gpt-web-state complete T-0131 --owner local-agent --evidence '...'`.

### 2. E2E Tech-Persona-Login vollends grün ziehen
- Datei: `scripts/e2e.mjs` (Zeile ~480, `post-click nav failed`)
- Ursache: Client-Bundle muss mit `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` gebaut sein (sonst ist der Browser-Login still tot).
- Anleitung: Lokal `cp`-frei `source .e2e-keys.env` (liegt gitignored im Repo-Root; Keys stammen aus OCI `docker inspect supabase-kong`), dann `export NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... && node node_modules/next/dist/bin/next build --webpack && PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node scripts/e2e.mjs`.
- Erwartung: Tech-Persona-Login (`/login` → `/pro`) läuft dann durch; ohne Env bleibt es der dokumentierte Fail-Fast.

### 3. Smoke gegen Produktion fahren (T-0131-Bestandteil)
- `BASE_URL=https://einfachhausen.de npm run test:smoke` (bzw. wie in `scripts/production-smoke.mjs` vorgesehen) und Ergebnis als Evidence an T-0131 hängen.

### 4. GitHub Actions Billing klären (Operator-Aufgabe, nicht code-seitig)
- CI (`.github/workflows/quality.yml`) schlägt fehl: "account is locked due to a billing issue". Abzustellen in GitHub → Settings → Billing. Danach läuft der Quality-Gate-Workflow auf jedem Push automatisch.

### 5. Altes App-Repo aufräumen (optional, niedrige Priorität)
- Der Ordner `einfach-hausen/` im Repo-Root ist das alte App-Repo (eigene Historie, remote `Delqhi/einfach-hausen` eingetragen — Vorsicht: `git push` dort betrifft dasselbe GitHub-Repo!). Wenn es nicht mehr gebraucht wird, in einen eigenen Klon auslagern oder löschen. Der Stand ist sicher: Branch `website-old` auf GitHub + Archive-Tags.
