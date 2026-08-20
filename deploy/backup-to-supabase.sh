#!/usr/bin/env bash
set -euo pipefail

DB_PATH="${DATABASE_PATH:-/var/lib/einfach-hausen/einfach-hausen.db}"
SUPABASE_ENV="${SUPABASE_ENV:-/opt/sin-supabase/.env}"
SUPABASE_URL="${SUPABASE_URL:-http://127.0.0.1:8006}"
BUCKET="${BACKUP_BUCKET:-einfach-hausen-backups}"
KEEP_LOCAL_DAYS="${KEEP_LOCAL_DAYS:-7}"
LOCAL_DIR="${LOCAL_BACKUP_DIR:-/var/backups/einfach-hausen}"

if [[ ! -r "$DB_PATH" ]]; then
  echo "Database not readable: $DB_PATH" >&2
  exit 1
fi
if [[ ! -r "$SUPABASE_ENV" ]]; then
  echo "Supabase environment not readable: $SUPABASE_ENV" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$SUPABASE_ENV"
set +a
: "${SERVICE_ROLE_KEY:?SERVICE_ROLE_KEY missing from Supabase environment}"

install -d -m 0750 "$LOCAL_DIR"
ts="$(date -u +%Y%m%dT%H%M%SZ)"
out="$LOCAL_DIR/einfach-hausen-$ts.db"

python3 - "$DB_PATH" "$out" <<'PY'
import sqlite3, sys
src, dst = sys.argv[1], sys.argv[2]
source = sqlite3.connect(f"file:{src}?mode=ro", uri=True)
target = sqlite3.connect(dst)
with target:
    source.backup(target)
target.close()
source.close()
PY
chmod 0640 "$out"

curl -fsS -X POST "$SUPABASE_URL/storage/v1/object/$BUCKET/$(basename "$out")"   -H "apikey: $SERVICE_ROLE_KEY"   -H "Authorization: Bearer $SERVICE_ROLE_KEY"   -H "Content-Type: application/octet-stream"   -H "x-upsert: true"   --data-binary "@$out" >/dev/null

find "$LOCAL_DIR" -type f -name 'einfach-hausen-*.db' -mtime "+$KEEP_LOCAL_DAYS" -delete
printf 'Backup uploaded: %s
' "$(basename "$out")"
