# DoktorABC-Design-Analyse (Referenz für einfachhaus.de, 2026-08-30)

Vollständiger Live-Sweep der doktorabc.com/de Startseite (Desktop + Mobile).
Ziel: Optisch/design/frontend besser machen. Nicht kopieren — die starken
Muster extrahieren und auf die einfachhaus-Brand (Petrol/Charcoal/Inter)
uebersetzen.

## Warum wirkt die Seite "premium modern"?

1. **Farb-Story pro Thema**: Jede Behandlungs-Sektion hat eine EIGENE
   subtile Hintergrund-Tönung (Cannabis: mint-gruen, ED: hellblau,
   Testosteron: steel-blue, Abnehmen: warm-beige, Verhuetung: rosa).
   Der Nutzer fuehlt jede Sektion als eigenes "Themen-Kapitel".
2. **Voller Foto-Mensch im Hero + in jeder Sektion**: Reale Personen
   (laechelnd, Alltags-Situationen, Arzt mit Paket) erzeugen Vertrauen
   und Emotion. Unsere Seite hat nur Mockups/Icons — kalt im Vergleich.
3. **Statement-Headlines mit Farbakzent im Satz**: "Verlaessliche
   Betreuung beginnt hier" — "Verlaessliche Betreuung" in Gruen, Rest
   schwarz. Wir machen das nur im Hero. DoktorABC in JEDER Sektion.
4. **Badge-Pill ueber jedem Themen-Block**: "LOESUNG FUER EREKTILE
   DYSFUNKTION", "TESTOSTERON" — zeigt sofort: hier geht's um dich.
5. **Kat-Cards mit 3D-Produktbildern**: Kleine Karten mit realistischem
   Produktrendering (Pille, Inhalator, Pflanze) + Arrow-Button. Sehr
   haptisch, sehr klar.
6. **"3 einfache Schritte" mit Fotos + geneigten Karten**: Die 3 Karten
   sind leicht rotiert (perspektivisch), mit echten Fotos (Handy,
   Arzt, Paket). Wir haben Nummern + Text — wirkt statisch.
7. **Social Proof massiv**: 4,78 Stars + 20.6k Bewertungen (Hero!),
   4M Bestellungen Counter (CountUp), 95% Weiterempfehlung, Trustpilot
   Widgets, Presse-Logos (Tagesspiegel, etc.), Zitate mit Namen + Datum,
   Medizinischer Beirat mit Foto-Karussell. WIR HABEN KEINE davon
   (Design.md verbietet Fake-Daten — aber echte Daten/Presse koennen wir
   nutzen, sobald vorhanden).
8. **Footer: dunkel (near-black) mit großen Link-Spalten + Zertifikats-
   Streifen (PCI, DMCA, LegitScript, Datenschutzerklaerung-Buttons).**
9. **CountUp-Animation** bei 4,000,000+ Bestellungen (T-0208 hat das
   bereits als count-up.tsx geliefert!).
10. **Cookie-Banner untertitelt mit Bewertung-Widget** (4,78 Sterne fix
    am rechten Rand).

## Konkrete Umsetzungen fuer einfachhaus.de (priorisiert)

### Direkt uebertragbar (ohne neue Inhalte)
- [x] Statement-Sections mit Farbakzent im Satz (H3-Hybel) — HABEN WIR
- [ ] **Themen-Tönung pro Sektion**: Hauptleistungen/Themen-Sektionen
      bekommen subtile Farb-Story (mint/teal/sand-Rotation)
- [ ] **Badge-Pill über jedem Block** (H3-Rhythmus) — haben wir teils
- [ ] **Cookie-Banner mit Bewertung** (echte Bewertung, sobald vorhanden)
- [ ] **Footer: dunkel mit Zertifikats-Streifen** (keine Fake-Zertifikate:
      stattdessen "Geprüfte Vertragspartner", "DSGVO: EU-Hosting",
      "Kein Lead-Handel" als Badge-Row)
- [ ] **CountUp bei echten Zahlen** (sobald echte Bestell-/Kunden-Zahlen
      vorliegen — T-0208 count-up.tsx existiert schon)
- [ ] **Presse-Logos-Reihe** (sobald Presse vorliegt)

### Benötigt neue Inhalte (Operator-Entscheidung)
- Echte Personen-Fotos (Team, Partner, Kunden) statt nur Icons/Mockups
- Echte Bewertungen (eKomi/Trustpilot-Anbindung, wenn vorhanden)
- Echte Zahlen (Kunden, Aufträge) für CountUp

### Design-Details die wir 1:1 lernen koennen
- Große Statement-Headlines: 2-Zeilig, erster Teil accent-farben
- Cat-Cards: Icon/Bild links, Pfeil rechts, Border-radius ~16px
- Hero: Suchfeld IM Hero (wir haben Composer ✓)
- Hover: Karten heben sich an (translateY -2..4px) + Schatten verstaerkt
- Sektions-Hintergründe: sanfte Verlaeufe statt flat colors
