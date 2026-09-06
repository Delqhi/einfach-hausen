# EH-BRAND — aktueller Handoff: Atelier 02
Stand 2026-09-06. Root Codex übernimmt Gestaltung und Umsetzung persönlich.
Task EH-BRAND-03: in progress, gestalterische Nutzerabnahme offen.
Issue: https://github.com/Delqhi/einfach-hausen/issues/39
Aktueller Draft-PR: https://github.com/Delqhi/einfach-hausen/pull/41

## Sofort verstehen
Die drei Stilproben in Draft-PR #40 wurden vom Nutzer ausdrücklich verworfen. 27/27 technische Prüfungen bleiben historische Evidenz, sind keine Designfreigabe. Nicht erneut zur Auswahl stellen und nicht erneut ausführen.
Die neue Richtung heißt "Ein Zuhause mit Gedächtnis". Sie ist ein neuer Vorschlag, noch nicht vom Nutzer angenommen oder abgelehnt.
Kein weiterer Prime/bai-Dispatch. Root Codex hat sämtliche neue Gestaltung und Code selbst geschrieben.
Das frühere vollständige Paket und alle früheren Erkenntnisse bleiben unter docs/brand/source und in den ursprünglichen Spec-/Plan-Dateien erhalten.

## Exakte Orte
- Host: sinsupabase / OCI-VM.
- Workspace: /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906
- Branch: design/einfachhausen-brand-atelier-20260906
- Baseline: 1239f7c469007ca5dd9895a8a0f44100c2b8b583 (enthält die verworfene Studie)
- Task-Autorität: /home/ubuntu/dev/einfach-hausen/.sin-gpt-web/taskplan.sqlite3, ausschließlich sin-gpt-web-state --repo /home/ubuntu/dev/einfach-hausen verwenden.
- Produktquelltext dieser Welle: design/brand-atelier/index.html, atelier.css, atelier.js.
- Laufzeit/Prüfung: design/brand-atelier/server.mjs, verify.mjs, build-preview.py.
- Vollständige Quelltextblöcke: docs/brand/ATELIER_02_SOURCE.md.
- Manifest mit SHA256, inklusive generierter Vorschau und Bildern: docs/brand/evidence/atelier/manifest.json.
- Portabler Entwurf: design/brand-atelier/preview.html (eine vollständige HTML-Datei, alle vier Original-Assets eingebettet).
- Vollformat-Screenshots und Berichte: docs/brand/evidence/atelier/.
- Mac-i9-Review-Kopie nach GitHub-Transfer: /Users/jeremyschulze/orca/workspaces/einfach-hausen-brand-atelier-20260906 (detached review checkout; Startdatei design/brand-atelier/preview.html).
- Diese Vorschau hat ausschließlich lokale Beispieldaten. Formulare versenden nichts. Produkt-Backend nicht implementiert oder verändert.

## Lesen
1. docs/brand/ATELIER_02.md: Nutzerkorrektur wörtlich, R01–R08, Gestaltungsrationale, Abgrenzung, Akzeptanz und Plan.
2. docs/brand/evidence/atelier/VISUAL_REVIEW.md: persönlich geprüfte Ansichten, erkannte Fehler und tatsächliche Korrekturen.
3. docs/brand/evidence/atelier/verification.json und persistence.json: echte technische und Speicher-Nachweise.
4. Aktuellen EH-BRAND-03-Datensatz zeigen, danach PRODUCT_VISION.md / PRODUCT_POSITIONING.md / DESIGN.md.

## Reproduzieren auf OCI
```bash
cd /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906
export PATH=/home/ubuntu/.nvm/versions/node/v22.23.0/bin:/home/ubuntu/.local/bin:$PATH
python3 design/brand-atelier/build-preview.py
EH_VERIFY_DEPENDENCIES=/home/ubuntu/dev/einfach-hausen EH_CHROMIUM_PATH=/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome node design/brand-atelier/verify.mjs
node design/brand-atelier/server.mjs
# Letzter Befehl: nur Loopback http://127.0.0.1:4182/
# Alternative ohne Server: preview.html direkt im Browser öffnen.
python3 design/brand-atelier/export-source.py
```

Die frühere Chromium-1228-Cacheinstallation war beim neuen Lauf nicht mehr verfügbar. Die bereits vorhandene Playwright-Version hat einen eigenen, projektbezogenen Browsercache installiert; kein System-Node, kein anderes Browserprofil und keine laufende Agentensitzung wurden verändert.
Node-Syntax, responsive Darstellung, Funktionen, axe und Server-Allowlist sind Prototyp-Verifikation, keine Produktions-Release-Gates. Vor produktiver Migration bleiben vollständige Repo-Gates und echte Flächenintegration erforderlich.

## Genau eine nächste Aktion
Den neuen Atelier-02-Entwurf in Originalgröße mit dem Nutzer besprechen und sein tatsächliches Feedback in EH-BRAND-03 festhalten. Daraus Refinements ableiten; erst nach einer realen Richtungsentscheidung EH-BRAND-04 (zentraler Komponenten-/Markenvertrag) fortsetzen. EH-BRAND-05/06 bleiben abhängig. Kein Merge oder Deploy des ungewählten Entwurfs.

## Verifizierte Bereitstellung
Design-Commit baea585e9de24c6d6bada491ac61c4537f2a5e4d ist gepusht. Die eigenständige Vorschau wurde über GitHub auf den Intel-i9-Mac übertragen und per Google Chrome geöffnet (open exit 0); keine andere Mac-Arbeitskopie geändert. Empfangs- und Speicher-Nachweise: evidence/atelier/delivery.json und persistence.json. OpenViking-Korrektur mem-b823c53eeb3ad68261bc wurde gespeichert und korrekt zurückgelesen; Brain-Konvention 6d24e92d-81e2-45a7-9948-9da8a512c065 ebenfalls. Honcho bleibt wie zuvor nicht verfügbar; dort wird keine Speicherung behauptet.
