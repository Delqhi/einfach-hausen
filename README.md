# Einfach Hausen

> **Ein Ansprechpartner für alles rund ums Eigenheim.**
>
> **Du sagst, was dein Haus braucht. Wir kümmern uns um den Rest.**

Einfach Hausen ist ein digitaler Hausmeister für Eigenheimbesitzer. Die KI versteht freie Anfragen über App oder WhatsApp, klärt fehlende Informationen, erstellt Richtpreise, disponiert geprüfte regionale Vertragspartner und vergleicht Angebote. **Nach der Buchung erhält der Kunde einen konkreten menschlichen Ansprechpartner beim ausführenden Unternehmen.**

Die verbindliche Produktdefinition steht in [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md).

## Live Pilot

- App: `https://einfach-hausen.delqhi.com`
- Runtime: OCI `sin-supabase`
- Cloudflare: existing `sin-kestra` tunnel
- Process supervisor: systemd (`einfach-hausen.service`)
- Backups: existing self-hosted Supabase Storage
- Scheduled health checks: existing Kestra

The pilot deliberately keeps the working core small. SQLite remains the transactional app database on the single OCI host for now; Supabase and Kestra are reused for platform services instead of rebuilding storage and scheduling from scratch. See `docs/OPERATIONS.md`.

## Kernablauf

1. Kunde schreibt, spricht oder lädt ein Foto hoch.
2. Der KI-Hausmeister fragt nur fehlende Informationen ab.
3. Leistung, Termin, Region und Preisorientierung werden ermittelt.
4. Geeignete aktive Vertragspartner werden disponiert.
5. Angebote werden nach Preis, Termin, Entfernung und Qualität verglichen.
6. Der Kunde bucht mit einem Klick.
7. Ein persönlicher Ansprechpartner des Partnerbetriebs wird zugewiesen.
8. Kunde und Ansprechpartner können direkt schreiben, anrufen und Termine abstimmen.
9. Der KI-Hausmeister bleibt für Hausakte, Organisation, Erinnerungen und Servicefälle verfügbar.
10. Nach Abschluss bleibt der Ansprechpartner für Folgeaufträge gespeichert.

## Kunden-App

- KI-Hausmeister als Hauptoberfläche
- Freitext, Foto und Spracheingabe
- mehrstufige Rückfragen bei fehlenden Auftragsdaten
- optionaler OpenAI-kompatibler KI-Gateway, mit deterministischem Fallback
- Richtpreise
- regionales Qualitätsmatching
- Angebotsvergleich: Empfehlung / günstigster Preis / schnellster Termin
- Ein-Klick-Buchung
- persönlicher Ansprechpartner nach Buchung
- direkter Chat / Telefon / Terminabstimmung
- „Meine Ansprechpartner“ für dauerhafte Kundenbeziehungen
- digitale Hausakte „Mein Haus“
- Anlagenregister für Heizung, Wärmepumpe, PV, Speicher, Wallbox, Dach, Garten und Smart Home
- wiederkehrender Wartungs- und Hausjahresplan
- private Rechnungen, Nachweise und Belege
- Bewertungen
- Service-/Problemfälle
- Benachrichtigungen
- WhatsApp Cloud API
- PWA-Manifest

## Kunden-Tarife

| Tarif | Preis | Kernnutzen |
|---|---:|---|
| FREE | 0 €/Monat | KI-Hausmeister, Aufträge, Angebote, Vermittlung, Ansprechpartner, Hausakte |
| PLUS | 19,90 €/Monat | Wartungsplanung, Hausjahresplan, Erinnerungen, Dokumente, Prioritätsservice |
| PREMIUM | 39,90 €/Monat | höchste Servicepriorität, jährlicher Hauscheck, automatische Wartungsorganisation, erweiterte Betreuung |

Jahrespakete sind zusätzlich möglich und erzeugen konkrete Aufgaben im Hausjahresplan.

## Partner-App

Ein Unternehmen wird erst nach Unternehmensprüfung und aktivem Partnervertrag disponiert.

### Ansprechpartnermodell

Eine Firma hat 1–X Ansprechpartner mit eigenem Login. Es gibt bewusst nur eine fachliche Berechtigung:

**Aufträge verwalten AN/AUS**

AN bedeutet: neue Anfragen sehen, Angebot senden, annehmen/ablehnen und gebuchte Aufträge zuweisen.  
AUS bedeutet: nur eigene zugewiesene Aufträge sehen, Kundenkontakt, Termin, Status, Dokumente und Abschluss.

Keine ERP-Rollenmatrix.

## Partner-Tarife

| Tarif | Preis | Provision |
|---|---:|---:|
| FREE | 0 €/Monat | 0 % |
| START | 29 €/Monat | 0 % |
| PRO | 79 €/Monat | 0 % |
| PREMIUM | 199 €/Monat | 0 % |

START/PRO/PREMIUM haben 60 Tage Testphase. Der Partner-Tarif beeinflusst **nicht** das Qualitätsmatching.

## Matching

Berücksichtigt werden unter anderem:

- Gewerk / Fachgebiet
- Qualifikation und Vertragsstatus
- Entfernung
- Verfügbarkeit
- aktuelle Kapazität
- Bewertungen
- Preis / tatsächliches Angebot
- bestehende Kundenbeziehung
- bereits bekannter Ansprechpartner

## Zahlungen

- Stripe Checkout für Kunden-Mitgliedschaften
- Stripe Checkout für Partner-Tarife
- Stripe Checkout für Jahrespakete
- Stripe Connect für Auftragszahlungen
- **0 % Plattformprovision pro Auftrag**
- signierter Stripe-Webhook

Der konkrete rechtliche, steuerliche und haftungsrechtliche Aufbau muss vor kommerziellem Livebetrieb fachlich geprüft werden.

## KI-Gateway

Optional kann die Anfrageextraktion über einen OpenAI-kompatiblen Gateway laufen. Auf der OCI-Installation wird dafür OmniRoute lokal genutzt.

```env
AI_BASE_URL=http://127.0.0.1:20128/v1
AI_MODEL=auto/best-fast
AI_API_KEY=
# Alternativ wird OMNIROUTE_MASTER_KEY gelesen.
```

Ohne Gateway bleibt die Kernfunktion über einen deterministischen Parser funktionsfähig.

## Stack

- Next.js 16 / React 19 / TypeScript
- SQLite + WAL via `better-sqlite3`
- HttpOnly Sessions + bcrypt
- Stripe / Stripe Connect
- OpenAI-kompatibler KI-Gateway
- serverseitige Actions
- private Dokumentablage
- PLZ-Geocoding + Distanzmatching
- Playwright E2E

## Lokal starten

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Qualitätschecks

```bash
npm run lint
npm run build
E2E_ADMIN_PASSWORD='<lokales-testpasswort>' npm run test:e2e
```

## Produktion

Die erste produktive Installation läuft auf der OCI-VM `sin-supabase` hinter einem Cloudflare Tunnel. Der Dienst bindet nur auf Loopback; der öffentliche Zugriff erfolgt ausschließlich über Cloudflare TLS.

- persistenter Datenpfad für SQLite und private Dateien
- systemd-Dienst mit automatischem Restart
- Cloudflare Tunnel
- Admin-Passwort außerhalb von Git
- KI-Gateway-Key außerhalb von Git
- Stripe-/WhatsApp-Secrets außerhalb von Git
- Stripe-Betrieb über den kanonischen `wow-my-zsh/shared/skills/sin-stripe`-Skill; Einfach-Hausen-Secrets bleiben in Infisical und werden nur in die private OCI-Runtime injiziert

## Repository

GitHub: `Delqhi/einfach-hausen`
