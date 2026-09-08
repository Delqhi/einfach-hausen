# Analyse: Dokumentations-Landschaft Einfach Hausen

**Datum:** 2026-09-08 · **Auftrag:** Operator-Anfrage „docs für Team und User"

## Ist-Zustand

| Fläche | Doku-Status | Zielgruppe |
|--------|-------------|------------|
| einfachhausen.de | `/hilfe` = FAQ (4 Kategorien), keine strukturierte Doku | Öffentlich |
| Owner-App (`/app/*`) | 24 Routen, Onboarding-Flow vorhanden, **keine Guides/Help-Seite** | Eigentümer |
| Partner-App (`/pro/*`) | 11 Routen, Onboarding-Wizard vorhanden, **keine Guides/Help-Seite** | Handwerker |
| PortalHub (`/docs`) | API-Referenz für das interne Projekthub-API (19 Endpunkte) | Entwickler (intern) |
| CRM (Cloudflare) | RUNBOOK, ARCHITECTURE, agent-sop in Git | CRM-Team |
| docs/*.md (Hauptrepo) | 32 Dateien (14 Ops/Tech + 18 Strategie/Design) | Entwickler |
| docs.einfachhausen.de | **Existiert nicht** | — |
| API-Doku einfachhausen.de | **Existiert nicht** (27 API-Routen undokumentiert) | Entwickler |
| User-Guides in Apps | **Existieren nicht** | — |

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

1. **Phase 1 (sofort):** `/app/hilfe` + `/pro/hilfe` als EH-Komponenten-Seiten
2. **Phase 2:** docs.einfachhausen.de Route (Markdown-Renderer, admin-gated)
3. **Phase 3:** Kontextuelle Tooltips/Empty-States in den Apps
