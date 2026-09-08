# EXTERNAL-BLOCKERS — Stand 2026-09-08 (Welle 4420880 deployed)

## Verbleibende externe Gates

1. **GitHub-Actions-Billing** auf Konto `Delqhi` (nur Jerry) — alle Runs seit 2026-09-06 ohne Steps failed (Issue #33). Blockiert: CI auf einfach-hausen, T-0151-CI-Teil. **Danach:** `gh run rerun` der offenen Checks.
2. **CRM Cloudflare-Produktions-Push** — `npm run cf:dry-run` PASS, `npm run cf:deploy` ist der produktive Push (Operator/ChatGPT web).

## Bereits erledigt (diese Welle)

- **Production-Deploy 4420880:** einfach-hausen auf `4fd6097`, portalhub auf `d0de1e8` — health ready, alle Dienste aktiv.
- **Taskplan konvergiert:** 130 done, 0 offen — alle vier EH-BRAND-05-Teilflächen (WEB/APPS/CRM/HUB) + EH-BRAND-06 Regression abgeschlossen.
- **Dispatcher-Hotfix** PR#55: Zustellung + Retention-Sweep in Produktion repariert.
- **Data-Inventory** PR#67: crm-d1-System-Scope für Production-DB-Kompatibilität.

## Detaillierte Evidenz

Vollständige Task-Records: `sin-gpt-web-state show <TASK>`. Gate-Logs: Release-Gate 15/15 auf /srv reproduziert (2026-09-08).