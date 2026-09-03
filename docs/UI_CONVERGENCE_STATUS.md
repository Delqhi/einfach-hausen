# UI & Frontend Convergence Status

Stand: September 2026

## 1. Erledigte Meilensteine

- **PR #18 & PR #19 erfolgreich gemerged:**
  - **P0 Ladezustände:** Entfernung irreführender Vorbereitungs-Overlays.
  - **Kanonische Design-Tokens:** `src/components/marketing/tokens.css` definiert die verbindlichen Werte für Farben (Teal-Skala, warmes Canvas `#faf8f4`, Ink `#10222a`), Radien, Rhythmus und Schatten.
  - **Eigentümer-App (`/app`):** Neuordnung der Startseite: Der KI-Hausmeister-Composer steht ganz oben als dominante Hauptaktion; Termine/Wartungen folgen unter „Als Nächstes“; FAB entfernt.
  - **Handwerker-App (`/pro`):** Reduzierung des ERP-artigen 4er-KPI-Blocks auf eine saubere Arbeits-Zusammenfassungsleiste mit Fokus auf den nächsten Arbeitsschritt.
  - **Admin & CRM (`/admin`, `/admin/crm`):** Einheitlicher visueller Standard für Listen, KPIs und Formulare.
  - **Seiten-Archetypen:** Differenzierung von `/leistungen`, `/preise`, `/hausakte`, `/partner`, `/sicherheit` und `/so-funktionierts`.

## 2. Nächste Schritte

1. **Visuelle Regression & Baselines:**
   - Neue Snapshots aufnehmen für `/app`, `/pro` und überarbeitete Marketing-Seiten (`npm run test:visual:update` bzw. `npm run test:visual:apps:update`).
2. **CSS-Konsolidierung:**
   - Schrittweises Ablösen redundanter Klassen aus `design-system.css` zugunsten von CSS-Modulen.
