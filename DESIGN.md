# Einfach Hausen — Design Contract

**Status:** verbindliche visuelle und UX-Leitlinie für Website, Eigentümer-App und Handwerker-/Partner-App.

Diese Datei ist die gemeinsame Design-Quelle für alle drei Produktflächen. Bestehende Funktionalität, Produktlogik und Sicherheitsregeln bleiben bestehen. Die drei Oberflächen dürfen sich in Informationsarchitektur und Nutzungskontext unterscheiden, müssen sich aber wie **ein einziges hochwertiges Produkt** anfühlen.

## 0. Visuelle Source of Truth · Notion App Design

Für Portal-UI (`/app`, `/pro`, Auth und responsive Shells) ist die Notion-Seite **App Design** die verbindliche visuelle Referenz für die tatsächlich gezeigten Zustände:

`https://app.notion.com/p/App-Design-3c8b784cdffc80a1a5d1ed2269dbdd0d`

Reihenfolge bei visuellen Konflikten:

1. Notion-Screenshots für tatsächlich gezeigte visuelle Charakteristik und Interaktionszustände.
2. Diese `DESIGN.md` für semantische Tokens, Accessibility, responsive Ableitung und nicht gezeigte Zustände.
3. Shared Portal-Primitives/Tokens in der Implementierung.
4. Route-lokale Overrides nur für echte Produktsemantik — niemals als zweites Theme.

Die Notion-Referenz bestätigt einen **hellen, ruhigen, großzügigen, mobile-first Consumer-Look** mit warmem Off-White, weißen Surfaces und Grün als primärer Marken-/Aktionsfarbe. Große dunkle Flächen bleiben Ausnahme. Eigentümer- und Partner-App verwenden dieselbe visuelle Foundation; die Partner-App darf informationsdichter sein, aber kein eigenes Dark-/Admin-Theme bilden.

Die Screenshots bestätigen **nicht** automatisch exakte Hexwerte, Desktop-/Tablet-Kompositionen, sämtliche Pro-Screens oder Produkttexte. Screenshot-Copy ist keine fachliche Anforderung. Für diese Punkte bleibt diese Datei verbindlich.

Die Premium-Präsentation übersetzt dasselbe System: Original-Logo aus dem Repo, dieselbe semantische Grün-/Neutral-Palette, helle Slides als Standard und schlanke Device-Frames. Ein separates Marketing-Brand ist ausdrücklich nicht vorgesehen.

## 1. Markenwirkung

Einfach Hausen soll auf den ersten Blick wirken wie eine etablierte, große digitale Plattform für Eigenheime — nicht wie ein Experiment, MVP, KI-Demo oder kleines Vermittlungs-Startup.

Die gewünschte visuelle Richtung verbindet:

- die Ruhe, Klarheit und typografische Präzision moderner OpenAI-/ChatGPT-Weboberflächen,
- die saubere Komponentenlogik und hochwertige Produktästhetik sehr guter v0-Interfaces,
- die Vertrauens- und Marktplatzwirkung großer Serviceplattformen wie MyHammer,
- eine eigenständige Einfach-Hausen-Marke mit Petrol-Teal aus dem Logo als zentralem Vertrauens- und Aktionssignal.

**Nicht kopieren:** keine 1:1-Übernahme von OpenAI-, v0- oder MyHammer-Branding, Layouts, Icons oder Texten. Referenz sind Qualitätsniveau, Klarheit, Hierarchie und Produktreife.

## 2. Kernprinzipien

1. **Hell und ruhig.** Weiß, warmes Off-White und sehr helle neutrale Flächen dominieren. Kein dunkles Partner-Dashboard.
2. **Teal als Marke, nicht als Tapete.** Das Logo-Petrol (#105258) markiert Hauptaktionen, aktive Zustände, Vertrauen und Erfolg; große Flächen bleiben überwiegend neutral.
3. **Eine starke Aktion pro Kontext.** Keine fünf gleich wichtigen Buttons nebeneinander.
4. **Weniger Karten.** Flächen, Listen, Tabellen und klare Abschnitte statt SaaS-Kachelwüste.
5. **Große Plattform, nicht Demo.** Navigation, Footer, Unterseiten, Trust, Support, Rechtliches und klare Produktbereiche müssen vollständig wirken.
6. **Conversational first.** Wo Menschen ein Problem beschreiben, soll die Oberfläche wie eine gute, ruhige Konversation funktionieren: große Eingabe, verständliche nächste Schritte, keine Formularwand.
7. **Progressive Disclosure.** Erst das zeigen, was jetzt relevant ist; Details bei Bedarf.
8. **Mobile first, Desktop excellent.** 390 px ist vollwertig; Desktop ist kein aufgeblasenes Handy.
9. **Barrierefreiheit sichtbar mitdenken.** Fokus, Kontrast, Labels, Statusmeldungen, Tastatur, 44px+ Touch-Ziele, reduced motion.
10. **Keine erfundenen Vertrauenssignale.** Keine Fake-Bewertungen, Kundenzahlen, Garantien oder Marktführer-Claims ohne belegbare Daten.

## 3. Brand & Design Tokens

### Logo (LOGO_03, verbindlich seit 2026-08-30)

- Quelle: `.orca/drops/LOGO_03.png` — Hausmarke (Petrol-Teal Outline) + zweifarbiges Wortbild: „einfach" in Charcoal, „hausen" in Teal-Skript.
- Öffentliche Website, Header: Hausmarke + typografischer Wordmark (Marke links, „einfach" Charcoal / „hausen" Teal). Footer: vollständige Logo-Komposition. Favicon/App-Icons: zugeschnittene Hausmarke.
- Asset-Quellen: `public/brand/logo-full.png` (Volllogo), `public/brand/logo-mark.png` + statische Imports in `src/components/marketing/assets/` (content-gehashte URLs; keine public-URLs für Logo-Images, sonst stale Optimizer-Cache).

### Farben (aus dem Logo kalibriert)

- `--eh-green-900: #0A3539` — sehr dunkles Marken-Petrol für dunkle Flächen/CTA-Gradient
- `--eh-green-700: #105258` — primäre Aktion (Teal aus der Hausmarke; 8.9:1 auf Weiß)
- `--eh-green-600: #147078` — Hover/aktive Akzente
- `--eh-green-100: #DCEBEC` — dezente Teal-Fläche
- `--eh-green-50: #EDF5F5` — sehr helle Vertrauensfläche
- `--eh-bg: #F4F7F7` — Website-Canvas
- `--eh-surface: #FFFFFF`
- `--eh-surface-subtle: #F2F5F5`
- `--eh-text: #1C2129` — Charcoal aus dem Wortbild
- `--eh-text-secondary: #57686B`
- `--eh-border: #E2E8E8`
- `--eh-border-strong: #CFDAD9`
- Fehler/Warnung/Info nur semantisch und zurückhaltend.

### Typografie

- Inter Variable, self-hosted (`src/fonts/InterVariable.woff2`), Display 700, UI 550–650, Body 400; globales Tracking −0.011em, Display −0.03em bis −0.035em.

### App-Delta (bekannt, bewusst offen)

Die Eigentümer-App ist pixelgenau auf die Notion-Referenzen kalibriert (aktuell `#14735c`-Grün, `src/app/globals.css` v2-Block) und wurde so abgenommen. Eine Konvergenz der App-Oberflächen auf die Logo-Teal-Palette ist ein eigener Wave mit erneuter Visual-Acceptance — wird hier nicht stillschweigend umgefärbt.

### Typografie

- System-/Inter-nahe Sans-Serif, keine verspielte Display-Schrift.
- Headlines: kompakt, ruhig, hohe Lesbarkeit; kein Marketing-ALL-CAPS außer kleinen Eyebrows.
- Body Desktop 16–18 px, Mobile mindestens 16 px.
- Kleine Meta-Texte nicht unter 12 px; wichtige Meta eher 13–14 px.
- Maximal 2–3 Font-Weights pro Screen.

### Radien und Flächen

- Inputs/Buttons: 10–12 px Radius.
- größere Panels: 16–20 px Radius.
- Modale/komplexe Surface: 20–24 px.
- Schatten sehr subtil; Border ist primäres Trennmittel.
- Keine Neon-Glows, Glas-/Blur-Orgien oder unnötigen Gradients.

### Spacing

- 4/8/12/16/24/32/48/64/96 System.
- Mobile horizontal 16–20 px.
- Desktop Contentbreite je Kontext ca. 1180–1280 px.
- Lesetext maximal ca. 720 px.

### Buttons

- Primary: grüner Hintergrund, weißer Text, klare Verb-Aktion.
- Secondary: weiß/neutral mit Border.
- Tertiary: text/link style.
- Destructive ausschließlich rot und nur für destruktive Aktionen.
- Mindesthöhe 44 px, bevorzugt 46–48 px.

### Inputs

- 46–52 px Höhe für Standardfelder.
- Conversational Composer größer, weich und prominent.
- Klare Focus-Ringe.
- Labels oberhalb oder semantisch eindeutig; Placeholder ersetzt kein Label.

## 4. Gemeinsame Komponenten-Sprache

Alle drei Oberflächen verwenden dieselbe mentale Komponentenfamilie:

- Top Navigation / App Header
- Primary CTA
- Search / Conversational Composer
- Trust Badge / Verified State
- Status Pill
- Section Header
- Empty State
- Inline Error / Recovery State
- Timeline / Activity
- Entity Row (Auftrag, Kontakt, Termin, Dokument)
- Detail Panel
- Filter / segmented control
- Footer / legal navigation nur Website

Icons: Lucide, konsistente Strichstärke, sparsam. Kein Icon-Zoo.

## 5. Öffentliche Website — etablierte Plattform statt One-Pager

### 5.1 Informationsarchitektur

Die Hauptnavigation darf **nicht** mehr überwiegend auf `#anker` der Homepage zeigen. Jeder primäre Menüpunkt führt auf eine eigenständige, indexierbare Unterseite.

Verbindliche Zielstruktur:

- `/` — Homepage / klare Plattformpositionierung
- `/so-funktionierts` — Prozess für Eigentümer verständlich erklären
- `/eigenheimbesitzer` — Nutzenwelt für Eigentümer
- `/leistungen` — Leistungs-/Kategorieübersicht
- `/hausakte` — digitale Hausakte und langfristiger Nutzen
- `/partner` — Einstieg für Handwerker/Dienstleister/weitere Partner
- `/preise` — transparente Kunden- und Partnermodelle, nur belegte aktuelle Preise
- `/ueber-uns` — Mission, Arbeitsweise, Vertrauen
- `/hilfe` — Hilfe / FAQ / Support-Einstieg
- `/kontakt` — Kontaktmöglichkeiten
- `/sicherheit` — Datenschutz-/Sicherheitsprinzipien in verständlicher Sprache
- `/impressum` — vollständige rechtliche Anbieterkennzeichnung mit **nur verifizierten** Unternehmensdaten
- `/datenschutz` — Datenschutzseite, keine erfundenen Rechtsbehauptungen
- `/agb` — AGB/Vertragsinformationen nur soweit rechtlich verifiziert; fehlende Inhalte als Launch-Blocker melden statt erfinden
- optional `/barrierefreiheit` — Barrierefreiheits-/Zugänglichkeitsinformationen, wenn belastbar

Weitere SEO-/Leistungsseiten dürfen entstehen, wenn sie echten Nutzwert haben, z. B. fachliche Leistungskategorien. Keine dünnen Doorway-Pages.

### 5.2 Hauptnavigation

Desktop:

- Logo links
- zentrale Menüpunkte als echte Seitenlinks, z. B. `So funktioniert's`, `Leistungen`, `Mein Haus`, `Für Betriebe`
- rechts `Einloggen` sekundär und `Kostenlos starten` primär
- Sticky erst sinnvoll nach Scroll; nicht permanent überdominant

Mobile:

- Logo + Login/CTA + sauberer Menü-Drawer
- Menü enthält dieselbe echte Seitenstruktur plus Support/Rechtliches

### 5.3 Homepage

Die Homepage verkauft nicht „probier mal unsere KI“, sondern vermittelt Plattformstärke:

- Hero: ein großes, sofort verständliches Nutzenversprechen für Menschen mit Eigenheim
- eine dominante Eingabe oder CTA
- darunter starke Vertrauensarchitektur: geprüfte Partner, persönlicher Ansprechpartner, Hausakte, transparente Organisation
- klare Produktbereiche statt 10 Demo-Karten
- visuelle Vorschau auf Eigentümer-App und Partnernetzwerk
- Leistungsbereiche / typische Anliegen
- Prozess in 3–4 Schritten
- Hausakte als langfristiger Lock-in/Nutzen
- Partnernetzwerk / Qualitätsmodell
- Preise bzw. „kostenlos starten“ seriös darstellen
- Support / Sicherheit / FAQ
- großer vollständiger Footer

Ton: souverän, präzise, verständlich. Keine Startup-Floskeln wie „revolutionär“, „magisch“, „AI-powered“ oder unbelegte Superlative.

### 5.4 Große-Plattform-Cues

Die Website soll visuell und strukturell signalisieren: Hier steckt ein vollständiges Produkt dahinter.

- echte Unterseiten
- konsistente globale Navigation
- ausführlicher Footer
- Hilfe/Kontakt/Sicherheit
- klare Kunden- und Partnerbereiche
- Kategorien/Leistungsspektrum
- wiedererkennbare Screenshots/Produktvorschauen
- seriöse rechtliche Navigation
- states für Fehler, 404 und Ladezustände
- keine erfundenen Nutzerzahlen oder Bewertungssterne

### 5.5 Footer

Verbindlich als großer strukturierter Footer mit 4–5 Spalten.

Beispielstruktur:

**Für Eigenheimbesitzer**
- So funktioniert's
- Leistungen
- Mein Haus / Hausakte
- Preise
- Hilfe

**Für Betriebe**
- Partner werden
- Partner-App
- Partner-Preise
- Anforderungen / Qualitätsmodell

**Einfach Hausen**
- Über uns
- Kontakt
- Sicherheit
- Hilfe / FAQ

**Rechtliches**
- Impressum
- Datenschutz
- AGB
- ggf. Barrierefreiheit
- Cookie-Einstellungen nur wenn tatsächlich ein Consent-/Tracking-System existiert

Footer enthält Logo, kurze Markenbeschreibung, Copyright und nur belegte Kontakt-/Firmendaten.

## 6. Eigentümer-App — persönlicher Haus-Copilot

Zielgefühl: ChatGPT-artige Einfachheit trifft auf eine sehr gute Consumer-Finance-/Home-App.

### Startseite

- oben persönliche Begrüßung + Hauskontext
- primärer Hausmeister-Composer als wichtigste Aktion
- darunter nur 2–4 wirklich relevante nächste Dinge: nächster Termin, offene Entscheidung/Angebot, fällige Wartung, wichtiger Status
- Kontakte und Hauswissen kontextuell, nicht alles gleichzeitig
- keine Dashboard-Metrik-Kachelwüste

### Hausmeister

- Composer und Gespräch sind visuelles Zentrum
- Text, Foto und Sprache klar, aber nicht technisch
- nach Einordnung explizite Wahl: `Frage klären`, `Ansprechpartner finden`, `Auftrag organisieren`
- kein Auftrag ohne bewusste Entscheidung
- Antworten scanbar, kurze Abschnitte, klare nächste Aktion

### Aufträge

- klare Statusreise / Timeline
- Angebote als ruhiger Vergleich, nicht Preisportal-Chaos
- Partnervertrauen und konkrete Person sichtbar
- Rechnung, Dokumente, Chat und Termin dort, wo Nutzer sie erwarten

### Mein Haus

- Hausakte als hochwertiges dauerhaftes Produkt darstellen
- Technik, Historie, Dokumente, Wartung, Ansprechpartner und Übergabe logisch gruppieren
- kein technisches Tabellengefühl

### Mobile Navigation

Maximal fünf klare Ziele. Bezeichnungen müssen menschlich sein. `Mehr` darf sekundäre Bereiche bündeln.

## 7. Handwerker-/Partner-App — helles Operations-Produkt

Die Partner-App ist **nicht mehr dunkel**. Sie verwendet denselben hellen Canvas wie die Eigentümer-App, mit etwas sachlicherer Informationsdichte.

Zielgefühl: moderne, extrem einfache Einsatz-/Kunden-App; kein ERP.

### Start / Anfragen

- neue Anfragen als klare Arbeitsliste
- jeder Eintrag zeigt nur: Was? Wo? Wann? Status? nächster Schritt?
- `Aufträge verwalten AN/AUS` bleibt einzige zentrale Berechtigung
- ein klarer Primary Action pro Anfrage

### Auftrag

- Kunde + Anliegen + Ort + Termin + Medien + Status oben verständlich
- Aktion: anbieten / annehmen / zuweisen / starten / abschließen je Zustand
- Ansprechpartner eindeutig
- Nachrichten, Dokumente, Rechnung in nachvollziehbarer Reihenfolge

### Team

- Menschen statt Rollenmatrix
- Name, Funktion, App-Zugang, `Aufträge verwalten AN/AUS`
- keine unnötigen Berechtigungsstufen

### Vertrauen

- Verifizierung, Vertrag, Qualifikation und Profilvollständigkeit klar, aber nicht alarmistisch
- leere/error/loading/integration-unavailable states hochwertig darstellen

## 8. Website vs. Apps

Website = Marke, Vertrauen, Orientierung, Conversion, SEO, rechtliche Vollständigkeit.

Eigentümer-App = Problem beschreiben, entscheiden, organisieren, Hauswissen behalten.

Partner-App = Anfragen bearbeiten, Kunden betreuen, Arbeit dokumentieren, abrechnen.

Alle drei teilen Farbe, Typografie, Radien, Interaktionslogik und Tonalität — aber nicht zwanghaft dasselbe Layout.

## 9. Content Style

- Deutsch, klar, kurze aktive Sätze.
- Fachbegriffe erklären oder vermeiden.
- Buttontexte sind Handlungen: `Anliegen starten`, `Ansprechpartner finden`, `Angebot senden`, `Termin bestätigen`.
- Keine generischen Buttons wie `Weiter`, wenn eine konkrete Aktion möglich ist.
- KI nie als Selbstzweck vermarkten. Nutzen zuerst.
- Partner nie als anonyme Ressource darstellen; konkrete Menschen und Betriebe schaffen Vertrauen.

## 10. State Design

Jeder kritische Screen braucht bewusst gestaltete Zustände:

- loading/skeleton
- empty
- success
- validation error
- recoverable error
- offline
- integration unavailable
- permission denied / no access

Fehler sagen: **was passiert ist + was der Nutzer jetzt tun kann**.

## 11. Accessibility

- sichtbarer Keyboard-Fokus
- Skip-Link wo sinnvoll
- semantische Headings
- Input-Errors mit `aria-describedby`
- Statusänderungen mit geeigneten Live-Regions
- keine Information nur über Farbe
- Kontrast mindestens WCAG AA
- Touch targets 44x44 px oder größer
- `prefers-reduced-motion`
- Animationen kurz und funktional; keine parallax/scroll theatrics

## 12. Motion

- 120–220 ms für kleine Übergänge
- 200–320 ms für größere Panels/Drawer
- Ease-out / spring sehr dezent
- keine permanente Bewegung
- reduced-motion vollständig respektieren

## 13. Umsetzung und Parallelitätsregel

Für parallele Agenten gilt:

- `DESIGN.md` ist **read-only** und gemeinsame Wahrheit.
- Shared Business Logic (`src/app/actions.ts`, `src/lib/**`, DB/Security) ist für reine Design-Waves read-only.
- Bestehende uncommittete T-0004/T-0005-Arbeit darf nicht überschrieben, resettet oder bereinigt werden.
- Jeder Agent arbeitet nur in seinem explizit zugewiesenen Pfadbereich.
- Neue oberflächenspezifische Komponenten kommen in getrennte Verzeichnisse:
  - Website: `src/components/marketing/**`
  - Eigentümer: `src/components/homeowner/**`
  - Partner: `src/components/provider/**`
- Oberflächenspezifische CSS-/Layout-Dateien liegen im jeweiligen Route-Bereich; gemeinsame CSS-Dateien bleiben während paralleler Arbeit unangetastet.

## 14. Definition of Visual Done

Eine Oberfläche ist visuell nicht fertig, nur weil sie „schön“ aussieht. Fertig bedeutet:

- klare Informationshierarchie
- maximal eine dominante Aktion je Kontext
- 390 px, Tablet und 1320 px ohne Overflow/Brüche
- keyboard/focus/contrast sauber
- hochwertige leere/loading/error states
- reale Datenzustände statt nur Happy Path
- kein unbelegter Trust-Claim
- Design passt zu dieser Datei
- Production Build und relevante Tests grün
- reale Browser-Screenshots für Mobile und Desktop geprüft
