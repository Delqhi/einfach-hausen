# Lexikon — Wissens-Archetyp der öffentlichen Website

**Stand:** 2026-09-05 · **Branch:** `feat/lexikon-enterprise-redesign` · **Routen:** `/lexikon`, `/lexikon/[begriff]`, `/lexikon/kategorie/[kategorie]`

Das Lexikon ist kein Glossar mit Kartenraster mehr, sondern ein **Entscheidungswerkzeug für Eigentümer**: Jeder Begriff beantwortet dieselben vier Fragen (Was ist das? Was kostet es? Wie läuft es ab? Betrifft es mein Haus?) und führt zu einem konkreten nächsten Schritt — *Anliegen beschreiben*. Das entspricht `docs/PRODUCT_POSITIONING.md` („Entscheidungssicherheit erhöhen, mentale Last reduzieren“).

## 1. Architektur

| Datei | Rolle |
| --- | --- |
| `src/lib/seo-cluster.ts` | Unverändert. Hält die vier SEO-Pilot-Einträge (`LEXIKON_TERMS`) und bleibt Ziel bestehender Blog-Querverweise. |
| `src/lib/lexikon.ts` | **Single Source of Truth.** Reichert die Pilot-Einträge an (`ENRICHMENT`), ergänzt 14 neue Einträge, definiert 7 Kategorien und liefert Helper (`getEintrag`, `eintraegeInKategorie`, `verwandteEintraege`, `nachbarn`, `lesezeit`, `assertLexikonIntegrity`). |
| `src/components/marketing/lexikon/lexikon.module.css` | Alle Lexikon-Stile. Ausschließlich `--eh-*`-Tokens, `composes: container from '../mkt.module.css'`. |
| `src/components/marketing/lexikon/entry-card.tsx` | Server-taugliche Eintragskarte, `RelevanzBadge`, `MiniLevels`, `EntryCardData` (serialisierbarer DTO). |
| `src/components/marketing/lexikon/lexikon-sections.tsx` | Server-Sektionen: `toCardData`, `KategorieBento`, `EntryGrid`, `KategorieIcon`. |
| `src/components/marketing/lexikon/lexikon-explorer.tsx` | Client: Hero, Suche, Sticky-Register, Layout-animiertes Raster. |
| `src/components/marketing/lexikon/lexikon-detail.tsx` | Client: `ReadingProgress`, `Gauges`, `Toc` (Scroll-Spy), `AblaufTimeline`, `Checklist`. |
| `src/app/lexikon/page.tsx` | Index (Explorer + Bento + „So nutzt du das Lexikon“ + CTA). JSON-LD `DefinedTermSet`. |
| `src/app/lexikon/[begriff]/page.tsx` | Detail. JSON-LD `Article` (+ `about: DefinedTerm`), `FAQPage`, `BreadcrumbList`. |
| `src/app/lexikon/kategorie/[kategorie]/page.tsx` | **Neu.** Kategorieseite mit `ItemList`-JSON-LD. |
| `src/app/lexikon/not-found.tsx` | **Neu.** Lexikon-eigene 404 mit Suche-Einstieg und den drei dringlichsten Begriffen. |
| `src/app/sitemap.ts` | Nutzt jetzt `LEXIKON_EINTRAEGE` + `LEXIKON_KATEGORIEN`. |

Die alte `LexikonTerm`-Struktur bleibt vollständig kompatibel; `LexikonEintrag` ist eine strikte Obermenge.

## 2. Content-Modell (`LexikonEintrag`)

```ts
{
  slug, begriff, title, description, definition,      // wie bisher (seo-cluster)
  kosten[], ablauf[{title,text}], prüfpunkte[], faqs[], related[],
  kategorie: LexikonKategorieSlug,                      // 1 von 7
  kurz: string,                                         // Ein-Satz-Nutzen für Karten (≤ 120 Zeichen)
  relevanz: 'pflicht' | 'empfohlen' | 'wissen',        // Badge + Filter
  synonyme: string[],                                   // Suchtreffer + „Auch bekannt als“
  wannHandeln: string,                                  // konkreter Trigger („Wann handeln“)
  stufen: { kosten, aufwand, dringlichkeit },           // je 1–4, qualitativ, KEINE Preise
  kennzahlen: [{label, value, hint}] × 3,               // Zuständigkeit, Intervall, Nachweis, …
  verwandt: string[],                                   // Slugs anderer Einträge (werden geprüft)
  leistung: { href, label },                            // Sekundär-CTA → Leistungsseite
}
```

### Redaktionsregeln (verbindlich)

- **Keine erfundenen Statistiken, Studien, Personen oder Reviews.** Kennzahlen sind Intervalle, Zuständigkeiten, Nachweise, gesetzliche Rahmen — keine Marktzahlen.
- **Kostenrahmen bleiben Orientierung** („niedriger dreistelliger Bereich“), nie Preise. Der Hinweis „verbindlich ist der Partnerbetrieb“ steht auf jeder Detailseite (`InfoPanel`).
- **Stufen** sind qualitative Einordnung (gering/moderat/erheblich/hoch). Dringlichkeit ≥ 3 wird terra-farbig markiert — der einzige warme Akzent.
- **Ton:** sachlich, Du-Ansprache, keine Superlative, kein KI-Foregrounding. Jeder Eintrag endet in „Anliegen beschreiben“, nicht in „KI fragen“.
- **Slugs:** neue Einträge ASCII (`waermepumpe`), bestehende Umlaut-Slugs (`lüftungsanlage`) bleiben aus Kompatibilitätsgründen; `getEintrag` dekodiert URL-encodete Slugs.

### Neuen Begriff anlegen

1. Objekt in `NEUE_EINTRAEGE` (`src/lib/lexikon.ts`) ergänzen — alle Felder, 3 Kennzahlen, 4 Prüfpunkte, 3 FAQs, 3 Related-Links, 2–4 `verwandt`-Slugs.
2. `npm run build` — `assertLexikonIntegrity()` bricht den Build bei doppelten Slugs, unbekannten Kategorien oder nicht auflösbaren `verwandt`-Slugs.
3. Sitemap, Kategorieseite, A–Z-Register, Vor/Zurück-Navigator und JSON-LD aktualisieren sich automatisch.
4. Optional: Slug in `FEATURED` (`src/app/lexikon/page.tsx`) für den Hero-Stapel.

### Neue Kategorie anlegen

`LEXIKON_KATEGORIEN` ergänzen, Union `LexikonKategorieSlug` erweitern, Icon in `ICONS` (`lexikon-sections.tsx`) hinterlegen. Die Kategorieseite entsteht automatisch über `generateStaticParams`.

## 3. Motion-Design (innerhalb DESIGN.md)

Motion nutzt **`motion/react`** (bereits Dependency) für Zustands-/Layout-Animationen und die bestehende GSAP-Schicht (`Reveal`, `Stagger`) für Scroll-Reveals. Regeln:

- Nur `transform`/`opacity`; eine Kurve `cubic-bezier(0.22, 1, 0.36, 1)`; kein Bounce/Elastic; kein permanentes Loopen.
- `MotionConfig reducedMotion="user"` auf Index und Detail → bei `prefers-reduced-motion` nur Endzustände. CSS-Transitions kollabieren über die `--eh-dur-*`-Tokens.
- Ohne JavaScript ist nichts versteckt (Server-Markup vollständig, Motion additiv).

| Fläche | Element | Verhalten |
| --- | --- | --- |
| Index-Hero | Headline | Wort-für-Wort-Rise (y + 1,5° Rotation), Akzentwörter in Teal-700 |
| Index-Hero | Kartenstapel | 3 Einträge, Tiefenstaffelung (`z`, `scale`, `opacity`), Mouse-Parallax über `useSpring` (±9° / ±7°), Hover-Lift |
| Index-Hero | Suche | Fokus-Ring wächst weich, `/` fokussiert, `Esc` leert, Clear-Button |
| Register | Chips / A–Z | Sticky unter Header (`top: 72px`), `aria-pressed`, Buchstaben ohne Treffer `disabled`, Live-Zähler |
| Raster | Karten | `LayoutGroup` + `AnimatePresence mode="popLayout"`: Karten gleiten beim Filtern an ihre neue Position, Treffer werden per `<mark>` hervorgehoben |
| Karte | Hover | Lift −5px, Shadow-md, Bottom-Line `scaleX 0→1`, Pfeil-Kreis füllt Teal |
| Detail | Lesefortschritt | Fixe 3px-Linie unter dem Header, `useScroll` + `useSpring` |
| Detail | „Auf einen Blick“ | Sticky Dark-Panel (Teal-900) mit 3 Kennzahlen + 3 segmentierten Gauges, die `whileInView` sequenziell füllen |
| Detail | TOC | Scroll-Spy via `IntersectionObserver`, aktive Zeile rückt 3px vor |
| Detail | Ablauf | Vertikale Timeline; Schiene füllt sich gescrubbt (`scaleY`), Punkte springen in der Lesezone auf aktiv |
| Detail | Prüfpunkte | Abhakbare Checkliste, Fortschrittsbalken, ab 1 Treffer erscheint „Als Anliegen beschreiben“ |
| Detail | Navigator | Vor/Zurück-Karten (alphabetisch, zyklisch) |

## 4. SEO / Structured Data

- `/lexikon`: `BreadcrumbList` + `DefinedTermSet` mit allen `DefinedTerm`s.
- `/lexikon/[begriff]`: `BreadcrumbList` (4 Ebenen inkl. Kategorie), `Article` mit `about: DefinedTerm`, `FAQPage`.
- `/lexikon/kategorie/[kategorie]`: `BreadcrumbList` + `ItemList`.
- Sitemap: 18 Begriffe + 7 Kategorien + Index.

## 5. Accessibility

- Filter-Chips und Buchstaben sind echte `<button aria-pressed>`; Trefferzahl ist `aria-live="polite"`.
- Gauges tragen `role="img"` mit Textalternative („Kosten: moderat (Stufe 2 von 4)“).
- Checkliste: `<button aria-pressed>`, Zusammenfassung `aria-live`.
- Hero-Headline: dekorative Wort-Spans `aria-hidden`, vollständiger Text per `aria-label` auf `<h1>`.
- Kartenstapel im Hero ist `aria-hidden` und `tabIndex={-1}` (reine Visualisierung; alle Einträge sind im Raster erreichbar).
- Fokus: bestehende `.mkt :focus-visible`-Regel; Sticky-Register überlappt keine Fokusziele (`scroll-margin-top` auf Blöcken).

## 6. Verifikation & offene Punkte

Lokal verifiziert (Sandbox, Next 16): `tsc` grün, `eslint` grün (inkl. React-Compiler-Regeln), `next build` mit 18 Begriffs- + 7 Kategorieseiten SSG, SSR-Smoke (200/404, Umlaut-Slug).

Im Repo noch auszuführen (OCI-VM, siehe `AGENTS.md`):

1. `npm run lint && npm run build`
2. `npm run test:public-site` — erwartet unverändert `/lexikon`-Link im Hilfe-Hub.
3. `npm run test:visual:update` — **Baselines für `/lexikon` bewusst neu setzen** (Redesign), danach `npm run test:visual`.
4. `npm run test:a11y` und `npm run test:responsive` (390 / Tablet / 1320) — Sticky-Register auf 390 px auf Overflow prüfen (horizontaler Scrollbalken ist per Design ausgeblendet, Inhalt bleibt wischbar).
5. `npm run test:public-nav` — unverändert.
