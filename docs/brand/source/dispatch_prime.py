#!/usr/bin/env python3
"""Launch the exact requested worker on its own supported daemon socket."""
from pathlib import Path
import datetime
import json
import os
import subprocess

ROOT = Path(__file__).resolve().parents[3]
PRIVATE = Path("/home/ubuntu/.local/share/eh-brand-prime-20260906")
RUNTIME_PATH = "/home/ubuntu/.nvm/versions/node/v22.23.0/bin:/home/ubuntu/.local/bin:/usr/local/bin:/usr/bin:/bin"

def main():
    PRIVATE.mkdir(mode=0o700, parents=True, exist_ok=True)
    sessions = PRIVATE / "sessions"
    sessions.mkdir(mode=0o700, exist_ok=True)
    if any(sessions.iterdir()):
        raise RuntimeError("Existing saved session: inspect and resume exact session instead of creating another.")
    previous = PRIVATE / "launch.json"
    if previous.exists():
        old = json.loads(previous.read_text())
        process = Path("/proc") / str(old["pid"]) / "cmdline"
        if process.exists() and "prime-agent" in process.read_text(errors="replace"):
            raise RuntimeError("Previous worker process still alive; inspect instead of duplicating.")
    environment = os.environ.copy()
    environment["PATH"] = RUNTIME_PATH
    socket = PRIVATE / "daemon.sock"
    prompt = (
        "Execute the attached complete EH-BRAND handoff and source package now. "
        "Exact worker: bai/glm-5.3-flash on sinsupabase; no model substitution or extra agents. "
        "Tasks EH-BRAND-01 and EH-BRAND-02 are yours; canonical CLI repo /home/ubuntu/dev/einfach-hausen. "
        "Issue #39 already exists. Apply complete sources, verify 27 study screenshots and local interactions, "
        "persist Brain/OpenViking/Honcho through the established interfaces with real receipts and readback, "
        "append handoffs, update task/issue evidence, commit and push only this own branch and create a DRAFT PR. "
        "Never mark an unavailable or stub memory write successful; record blocked persistence precisely, "
        "but finish independent study/code/docs work. No merge/deploy or unselected production rebrand. "
        "Read the full spec in the source packet and baseline snapshot where needed; all information is local. "
        "Use Node22 PATH and existing read-only Chromium/playwright dependencies or your isolated install. "
        "Write docs/brand/evidence/WORKER_REPORT.md and persistence.json with actual provider/model/session, "
        "test commands/exits, receipt/readback IDs, issue/PR URL, own commit and exact next action. "
        "If code fixes are needed, synchronize implementation.json and regenerate complete source blocks/packet. "
        "The initial root controller launch failed before session creation due to default-daemon ownership; "
        "this launch uses the supported isolated --daemon-socket. Do not touch existing daemons or other agents."
    )
    args = [
        "prime-agent", "--print", "--mode", "json", "--provider", "bai", "--model", "glm-5.3-flash",
        "--thinking", "high", "--cwd", str(ROOT), "--session-dir", str(sessions),
        "--daemon-socket", str(socket), "--autonomous", "--autonomous-max-continuations", "3",
        "--autonomous-max-turns", "60", "--autonomous-max-tokens", "150000",
        "--autonomous-timeout-ms", "1800000",
        "@" + str(ROOT / "docs/brand/HANDOFF.md"),
        "@" + str(ROOT / "docs/brand/SOURCE_PACKET.md"), prompt
    ]
    log = PRIVATE / "prime-isolated-events.jsonl"
    with log.open("ab", buffering=0) as stream:
        worker = subprocess.Popen(args, cwd=ROOT, env=environment, stdin=subprocess.DEVNULL,
                                  stdout=stream, stderr=stream, start_new_session=True)
    record = {
        "host": "sinsupabase", "provider": "bai", "model": "glm-5.3-flash",
        "workspace": str(ROOT), "pid": worker.pid, "daemon_socket": str(socket),
        "session_dir": str(sessions), "private_log": str(log),
        "started_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "issue": "https://github.com/Delqhi/einfach-hausen/issues/39",
        "state": "process_started_not_yet_verified",
        "prior_failure": "Default daemon ownership conflict; no session created; existing services preserved."
    }
    (ROOT / "docs/brand/evidence/delegation.json").write_text(json.dumps(record, indent=2) + "\n")
    previous.write_text(json.dumps(record, indent=2) + "\n")
    print(json.dumps(record))

if __name__ == "__main__":
    main()
