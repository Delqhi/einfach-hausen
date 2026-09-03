# T-0204 — Restore-Drill-Beweis (2026-08-30)

**Backup-Quelle:** `/var/backups/einfach-hausen/einfach-hausen-20260830T045815Z` (Pre-Deploy-Backup beim Deploy c9825fb, zusätzlich Nightly-Timer 03:25 UTC + Upload in Supabase-Bucket `einfach-hausen-backups`)

## Drill 1 — Verify-Dry-Run (scripts/restore-einfach-hausen.sh --dry-run)

```
Restore dry-run OK: checksums, SQLite integrity_check, private files and uploads verified.
real 0m2.093s
```

## Drill 2 — Staged Restore mit Datenstichproben (--stage temp dir)

```
Restore staging OK: verified data extracted without overwriting production.
```

Staged Inhalt: einfach-hausen.db (+wal/shm), private/, uploads/

SQLite-Beweise gegen die wiederhergestellte Kopie (read-only):

| Check | Ergebnis |
| --- | --- |
| `PRAGMA integrity_check` | `ok` |
| users count | 6 (identisch zur Live-DB) |
| jobs count | 0 (identisch zur Live-DB) |
| documents count | 0 (identisch zur Live-DB) |

## RPO / RTO

- **RPO:** ≤ 24 h regulär (Nightly-Timer 03:25 UTC, Persistent=true); bei Deploys zusätzlich Pre-Deploy-Backup → RPO im Deploy-Fall Minuten. Bucket-Beweis: 8 Bundles in `einfach-hausen-backups`, neuestes `einfach-hausen-20260830T032653Z.tar.gz` (Nightly-Pfad).
- **RTO (Verify-Drill):** ~2 s (Dry-Run inkl. Checksummen + integrity_check). Vollständiger Staging-Restore: Sekundenbereich. Reale In-Place-Recovery (Service-Stopp → Restore → Start) ist davon nicht gedeckt und bleibt eine Operating-Übung.

## Grenzen (durch Drill belegt, nicht spekuliert)

- Backup liegt same-host (Supabase-Storage auf derselben VM). Eine Zweitkopie außerhalb der VM ist als externer Blocker unter `docs/EXTERNAL-BLOCKERS.md` dokumentiert (OCI-CLI vorhanden, aber Tenancy-Credentials/entscheid fehlen).
- Die 6 vorhandenen User-Zeilen in der Produktions-DB sind E2E-Testartefakte (Aug 21–26) und wurden bewusst NICHT gelöscht (Produktions-Mutations-Regel); dokumentiert im T-0205-Report.
