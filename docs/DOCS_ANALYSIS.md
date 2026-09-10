# Analyse: Dokumentations-Landschaft Einfach Hausen

**Datum:** 2026-09-08 · **Auftrag:** Operator-Anfrage „docs für Team und User"

> **Richtigstellung 2026-09-10 (HEAD `0503da3`):** `/app/hilfe`, `/pro/hilfe` und `/docs-internal` (inkl. `/docs-internal/[doc]`, admin-gated) existieren — die gegenteilige Ist-Aussage vom 2026-09-08 war falsch und ist unten korrigiert. Empfehlungs-Phasen 1 und 2 sind damit umgesetzt.

## Ist-Zustand (korrigiert 2026-09-10)

| Fläche | Doku-Status | Zielgruppe |
|--------|-------------|------------|
| einfachhausen.de | `/hilfe` = FAQ (4 Kategorien), keine strukturierte Doku | Öffentlich |
| Owner-App (`/app/*`) | 25 Routen (Stand 2026-09-10, HEAD `0503da3`), Onboarding-Flow + **`/app/hilfe`-Guide vorhanden** | Eigentümer |
| Partner-App (`/pro/*`) | 13 Routen (Stand 2026-09-10, HEAD `0503da3`), Onboarding-Wizard + **`/pro/hilfe`-Guide vorhanden** | Handwerker |
| PortalHub (`/docs`) | API-Referenz für das interne Projekthub-API (19 Endpunkte) | Entwickler (intern) |
| CRM (Cloudflare) | RUNBOOK, ARCHITECTURE, agent-sop in Git | CRM-Team |
| docs/*.md (Hauptrepo) | 32 Dateien (14 Ops/Tech + 18 Strategie/Design) | Entwickler |
| docs.einfachhausen.de | **Umgesetzt als `/docs-internal`-Route** (admin-gated, rendert `docs/*.md`; Stand 2026-09-10) | Team (admin) |
| API-Doku einfachhausen.de | **Teils umgesetzt:** `/docs-internal` rendert Repo-Docs; 27 API-Routen (23 Bereiche) weiter ohne separate API-Referenz | Entwickler |
| User-Guides in Apps | **Umgesetzt:** `/app/hilfe` + `/pro/hilfe` (Stand 2026-09-10) | Eigentümer / Handwerker |

## Empfehlung: 2 getrennte Docs-Stränge

### 1. Entwickler-Docs → docs.einfachhausen.de

- **Zielgruppe:** Jerry + zukünftige Entwickler
- **Hosting:** Next.js Route in einfach-hausen (Subdomain-Route oder Pfad `/docs-internal`), statisch generiert aus `docs/*.md`
- **Zugang:** Team-only (Supabase Rolle `admin` oder Cloudflare Access)
- **Inhalt:** ARCHITECTURE, API-Referenz (27 Routen), DB-Schema, Auth-Flow, Deploy-Runbook, CRM-Integration, Design-System-Referenz, Monitoring/SLOs
- **Quelle:** Bestehende `docs/*.md` (kein neues Framework, kein MDX nötig — einfache Markdown-Rendering-Route reicht)

### 2. User-Docs → In den Apps selbst

- **Owner-Guide:** `/app/hilfe` — kontextuelle Feature-Guides (Hausakte, Wartung, Rechnungen, Termine, Nachrichten, Hausmeisterservice)
- **Partner-Guide:** `/pro/hilfe` — Angebote, Termine, Team, Rechnungen, Fähigkeiten
- **Form:** EH-Komponenten (EHAppHeader, EHPanel, EHList), kontextuell, keine Tech-Docs
- **Onboarding:** Bestehende Onboarding-Flows erweitern um Help-Links

### Was NICHT in die Apps gehört:
- API-Endpunkte, DB-Schema, Deploy-Runbook → docs.einfachhausen.de
- Produktions-/Ops-Details → Git only

## Umsetzungsreihenfolge

1. **Phase 1: ERLEDIGT (Stand 2026-09-10)** — `/app/hilfe` + `/pro/hilfe` existieren
2. **Phase 2: ERLEDIGT (Stand 2026-09-10)** — `/docs-internal`-Route (admin-gated Markdown-Renderer, inkl. `/docs-internal/[doc]`)
3. **Phase 3:** Kontextuelle Tooltips/Empty-States in den Apps
