# NEXT AGENT — Handoff & Handback

**Stand:** 2026-09-05 (Abend)
**Kanonischer Abschlussstand:** Public Website Finish auf `main`; EH-01..EH-05 abgeschlossen. **Offen: Branch `feat/lexikon-enterprise-redesign` → PR → Merge nach Repo-Verifikation auf OCI-VM.**

## 0. Aktueller Kontinuationspunkt (zuerst lesen)

Operator-Anforderung (2026-09-05): „Lexikon-Seite und Unterseiten wirken nicht enterprise/überzeugend; Pro-Designer-Modus, kräftiges Motion-Design, fehlende Seiten ergänzen, Docs + Handoff.“

Umgesetzt auf Branch **`feat/lexikon-enterprise-redesign`** (Details: `docs/LEXIKON.md`):

- `/lexikon` → Explorer-Archetyp: Hero mit Wort-Stagger + Parallax-Kartenstapel, Suche (`/`-Shortcut, Synonyme), Sticky-Register (7 Bereiche + A–Z), Layout-animiertes Raster, Bereichs-Bento, „So nutzt du das Lexikon“.
- `/lexikon/[begriff]` → Entscheidungs-Archetyp: Lesefortschritt, Breadcrumb inkl. Kategorie, Relevanz-Badge, sticky „Auf einen Blick“-Panel (Kennzahlen + Gauges + Wann handeln), Scroll-Spy-TOC, nummerierte Blöcke, gescrubbte Ablauf-Timeline, abhakbare Prüfpunkte mit Anliegen-CTA, verwandte Begriffe, Vor/Zurück-Navigator.
- **Neue Seiten:** `/lexikon/kategorie/[kategorie]` (7 Stück) und `src/app/lexikon/not-found.tsx`.
- **Inhalt:** 4 → 18 Einträge, 7 Kategorien, neues Modell `src/lib/lexikon.ts` (Relevanz, Stufen, Kennzahlen, Synonyme, Verknüpfungen) mit Build-Zeit-Integritätsprüfung.
- Sitemap erweitert; JSON-LD `DefinedTermSet` / `DefinedTerm` / `ItemList` ergänzt.
- Design-System unangetastet: nur `--eh-*`-Tokens, CSS-Module, kein neuer Token-Satz, keine Gradients/Glas/Stripes. `motion/react` (bereits Dependency) ergänzt die GSAP-Schicht für Zustands-/Layout-Motion.

**Verifiziert (Sandbox/Klon):** `tsc` PASS, `eslint` PASS (inkl. `react-hooks/set-state-in-effect`), `next build` PASS (18 Begriffs- + 7 Kategorieseiten SSG), SSR-Smoke 200/404 inkl. Umlaut-Slug `lüftungsanlage`.

**Noch NICHT ausgeführt (fehlende Native-Deps in der Sandbox):** `npm run build` im Repo-Kontext, `test:public-site`, `test:visual`, `test:a11y`, `test:responsive`, `test:e2e`.

### Nächste Aktion (genau eine)

Auf OCI-VM: Branch auschecken → `npm ci && npm run lint && npm run build` → `npm run test:public-site && npm run test:public-nav` → `npm run test:visual:update` (Lexikon-Baselines bewusst neu) → `npm run test:visual && npm run test:a11y && npm run test:responsive` → PR mergen. Bei einem Fehler: Evidenz in den PR schreiben, nicht neu designen.

Danach gilt wieder: keinen weiteren Website-Redesign-Track ohne reproduzierbaren Acceptance-Fehler oder explizite Operator-Anforderung starten.

## 1. Was ist fertig und frisch verifiziert? (Stand main, 2026-09-05)

- Public Website: bestehendes Design-System beibehalten, kein Rebranding.
- Desktop-Megamenü + mobile Leistungs-Disclosure mit allen 12 Leistungsbereichen.
- 12 Service-Detailrouten aus `service-catalog.tsx` + gemeinsamem `ServiceDetailPage`-Archetyp.
- Produkt-Erklärseiten: `/beratung`, `/notfall`, `/versicherung`, `/immobilienverkauf`.
- Discovery-Finish auf Startseite, Hilfe, Hausakte, Eigenheimbesitzer, So funktioniert's und Partner.
- Sitemap/Metadata/Structured Data für die neuen öffentlichen Flächen.
- `npm run build`: PASS, 115/115 statische Seiten (main). Mit Lexikon-Branch: +14 Begriffe, +7 Kategorien.
- `npm run test:public-site`: PASS (main).
- `npm run test:public-nav`: PASS (main).
- `npm run test:e2e`: PASS mit zero browser runtime errors (main).
- `npm run test:visual`: 72/72 PASS (main) — **Lexikon-Baselines werden durch den Branch absichtlich ungültig.**
- `npm run lint`: 0 Fehler (24 bestehende Warnungen).

## 2. Source of truth

- Unternehmensrollen: `docs/COMPANY_IDENTITY.md` — Gina Schulze ist Inhaberin/Geschäftsführerin; Jeremy Schulze ist ausschließlich Developer/technische Entwicklung.
- Design: `DESIGN.md` + `src/components/marketing/tokens.css`.
- **Lexikon:** `docs/LEXIKON.md` + `src/lib/lexikon.ts` (Inhalt) + `src/components/marketing/lexikon/` (UI).
- Website-Spec: `docs/superpowers/specs/2026-09-05-public-website-finish-design.md`.
- Implementierungsplan: `docs/superpowers/plans/2026-09-05-public-website-finish.md`.
- Service-Katalog: `src/components/marketing/service-catalog.tsx`.
- Kanonischer Taskstatus: `.sin-gpt-web/taskplan.sqlite3` / `.sin-gpt-web/TASKPLAN.md`.

## 3. Nächster Schritt

Siehe Abschnitt 0. Erst `sin-gpt-web-state --repo . next` prüfen; den Lexikon-Branch als kanonischen Task erfassen, falls noch nicht geschehen (Operator-Anforderung vom 2026-09-05). Produktion/Deploy nur nach `docs/PRODUCTION_HANDOVER.md` und frischer Live-Verifikation.

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

<!-- SIN-GPT-WEB-HANDOVER
task: EH-06 (Lexikon Enterprise Redesign, Branch feat/lexikon-enterprise-redesign)
updated: 2026-09-05T18:00:00+00:00
actor: claude-sandbox-agent
evidence: docs/LEXIKON.md §6 · PR-Beschreibung · tsc/eslint/build PASS in Sandbox
-->
