# Test- und Deploy-Ablauf

Stand: 2026-09-10. **Nichts hiervon automatisch ausführen, ohne es zu wollen:**
Deploy läuft ausschließlich über das freigegebene Script auf dem
Deploy-Host. Diese Datei beschreibt nur den Ablauf.

## Vor jedem Release (Pflicht)

```sh
npm run lint
npm run build
npm run test:e2e
```

Weitere Abgrenzungen aus `package.json`:

- `npm run test:public-site` — Vertrag der öffentlichen Website
- `npm run test:public-nav` — Navigation der öffentlichen Website
- `npm run test:security` — Sicherheits-Regressionen
- `npm run test:smoke` — Produktions-Smoke nach dem Deploy

## Deploy (OCI)

- Script: `deploy/update-on-oci.sh` (auf dem Deploy-Host ausführen,
  **nicht** von hier aus starten).
- Das Script verlangt Branch `main`, Node 22 und prüft nach dem Deploy
  die Gesundheit über `GET /api/health`.
- Persistente Daten liegen unter `/var/lib/einfach-hausen`
  (Datenbank, Uploads); Backups unter `/var/backups/einfach-hausen`
  (siehe `docs/OPERATIONS.md`).
- Details zu DNS, Routing und Übergaben: `docs/PRODUCTION_HANDOVER.md`,
  `docs/OPERATIONS.md`. Erst lesen, dann handeln.

## Verbote

- Kein Deploy aus der Entwickungsumgebung per Handkopie;
  Code wandert nur über Git (freigegebener Branch) auf den Host.
- Keine Produktions-Secrets in Docs oder Chat ausgeben.
