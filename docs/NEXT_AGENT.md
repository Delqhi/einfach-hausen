# NEXT AGENT — Handoff & Handback

**Stand:** 2026-09-05
**Kanonischer Abschlussstand:** Public Website Finish auf `main`; EH-01..EH-04 sind die aktuelle `eh-finish`-Kette.

## 1. Was ist fertig und frisch verifiziert?

- Public Website: bestehendes Design-System beibehalten, kein Rebranding.
- Desktop-Megamenü + mobile Leistungs-Disclosure mit allen 12 Leistungsbereichen.
- 12 Service-Detailrouten aus `service-catalog.tsx` + gemeinsamem `ServiceDetailPage`-Archetyp.
- Produkt-Erklärseiten: `/beratung`, `/notfall`, `/versicherung`, `/immobilienverkauf`.
- Discovery-Finish auf Startseite, Hilfe, Hausakte, Eigenheimbesitzer, So funktioniert's und Partner.
- Sitemap/Metadata/Structured Data für die neuen öffentlichen Flächen.
- `npm run build`: PASS, 115/115 statische Seiten.
- `npm run test:public-site`: PASS.
- `npm run test:public-nav`: PASS (Megamenü, Keyboard, Mobile, Deep-Links, kein 390-px-Overflow).
- `npm run test:e2e`: PASS mit zero browser runtime errors.
- `npm run test:visual`: **72/72 PASS** über 390 / Tablet / 1320.
- `npm run lint`: 0 Fehler (24 bestehende Warnungen).

## 2. Source of truth

- Unternehmensrollen: `docs/COMPANY_IDENTITY.md` — Gina Schulze ist Inhaberin/Geschäftsführerin; Jeremy Schulze ist ausschließlich Developer/technische Entwicklung.
- Design: `DESIGN.md` + `src/components/marketing/tokens.css`.
- Website-Spec: `docs/superpowers/specs/2026-09-05-public-website-finish-design.md`.
- Implementierungsplan: `docs/superpowers/plans/2026-09-05-public-website-finish.md`.
- Service-Katalog: `src/components/marketing/service-catalog.tsx`.
- Kanonischer Taskstatus: `.sin-gpt-web/taskplan.sqlite3` / `.sin-gpt-web/TASKPLAN.md`.

## 3. Nächster Schritt

Keinen weiteren Website-Redesign-Track starten. Erst `sin-gpt-web-state --repo . next` prüfen. Neue UI-Arbeit nur aus einem reproduzierbaren Acceptance-Fehler oder einer neuen expliziten Operator-Anforderung ableiten. Produktion/Deploy nur nach `docs/PRODUCTION_HANDOVER.md` und frischer Live-Verifikation.

<!-- SIN-GPT-WEB-HANDOVER
task: EH-01
updated: 2026-09-05T02:00:41+00:00
actor: chatgpt-web
evidence-sha256: 223ddabf850fcb56047dafd0834c4648fe0356286d14630d790002d451660459
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-02
updated: 2026-09-05T02:19:47+00:00
actor: chatgpt-web
evidence-sha256: d3169b9afa465be4ab22588b73903be33178b28010810633f5fb6546dc51f563
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-03
updated: 2026-09-05T04:33:10+00:00
actor: local-agent
evidence-sha256: b9300da9b1e348fc386da08fda11e75c105f6db589d60a0f190ae0af25041437
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-04
updated: 2026-09-05T06:26:03+00:00
actor: chatgpt-web
evidence-sha256: 0bf6db00102a87441e641b95f92d629df17ac5aa3144da80eeb67f83cab48460
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-05
updated: 2026-09-05T09:09:00+00:00
actor: chatgpt-web
evidence-sha256: e072648f313eb7d38b0daa3a917b5f8b9cfbee90f62754f8cef486aa6b258c03
-->
