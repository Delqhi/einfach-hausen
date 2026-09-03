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

---

## Welle 1 – Grundlage

### Token-Kanon

`src/components/marketing/tokens.css` ist die einzige Quelle für Form,
Tiefe, Rhythmus und Motion auf den öffentlichen Seiten. Neue Regeln nutzen
diese Variablen, statt eigene Werte zu setzen.

| Dimension | Tokens |
| --- | --- |
| Radien | `--eh-r-xs`, `--eh-r-chip`, `--eh-r-btn`, `--eh-r-input`, `--eh-r-card`, `--eh-r-card-lg`, `--eh-r-media`, `--eh-r-pill` |
| Tiefe | `--eh-shadow-sm`, `--eh-shadow-md`, `--eh-shadow-lg`, `--eh-ring` |
| Rhythmus | `--eh-space-1` bis `--eh-space-7` (bewusst ungleichmäßig) |
| Motion | `--eh-ease` plus `--eh-dur-fast`, `--eh-dur`, `--eh-dur-slow` |

Regeln:

- Drei Schattenstufen, alle auf derselben Ink-Hue. Kein viertes
  Schatten-Rezept pro Modul.
- Eine Motion-Kurve, exponentielles Ease-out. Kein Bounce, kein Elastic.
- `prefers-reduced-motion` setzt alle Dauern auf `1ms`.
- Keine CSS-Layout-Eigenschaften animieren, nur `transform` und `opacity`.

### Ladezustand

`src/app/loading.tsx` zeigt **keinen** vollflächigen Platzhalter-Block. Der
alte Zustand erschien über bereits geladenem Inhalt und ließ fertige Seiten
unfertig aussehen. Jetzt: schmale Fortschrittsleiste an der oberen Kante,
Statusmeldung nur für Screenreader.

### App-Prioritäten

- **Eigentümer-Start** (`src/app/app/page.tsx`): Composer zuerst, danach
  „Als Nächstes“, alles Weitere in einer leisen „Mehr“-Liste. Keine
  konkurrierenden Schnellaktionen vor der Hauptaktion, kein FAB, der
  denselben Weg ein zweites Mal anbietet.
- **Partner-Arbeitsbereich** (`src/app/pro/page.tsx`): eine
  Zusammenfassungszeile statt vier KPI-Karten, darunter genau **ein**
  nächster Arbeitsschritt, dann die Anfrageliste. Der Bereich ist eine
  Arbeitsliste, kein Mini-ERP.

---

## Welle 2 – Vier Seiten-Archetypen

`src/components/marketing/archetypes.tsx` plus
`archetypes.module.css`. Selbsttragend: kein Import aus `mkt.module.css`
oder `marketing.module.css`, damit die Alt-Ebenen nicht dagegen arbeiten.

| Archetyp | Seite | Form |
| --- | --- | --- |
| **Index** | `/leistungen` | Typografischer Index mit führenden Nummern auf Haarlinien. Kein Mockup, keine Karten. Die echten Kundensätze sind ein eigenes Band. |
| **Ledger** | `/preise` | Echte Vergleichstabelle mit Tabellenziffern und getönter Leitspalte. Nullzeilen als Kontoauszug. |
| **Dossier** | `/hausakte` | Aktenkopf mit Label-Wert-Zeilen, danach eine Rail mit Einträgen entlang des Lebenszyklus der Akte. |
| **Terms** | `/partner`, `/sicherheit` | Vertragsblatt: Paragraphen-Klauseln in zwei Spalten, Prüfliste mit echten Zuständen. |

Weitere Bausteine: `FaqFrame` (links ausgerichtet statt zentriert),
`QuietClose` (leiser Abschluss für Seiten, die kein zweites dunkles CTA-Band
brauchen).

### Was dabei verschwunden ist

- Drei bis vier identische Feature-Kartenraster hintereinander auf
  `/sicherheit` und `/so-funktionierts`.
- Drei bzw. vier schwebende Preiskarten auf `/preise`
  (`price-toggle.tsx` ist ersetzt durch `price-ledger.tsx`).
- Zwölf gleich große Kategorie-Karten auf `/leistungen`.

---

## Verbote

Gilt für alle neuen Flächen:

- Keine farbigen Seitenstreifen (`border-left` größer 1px als Akzent) auf
  Karten, Listenzeilen oder Hinweisen.
- Kein Gradient-Text (`background-clip: text`).
- Kein dekorativer Blur, kein Glass als Standard.
- Keine gleich großen Kartenraster aus Icon, Überschrift und Text als
  Reflex. Erst prüfen, ob eine Liste, eine Tabelle oder Typografie die
  Information besser trägt.
- Keine verschachtelten Karten.

---

## Welle 3 – offen

1. **Alt-Ebenen entflechten.** `design-system.css` (146 KB),
   `globals.css` (105 KB), `provider-workspace.module.css` (49 KB),
   `homeowner.module.css` (45 KB), `marketing.module.css` (68 KB) und
   `mkt.module.css` (36 KB) enthalten noch eigene Radien-, Schatten- und
   Abstandswerte. Schrittweise auf die Tokens ziehen, Datei für Datei, mit
   Snapshot pro Schritt.
2. **Visual-Baselines neu aufnehmen** für 390, Tablet und Desktop. Die
   alten Snapshots für `/app`, `/pro`, `/leistungen`, `/preise`,
   `/hausakte`, `/partner`, `/sicherheit` und `/so-funktionierts` sind
   bewusst ungültig.
3. **Restliche Unterseiten** prüfen: `/eigenheimbesitzer`, `/ueber-uns`,
   `/mein-haus`, `/ansprechpartner`, `/pilotphase`, `/hilfe`. Wo das alte
   Muster noch steht, den passenden Archetyp einsetzen statt einen neuen zu
   erfinden.
