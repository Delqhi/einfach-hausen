#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/einfach-hausen}"
DB_PATH="${DATABASE_PATH:-/var/lib/einfach-hausen/einfach-hausen.db}"
PRIVATE_ROOT="${PRIVATE_ROOT:-/var/lib/einfach-hausen/private}"
UPLOAD_ROOT="${UPLOAD_ROOT:-/var/lib/einfach-hausen/uploads}"
SUPABASE_ENV="${SUPABASE_ENV:-/opt/sin-supabase/.env}"
SUPABASE_URL="${SUPABASE_URL:-http://127.0.0.1:8006}"
BUCKET="${BACKUP_BUCKET:-einfach-hausen-backups}"
KEEP_LOCAL_DAYS="${KEEP_LOCAL_DAYS:-7}"
LOCAL_DIR="${LOCAL_BACKUP_DIR:-/var/backups/einfach-hausen}"

[[ -x "$APP_DIR/scripts/backup-einfach-hausen.sh" ]] || { echo 'Canonical backup script is missing or not executable.' >&2; exit 1; }
[[ -r "$SUPABASE_ENV" ]] || { echo 'Supabase environment is not readable.' >&2; exit 1; }

set -a
# shellcheck disable=SC1090
source "$SUPABASE_ENV"
set +a
: "${SERVICE_ROLE_KEY:?SERVICE_ROLE_KEY missing from Supabase environment}"

backup_dir="$(DATABASE_PATH="$DB_PATH" PRIVATE_ROOT="$PRIVATE_ROOT" UPLOAD_ROOT="$UPLOAD_ROOT" BACKUP_ROOT="$LOCAL_DIR" "$APP_DIR/scripts/backup-einfach-hausen.sh")"
bundle="$backup_dir.tar.gz"
tar -C "$(dirname "$backup_dir")" -czf "$bundle" "$(basename "$backup_dir")"
chmod 0640 "$bundle"

curl -fsS -X POST "$SUPABASE_URL/storage/v1/object/$BUCKET/$(basename "$bundle")" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/gzip" \
  --data-binary "@$bundle" >/dev/null

find "$LOCAL_DIR" -mindepth 1 -maxdepth 1 -type d -name 'einfach-hausen-*' -mtime "+$KEEP_LOCAL_DAYS" -exec rm -rf -- {} +
find "$LOCAL_DIR" -maxdepth 1 -type f -name 'einfach-hausen-*.tar.gz' -mtime "+$KEEP_LOCAL_DAYS" -delete
printf 'Backup uploaded: %s\n' "$(basename "$bundle")"
