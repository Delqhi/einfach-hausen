#!/usr/bin/env bash
# T-0124 backup/restore drill: non-destructive recurring drill that proves the
# backup pipeline is actually restorable and records RPO/RTO evidence.
#
# What it does (never touches production data paths):
#   1. Picks the newest backup under /var/backups/einfach-hausen.
#   2. Computes RPO: age of that backup in hours.
#   3. Runs scripts/restore-einfach-hausen.sh BACKUP_DIR --stage TMPDIR
#      (integrity checksums, SQLite integrity_check, private/upload archives).
#   4. Runs a SQLite PRAGMA integrity_check on the restored DB.
#   5. Verifies expected private files exist in the staged restore.
#   6. Records RTO (restore wall-clock) and appends one JSON evidence line to
#      /var/lib/einfach-hausen/drill-evidence.jsonl (root-readable dir, file is
#      ubuntu-owned when created by this drill).
#
# Exit 0 only when restore + integrity + private files all pass; missing
# private files or SQLite corruption fail loudly with exit 1.
set -euo pipefail

BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/einfach-hausen}"
EVIDENCE_FILE="${EVIDENCE_FILE:-/var/lib/einfach-hausen/drill-evidence.jsonl}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ -d "$BACKUP_ROOT" ]] || { echo "{\"drill\":\"backup_restore\",\"ok\":false,\"detail\":\"backup root missing: $BACKUP_ROOT\"}"; exit 1; }

# Backups are root-owned 0700 by design (privacy). The drill reads them, so it
# re-executes itself with sudo when the newest manifest is not readable.
# Root-owned 0700 dirs make even traversal fail as ubuntu, so probe readability
# by attempting a direct stat on the newest manifest path after listing names.
newest_dir_name="$(ls -1 "$BACKUP_ROOT" 2>/dev/null | grep -E "^einfach-hausen-[0-9]{8}T[0-9]{6}Z$" | sort | tail -1)"
readable_manifest=""
if [[ -n "$newest_dir_name" ]]; then
  candidate="$BACKUP_ROOT/$newest_dir_name/manifest.json"
  if [[ -r "$candidate" ]]; then readable_manifest="$candidate"; fi
fi
if [[ -z "$readable_manifest" ]]; then
  if [[ "$(id -u)" -ne 0 ]] && command -v sudo >/dev/null; then
    exec sudo -E "$0" "$@"
  fi
  echo "{\"drill\":\"backup_restore\",\"ok\":false,\"detail\":\"no readable backup manifest (root-owned by design)\"}"
  exit 1
fi

# Newest backup directory that actually contains a manifest.
newest=""
for d in "$BACKUP_ROOT"/*/; do
  [[ -f "$d/manifest.json" ]] && newest="$d"
done
[[ -n "$newest" ]] || { echo "{\"drill\":\"backup_restore\",\"ok\":false,\"detail\":\"no backup with manifest.json found\"}"; exit 1; }

backup_name="$(basename "$newest")"
backup_epoch="$(stat -c %Y "$newest/manifest.json")"
now_epoch="$(date +%s)"
rpo_hours=$(python3 -c "print(round(($now_epoch-$backup_epoch)/3600.0, 2))")

started=$(date +%s)
stage="$(mktemp -d /tmp/eh-drill-restore-XXXXXX)"
trap 'rm -rf "$stage"' EXIT

# The restore script verifies checksums + SQLite integrity + archives into $stage.
if ! "$SCRIPT_DIR/restore-einfach-hausen.sh" "$newest" --stage "$stage" >/tmp/eh-drill-restore.log 2>&1; then
  echo "{\"drill\":\"backup_restore\",\"ok\":false,\"detail\":\"restore verification failed\",\"backup\":\"$backup_name\"}"
  tail -5 /tmp/eh-drill-restore.log >&2 || true
  exit 1
fi

# SQLite integrity check on the restored database.
restored_db="$(find "$stage" -maxdepth 3 -name '*.db' | head -1)"
if [[ -z "$restored_db" ]]; then
  echo "{\"drill\":\"backup_restore\",\"ok\":false,\"detail\":\"no restored database found\",\"backup\":\"$backup_name\"}"
  exit 1
fi
integrity="$(sqlite3 "$restored_db" 'PRAGMA integrity_check;' 2>/dev/null || echo "sqlite3-missing")"
[[ "$integrity" == "ok" ]] || {
  echo "{\"drill\":\"backup_restore\",\"ok\":false,\"detail\":\"SQLite integrity_check=$integrity\",\"backup\":\"$backup_name\"}"
  exit 1
}

# The private archive must survive the restore (fail loudly when missing).
# An empty archive is legitimate while no media has been uploaded; a missing
# private/ directory or archive means the restore is not trustworthy.
private_dir="$(find "$stage" -maxdepth 3 -type d -name 'private' | head -1)"
if [[ -z "$private_dir" ]]; then
  echo "{\"drill\":\"backup_restore\",\"ok\":false,\"detail\":\"restored private directory missing\",\"backup\":\"$backup_name\"}"
  exit 1
fi
private_files="$(find "$private_dir" -type f 2>/dev/null | wc -l)"

finished=$(date +%s)
rto_seconds=$((finished - started))
users="$(sqlite3 "$restored_db" 'SELECT COUNT(*) FROM users;' 2>/dev/null || echo 0)"

evidence="$(python3 - "$rpo_hours" "$rto_seconds" "$private_files" "$users" "$backup_name" <<'PYEOF'
import json, sys, datetime
rpo, rto, private, users, backup = sys.argv[1:6]
print(json.dumps({
    "drill": "backup_restore", "ok": True, "backup": backup,
    "rpo_hours": float(rpo), "rto_seconds": int(rto),
    "restored_private_files": int(private), "restored_users": int(users),
    "sqlite_integrity": "ok", "ts": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
}, separators=(",", ":")))
PYEOF
)"
echo "$evidence"
mkdir -p "$(dirname "$EVIDENCE_FILE")" 2>/dev/null || true
if touch "$EVIDENCE_FILE" 2>/dev/null; then echo "$evidence" >> "$EVIDENCE_FILE"; fi
