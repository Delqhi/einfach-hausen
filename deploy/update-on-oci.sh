#!/usr/bin/env bash
set -euo pipefail

NODE_BIN_DIR="${NODE_BIN_DIR:-/home/ubuntu/.nvm/versions/node/v22.23.0/bin}"
if [[ -d "$NODE_BIN_DIR" ]]; then
  export PATH="$NODE_BIN_DIR:$PATH"
fi

APP_DIR="${APP_DIR:-/srv/einfach-hausen}"
SERVICE="${SERVICE:-einfach-hausen.service}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3010/api/health}"

cd "$APP_DIR"
git fetch origin main
git checkout main
git reset --hard origin/main
npm ci
npm run build
sudo systemctl restart "$SERVICE"

for _ in $(seq 1 30); do
  if curl -fsS "$HEALTH_URL" >/dev/null; then
    echo "Einfach Hausen deployment healthy."
    exit 0
  fi
  sleep 1
done

echo "Health check failed after deployment." >&2
sudo journalctl -u "$SERVICE" -n 80 --no-pager >&2
exit 1
