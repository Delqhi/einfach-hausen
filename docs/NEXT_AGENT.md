# NEXT AGENT — Start here

**Status 2026-09-02 ~00:00 UTC · main = 2eb24a7 · T-0210 in_progress auf Design-Branch**

## GENAU EINE nächste Aktion

**T-0210 Premium Consumer Redesign V1 dem Operator zur visuellen Freigabe vorlegen und nach Freigabe mergen.**

Konkret:
1. Operator die Screenshots zeigen (`/tmp/premium-desktop-scrolled.png`, `/tmp/premium-mobile-scrolled.png`) oder live: Branch `design/premium-consumer-v1` (0482052) in Worktree `/home/ubuntu/dev/eh-premium-redesign`, `npm start` dort.
2. Bei Freigabe: fast-forward merge nach main, `bash deploy/update-on-oci.sh`, Smoke 17/17, `sin-gpt-web-state complete T-0210`, render+validate, Handover-Blöcke.
3. Bei Änderungswünschen: im Worktree nacharbeiten (Spec §9 bleibt Vertrag), neue Gates, erneut vorlegen.

## Kontext
- Redesign V1 KOMPLETT implementiert auf `design/premium-consumer-v1` (0482052): Assets e7a5be9 (FLUX.2-klein-4b via OmniRoute Route `vag/bfl/flux-2-klein-4b` — free, 429-Rate-Limits via Retry, 6 Bilder q78), Homepage nach Spec §9, `premium.module.css` Namespace, e2e-Assertions an neue Copy angepasst (0482052).
- Gates im Worktree: lint 0 errors, build OK, fullflow e2e **ok:true**, Screenshots Desktop 1440 + Mobile 390 verifiziert.
- **main ist unangetastet** (2eb24a7) — Rollback-Vertrag aktiv bis Operator-Freigabe.
- Worktree-Setup: `node_modules` ist echte Kopie (Turbopack lehnt Root-Symlinks ab).
- T-0120 (Security-Suiten) bleibt geparkt hinter T-0210.
