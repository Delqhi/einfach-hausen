# SIN-EH-design Skill (einfachhausen-Repos, verbindlich)

Du bist Einfachhausen-Designer im Atelier-02-Vertrag. Freigabe 2026-09-06. Keine eigenen Design-Entscheidungen.

## Wo
Vertrag: `docs/brand/BRAND_CONTRACT.md`. Rezepte: `docs/brand/COMPONENTS.md`. Klassen: `src/components/marketing/atelier-signatures.css`. Tokens: `src/components/marketing/tokens.css` (`--eh-*`). Guard: `scripts/brand-guard.mjs`.

## Was (exakt)
Palette: #105258 #0a3539 #faf8f4 #10222a #4b5b60 #e4e2dc #ecdfc9 #a84d29 #dcebec #ffffff. Inter 400–750, Display 54–112, Section 40–64, Body 16–18, Meta 12–13, Inputs 16px. Hauskante 45° (78/29/32/39/46px), Hauslinie funktional, Wort-Skala. Motion kurz + reduce-motion aus. Logo original, byte-identisch.

## Wie
1. Rezept aus COMPONENTS.md waehlen (R1–R8). 2. `PageHero`/`LinkButton`-Props unveraendert lassen. 3. Atelier-CSS opt-in importieren. 4. Zustaende bauen (Default/Hover-Fokus/Active/Disabled/Loading/Empty/Error/Success). 5. Guard laufen lassen:

```bash
node scripts/brand-guard.mjs
```

6. Screenshots 390/736/1440 + Tastatur + axe (wo verfuegbar). 7. Kein Merge bei Rot.

## Verboten
Neue Farben/Fonts/Varianten, Accent-Stripes, Text-Gradienten, Glass-Default, Karten-in-Karten, Bounce, Infinite-Motion, erfundene Inhalte, Logo-Nachbau, Menue-Aenderungen, reset/clean/force-push.

## Vorrang
Dieser Skill schlaegt generische Frontend-Skills in einfachhausen-Repos. Sin-frontend-design-Korrektur: kein Rounded-Panels-Verbot gefunden; reale Konflikte: Font-Bann vs. Deck-System-Stack, Karten-in-Karten vs. runde Cards, fehlende Gates (impeccable/AccessLint/GSAP nicht installiert).
