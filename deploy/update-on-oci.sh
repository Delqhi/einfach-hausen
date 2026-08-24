#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/srv/einfach-hausen}"
SERVICE="${SERVICE:-einfach-hausen.service}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3010/api/health}"
NODE_BIN_DIR="${NODE_BIN_DIR:-/home/ubuntu/.nvm/versions/node/v22.23.0/bin}"
NODE_BIN="$NODE_BIN_DIR/node"
NPM_BIN="$NODE_BIN_DIR/npm"
PERSIST_ROOT="${PERSIST_ROOT:-/var/lib/einfach-hausen}"
DB_PATH="$PERSIST_ROOT/einfach-hausen.db"
PRIVATE_ROOT="$PERSIST_ROOT/private"
UPLOAD_ROOT="$PERSIST_ROOT/uploads"

for executable in "$NODE_BIN" "$NPM_BIN"; do
  [[ -x "$executable" ]] || { echo "Required Node 22 runtime missing: $executable" >&2; exit 1; }
done
node_major="$($NODE_BIN -p 'process.versions.node.split(".")[0]')"
[[ "$node_major" == "22" ]] || { echo "Deployment requires Node 22; found major $node_major" >&2; exit 1; }

# npm itself uses `#!/usr/bin/env node`; prepend the validated Node 22 runtime so
# npm lifecycle scripts and Next.js workers cannot fall back to /usr/bin/node.
export PATH="$NODE_BIN_DIR:$PATH"
[[ "$(node -p 'process.versions.node.split(".")[0]')" == "22" ]] || {
  echo 'Failed to activate Node 22 for the deployment process.' >&2
  exit 1
}

cd "$APP_DIR"
[[ "$(git branch --show-current)" == "main" ]] || { echo 'Deployment requires the main branch.' >&2; exit 1; }

validate_runtime_path() {
  local path="$1"
  local expected_target="$2"

  if [[ -L "$path" ]]; then
    [[ "$(readlink "$path")" == "$expected_target" ]] || {
      echo "Refusing unexpected runtime symlink: $path" >&2
      exit 1
    }
  elif [[ -e "$path" && ! -d "$path" ]]; then
    echo "Refusing unexpected runtime path type: $path" >&2
    exit 1
  fi
}

validate_runtime_path "$APP_DIR/data/private" "$PRIVATE_ROOT"
validate_runtime_path "$APP_DIR/public/uploads" "$UPLOAD_ROOT"

# Runtime media predates the persistent-storage migration on some hosts. Allow
# only these two known untracked paths (or their legacy directory contents);
# every tracked change and every other untracked path still blocks deployment.
dirty_status="$(git status --porcelain --untracked-files=all | while IFS= read -r line; do
  if [[ "$line" == "?? data/private" || "$line" == "?? public/uploads" ||
        "$line" == "?? data/private/"* || "$line" == "?? public/uploads/"* ]]; then
    continue
  fi
  printf '%s\n' "$line"
done)"
[[ -z "$dirty_status" ]] || {
  echo 'Refusing deployment from a dirty working tree.' >&2
  printf '%s\n' "$dirty_status" >&2
  exit 1
}

sudo install -d -o ubuntu -g ubuntu -m 0750 "$PERSIST_ROOT" "$PRIVATE_ROOT" "$UPLOAD_ROOT" /var/backups/einfach-hausen

# One-time migration into persistent storage is copy-only. Existing persistent
# files win; nothing in /var/lib is deleted or overwritten here.
if [[ -d "$APP_DIR/data/private" ]]; then
  sudo rsync -a --ignore-existing --chown=ubuntu:ubuntu "$APP_DIR/data/private/" "$PRIVATE_ROOT/"
fi
if [[ -d "$APP_DIR/public/uploads" ]]; then
  sudo rsync -a --ignore-existing --chown=ubuntu:ubuntu "$APP_DIR/public/uploads/" "$UPLOAD_ROOT/"
fi

if [[ -r "$DB_PATH" ]]; then
  sudo DATABASE_PATH="$DB_PATH" PRIVATE_ROOT="$PRIVATE_ROOT" UPLOAD_ROOT="$UPLOAD_ROOT" \
    BACKUP_ROOT=/var/backups/einfach-hausen "$APP_DIR/scripts/backup-einfach-hausen.sh" >/dev/null
fi

git fetch origin main
git merge --ff-only origin/main
"$NPM_BIN" ci
BUILD_DATABASE_PATH="${BUILD_DATABASE_PATH:-/tmp/einfach-hausen-build-$$.db}"
DATABASE_PATH="$BUILD_DATABASE_PATH" "$NPM_BIN" run build
if [[ "$BUILD_DATABASE_PATH" == /tmp/einfach-hausen-build-* ]]; then
  rm -f "$BUILD_DATABASE_PATH" "$BUILD_DATABASE_PATH-wal" "$BUILD_DATABASE_PATH-shm"
fi
sudo systemctl daemon-reload
sudo systemctl restart "$SERVICE"

for _ in $(seq 1 30); do
  if curl -fsS "$HEALTH_URL" >/dev/null; then
    echo "Einfach Hausen deployment healthy on Node $($NODE_BIN --version)."
    exit 0
  fi
  sleep 1
done

echo "Health check failed after deployment." >&2
sudo journalctl -u "$SERVICE" -n 80 --no-pager >&2
exit 1
