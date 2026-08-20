# Einfach Hausen

Produktionsnaher Full-Stack-Marktplatz für Eigenheimbesitzer und Handwerker/Dienstleister – umgesetzt nach dem gelieferten UI-Referenzbild. Kein statischer Prototyp: Registrierung, Rollen, Aufträge, Matching, Angebote, Annahme, Termine, Nachrichten, Statusworkflow, Bild-Uploads, Zahlungen und Bewertungen arbeiten mit einer echten Datenbank.

## Funktionen

- **Eigenheimbesitzer:** Freitext-Anfrage mit automatischer Kategorisierung, Budget/Termin/PLZ/Foto, Auftragsübersicht, Angebotsvergleich, Auftragserteilung, Kalender, Chat, Stripe-Zahlung, Bewertung.
- **Dienstleister:** Gewerke/Region/Radius, passende Anfragen, Angebote erstellen/aktualisieren, angenommene Aufträge, Arbeitsstatus, Termine, Chat, Profil.
- **Plattform:** Session-Auth mit HttpOnly-Cookies, bcrypt-Passwort-Hashes, SQLite/WAL, rollenbasierte Zugriffe, sichere Stripe-Checkout-Integration.

## Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Öffne `http://localhost:3000`. Für die lokale Kernfunktion sind keine externen Services nötig. Stripe-Zahlungen werden nur aktiviert, wenn `STRIPE_SECRET_KEY` gesetzt ist.

## Produktionsbetrieb

1. Persistentes Volume für `DATABASE_PATH` bereitstellen (oder den Datenlayer für horizontale Skalierung auf Postgres migrieren).
2. Für Live-Zahlungen Stripe Secret und Webhook-Secret setzen.
3. TLS/HTTPS am Reverse Proxy aktivieren.
4. `npm run build && npm run start`.

## Kern-Datenmodell

`users`, `sessions`, `homeowner_profiles`, `provider_profiles`, `jobs`, `job_photos`, `quotes`, `appointments`, `messages`, `payments`, `reviews`.

## Workflow

1. Eigenheimbesitzer erstellt Anfrage.
2. Passende Dienstleister sehen sie im Anfragen-Dashboard.
3. Dienstleister gibt Preis, Verfügbarkeit und Nachricht ab.
4. Eigenheimbesitzer vergleicht und nimmt ein Angebot an.
5. Termin und Chat werden freigeschaltet.
6. Dienstleister setzt Auftrag auf *in Arbeit* und *erledigt*.
7. Zahlung läuft über Stripe Checkout; danach kann bewertet werden.

## Design

- Kundenseite: hell, grün, ruhig, an der linken Smartphone-Ansicht der Referenz orientiert.
- Dienstleisterseite: dunkel/navy, kompakte Karten, an der rechten Smartphone-Ansicht orientiert.
- Mobile-first, auf Desktop als hochwertiger App-Frame dargestellt.
