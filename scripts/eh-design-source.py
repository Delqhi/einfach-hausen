"""Export a committed delivery, never another agent's working files."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("--root", required=True)
parser.add_argument("--base", required=True)
parser.add_argument("--ref", default="HEAD", help="Committed delivery to export (default HEAD)")
parser.add_argument("--out", default="docs/brand/system")
args = parser.parse_args()
root = Path(args.root).resolve()
out = (root / args.out).resolve()
if not out.is_relative_to(root) or out == root:
    parser.error("--out must be a subdirectory of the repository")

def git(*argv):
    return subprocess.check_output(["git", *argv], cwd=root)

base = git("rev-parse", "--verify", args.base + "^{commit}").decode().strip()
head = git("rev-parse", "--verify", args.ref + "^{commit}").decode().strip()
paths = sorted(filter(None, git("diff", "--no-renames", "--name-only", "-z", base, head, "--").decode().split("\0")))
excluded = {(out / name).relative_to(root).as_posix() for name in ("SOURCE.md", "source-manifest.json")}
body = ["# Vollständige Quelldateien der Lieferung", "",
        f"Basiscommit: {base}. Implementierungscommit: {head}.",
        "Ausschließlich versionierte Dateien dieses Commits. Änderungen im Arbeitsverzeichnis und unversionierte Dateien werden niemals übernommen.",
        "Textdateien stehen vollständig in Codeblöcken; Binärdateien im Manifest mit SHA256. Gelöschte Dateien sind gesondert ausgewiesen.", ""]
manifest = {"base": base, "implementationCommit": head, "files": {}, "deleted": [], "symlinks": {}}
for rel in paths:
    if rel in excluded:
        continue
    entry = git("ls-tree", "-z", head, "--", rel)
    if not entry:
        manifest["deleted"].append(rel)
        continue
    mode = entry.split(b" ", 1)[0]
    if mode == b"160000":
        raise SystemExit("Submodule requires separate handoff: " + rel)
    data = git("show", head + ":" + rel)
    if mode == b"120000":
        manifest["symlinks"][rel] = data.decode()
        continue
    item = {"sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}
    try:
        text = data.decode("utf-8")
        is_text = "\0" not in text
    except UnicodeDecodeError:
        is_text = False
    item["kind"] = "text" if is_text else "binary"
    manifest["files"][rel] = item
    if is_text:
        fence = "`" * max(5, max((len(run) for run in re.findall(r"`+", text)), default=0) + 1)
        lang = {".tsx": "tsx", ".ts": "ts", ".mjs": "js", ".js": "js",
                ".css": "css", ".json": "json", ".py": "python",
                ".yml": "yaml", ".md": "markdown", ".html": "html"}.get(Path(rel).suffix, "text")
        body.extend(["## " + rel, "", fence + lang, text, fence, ""])
out.mkdir(parents=True, exist_ok=True)
(out / "SOURCE.md").write_text("\n".join(body))
(out / "source-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print("EH_SOURCE_COMPLETE", len(manifest["files"]), head)
