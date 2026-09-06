# NEXT AGENT — EH-BRAND-05/06 nach freigegebenem 04-Vertrag

Vertrag: `docs/brand/BRAND_CONTRACT.md`. Rezepte: `docs/brand/COMPONENTS.md`. Skill: `docs/brand/SIN-EH-DESIGN-SKILL.md`. Guard: `node scripts/brand-guard.mjs`.

## 05-WEB (Unterseiten)
R1/R2/R5 je Seite, `PageHero`/`LinkButton`-Props unveraendert, Atelier-CSS opt-in:
```css
@import url("../marketing/atelier-signatures.css");
```
Abnahme je Flaeche 390/736/1440 + Tastatur. Kein Token-Rename.

## 05-APPS (Owner/Pro)
Workflows behalten. Statuszeile statt KPI-Kacheln, 1 CTA, Listen, Formulare 16px, kein FAB, kein Dark-Mode. Shell (`logo.tsx`) nur additiv.

## 05-CRM
`/admin/crm` ist RSC — kein HTML-Adapter bauen. Standalone-CRM ist separates Repo (docs/CRM.md). Nur helle Canvas-Angleichung im eingebetteten Admin.

## 05-HUB
Kein React-Hub im Repo gefunden — erst Bestand nachweisen, dann migrieren. Nichts erfinden.

## 06 (Gates)
```bash
node scripts/brand-guard.mjs
npm run lint && npm run build
```
T-0151 + #33 verknuepfen. Baselines nur bei akzeptierter visueller Differenz erneuern. Release nur exakter Review-Commit + Freigabe.

## Praesentation
Primaer #105258, Sekundaer #0a3539, Canvas #faf8f4, Text #10222a, Inter+Fallback, Logo byte-identisch. Nach Capture: pdf/pptx neu bauen, QA laufen lassen.
