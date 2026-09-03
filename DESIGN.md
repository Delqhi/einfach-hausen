# Einfach Hausen — Design Contract

**Status:** verbindliche visuelle und UX-Leitlinie für Website, Eigentümer-App, Handwerker-/Partner-App und CRM (Stand: 2026-09-03).

Diese Datei ist die gemeinsame Design-Quelle für alle Produktflächen. Bestehende Funktionalität, Produktlogik und Sicherheitsregeln bleiben bestehen. Die Oberflächen dürfen sich in Informationsarchitektur und Nutzungskontext unterscheiden, fühlen sich aber wie **ein einziges, konvergentes Premium-Produkt** an.

## 0. Visuelle Source of Truth · Notion App Design & Canonical Tokens

Für Portal-UI (`/app`, `/pro`, Admin `/admin`, Auth und responsive Shells) ist das einheitliche Token-System verbindlich:

- Kanonische Token-Quelle: `src/components/marketing/tokens.css` (`--eh-*`).
- Farbkonsistenz: Warmes Off-White/Canvas (`#faf8f4` / `#f4f7f7`), Brand-Teal (`#105258`), dunkles Petrol (`#0a3539`), Charcoal-Ink (`#10222a` / `#1c2129`) und dezente Haarlinien (`#e4e2dc`).
- Kein ERP-Cockpit, kein Dark-Mode im Pro-Bereich: Handwerker und Eigentümer nutzen dieselbe helle, ruhige Basisfarbe.

## 1. Produktflächen im Überblick

1. **Öffentliche Website & Content (`/`, `/leistungen`, `/preise`, `/hausakte`, `/partner`, `/blog`, `/lexikon`):**
   - Reduktion von redundanten Kartenrastern zu spezifischen Seiten-Archetypen (Index, Akte, Vergleichstabelle, Vertragsblatt).
   - Kein störendes Lade-Overlay („Wir bereiten die Inhalte vor“), sondern subtile Indikatoren.
2. **Eigentümer-App (`/app`):**
   - **Hausmeister-Composer an 1. Stelle:** Das KI-Eingabefeld steht dominant oben.
   - **Als Nächstes an 2. Stelle:** Termine, offene Angebote und anstehende Wartungen.
   - **Schnellaktionen & Archiv:** Dezent untergeordnet, kein Floating Action Button (FAB).
3. **Handwerker-/Partner-App (`/pro`):**
   - Keine 4 isolierten KPI-Kacheln, sondern eine schlanke Statuszeile.
   - Ein primärer Call-to-Action („Nächster Schritt: Angebot erstellen“), gefolgt von einer klaren Auftragsliste.
4. **Admin & CRM (`/admin`, `/admin/crm`):**
   - Vollständige visuelle Angleichung an den warmen Canvas und saubere Typo-Hierarchie ohne harte Brüche.

## 2. CSS-Architektur & Konsolidierungs-Regeln

- Neue Stile werden ausschließlich über CSS-Module (`*.module.css`) oder Scoped Tokens implementiert.
- Veraltete Überschreibungen (`.premium-*`, `.conversion-*`, inkonsistente Utility-Layers) werden schrittweise neutralisiert.
- Keine `border-left`/`border-right`-Accent-Stripes, keine Text-Gradients, kein Glassmorphism als Standard.
