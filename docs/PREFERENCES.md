# Project Preferences & Standing Design Convergence Rules

Diese Datei synchronisiert die verbindlichen Design- und Architektur-Präferenzen für Agenten und Mitwirkende.

## 1. Design System & Palette (Kanon)
- **Canvas / Hintergrund:** Warmweiß `#faf8f4` (alternativ `#f4f7f7`). Keine harten Kaltweiß- oder Reinweiß-Überstrahlungen.
- **Brand / Hauptaktion:** Teal / Petrol `#105258` (aus der Hausmarke kalibriert, min. 8.9:1 Kontrast).
- **Dark Accent / Kicker:** Deep Petrol `#0a3539`.
- **Typografie & Text:** Charcoal-Ink `#10222a` / `#1c2129` für Fließtext, `#4b5b60` / `#5f6e75` für Sekundärtexte. Schriftart ausschließlich Inter Variable (self-hosted).
- **Rahmen & Haarlinien:** Weiche Trenner mit `#e4e2dc` / `#e2e8e8`.

## 2. Keine Theme-Silos
- **Einheitlichkeit:** Webseiten, Eigentümer-App (`/app`), Partner-App (`/pro`) und CRM (`/admin`) teilen dieselbe ruhige Grundstimmung.
- **Kein Dark-Mode:** Partnerbereich und CRM sind helle, konzentrierte Arbeitsumgebungen und keine dunklen ERP-Inseln.

## 3. Informationsarchitektur & Prioritäten
- **Eigentümer (`/app`):** 
  1. Hausmeister-Composer steht ganz oben als primäre Aktion.
  2. „Als Nächstes“ fasst echte nächste Schritte zusammen (Termine, Quotes, anstehende Wartungen).
  3. Schnellaktionen dezent untergeordnet; störende Floating Action Buttons (FABs) sind verboten.
- **Partner (`/pro`):** 
  1. Keine überladenen 4-Karten-KPI-Blöcke.
  2. Schlanke Statuszeile + genau ein nächster sinnvoller Handlungsschritt („Kostenvoranschlag senden“).
  3. Fokussierte Auftragsliste.

## 4. Absolute Design-Verbote (Design Laws)
- **Keine Accent-Stripes:** Keine `border-left` / `border-right` Balken an Karten oder Listenelementen.
- **Keine Gradient-Texte:** Überschriften und Text bleiben solide und lesbar.
- **Kein pauschaler Glassmorphismus:** Keine dekorativen Unschärfen ohne funktionale Ebene.
- **Keine Kachelwüsten:** Strukturierung über typografischen Rhythmus, Listen und Tabellen.
