# Aktuelle Übernahme · 2026-09-09

## Host und vorhandene Lieferung

OCI sin-supabase. Hauptrepo Delqhi/einfach-hausen. Task EH-BRAND-07-WORKSPACE. Taskplan /home/ubuntu/dev/einfach-hausen/.sin-gpt-web/taskplan.sqlite3. Produktion /srv/einfach-hausen. PR71/72/73 gemergt; Frontend-Abschluss main a5df348. Keine fremde Arbeit löschen, reset/clean/force verboten. Eigenen Worktree vom aktuellen origin/main erstellen.

Vollständiger Code bereits vorhanden:
- docs/brand/workspace/SOURCE.md + source-manifest.json: Detail/Upload/Rechnungseditor.
- docs/brand/agent-acceptance/SOURCE.md + source-manifest.json: sicherer Exporter/Abnahme.
- docs/brand/final-documents/SOURCE.md + source-manifest.json: Dokumentrahmen, Original-Logo, PrintButton, euroExact, mobile Positionslabels.

Nicht erneut implementieren. Native Aktionen, Auth-Filter, Daten und Zahlungssystem erhalten. Letzter vollständiger Release-Gate15/15. Isolierte Prüfungen: echter Upload, Rechnung mit Redirect,12 Dokument-Screenshots bei390/736/1536 und4 PDF-Ausgaben. Keine vollständige mehrseitige PDF- oder Live-Abnahme behaupten.

## Jetzt zusätzlich erledigt

wow-my-zsh PR105 und106 gemergt. Installationsquelle e2ac0dc; vollständiger Code und Hashmanifest in OpenSIN-Code/wow-my-zsh unter docs/eh-design-harness-handoff/. sin-eh-design und sin-frontend-design sind auf OCI in Codex, OpenCode, Prime Agent und DSH installiert und Hash-verifiziert. Backup /home/ubuntu/.local/share/eh-design-backups/20260909T131744Z. DSH skills ist ein Symlink auf /home/ubuntu/.wow-my-zsh/shared/skills; Verknüpfung und gemeinsame Hausregeln wurden erhalten. Mac-Installationen und andere Repositories bleiben ungeprüft.

## Blocker erneut bestätigt

Produktion weiterhin f554939; /api/health HTTP503, database/storage ready, auth_authority unreachable. Voriger diagnostischer Auth-Health-Aufruf: Cloudflare HTTP403/1010. Standarddeploy scheiterte an sudo/no-new-privileges. Erneute Nutzerfreigaben ändern diese technischen Zugriffsgrenzen nicht.

Nächste Aktion ist autorisierte Infrastrukturbehebung, nicht ein erneuter Designumbau:
1. Zuständige Cloudflare-Zone und Security Event mit berechtigtem Konto prüfen. Verantwortliche Regel identifizieren; eng begrenzte fachgerechte Korrektur. Keine pauschale Schutzabschaltung oder User-Agent-Täuschung.
2. Auth-Health und echte Owner-/Pro-Anmeldung prüfen. Keine Secrets/Cookies ausgeben.
3. Berechtigten Host-Deployweg benutzen. no-new-privileges nicht umgehen. Wenn kein berechtigter Zugang verfügbar ist, exakten benötigten Administratorzugriff melden und Task blocked lassen.

Read-only-Diagnose:

```bash
cd /srv/einfach-hausen
git status --short
git rev-parse HEAD
systemctl is-active einfach-hausen.service
curl --silent --show-error --max-time 10 --write-out '\nHTTP %{http_code}\n' http://127.0.0.1:3010/api/health
```

Nur im autorisierten Hostkontext, nach aktuellem Code-/Daten-/Backup-Check:

```bash
cd /srv/einfach-hausen
export PATH="/home/ubuntu/.nvm/versions/node/v22.23.0/bin:$PATH"
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome"
bash deploy/update-on-oci.sh
git rev-parse HEAD
systemctl is-active einfach-hausen.service
curl --silent --show-error --max-time 10 --write-out '\nHTTP %{http_code}\n' http://127.0.0.1:3010/api/health
```

## Nach Wiederherstellung konkret abnehmen

AGENT-ACCEPTANCE.md und APP_COVERAGE_GAPS.md sind Ausgangsmatrizen, keine erledigten Checklisten. Echte Rollenansichten prüfen: Shell/Mobile-Menü, Auftrag/Kontaktanfrage, Nachrichten, Profile/Team/Onboarding, Haus/Technik/Wartung, Tarife/Verifizierung, Freigabe/Übergabe. Jeweils normale, leere, lange, Fehler-, Pending- und eingeschränkte Zustände. 390/736/1536; Druck zusätzlich mehrseitig. Marketing-Navigation und vorhandene Website-Unterseiten prüfen. Keine echten Rechnungen, Nachrichten oder Zahlungen für QA auslösen.

CRM/Hub/Präsentationsgenerator nur nach aktuellem eigenem Repositoryinventar beurteilen. Keine öffentlichen Quellenkapseln mit privaten Daten/Quellen anderer Repos befüllen. Keine entfernten Präsentationsvideos wieder einsetzen. Keine fehlenden Funktionen anhand von Screenshots erfinden.

Nur konkrete belegte Fehler innerhalb des akzeptierten Designsystems korrigieren. Neue eigene Änderungen isoliert testen, vollständigen Releaseprozess laufen lassen und vollständige Codeblöcke erzeugen:

```bash
python3 scripts/eh-design-source.py --root "$PWD" --base a5df3488e712999c96916fb21c1c8f22270a363e --ref HEAD --out docs/brand/production-acceptance
```

Vor Export eigene Dateien gezielt committen. Keine unversionierten Agentendateien einsammeln. Schlussbericht: echter Produktionscommit, Health, Auth/Rollenprüfung, konkret geprüfte Routen/Zustände, Screenshots, vollständiger Quellcode und verbliebene Lücken. Task/Issues/Brain/Memory aktualisieren. Erst abschließen, wenn die tatsächlichen Abnahmekriterien erfüllt sind.
