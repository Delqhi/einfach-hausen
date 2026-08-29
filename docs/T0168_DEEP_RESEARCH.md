# T-0168 — Deep Research: Auth-Konvergenz und visuelle 1:1-Abnahme

**Stand:** 2026-08-28

Diese Datei integriert die Deep-Research-Analyse und die bisherigen Luna-/ChatGPT-Web-Evidenzen für T-0168. Sie ergänzt den kanonischen Taskplan; sie ersetzt ihn nicht.

## 1. Executive Summary

T-0168 ist visuell weit fortgeschritten, aber ein belastbarer "100% 1:1"-Claim braucht zwei zusätzliche Beweise:

1. **eine konsistente Produktions-Authentifizierungsarchitektur**, damit geschützte Owner-/Provider-Screens über den echten Auth-Pfad reproduzierbar gerendert werden können;
2. **frische Round-3-Vergleichsevidence** aus Notion-Referenz → Actual → Overlay → Diff → manueller visueller Abnahme.

Die bisherige Arbeit hat bereits wichtige Grundlagen geschaffen: Notion-Designsystem, mobile Screens, Build-Fixes, Dual-Auth-Regression und authentifizierte Round-2-Captures. Die Deep-Research-Analyse stuft den noch bestehenden Auth-Split jedoch als Architektur-Risiko ein: Supabase-Browser-Auth und lokale `mh_session`/SQLite-Auth bilden derzeit zwei konkurrierende Identitätswelten.

## 2. Repository- und Evidence-Audit

Kanonische Quellen:

- Taskplan: `.sin-gpt-web/taskplan.sqlite3`
- gerenderter Plan: `.sin-gpt-web/TASKPLAN.md`
- visuelle Referenzen/Evidence: `.sin-gpt-web/evidence/T-0168/`
- Notion-Referenz: `https://app.notion.com/p/App-Design-3c8b784cdffc80a1a5d1ed2269dbdd0d`
- lokaler Referenzbestand: `public/notion/`

Die lokale Notion-Referenz umfasst Owner- und Provider-Bilder. Für die finale Pixel-Abnahme werden Owner-Referenzen als harte 1:1-Quelle verwendet. Provider wird mindestens auf dasselbe freigegebene Designsystem geprüft; ein unabhängiger Provider-1:1-Claim setzt eine eindeutig zugeordnete Referenz pro Screen voraus.

Bereits vorhandene Round-1/Round-2-Evidence bleibt historisch erhalten. Round 3 wird nur dann neue finale Acceptance-Quelle, wenn alle dort definierten Gates grün sind.

## 3. Aktuelle Dual-Auth-Topologie

Der aktuelle Code enthält zwei Auth-Domänen:

```text
Supabase Browser Auth
  -> /login
  -> /register-owner
  -> /register-pro
  -> /dashboard
  -> /dashboard-pro

Lokale Session / SQLite
  -> mh_session
  -> currentUser()/requireUser()/requirePro()
  -> /app/**
  -> /pro/**
```

Round 2 hat einen realen Redirect-Konflikt behoben: Der globale `AuthContext` durfte eine serverseitig bereits gültige `/app/**`- oder `/pro/**`-Session nicht wieder clientseitig nach `/login` umleiten. Dieser Fix ist als Regression wertvoll, aber nicht der gewünschte langfristige Endzustand, wenn Produktion Supabase als Primary Identity nutzt.

## 4. Ziel-Invarianten für Authentifizierung

### Produktion

- Supabase ist die serverseitige Identity Authority.
- Geschützte Server Components, Route Handler und Server Actions autorisieren gegen eine serverseitig verifizierte Identität.
- `mh_session` allein darf in Produktions-Supabase-Modus keinen geschützten Zugriff gewähren.
- Lokale Auth darf in Produktion nicht stillschweigend aktiviert oder als Fallback genutzt werden.
- Ein explizit gewählter Local-Auth-Modus muss in Produktion fail-closed enden.

### Entwicklung

- Standard bleibt Supabase-Modus.
- Ein expliziter Local-Dev-Modus darf SQLite/`mh_session` verwenden, sofern `NODE_ENV !== 'production'`.
- Es gibt keinen stillen Fallback von Supabase auf lokale Auth.

### Alle Umgebungen

- `AuthContext` ist UI-/Session-State, nicht die Sicherheitsgrenze.
- `requireUser()` / `requirePro()` bilden die gemeinsame serverseitige App-Autorisierung.
- Server Actions autorisieren vor Mutation erneut.
- Rollen werden serverseitig aufgelöst.
- Eine ungültige/abgelaufene Session zeigt keine geschützten Inhalte.

## 5. Identity-Mapping Decision Record

Vor einer Schema- oder Mapping-Änderung muss geprüft werden:

- lokales `users`-Schema;
- bestehende Supabase-Profile bzw. Auth-Subject-Verwendung;
- alle FKs auf lokale User-IDs;
- aktuelle Role-Quelle;
- bestehende stabile Mapping-Felder.

**Nicht zulässig:** ungeprüft annehmen, dass `supabase.auth.users.id` identisch mit dem bestehenden Application-`users.id` ist.

Empfohlenes internes Modell, falls kein gleichwertiger Typ existiert:

```ts
type AppIdentity = {
  appUserId: string
  authSubject: string
  role: 'owner' | 'pro'
  source: 'supabase' | 'local'
}
```

Ein E-Mail-Match darf nicht ohne Analyse als dauerhafter Security-Identifier eingeführt werden.

## 6. Test-first-Migrationsplan

Vor dem finalen Architektur-Fix muss mindestens ein aktuelles Fehlverhalten durch einen reproduzierbaren Regressionstest rot sein.

Pflichtmatrix:

```text
unauthenticated -> /app/owner            => /login
unauthenticated -> /pro                  => /login
Supabase Owner -> canonical Owner route  => 200, kein Login-Loop
Supabase Pro -> /pro                     => 200
Owner -> Pro-only route                  => abgewiesen/sicherer Rollenredirect
Pro -> /app                              => kanonische Rollenauflösung
invalid/expired Supabase session         => keine geschützten Inhalte
mh_session only + supabase mode          => kein Zugriff
local mode + development + local session => rollenrichtiger Zugriff
local mode + production                  => fail closed
logout                                   => vorheriger geschützter Zugriff ungültig
server action without auth               => keine Mutation
```

Der bestehende T-0168-Dual-Auth-Test wird auf die Zielinvariante weiterentwickelt: Nicht der Split soll konserviert, sondern der Produktionssplit entfernt werden.

## 7. Notion Visual Acceptance Matrix

### Owner — harte Referenz

Die finale Round-3-Abnahme muss mindestens folgende Referenzen explizit zuordnen:

- Einstieg / First Screen
- Login
- Owner Dashboard
- Historie
- Menü geschlossen
- Menü geöffnet

Lokale Referenzdateien unter `public/notion/` bzw. `.sin-gpt-web/evidence/T-0168/` sind die bildliche Wahrheit. DESIGN.md und Implementierung sind nachrangig.

### Provider

Provider-Screens werden gegen dieselben freigegebenen Design-Primitiven geprüft:

- Creme/Petrol/Tinte-Palette;
- Typografie;
- Kartenradien und Schatten;
- dünne Outline-Icons;
- Header;
- Drawer/SideMenu;
- Bottom-Navigation;
- Abstands- und Rhythmus-System.

Ein unabhängiger Provider-"100% Notion 1:1"-Claim ist nur zulässig, wenn der jeweilige Provider-Screen eindeutig einer Notion-Referenz zugeordnet ist.

## 8. Capture- und Evidence-Vertrag

Round-3-Capturebedingungen:

```text
Viewport: 390 x 844 CSS px
DPR: 1
Zoom: 100%
gleicher Chromium/Playwright-Build pro Vergleich
stabile/deterministische Daten
Animationen deaktiviert oder settled
echter unterstützter Auth-Pfad
keine gefälschte LocalStorage-/Cookie-Seeding-Abkürzung als Primär-Acceptance
```

Für jeden harten Owner-Referenzscreen:

```text
<screen>-reference.png
<screen>-actual.png
<screen>-overlay-50.png
<screen>-diff.png
```

Zusätzlich:

```text
round3/notion-parity-contact-sheet.png
round3/acceptance.json
```

Diagnostische Zielwerte:

- geometrische Anker möglichst innerhalb ±1 CSS px;
- Fullscreen-Mismatch <= 0,5 % nur als Diagnoseziel nach dokumentierter Maskierung wirklich dynamischer Bereiche;
- manuelle Overlay-Abnahme bleibt für externe Notion-Referenzen autoritativ.

## 9. Round-3-Evidence-Struktur

```text
.sin-gpt-web/evidence/T-0168/round3/
├── pre-head.txt
├── pre-status.txt
├── changed-files.txt
├── auth-regression.txt
├── security-regression.txt
├── auth-e2e.txt
├── visual-e2e.txt
├── typescript.txt
├── build.txt
├── diff-check.txt
├── gitnexus-changes.json
├── acceptance.json
├── <owner-reference/actual/overlay/diff pairs>
├── pro-dashboard-actual.png
├── pro-jobs-actual.png
├── pro-team-actual.png
├── pro-profile-actual.png
└── notion-parity-contact-sheet.png
```

Round-1/Round-2-Evidence wird nicht gelöscht.

## 10. Worktree- und Rollback-Regeln

Vor Round-3-Mutationen:

```text
HEAD sichern
vollständigen porcelain status sichern
Binary-Patch des Working Trees außerhalb des Repos sichern
nur tatsächlich anzufassende Dateien separat sichern
```

Verboten:

- `git reset --hard`
- `git clean`
- `git checkout -- .`
- `git restore .`
- Force Push
- pauschales Überschreiben fremder Dirty-Arbeit

Rollback erfolgt ausschließlich pro Round-3-Datei.

## 11. Gate-Reihenfolge

1. Baseline HEAD/Status
2. GitNexus Context/Impact vor nicht-trivialen Symboländerungen
3. rote Auth-Regression
4. minimale Implementierung
5. Auth-Regression PASS
6. Security-Regression PASS
7. Auth-Playwright-E2E PASS
8. authentifizierte Round-3-Captures
9. Referenz/Actual/Overlay/Diff
10. visuelle Acceptance PASS
11. TypeScript PASS
12. `npm run build` PASS
13. `git diff --check` PASS
14. Changed-file-/Status-Audit
15. frisches GitNexus `detect_changes`
16. Taskplan render + validate
17. Doku/Evidence-Sync
18. vollständiger Handback

## 12. Completion Definition

T-0168 bzw. seine Deep-Research-Folgearbeit darf erst endgültig abgeschlossen werden, wenn:

- Supabase die einzige Produktions-Identity-Authority ist;
- lokale Auth explizit development-only ist;
- Produktions-Local-Mode fail-closed ist;
- `AuthContext` keine konkurrierende Security-Policy für `/app`/`/pro` enthält;
- Owner/Pro konsistent auf serverseitiger App-Identity autorisieren;
- Direct-Route- und Server-Action-Verhalten getestet ist;
- alle Owner-Notion-Referenzen frische Round-3-Actual/Overlay/Diff-Evidence besitzen;
- die Owner-Parität manuell anhand der Evidence akzeptiert wurde;
- Provider nachweisbar dasselbe Designsystem verwendet;
- Security, Auth-E2E, Visual-E2E, TypeScript, Build und Diff-Check grün sind;
- GitNexus-Änderungsanalyse frisch geprüft ist;
- Taskplan und Pflichtdokumente synchron sind;
- der Handback HEAD, Status, alle geänderten Dateien, Restlücken und den vollständigen finalen Inhalt jeder in Round 3 neu erstellten oder geänderten Datei enthält.

## 13. Primary References

Für die Implementierung sind die jeweils aktuellen Primärquellen zu verwenden:

- Supabase SSR / Server-Client-Dokumentation
- Supabase serverseitige User-/Claims-Verifikation
- Next.js Authentication / Data Security Guides der im Repo installierten Next.js-Version
- Playwright Visual Comparisons
- GitNexus Repo-Graph / Impact / Detect-Changes

Bei Konflikten gilt: installierte Framework-Dokumentation und aktuelle Primärdokumentation vor Trainingswissen.
