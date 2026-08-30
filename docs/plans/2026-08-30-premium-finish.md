# Premium-Finish Plan (Designer-Boss, 2026-08-30)

Audit: 11 Live-Seiten gesichtet. Hero-System 8/10, Seitenkörper 5/10.
Ziel: Master-Niveau auf ALLEN Sektionen. Jeder Hebel mit Gates:
build+lint+qa-extreme+desktop/mobile-Shots+a11y → Deploy → Live-Smoke.

## Hebel (Reihenfolge = Priorität)

### H1 — Bug: leere graue Box (Kontakt "Partnerbereich ordnen")  [P0]
- Ursache: InfoPanel/FeatureGrid mit leerem Slot.
- Fix: Inhalt füllen oder Panel entfernen.
- Gate: Kontakt-Screenshot ohne Leere; QA grün.

### H2 — Preise-Hero-Redundanz  [P0]
- Hero-Mockup (0€/0% Chips) wiederholt die Seite. Ersetzen durch
  Rechnungs-/Vergleichs-Mockup ODER single-column Statement-Hero.
- Gate: Screenshot; keine doppelte Preisinfo im Hero.

### H3 — Sektions-Rhythmus: neue Section-Varianten  [P0]
- (a) Statement-Section: riesige Typo, zentriert, als Pause/Punchline.
- (b) Numbered-Section: 01/02/03-Gliederung statt Bullet-Wall.
- Anwendung: hausakte (Historie-Teil), eigenheimbesitzer (Nutzung),
  partner (Modell), so-funktionierts (Wege), ueber-uns (Mission).
- Gate: pro Seite 1 neue Sektionsform; Screenshot je Seite.

### H4 — Hilfe: zweispaltiges FAQ + Kategorie-Jumps  [P1]
- Desktop 2-Spalten; Kategorie-Anker (Ablauf/Kosten/Partner/Daten).
- Gate: Desktop/Mobile-Shots; Anker funktionieren.

### H5 — Über-uns: Missions-Typo-Moment  [P1]
- Kernsatz riesig zentriert, Werte als Numbered.
- Gate: Screenshot.

### H6 — Micro-Finish  [P2]
- CtaBand: leicht variierende Titel-Höhe via Prop ok; FAQ-Chevron-Gruppe;
  Section-Head-Nummern optional.

## Definition of Done (gesamt)
- qa-extreme PASS (lokal + live), lint 0e, build grün, a11y-Report grün,
  Deploy + Production-Smoke 17/17, Live-Marker je Hebel geprüft.
