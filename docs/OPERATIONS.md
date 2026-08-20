# Einfach Hausen — Pilotbetrieb auf OCI

## Ziel

Der Pilot soll bewusst einfach bleiben: ein Next.js-Dienst, ein persistentes Datenverzeichnis, Cloudflare Tunnel davor und vorhandene SIN-Infrastruktur dort nutzen, wo sie Komplexität reduziert.

## Produktionsroute

`Internet -> Cloudflare -> sin-kestra Tunnel -> 127.0.0.1:3010 -> einfach-hausen.service`

Öffentlich: `https://einfach-hausen.delqhi.com`

## Laufzeit

- Code: `/srv/einfach-hausen`
- Runtime-Konfiguration: `/etc/einfach-hausen.env` (nicht in Git)
- Datenbank: `/var/lib/einfach-hausen/einfach-hausen.db`
- Service: `einfach-hausen.service`
- Public health: `/api/health`

## Bestehende OCI-Bausteine

### Supabase

Für den Pilot bleibt die transaktionale App-Datenbank SQLite, weil sie bereits funktioniert und auf einer einzelnen OCI-Instanz die geringste Betriebs-Komplexität hat. Supabase wird sofort für private Backups innerhalb des bestehenden Storage-Stacks wiederverwendet. Eine spätere Migration auf Postgres/Supabase ist damit möglich, ohne jetzt Auth, SQL und sämtliche Workflows gleichzeitig umzubauen.

Bucket: `einfach-hausen-backups` (privat)

### Kestra

Kestra überwacht den App-Health-Endpoint alle zehn Minuten über einen ausschließlich auf das private Kestra-Docker-Netz gebundenen systemd-Socket-Proxy. Der eigentliche Next.js-Dienst bleibt auf `127.0.0.1` gebunden. Geschäftliche Zeitpläne wie Wartungserinnerungen können später ebenfalls in Kestra ergänzt werden, statt eigene Cron-Frameworks in die App einzubauen.

Flow: `einfach.hausen/einfach_hausen_health`

Private Kestra-Route: `172.28.50.1:3010 -> systemd-socket-proxyd -> 127.0.0.1:3010`

## Deployment

```bash
sudo /srv/einfach-hausen/deploy/update-on-oci.sh
```

Der Ablauf ist absichtlich einfach: `fetch -> main -> npm ci -> build -> systemd restart -> health check`.

## Backup

`einfach-hausen-backup.timer` erstellt nachts über SQLite Online Backup eine konsistente Kopie und lädt sie in den vorhandenen selbst gehosteten Supabase-Storage. Lokale Kopien werden sieben Tage behalten.

## Recovery

1. App stoppen.
2. Gewünschtes Backup aus dem privaten Supabase-Bucket herunterladen.
3. Als `/var/lib/einfach-hausen/einfach-hausen.db` einsetzen.
4. Besitzer/Rechte prüfen.
5. `systemctl start einfach-hausen`.
6. `/api/health` und die öffentliche URL prüfen.
