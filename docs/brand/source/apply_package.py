#!/usr/bin/env python3
"""Apply complete EH-BRAND target sources without overwriting conflicting work."""
from pathlib import Path
import hashlib
import json
import subprocess
ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "docs/brand/source/implementation.json"
def digest(data):
    return hashlib.sha256(data).hexdigest()
def main():
    payload = json.loads(SOURCE.read_text())
    subprocess.run(["git", "-C", str(ROOT), "merge-base", "--is-ancestor", payload["base"], "HEAD"], check=True)
    expected = payload.get("before_sha256", {})
    operations = []
    for relative, content in payload["files"].items():
        target = (ROOT / relative).resolve()
        if not target.is_relative_to(ROOT) or target == ROOT:
            raise RuntimeError("Unsafe target path: " + relative)
        encoded = content.encode("utf-8")
        if target.exists():
            current = target.read_bytes()
            if current == encoded:
                continue
            if relative not in expected or digest(current) != expected[relative]:
                raise RuntimeError("Conflicting existing file, preserved: " + relative)
        elif relative in expected:
            raise RuntimeError("Expected baseline file is missing: " + relative)
        operations.append((relative, target, encoded))
    for relative, target, encoded in operations:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(encoded)
        print(json.dumps({"written": relative, "sha256": digest(encoded)}))
if __name__ == "__main__":
    main()
