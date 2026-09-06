# Einfachhausen — Komponentenkatalog + Seitenrezepte (EH-BRAND-04)

Additiv. `PageHero`/`LinkButton`-Props bleiben. Atelier-Klassen aus `atelier-signatures.css` opt-in per Rezept.

## 0. Import (opt-in, kein Global-Default)
```css
@import url("../marketing/atelier-signatures.css");
```
Kein Default-Import in `layout.tsx`. Kein Token-Rename.

## 1. Atelier-Utilities
- `.eh-haus-cut` (78px), `.eh-haus-cut--sm` (29/32px), `.eh-haus-cut--contact` (46px), responsiv 48/51/22px.
- `.eh-hausline` (funktionale Trennlinie + Register), `.eh-register` (Nummern), `.eh-timeline` (datierte Eintraege).
- `.eh-display` (Wort-Skala h1), `.eh-section` (h2), `.eh-meta` (12–13px), `.eh-focus` (terracotta-Ring).
- Motion-Klassen nur kurz; `prefers-reduced-motion` killt alles (siehe CSS-Datei).

## 2. Rezepte (8)
### R1 Leistung (`/leistungen/[slug]`)
Hero (`PageHero`, Props unveraendert) + Ablauf (Hauslinie, 3 Schritte) + Leistungsumfang (Register) + Kontakt-Band. Atelier: `.eh-haus-cut` am Aufmacher, `.eh-hausline` zwischen Schritten.
### R2 Ratgeber/Lexikon
TOC links (sticky), Lesespalte 65ch, Register-Nummern, Hinweis-Box (Linie, kein Glass). Bestehende Lexikon-Explorer-Logik behalten.
### R3 Hausakte (Owner)
Composer oben (16px), Termin-Block, Chronik (Timeline), Unterlagen-Register + Suche + Empty-State, Ansprechpartner. Fiktion = BEISPIEL.
### R4 Kontakt
Labels sichtbar, maxlength 100/254/3000, native email-Pruefung, lokale Quittung „nichts versendet/nichts gespeichert“, 0 Submit-Requests im Demo-Modus.
### R5 Preis/Vergleich
Ledger-Tabelle, keine Kartenraster; Zeilenhoover subtil; CTA `LinkButton` (Props unveraendert).
### R6 Owner-App-Liste
Statuszeile (keine 4 KPI-Kacheln), 1 primaerer CTA, Auftragsliste, Archiv untergeordnet, kein FAB.
### R7 Pro-App-Auftrag
Schlanke Statuszeile, „Naechster Schritt“-CTA, Auftragsliste, Formulare 16px mit Fehler-/Erfolgszustaenden.
### R8 Praesentation (15 Slides, 1280x720)
Primaer `#105258`, Sekundaer `#0a3539`, Canvas `#faf8f4`, Text `#10222a`; Inter mit System-Fallback; Logo byte-identisch; dunkle Slides 1/11/15; Phone-Frame 3px (max 5); Footer-Reserve; Min-Font 15px (Deck-QA).

## 3. Bloecke (Auswahl, alle mit Zustaenden)
Hero-Band, Promise-Row (01/02/03), Memory-Chapter (deep), Haus-Record-Insert, Register-Liste, Timeline, Composer, Termin-Karte, Unterlagen-Suche, Kontakt-Formular, FAQ, Footer-Band. Jeder Block: Default/Hover-Fokus/Active/Disabled/Loading/Empty/Error/Success.

## 4. Verboten
Neue Hex ausserhalb Palette, Fonts ausser Inter+Fallback, Accent-Stripes, Text-Gradienten, Glass-Default, Karten-in-Karten, Bounce, Infinite-Motion. Guard prueft das.
