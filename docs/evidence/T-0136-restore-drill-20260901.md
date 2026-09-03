# T-0136 — Vollständiger Restore-Drill (2026-09-01, Jcode)

**Betriebsbefehl:** Operator 2026-09-01T18:00:55Z (Wiederholung des Finalisierungsmandats, siehe docs/OPERATOR_COMMAND_LOG.md T4).

## Acceptance-Kriterien ↔ Beweise

| Kriterium | Beweis |
| --- | --- |
| Aktuelles Produktionsbackup in isolierter Umgebung wiederhergestellt | Staged Restore in leere Temp-Verzeichnisse (`/tmp/eh-restore-stage*`, `/tmp/eh-offsite-restore*`), Produktions-DB nie berührt (`--stage` verweigert Überschreiben). Lokales Bundle `einfach-hausen-20260901T175740Z` (17:57Z, Pre-Deploy) UND Offsite-Bundle `einfach-hausen-20260901T180421Z.tar.gz` (18:04Z, aus Supabase-Bucket `einfach-hausen-backups` heruntergeladen und extrahiert). |
| Integritätschecks bestehen | `Restore dry-run OK: checksums, SQLite integrity_check, private files and uploads verified.` für beide Bundles; `PRAGMA integrity_check = ok` gegen beide restaurierten Kopien (read-only URI). |
| Nutzer-Stichprobe | `users` restored=6 / live=6; konkrete Zeile (`id,email,role,created_at` des ältesten Users) identisch zwischen Backup und Live. |
| Booking-Stichprobe | `jobs` restored=1 / live=1; komplette jüngste `jobs`-Zeile (SELECT *) identisch. Ferner identisch: properties (4/4), documents (0/0), cwv_metrics (0/0), review_reports, data_requests. |
| Upload-Stichprobe | Manifest-Zähler verifiziert (`private_file_count=0`, `upload_file_count=0` — aktuell keine Uploads in Produktion); Archiv-Extraktion + Dateizähl-Check im Restore-Skript gelaufen. Konsistent zum Live-Zustand. |
| RPO dokumentiert | ≤ 24 h regulär (Nightly-Timer `einfach-hausen-backup.timer`, zuletzt 03:28Z, Persistent), bei Deploys zusätzlich Pre-Deploy-Backup (17:57Z vor diesem Deploy) → RPO im Deploy-Fall Minuten. Offsite-Bundles: 20260831T032908Z, 20260901T032848Z, 20260901T180406Z, 20260901T180421Z. 97 lokale Bundles unter /var/backups/einfach-hausen. |
| RTO dokumentiert | Dry-Run-Verifikation: 2,6 s. Vollständiger Staged-Restore (Checksummen + Extraktion + Integrität): **2,48 s** (`/usr/bin/time` gemessen). Offsite-Roundtrip (Download 41 MB → Extract → Verify → Stage): 7,0 s End-to-End. Reale In-Place-Recovery (Service-Stopp → Restore → Service-Start) bleibt Operating-Übung und ist NICHT Teil dieses Drills (bewusst, Produktionsrisiko). |

## Offsite-Roundtrip (neu in diesem Drill, über T-0204 hinaus)

1. Upload frischen Bundles via `deploy/backup-to-supabase.sh` → `Backup uploaded: einfach-hausen-20260901T180421Z.tar.gz` (41.307.503 bytes).
2. Download desselben Bundles aus dem Bucket.
3. `restore-einfach-hausen.sh --dry-run` und `--stage` auf dem Download: PASS.
4. Datenstichproben gegen Live: PASS. **OFFSITE ROUNDTRIP: PASS.**

## Grenzen (unverändert, dokumentiert)

- Offsite-Ziel ist der Supabase-Storage auf derselben VM (geteilter Gateway). Zweitkopie außerhalb der VM bleibt externer Blocker (docs/EXTERNAL-BLOCKERS.md, OCI-Tenancy-Credentials fehlen).
- Kein echter In-Place-Service-Failover-Test (würde Produktion unterbrechen; Verhältnis Risiko/Nutzen sprach dagegen — drill war isoliert).
- 6 historische E2E-User in der Produktions-DB sind bewusst unangetastet (Produktions-Mutations-Regel, T-0205).
