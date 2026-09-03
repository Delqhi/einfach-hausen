# Einfach Hausen — Disaster-Recovery Runbook (T-0137)

Reproduzierbare Wiederherstellungsabläufe für die drei definierten Szenarien. Alle Befehle auf der OCI-VM (`sin-supabase`) als `ubuntu` ausführen, außer wo `sudo` steht. Verifiziert gegen T-0136 (Restore-Drill) und T-0124 (wöchentlicher Drill).

**Recovery-Ziele (Betriebsnachweis, keine Garantien):**
- RPO: Alter des neuesten Backups (`/var/backups/einfach-hausen`, stündlich via `einfach-hausen-backup.timer`; getestet ≤ 2h)
- RTO: Restore-Drill misst tatsächlich 5s für Verify+Stage; produktive Wiederherstellung inkl. Service-Restart < 15 min

**Artefakte:**
- Backups: `/var/backups/einfach-hausen/einfach-hausen-<TS>/` mit `manifest.json`, `einfach-hausen.db`, `private.tar`, `uploads.tar` (root:0700)
- Off-Site: Supabase-Storage-Bucket via `deploy/backup-to-supabase.sh`
- Drill-Evidence: `/var/lib/einfach-hausen/drill-evidence.jsonl`

---

## Szenario 1: SQLite-Datenbankverlust (DB weg oder unlesbar)

1. **Ruhe bewahren, Stop-Uhr starten** (RTO beginnt).
2. Prozess stoppen: `sudo systemctl stop einfach-hausen.service`
3. Beschädigte DB sichern für Post-Mortem (niemals überschreiben):
   `sudo mv /var/lib/einfach-hausen/einfach-hausen.db /var/lib/einfach-hausen/einfach-hausen.lost.$(date +%s)`
4. Neuestes intaktes Backup wählen:
   `ls -1dt /var/backups/einfach-hausen/*/ | head -1`
5. Restore verifizieren + stagen:
   `sudo scripts/restore-einfach-hausen.sh <BACKUP_DIR> --stage /tmp/eh-restore-$$`
   - Bricht laut ab bei Checksummen-Mismatch oder `integrity_check != ok` → nächstälteres Backup probieren.
6. Wiederherstellen (Copy-only, keine Metadaten):
   ```bash
   sudo cp /tmp/eh-restore-$$/einfach-hausen.db /var/lib/einfach-hausen/einfach-hausen.db
   sudo rsync -a /tmp/eh-restore-$$/private/ /var/lib/einfach-hausen/private/
   sudo rsync -a /tmp/eh-restore-$$/uploads/ /var/lib/einfach-hausen/uploads/
   sudo chown -R ubuntu:ubuntu /var/lib/einfach-hausen/einfach-hausen.db
   sudo -u ubuntu sqlite3 /var/lib/einfach-hausen/einfach-hausen.db 'PRAGMA integrity_check;'
   # Erwartung: ok
   ```
7. Service starten und healthen:
   `sudo systemctl start einfach-hausen.service`
   `curl -s http://127.0.0.1:3010/api/health` → `"state":"ready"` (T-0134-Felder)
   - `state:"degraded"` + `state_detail.degraded` nennt die gestörte Komponente (T-0134-Diagnostik).
8. Liveness/Smoke: `node scripts/production-smoke.mjs` → 18/18.
9. **RPO dokumentieren:** `python3 -c` aus Manifest-MTime; Differenz zu Jetzt = Datenverlust-Fenster. Evidence-Zeile in `/var/lib/einfach-hausen/drill-evidence.jsonl` anfügen.
10. Stop-Uhr stoppen = RTO. Wenn > 15 min: Ursache ins Runbook-Ergänzungslog.

**Nacharbeit:** WAL-Dateien der beschädigten DB nicht löschen (Forensik); Supabase-Off-Site-Kopie gegenprüfen; Ursache (Disk? Migration?) in T-0137-Nachtrag.

---

## Szenario 2: Korruptes/kaputtes Release (Deploy bricht oder App startet nicht)

1. **Kein Datenverlust** — Code-Problem, Daten unberührt. RTO-Ziel: < 10 min.
2. Symptom prüfen: `systemctl status einfach-hausen.service`; `journalctl -u einfach-hausen -n 50`.
3. Health zeigt was? `curl -s http://127.0.0.1:3010/api/live` (Prozess lebt?) vs `/api/health` (Dependencies ok?).
   - `/api/live` antwortet, `/api/health` 503 mit `state_detail.degraded` → Dependency-Problem, siehe Szenario 1/3.
   - Beide tot → Release-Rollback:
4. **Rollback auf letzten grünen Release:**
   ```bash
   cd /srv/einfach-hausen
   git log --oneline -5          # letzten bekannten guten SHA notieren (production marker)
   sudo git fetch origin main
   sudo git checkout <GOOD_SHA>  # detached für schnellen Rollback
   # Build-Env quellen und bauen:
   set -a; source /etc/einfach-hausen-build.env; set +a
   PATH="/home/ubuntu/.nvm/versions/node/v22.23.0/bin:$PATH" npm ci
   PATH="/home/ubuntu/.nvm/versions/node/v22.23.0/bin:$PATH" npx next build --webpack
   sudo systemctl restart einfach-hausen.service
   curl -s http://127.0.0.1:3010/api/health   # state=ready erwartet
   ```
   Alternativ (schneller): `.next` des letzten grünen Deploys liegt nicht vor — daher ist der Weg über Git verbindlich. **Nach dem Rollback main wieder auf grünen Stand bringen (`git checkout main && git reset --hard origin/main` erst nach Fix).**
5. Smoke: `node scripts/production-smoke.mjs` → 18/18.
6. Ursache: Gate-Fehler im CI-Rebuild reproduzieren (`npm run release-gate` lokal), Fix auf main, regulär über `deploy/update-on-oci.sh` redeployen. **Nie manuell auf Produktion bauen und stehen lassen** — Produktion folgt immer origin/main außer im aktiven Rollback.

---

## Szenario 3: Fehlerhafte Migration (Schema-Migration beschädigt Daten/Verhalten)

1. **Sofort stoppen:** Weitere Starts verschlimmern den Zustand (Migrationen laufen idempotent beim Boot, aber kaputte Daten bleiben).
2. Zustand einfrieren: `sudo systemctl stop einfach-hausen.service`
3. DB-Snapshot für Analyse: `sudo cp /var/lib/einfach-hausen/einfach-hausen.db /tmp/migration-postmortem.db`
4. **Umfang bestimmen:** `sudo -u ubuntu sqlite3 /var/lib/einfach-hausen/einfach-hausen.db 'PRAGMA integrity_check;'` und betroffene Tabellen zählen.
   - `integrity_check != ok` → echter Korruptionsfall → **Szenario 1** (DB-Verlust) anwenden.
   - Integrität ok, aber Inhalt falsch → gezielter Daten-Patch statt Full-Restore:
5. **Gezielter Rollback der Migration:**
   - Letzten guten Backup-Stand identifizieren (vor dem Deploy mit der Migration).
   - Nur die betroffenen Tabellen aus dem Staged-Restore übernehmen:
     ```bash
     sudo scripts/restore-einfach-hausen.sh <BACKUP_DIR_VOR_MIGRATION> --stage /tmp/eh-restore-$$
     sudo -u ubuntu sqlite3 /var/lib/einfach-hausen/einfach-hausen.db ".attach '/tmp/eh-restore-$$/einfach-hausen.db' AS good"
     # Beispiel: Tabelle zurückkopieren
     sudo -u ubuntu sqlite3 /var/lib/einfach-hausen/einfach-hausen.db "DROP TABLE main.<TABELLE>; CREATE TABLE main.<TABELLE> AS SELECT * FROM good.<TABELLE>;"
     sudo -u ubuntu sqlite3 /var/lib/einfach-hausen/einfach-hausen.db 'DETACH DATABASE good;'
     ```
   - Schema-Änderung der fehlerhaften Migration zurücksetzen (falls additiv: `ALTER TABLE ... DROP COLUMN` via Neu-Erstellung).
6. Start + Health + Smoke wie Szenario 1 (Schritte 7–8).
7. **Nacharbeit:** Migration fixen + Regression ergänzen, die den Schaden verhindert hätte; Deploy erneut über Gate.

---

## Prävention (laufend)

- Wöchentlicher Drill: `einfach-hausen-drill.timer` (T-0124) → Evidence in `drill-evidence.jsonl`; Alert bei `ok:false`.
- SLO-Probes alle 15 min (T-0123): Health/Homepage/Auth/Dispatch/Backup — Failures mit Correlation-ID in Kestra-History.
- Deploy-Pflicht: `deploy/update-on-oci.sh` mit Release-Gate 11/11; **nie** Service-Restart ohne vorheriges Gate.
- Backup-Retention: Off-Site-Kopie (`backup-to-supabase.sh`) gegen Hardware-Verlust; Mount/Restore des Buckets jährlich testen.

## Verifizierung gegen T-0136

Jedes Szenario wurde auf nicht-produktiven Pfaden nachgestellt (Staging-Verzeichnisse, Fixture-DBs); der Restore-Kern (Checksummen → `integrity_check` → Stage) ist derselbe geprüfte Code-Pfad wie T-0136/T-0124 (`scripts/restore-einfach-hausen.sh`, `scripts/t0124-backup-drill.sh`). Produktions-Pfade werden im Drill niemals berührt; ein echter Notfall folgt exakt den Schritten oben.
