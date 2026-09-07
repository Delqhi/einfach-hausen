#!/usr/bin/env python3
"""Export exact full text and hashes; self-generated container is excluded."""
from pathlib import Path
import hashlib
import json
import re
ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "docs/brand/source/implementation.json"
PACKET = ROOT / "docs/brand/SOURCE_PACKET.md"
MANIFEST = ROOT / "docs/brand/source/manifest.json"
def digest(data):
    return hashlib.sha256(data).hexdigest()
def main():
    payload = json.loads(SOURCE.read_text())
    primary = set(payload["files"])
    primary.update([
        "docs/superpowers/specs/2026-09-06-einfachhausen-brand-system-design.md",
        "docs/superpowers/plans/2026-09-06-einfachhausen-brand-system.md",
        "docs/brand/HANDOFF.md", "docs/brand/ISSUE_BODY.md",
        "docs/brand/source/apply_package.py", "docs/brand/source/export_packet.py"
    ])
    for target in (ROOT / "docs/brand/evidence").glob("*"):
        if target.suffix in (".json", ".md"):
            primary.add(str(target.relative_to(ROOT)))
    records = []
    blocks = [
        "# Complete EH-BRAND source packet\n",
        "All primary new/modified text files of the current executable wave are included in full below. "
        "The packet, its manifest, BASE_SNAPSHOT.md and machine-readable transport JSON are derived containers, "
        "excluded from recursive self-embedding. Their exact generating recipes are included. "
        "Unchanged relevant sources are fully archived in source/BASE_SNAPSHOT.md; binary assets are hashed there. "
        "Current production-migration follow-ups require the recorded visual direction decision.\n",
        "Base commit: " + payload["base"] + "\n"
    ]
    for relative in sorted(primary):
        target = ROOT / relative
        pending = payload["files"].get(relative)
        before = payload.get("before_sha256", {}).get(relative)
        if pending is not None and (not target.exists() or (before and digest(target.read_bytes()) == before)):
            text = pending
        else:
            text = target.read_text()
        raw = text.encode("utf-8")
        sha = digest(raw)
        records.append({"path": relative, "sha256": sha, "bytes": len(raw)})
        language = {".html":"html", ".css":"css", ".js":"javascript", ".mjs":"javascript", ".py":"python", ".json":"json", ".md":"markdown"}.get(target.suffix, "text")
        fence = chr(96) * max(4, max([len(x) for x in re.findall(chr(96) + "+", text)] + [0]) + 1)
        blocks.extend(["\n## " + relative + "\n", "SHA256: " + sha + "\n",
                       fence + language + "\n" + text + ("" if text.endswith("\n") else "\n") + fence + "\n"])
    PACKET.write_text("\n".join(blocks))
    MANIFEST.write_text(json.dumps({"base":payload["base"],"files":records,"packet_sha256":digest(PACKET.read_bytes())}, indent=2) + "\n")
    print(json.dumps({"files":len(records),"packet_bytes":PACKET.stat().st_size,"packet_sha256":digest(PACKET.read_bytes())}))
if __name__ == "__main__":
    main()
