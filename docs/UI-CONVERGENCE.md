# UI-Convergence

Ergänzung zu `DESIGN.md`. Diese Seite beschreibt, **wie** die visuelle
Konvergenz umgesetzt ist, damit die nächste Änderung nicht wieder eine
fünfte CSS-Generation anlegt.

Ausgangslage: funktional war viel da, optisch fehlte nicht mehr Design,
sondern Konvergenz. Mehrere Token-Systeme lagen übereinander
(`design-system.css`, `globals.css`, `marketing.module.css`,
`mkt.module.css`, `premium.module.css`, App-Overrides), und fast jede
öffentliche Unterseite folgte demselben Ablauf aus Hero, Mockup, Karten,
Statement, FAQ und CTA-Band.

Verbindlich bleibt `DESIGN.md` (Kanon, Verbote, Flächen). Diese Datei
dokumentiert die Umsetzung und den Stand der Aufräumung.

---

## Welle 1 – Grundlage (umgesetzt)

### Token-Kanon

`src/components/marketing/tokens.css` ist die einzige Quelle für Farbe,
Form, Tiefe, Rhythmus und Motion auf den öffentlichen Seiten (`.mkt`).
Neue Regeln nutzen diese Variablen, statt eigene Werte zu setzen.

| Dimension | Tokens |
| --- | --- |
| Radien | `--eh-r-xs`, `--eh-r-chip`, `--eh-r-btn`, `--eh-r-input`, `--eh-r-card`, `--eh-r-card-lg`, `--eh-r-media`, `--eh-r-pill` |
| Tiefe | `--eh-shadow-sm`, `--eh-shadow-md`, `--eh-shadow-lg`, `--eh-ring` |
| Rhythmus | `--eh-space-1` bis `--eh-space-7` (bewusst ungleichmäßig) |
| Motion | `--eh-ease` plus `--eh-dur-fast`, `--eh-dur`, `--eh-dur-slow` |
| Layout | `--eh-container`, `--eh-container-narrow`, `--eh-gutter`, `--eh-section-y`, `--eh-section-y-tight` |
| Type | `--eh-display`, `--eh-h1`, `--eh-h2`, `--eh-h3`, `--eh-lead`, `--eh-body`, `--eh-small`, `--eh-micro` |

Regeln:

- Farbwerte bleiben am Kanon aus `DESIGN.md` §3 (`--eh-teal-700` = `#105258`,
  `--eh-green-900` = `#0a3539`, Canvas `#faf8f4` / `#f4f7f7`). Die Skalen oben
  sind **additiv**: Sie dürfen genutzt werden, sie ändern keine bestehenden
  Farbwerte.
- Drei Schattenstufen, alle auf derselben Ink-Hue. Kein viertes
  Schatten-Rezept pro Modul.
- Eine Motion-Kurve, exponentielles Ease-out. Kein Bounce, kein Elastic.
- `prefers-reduced-motion` setzt alle Motion-Dauern auf `1ms` — Module müssen
  die Abfrage nicht selbst bauen, sondern nur die Tokens nutzen.
- Keine CSS-Layout-Eigenschaften animieren, nur `transform` und `opacity`.

### Bausteine statt Seitensysteme

Öffentliche Seiten bauen auf `src/components/marketing/ui.tsx`
(`PageHero`, `Section`, `CardGrid`, `Card`, `Facts`, `Steps`, `Statement`,
`Faq`, `CtaBand`, `LinkButton`, `TextLink`, `Numbered`, `BulletList`,
`InfoPanel`) plus `MarketingShell` und `app-frames`. **Ein** System — keine
zweite Komponentenschicht daneben (siehe „Nicht übernommen").

Ergänzungen kommen als Klassen in `mkt.module.css` oder als eigenes
`*.module.css` der Seite, immer mit `var(--eh-*)` statt Hex-Literalen.

### App-Prioritäten

- **Eigentümer-Start** (`src/app/app/page.tsx`): Composer zuerst, danach
  „Als Nächstes", alles Weitere in einer leisen „Mehr"-Liste. Keine
  konkurrierenden Schnellaktionen vor der Hauptaktion, kein FAB, der
  denselben Weg ein zweites Mal anbietet.
- **Partner-Arbeitsbereich** (`src/app/pro/*`): Arbeitsliste, kein Mini-ERP.
  Helle, ruhige Flächen wie im Eigentümer-Bereich (`DESIGN.md` §0: kein
  Dark-Mode im Pro-Bereich), eine Zusammenfassungszeile statt vier
  KPI-Karten, darunter der nächste Arbeitsschritt, dann die Anfragen.

---

## Nicht übernommen: vier Seiten-Archetypen

Auf dem Branch `ui-convergence-welle-1` (PR #18) entstand parallel ein
zweites Seitensystem: `archetypes.tsx` + `archetypes.module.css`
(`IndexHero`, `LedgerHero`, `ZeroBand`, `QuietClose`, `FaqFrame`,
`DossierHero`) mit vier Archetypen für `/leistungen`, `/preise`,
`/hausakte` und `/partner` + `/sicherheit`.

**Bewusst nicht gemergt.** `main` war zwischenzeitlich auf `ui.tsx`
konvergiert; ein zweites, gleich großes Komponentensystem daneben wäre
genau die fünfte CSS-Generation gewesen, die diese Convergence verhindern
soll. Aus dem Branch übernommen wurde nur, was ohne Doppelsystem trägt:

- **Ledger-Tabelle für `/preise`** — `src/app/preise/price-ledger.tsx` +
  `price-ledger.module.css`. Echte Vergleichstabelle mit Tabellenziffern,
  getönter Leitspalte, `caption` für Screenreader und Pfeiltasten-Navigation
  im `tablist`. Ersetzt `price-toggle.tsx` mit seinen drei bzw. vier
  schwebenden Preiskarten.
- **Token-Skalen** (Radien-Aliase, Rhythmus, Motion, `--eh-ring`,
  `--eh-container-narrow`, `--eh-micro`) und die `prefers-reduced-motion`-
  Regel — siehe Welle 1.

Wer einen Archetyp-Gedanken wieder aufgreifen will: als Variante innerhalb
von `ui.tsx` umsetzen (z. B. `Section`-Prop), nicht als neue Datei neben dem
System.

---

## Verbote

Gilt für alle neuen Flächen (deckt sich mit `DESIGN.md`, hier als
CSS-Checkliste):

- Keine farbigen Seitenstreifen (`border-left`/`border-right` > 1px als
  Akzent) auf Karten, Listenzeilen oder Hinweisen.
- Kein Gradient-Text (`background-clip: text`).
- Kein dekorativer Blur, kein Glassmorphism als Standard — sticky Leisten
  sind deckend.
- Kein Dark-Mode im Pro-Bereich.
- Kein Floating Action Button.
- Keine gleich großen Kartenraster aus Icon, Überschrift und Text als
  Reflex. Erst prüfen, ob eine Liste, eine Tabelle oder Typografie die
  Information besser trägt.
- Keine verschachtelten Karten.
- 44px+ Touch-Ziele, auch für Icon-Buttons.

---

## Welle 3 – offen

1. **Alt-Ebenen entflechten.** `design-system.css` (150 KB),
   `globals.css` (102 KB), `marketing.module.css` (66 KB),
   `provider-workspace.module.css` (47 KB), `homeowner.module.css` (43 KB),
   `mkt.module.css` (36 KB) und `premium.module.css` (8 KB) enthalten noch
   eigene Radien-, Schatten- und Abstandswerte. Schrittweise auf die Tokens
   ziehen, Datei für Datei, mit Snapshot pro Schritt.
2. **Visual-Baselines neu aufnehmen** für 390, Tablet und Desktop
   (`npm run build && npm run test:visual:update && npm run test:visual:apps:update`).
   Die Snapshots vor der Kanon-Angleichung (PR #32) und vor der
   Ledger-Tabelle sind bewusst ungültig — siehe Issue #33.
3. **Ladezustand prüfen.** `src/app/loading.tsx` zeigt aktuell einen
   `PublicState`-Block mit Skeleton. Zu entscheiden: schmale
   Fortschrittsleiste an der Oberkante mit Statusmeldung nur für
   Screenreader, damit bereits geladene Seiten nicht unfertig wirken.
4. **Restliche Unterseiten** prüfen: `/eigenheimbesitzer`, `/ueber-uns`,
   `/mein-haus`, `/ansprechpartner`, `/pilotphase`, `/hilfe`. Wo das alte
   Muster noch steht, mit den vorhandenen `ui.tsx`-Bausteinen auflösen statt
   einen neuen zu erfinden.
