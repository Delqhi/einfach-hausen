# EXTERNAL-BLOCKERS — Stand 2026-09-07 (Prime Agent, Welle abgeschlossen)

Nur noch vier offene Tasks. Alle vier hängen an externen Autoritäten; keine kann ein Agent selbst lösen.

## 1. GitHub-Actions-Billing auf Konto `Delqhi` → blockiert T-0151 (CI-Teil)
- **Wer muss handeln:** Jerry (Kontoinhaber).
- **Beleg:** Alle Runs auf `Delqhi/einfach-hausen` scheitern seit 2026-09-06 ~20:01 UTC mit 0 Steps / ~2s / ohne Logs; Gegenprobe `einfachhausen-de/portalhub` läuft grün. Issue #33 (Kommentar 15:20 UTC).
- **Danach:** `gh run rerun` auf offenen PRs (#53/#54 sind fachlich fertig und lokal grün), T-0151 entblocken.

## 2. EH-BRAND-05-CRM → blockiert EH-BRAND-05 und EH-BRAND-06
- **Wer muss handeln:** ChatGPT web (exklusive Aufgabe laut Wellen-Split) — blockiert auf Mac-i9-Remote-Zugang.
- **Achtung:** CRM-Worktree `/home/ubuntu/orca/workspaces/einfach-hausen-crm-brand-20260906` enthält **unveröffentlichte Vendor-Sync-Änderungen von ChatGPT web** — nicht überschreiben. Vor Übernahme durch einen lokalen Agenten: Abstimmung mit ChatGPT web bzw. Operator.

## 3. EH-BRAND-05 / EH-BRAND-06
- Rein abhängig: 05 wartet auf CRM, 06 auf 05. Alle lokalen Vorarbeiten sind erledigt (Website, Apps, Hub, CRM-Vorhandene-Flächen unverändert erhalten).
- EH-BRAND-06 braucht zusätzlich: Browser-Regression (läuft jetzt auf OCI — Chromium 151 via playwright-core installiert), CI-Freiheit (Punkt 1) und CRM (Punkt 2).

## Erledigt in dieser Welle (Kontext)
Dispatcher-Hotfix PR#55 (Produktion läuft), T-0133 PR#57, T-0139 PR#58, T-0146 PR#59, EH-BRAND-05-HUB (portalhub PR#1 inkl. echter visueller 390/736/1440-Abnahme), EH-BRAND-05-WEB, Docs PR#56/#60. Vollständige Evidenz im Taskplan (`sin-gpt-web-state show <TASK>`).
