# Einfachhausen — Zentraler Marken- und Komponentenvertrag (EH-BRAND-04)

**Status:** freigegebene Richtung Atelier 02 „Ein Zuhause mit Gedächtnis“ (Nutzerfreigabe 2026-09-06, Mac-i9-Vollansicht). Quelle: Branch `origin/design/einfachhausen-brand-atelier-20260906`, `docs/brand/ATELIER_02.md`, `design/brand-atelier/*`, `verification.json` (pass, 12 Screenshots, 6 axe 0 Verstoesse — technisch, keine Schoenheitsableitung).
**Regel:** 100% nach ChatGPT-Vorgabe. Keine eigenen Design-Entscheidungen. Additiv zu Produktion; Interfaces bleiben.

## 1. Unveraenderliche Vorgaben
- Original-Logo vollstaendig und unveraendert; Lettering niemals nachbauen. Logo-Assets byte-identisch (`public/brand/*`, `src/components/marketing/assets/*`).
- Gina Schulze = Inhaberin/Geschaeftsfuehrerin. Jeremy Schulze = Developer, nicht Inhaber/Betreiber/GF. Keine erfundenen Rechts-/Adress-/Register-/USt-/Telefondaten.
- Helle, ruhige Produktfamilie (Website, Owner-App, Partner-App, Admin/CRM). Kein dunkles ERP, kein Dark-Mode im Pro-Bereich.
- Navigation, Leistungsbereiche, Inhalte, Backend, Auth, Daten, Sicherheitsgrenzen erhalten. Keine Menue-Aenderungen.
- Keine erfundenen Kunden, Bewertungen, Partnerzahlen, Zertifikate, Garantien, 24/7-Zusagen. Beispieldaten immer als BEISPIEL markieren.
- Keine Reaktivierung entfernter Praesentations-Sektionen. Parallelarbeit (Hero, Lexikon, Kontakt, Footer) erhalten. Kein reset/clean/force-push.
- Formulare versenden nichts ohne Backend; lokale Quittung sagt ausdruecklich „nichts versendet/nichts gespeichert“.

## 2. Palette (exakt, Atelier 02)
petrol `#105258`, deep `#0a3539`, paper `#faf8f4`, ink `#10222a`, muted `#4b5b60`, line `#e4e2dc`, sand `#ecdfc9`, terracotta `#a84d29`, pale `#dcebec`, white `#ffffff`.
Terrakotta/Ocker-Marker schmal-dekorativ, niemals Service-Status. Memory-Kapitel: deep-BG + paper-Text, Divider `#416468`, Timeline `#cbcfc8`. Fokus-Ring terracotta (sand auf deep).
Kanonische Token-Quelle bleibt `src/components/marketing/tokens.css` (`--eh-*`). Keine Umbenennung/Entfernung (30 Verbraucher, KRITISCH).

## 3. Typografie (exakt)
Inter only, selbstgehostet `src/fonts/InterVariable.woff2`, Gewichte 400–750. Display 54–112px, Section 40–64px, Body 16–18px, Meta 12–13px. Hero-h1 `clamp(76px,7.6vw,112px)` lh .965 w700; Tracking h1 -.052em, h2 -.05em, h3 -.035em. Body 16px/1.55 ls -.025em. Mobile Inputs 16px. Begleittexte mind. 13px.

## 4. Signaturen
- **Hauskante:** EINE zurueckhaltende 45°-Clip-Ecke an grossem Bild + Aktendeckel. Cuts: Home-Foto 78px (48/51 responsiv), Haus-Deckel 29px, Memory-Record 32px, Property-Cover 39px (22 mobil), Kontakt-Foto 46px.
- **Hauslinie:** klare Linien, Registernummern, verbundene datierte Eintraege. Nur mit Gruppierungs-/Navigationszweck; keine Deko-Rahmen, keine Dashboard-Kacheln.
- **Wort-Skala:** fette Inter-Editorial-Headlines, kurze Zeilen, grosszuegige Abstaende vs. praezise kleine Metadaten.
- Opt-in-Klassen in `src/components/marketing/atelier-signatures.css` (additiv, kein Default-Import).

## 5. Bildsprache
Bewohnte Haeuser, echte Ansprechpartner, praezise Handwerksdetails; einheitliches Tageslicht. Bestand: `public/images/marketing/family-home.jpg`, `partner-doorstep.jpg`, `owner-kitchen.jpg`; als Stimmung, nicht als Kunden/Team ausgeben.

## 6. Motion
Kurze Entrance/State-Transitions (.65s cubic-bezier(.22,1,.36,1), Buttons .18s, Pfeile .2s). Kein Infinite/Scroll-Hijack. `prefers-reduced-motion: reduce` → alles aus, Scroll instant.

## 7. Zustaende (jede Komponente)
Default, Hover/Fokus (terracotta-Ring), Active, Disabled, Loading (subtil, kein Voll-Overlay), Empty (mit Handlung), Error (Feld+Text), Success (Quittung). Skip-Link, Escape schliesst mobile Nav, aria-pressed/aria-live wo relevant.

## 8. Agentenregeln (strikt, ab Freigabe)
- Niemals eigenstaendig Design erstellen/aendern. Nur Vertragskomponenten + Rezepte aus `docs/brand/COMPONENTS.md`. Keine neuen Farben, Typografien, Radien-Systeme, Varianten.
- `PageHero` (21 Nutzungen/21 Dateien), `LinkButton` (38 Stellen/21 Dateien): Props erhalten, nur additive optionale Props.
- `site-shell.tsx` (22 Importer), `tokens.css` (~30 Verbraucher), `design-system.css`/`globals.css` (jede Route): additiv, kein Rename/Remove ohne Caller-Nachweis + Flaechenabnahme.
- 4 Logo-Umsetzungen synchron halten. Taglines nicht erfinden.
- Praesentation: Primaer `#105258`, Sekundaer `#0a3539`, Canvas `#faf8f4`, Text `#10222a`; Inter mit System-Fallback; Logo byte-identisch.
- Jede PR mit Design-Beruehrung: `node scripts/brand-guard.mjs` gruen. Workflow `brand-guard.yml`.
- Skill-Prioritaet fuer einfachhausen-Repos: `docs/brand/SIN-EH-DESIGN-SKILL.md` schlaegt generische Frontend-Skills. Korrekturvermerk sin-frontend-design: kein Rounded-Panels-Verbot gefunden (nur Broadsheet-Slop-Look); reale Konflikte: Font-Bann vs. Deck-System-Stack, Karten-in-Karten vs. runde Cards, fehlende Gates (impeccable/AccessLint/GSAP nicht installiert).

## 9. Flachen
- Website/Unterseiten: Rezepte in COMPONENTS.md.
- Owner/Pro-Apps: Workflows behalten, helle Sprache teilen; Migration je Flaeche mit Abnahme (EH-BRAND-05-APPS).
- `/admin/crm` ist React Server Component (kein Direkt-HTML-CRM, kein React-Hub im Repo). Kein Phantom-HTML-Adapter. Standalone-CRM ist separates Repo (docs/CRM.md).
- Repo ist PUBLIC, `main` aktuell UNPROTECTED: Guard-Workflow vorhanden, blockierend erst nach Aktivierung des erforderlichen Status (separater Settings-Schritt).

## 10. Evidenz
Atelier: verification.json (pass), VISUAL_REVIEW.md, 12 Screenshots + 2 Openings. Caller-Impact: PageHero 21/21, LinkButton 38/21, shell 22, tokens ~30, Logos 4-fach. Guard: `node scripts/brand-guard.mjs`. Refs: Issue #39, PR #41 (Draft), T-0151, #33.
