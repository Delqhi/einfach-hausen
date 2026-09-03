# App-Design-Audit (Owner + Pro), 2026-08-30 — Designer-Boss

Audit-Methode: Echte 390x844 Screens aller 19 App/Pro-Screens mit
Seed-Usern (scripts/app-audit.mjs, pro-audit.mjs, seed-*.cjs).

## Bewertung: 7/10 — solides Fundament, aber Brand-Split sichtbar

### Befunde
1. [hoch] FARB-SPLIT: App nutzt #14735c (Notion-Grün) + Cream-Hintergrund
   (#faf6ef), Website nutzt #105258 (Logo-Teal) + #f4f7f7. Nutzer sieht
   beim Wechsel Website→App zwei unterschiedliche Marken.
2. [hoch] pro-home leer: "Keinem Unternehmen zugeordnet" + keine
   Demodaten — Seed liefert leere States (nicht die App-Schuld, aber die
   Premium-Wirkung leidet ohne echte Inhalte).
3. [mittel] pro-plans & app-plans: Preise in App (#14735c-Buttons)
   vs. Website-Preisseite (#105258) — gleiche Info, zwei Farben.
4. [mittel] Font-Split: Website Inter Variable, App noch
   System/Inter-Fallback-Stack (kein next/font/local).
5. [niedrig] app-home "Kl" Badge unklares Kürzel; Leere-States teils
   ungestylt (pro-leads leer ohne Illustration).

### Was schon gut ist
- Konsistente Karten-Sprache (Radii, Shadows), Bottom-Nav, Hausmeister-
  Composer als Herzstück ist stark, Status-Pills, Composer-„KI"-Chip.

## Beschlossene Hebel-Planung (App-Design-Welle, separater Plan)
- A1 [P0] App-Konvergenz auf Logo-Palette (globals.css v2-Block auf
  #105258-Familie + Background #f4f7f7) NUR nach Visual-Acceptance gegen
  die 12 Notion-Referenzen (scripts/t0169-visual-diff.py als Gate).
- A2 [P0] Inter Variable in der App (next/font/local im app layout).
- A3 [P1] Empty-States mit Illustration + CTA (pro-leads, pro-jobs leer).
- A4 [P1] „KI"-Badge → sprechendes Label ("Hausmeister").
- A5 [P2] Demo-Daten-Seeder für Screenshots/Dev (scripts/seed-demo
  erweitern) — zeigt Premium statt leer.
- Gate je Hebel: build, lint, t0169-visual-diff (Pixel-Abweichung),
  Screenshots, auth-regressionen.
- Randbedingung: A1+A2 dürfen NICHT stillschweigend — Re-Abnahme nötig
  (DESIGN.md §3 App-Delta). Entscheidung: Umsetzung als eigener Branch +
  Acceptance-Report für den Operator.
