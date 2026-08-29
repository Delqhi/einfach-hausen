# einfach-hausen Presentation Brand

## Source of Truth

Visuelle Referenz:

`https://app.notion.com/p/App-Design-3c8b784cdffc80a1a5d1ed2269dbdd0d?source=copy_link`

Notion ist die **visuelle Designreferenz**, nicht automatisch die fachliche Produktspezifikation. Die dort sichtbar gezeigten mobilen Owner-Screens sind belastbare Design-Evidence. Leere Dashboard-/User-Story-Bereiche sind keine visuelle Evidence. Texte aus Screenshots dürfen nicht ungeprüft zu Produktanforderungen werden.

Die verbindliche Kette für Präsentationsänderungen ist:

```text
Notion App Design
    ↓
DESIGN.md
    ↓
docs/PRESENTATION_BRAND.md
    ↓
presentation/premium/brand.config.json
    ↓
presentation/premium/deck.html
```

Änderungen am App-Design müssen künftig immer auch gegen Presentation Brand und Präsentation geprüft werden.

## Brand-Regeln

Das Repository besitzt in diesem Branch kein `assets/branding/logo-blue.svg`. Die tatsächlich verwendete Logo-Quelle der Anwendung ist:

`public/brand/einfachhausen-mark.svg`

Die Präsentation führt davon ausschließlich eine byte-identische Kopie unter:

`presentation/premium/assets/branding/einfachhausen-mark.svg`

Regeln:

- Originales Repo-Asset verwenden.
- Nicht neu zeichnen.
- Nicht umfärben.
- Nicht verzerren.
- Auf dunklen Flächen eine helle/ruhige Surface-Behandlung verwenden, statt das Original-Asset zu verändern.
- Die Wortmarken-/Tagline-Behandlung folgt `src/components/logo.tsx` und `src/app/design-system.css`.

## Präsentationsdesign

- überwiegend hell;
- warmes/off-white Canvas;
- weiße Surfaces;
- Grün als Action-/Brandfarbe;
- großzügige Abstände;
- runde Cards;
- Consumer-/Mobile-first;
- Owner und Pro teilen dieselbe Designsprache;
- Pro darf informationsdichter sein, aber kein separates Dark/Admin-Theme bekommen;
- dunkle Slides sind gezielte Akzente, derzeit nur 1, 11 und 15;
- Slide 12 bleibt hell.

Die kanonischen Präsentationsfarben liegen in `presentation/premium/brand.config.json`. Das Deck darf nicht auf die alten Primärfarben `#0B3D2A` / `#0B6B43` zurückfallen.

## Devices

```text
Phone frame target: 3px
Phone frame maximum: 5px
```

Der Device-Rahmen bleibt der UI visuell untergeordnet. Geometrie, Schatten und Notch dürfen das Produkt-Screenshot nicht dominieren.

## Evidence und QA

Produkt-Snapshot, Live-Health, Datenbankstatus und Screenshot-Capture sind getrennte Evidenzen. Aus einem Screenshot darf keine unbelegte Git↔Produktion-Identität abgeleitet werden.

Vor einem finalen Export sind mindestens auszuführen:

```bash
node presentation/premium/test-brand-config.mjs
node presentation/premium/test-brand-frame.mjs
```

Danach folgen Presentation-QA, frischer Render aller 15 Slides, visuelle Gesamtkontrolle sowie PDF-/PPTX-Export.
