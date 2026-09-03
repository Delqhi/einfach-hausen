# NEXT AGENT — Handoff & Handback

**Stand:** 2026-09-03 ~23:55 UTC  
**Letzte Merges auf main:**
- `c711b167` (PR #19): UI-Konvergenz-Welle über Admin, CRM, Eigentümer-App und Partner-App.
- `ef20da18` (PR #20): Dokumentation der UI-Konvergenz-Meilensteine.

---

## 1. Was ist 100% fertig und verifiziert?

1. **Eigentümer-App (`/app/page.tsx`):**
   - Hausmeister-Composer ist primäre Hauptaktion direkt unter der Begrüßung.
   - „Als Nächstes“ (Termine, Quotes, Wartung) folgt direkt darunter.
   - FAB entfernt, Schnellaktionen dezent untergeordnet.
2. **Handwerker-App (`/pro/page.tsx`):**
   - ERP-Dashboard aufgelöst: 4 KPI-Karten durch eine ruhige Arbeits-Zusammenfassungsleiste ersetzt.
   - Ein klarer nächster Schritt („Kostenvoranschlag senden“) vor der Auftragsliste.
3. **Admin & CRM (`/admin/page.tsx`, `/admin/crm/page.tsx`, `admin.module.css`):**
   - Harmonisierung auf den Token-Kanon (`#faf8f4` Canvas, `#105258` Petrol, `#e4e2dc` Borders).
4. **Webseiten-Archetypen (`/leistungen`, `/preise`, `/hausakte`, `/partner`, `/sicherheit`, `/so-funktionierts`):**
   - Differenzierte Layouts statt repetitiver Kachelwüsten.

---

## 2. Offene Aufgaben für den nächsten Agenten / Host-Lauf

1. **Visual Regression Baselines aktualisieren:**
   ```bash
   npm run test:visual:update
   npm run test:visual:apps:update
   ```
   *Grund:* Die Layouts von `/app`, `/pro` und den Marketing-Unterseiten wurden strukturell verbessert; die alten Screenshots schlagen wegen Intentional Diffs an.
2. **Release Gate laufen lassen:**
   ```bash
   npm run release-gate
   ```
3. **Deploy & Smoke:**
   ```bash
   deploy/update-on-oci.sh
   npm run test:smoke
   ```
