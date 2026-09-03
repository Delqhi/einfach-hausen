#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: restore-einfach-hausen.sh BACKUP_DIR [--dry-run | --stage TARGET_DIR]

--dry-run       Verify checksums, SQLite integrity and private/upload archives in a temporary directory. This is the default.
--stage DIR     Verify and extract into a new, empty staging directory. Existing files are never overwritten.
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 2
fi

backup_dir="$1"
shift
mode="dry-run"
stage_target=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      mode="dry-run"
      ;;
    --stage)
      shift
      [[ $# -gt 0 ]] || { usage; exit 2; }
      mode="stage"
      stage_target="$1"
      ;;
    *)
      usage
      exit 2
      ;;
  esac
  shift
done

manifest="$backup_dir/manifest.json"
[[ -r "$manifest" ]] || { echo "Backup manifest is not readable: $manifest" >&2; exit 1; }

if [[ "$mode" == "dry-run" ]]; then
  work="$(mktemp -d "${TMPDIR:-/tmp}/einfach-hausen-restore.XXXXXX")"
  cleanup() { rm -rf "$work"; }
  trap cleanup EXIT
else
  [[ -n "$stage_target" ]] || { usage; exit 2; }
  if [[ -e "$stage_target" ]]; then
    if [[ ! -d "$stage_target" || -n "$(find "$stage_target" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
      echo "Stage target must not exist or must be empty; refusing to overwrite: $stage_target" >&2
      exit 1
    fi
  else
    mkdir -p "$stage_target"
  fi
  work="$stage_target"
fi

python3 - "$backup_dir" "$manifest" <<'PY'
import hashlib
import json
from pathlib import Path
import sys

backup_dir = Path(sys.argv[1]).resolve()
manifest_path = Path(sys.argv[2])
data = json.loads(manifest_path.read_text(encoding="utf-8"))
if data.get("format") != 1:
    raise SystemExit("unsupported backup format")
for name in ("einfach-hausen.db", "private.tar", "uploads.tar"):
    meta = data.get("payloads", {}).get(name)
    if not isinstance(meta, dict) or not meta.get("sha256"):
        raise SystemExit(f"missing checksum for {name}")
    p = (backup_dir / name).resolve()
    if p.parent != backup_dir or not p.is_file():
        raise SystemExit(f"missing backup payload: {name}")
    digest = hashlib.sha256()
    with p.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    if digest.hexdigest() != meta["sha256"]:
        raise SystemExit(f"checksum mismatch: {name}")
    if p.stat().st_size != int(meta.get("bytes", -1)):
        raise SystemExit(f"size mismatch: {name}")
PY

mkdir -p "$work/private" "$work/uploads"
cp "$backup_dir/einfach-hausen.db" "$work/einfach-hausen.db"
tar -C "$work/private" -xf "$backup_dir/private.tar"
tar -C "$work/uploads" -xf "$backup_dir/uploads.tar"

python3 - "$work" "$manifest" <<'PY'
import json
from pathlib import Path
import sqlite3
import sys

work = Path(sys.argv[1])
manifest = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
conn = sqlite3.connect(f"file:{work / 'einfach-hausen.db'}?mode=ro", uri=True)
try:
    result = conn.execute("PRAGMA integrity_check").fetchone()
finally:
    conn.close()
if not result or result[0] != "ok":
    raise SystemExit(f"restore integrity_check failed: {result!r}")

def count_files(root: Path) -> int:
    return sum(1 for p in root.rglob('*') if p.is_file())

actual_private = count_files(work / "private")
actual_uploads = count_files(work / "uploads")
if actual_private != int(manifest.get("private_file_count", -1)):
    raise SystemExit(f"private file count mismatch: expected {manifest.get('private_file_count')}, got {actual_private}")
if actual_uploads != int(manifest.get("upload_file_count", -1)):
    raise SystemExit(f"upload file count mismatch: expected {manifest.get('upload_file_count')}, got {actual_uploads}")
PY

if [[ "$mode" == "dry-run" ]]; then
  echo "Restore dry-run OK: checksums, SQLite integrity_check, private files and uploads verified."
else
  echo "Restore staging OK: verified data extracted without overwriting production."
  printf '%s\n' "$work"
fi
