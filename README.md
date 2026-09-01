# Einfach Hausen

<p align="left"><img src="public/brand/logo-full.png" alt="einfachhausen Logo" width="220" /></p>

> **Ein Ansprechpartner für alles rund ums Eigenheim.**
>
> **Du sagst, was dein Haus braucht. Wir kümmern uns um den Rest.**

Einfach Hausen ist die zentrale Anlaufstelle für Eigenheimbesitzer. Der Kunde beschreibt ein Problem und entscheidet selbst: **nur einen konkreten menschlichen Ansprechpartner sprechen** oder **einen echten Auftrag organisieren lassen**. Kontakte, Hausdaten, Termine und Dokumente bleiben dauerhaft beim Haus. Die KI arbeitet im Hintergrund als Assistenz- und Organisationsschicht, ist aber nicht das eigentliche Kundenversprechen.

Die verbindliche Produktdefinition steht in [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md). Die strategische Positionierung als **persönlicher Hausmanager / Betriebszentrale für das eigene Zuhause** steht in [`docs/PRODUCT_POSITIONING.md`](docs/PRODUCT_POSITIONING.md). Das langlebige Daten- und Berechtigungsmodell steht in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Agenten & kanonischer Arbeitsstand

Alle Agents arbeiten in diesem Repository **am selben Ziel**. Es gibt keinen zweiten Engineering-Taskplan in README, Issues oder Worker-Reports. Der verbindliche Einstieg ist [`docs/NEXT_AGENT.md`](docs/NEXT_AGENT.md); der transaktionale Taskstatus liegt in `.sin-gpt-web/taskplan.sqlite3` und wird nach `.sin-gpt-web/TASKPLAN.md` gerendert.

Aktueller Endpfad: **T-0171 Final Convergence abgeschlossen (2026-08-29, deployed) → offen: T-0006 e2e Modernisierung**. Bereits erledigte oder abgelöste Wellen werden nicht erneut begonnen. Neue Implementierungsarbeit entsteht nur aus einem reproduzierbaren Acceptance-Fehler und wird als kanonischer Remediation-Task erfasst.

## Systemübersicht

![Einfach Hausen Plattformarchitektur](docs/diagrams/platform-architecture.svg)

[Interaktive Architektur öffnen](docs/diagrams/platform-architecture.html) · Detailansichten: [Eigentümer-Serviceflow](docs/diagrams/homeowner-service-flow.html), [Partner-/Auftrags-Lifecycle](docs/diagrams/partner-job-lifecycle.html), [Hausakte & Datenschutz](docs/diagrams/property-privacy-dataflow.html), [Zahlungen](docs/diagrams/payment-lifecycle.html), [CRM & Outreach](docs/diagrams/crm-outreach-flow.html), [Production & Recovery](docs/diagrams/production-recovery-flow.html).


## Live Produktion (HA)

- App: `https://einfachhausen.de`
- Runtime: OCI `sin-supabase`
- Cloudflare: `sin-kestra` tunnel
- Process supervisor: systemd (`einfach-hausen.service`)
- **App-Datenbank: SQLite** (`better-sqlite3`, `DATABASE_PATH`) — bewährter Single-Node-Betrieb mit Backup-Pflicht
- **Auth: SIN Supabase OSS (self-hosted, `https://supabase.delqhi.com`)** — serverseitig autoritative Identität (`auth_subject`); Supabase ist **nicht** die App-Datenbank
- **Primärer Storage: Supabase Storage** für `private/` und `uploads/` (Fotos, Dokumente, Rechnungen, Haus-Historie) — `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_STORAGE_BUCKET`
- **Fallback/Local Dev: SQLite + WAL via `better-sqlite3`** (`DATABASE_PATH=./data/einfach-hausen.db`) nur für lokale Entwicklung und als Offline-Fallback, nicht mehr als Produktions-Primary
- **Mobile HA: Capacitor 6** — Next.js App wird als native iOS/Android Hülle ausgeliefert (siehe `Mobile App / Capacitor`)
- Scheduled health checks: Kestra

Produktion ist ein **Multi-User-Betrieb** auf Single-Node-Basis: App-Daten in SQLite (persistenter Pfad + Backup), Auth gegen den self-hosted SIN-Supabase-Stack (Autorität serverseitig verifiziert). Ein Supabase-Storage-Adapter ist **nicht implementiert**; `private/`/`uploads/` laufen über persistente lokale Verzeichnisse. Historische HA-/Postgres-Migrationsplanung (T-0166) wurde nie ausgeführt und ist nicht Teil des aktuellen Taskplans. Siehe `docs/OPERATIONS.md` und `docs/ARCHITECTURE.md`.

## Kernablauf

1. Kunde schreibt, spricht oder lädt ein Foto hoch.
2. Der KI-Hausmeister beantwortet und ordnet das Thema ein; **noch entsteht weder Vermittlung noch Auftrag**.
3. Der Kunde entscheidet: **Ansprechpartner finden** oder **Auftrag organisieren**.
4. Beim Ansprechpartner-Weg wird ein passender geprüfter Betrieb angefragt. Ein konkreter Mensch kann übernehmen, ohne Angebot und ohne Buchung.
5. Beim Auftrags-Weg fragt die KI nur fehlende Auftragsdaten ab, ermittelt eine Preisorientierung und disponiert passende Partner.
6. Angebote werden nach Preis, Termin, Entfernung und Qualität verglichen.
7. Der Kunde bucht bewusst.
8. Ein konkreter Ansprechpartner des Partnerbetriebs wird spätestens jetzt zugewiesen.
9. Kunde und Ansprechpartner können direkt schreiben, anrufen und Termine abstimmen.
10. Der KI-Hausmeister bleibt parallel für Fragen, Hausakte, Organisation, Erinnerungen und Servicefälle verfügbar.
11. Ein bereits verbundener Ansprechpartner bleibt in der Hausakte und kann später ohne neue Suche kontaktiert werden.
12. Aus einer reinen Kontaktanfrage kann der Kunde später separat einen Auftrag machen.

## Visuelles Produktdesign

Die verbindliche UI-Richtung steht in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). Die Kunden-App ist mobile-first und folgt der Referenz: Startseite, Hausservice, Angebotsvergleich, Auftragsdetail, Mein Haus, Mein Jahr, Pakete, Aufträge, Partnerprofil und Einstellungen.

Für T-0165 gilt zusätzlich die Präsentations-Source-of-Truth-Kette: **Notion App Design → `DESIGN.md` → [`docs/PRESENTATION_BRAND.md`](docs/PRESENTATION_BRAND.md) → `presentation/premium/brand.config.json` → `presentation/premium/deck.html`**. Notion liefert visuelle Evidence, nicht automatisch fachliche Produktspezifikation. Änderungen am App-Design müssen deshalb immer auch auf Presentation Brand und Deck geprüft werden.

## Kunden-App

- Startseite mit Schnellaktionen, Terminen, Angeboten und Hausstatus
- fokussierter Hausservice unter `/app/hausmeister`
- Freitext, Foto und Spracheingabe
- echte Hausfragen zuerst beantworten, ohne automatisch einen Auftrag anzulegen
- klare Auswahl **Ansprechpartner finden** oder **Auftrag organisieren**
- mehrstufige Rückfragen nur bei fehlenden Daten des gewählten Wegs
- optionaler OpenAI-kompatibler KI-Gateway, mit deterministischem Fallback
- Richtpreise
- regionales Qualitätsmatching
- Angebotsvergleich: Empfehlung / günstigster Preis / schnellster Termin
- Ein-Klick-Buchung
- persönlicher Ansprechpartner auch ohne Buchungszwang
- Kontaktanfrage ohne Angebot/Preis und spätere Umwandlung in einen Auftrag
- direkter Chat / Telefon / Terminabstimmung
- „Meine Ansprechpartner“ für dauerhafte Kundenbeziehungen
- digitale Hausakte „Mein Haus“
- „Mein Jahr“ als Jahres-, Wartungs- und Aufgabenplan
- geprüfte Partnerprofile direkt aus dem Angebotsvergleich
- Anlagenregister für Heizung, Wärmepumpe, PV, Speicher, Wallbox, Dach, Garten und Smart Home
- wiederkehrender Wartungs- und Hausjahresplan
- private Rechnungen, Nachweise und Belege
- direkte Handwerker-Rechnungen in der App mit Positionen, MwSt., Zahlungsziel und optionaler Stripe-Zahlung
- großer Notfall-Einstieg mit Bereitschafts-/Entfernungs-/Qualitätsmatching
- eigener Beratungsweg ohne automatischen Auftrag
- Ansprechpartner nach Bereichen gruppiert, inklusive eigener Kategorien
- lebenslange Haus-Historie mit früheren Arbeiten, Kosten, Garantien, Fotos und Dokumenten
- digitaler Hauspass und übertragbare Immobilie mit Eigentümerhistorie
- Immobilienbewertung, Verkaufsinteresse und datenschutzgesteuertes Makler-Matching
- Bewertungen
- Service-/Problemfälle
- Benachrichtigungen
- WhatsApp Cloud API mit demselben Modell: KI zuerst, danach `ANSPRECHPARTNER` oder `AUFTRAG`
- PWA-Manifest

## Mobile App / Capacitor (iOS + Android) + PWA

Die Next.js-Anwendung ist die **Produktions-App für Web + iOS + Android**. Auslieferung erfolgt als:

- **Web:** Next.js direkt auf `https://einfachhausen.de` (PWA bleibt für Browser/Installierbarkeit)
- **iOS / Android:** **Capacitor 6** native Hülle (`@capacitor/core`, `@capacitor/ios`, `@capacitor/android`) um dieselbe Next.js-Build — keine zweite Codebase, kein Flutter/React-Native Rewrite

Enthalten (Web + nativ identisch):

- `manifest.webmanifest` mit App-Icons und Shortcuts
- Apple-Touch-Icon und `appleWebApp`-Metadaten
- Service Worker für Installierbarkeit und sichere Offline-Hinweise
- **keine privaten Auftrags-, Nachrichten- oder Hausdaten im Service-Worker-Cache**
- Safe-Area-Unterstützung für iPhone-Notch/Home-Indikator
- mobile Bottom-Navigation: Home, Aufträge, Termine, Ansprechpartner, Mehr
- 44px+-Touch-Ziele und 16px-Formfelder gegen iOS-Auto-Zoom
- `capacitor.config.ts` mit AppId `de.einfachhausen.app`, native Push (`@capacitor/push-notifications`), Camera/Filesystem via Supabase Storage
- App-Store Verteilung: App Store + Play Store sind **ab sofort aktiver Produktionspfad** (kein externer Blocker mehr), siehe `docs/ARCHITECTURE.md`

## Kunden-Tarife

| Tarif | Preis | Kernnutzen |
|---|---:|---|
| FREE | 0 €/Monat | Hausmeisterservice, Aufträge, Angebote, Ansprechpartner, Hausakte |
| PLUS | 19,90 €/Monat | Wartungsplanung, Hausjahresplan, Erinnerungen, Dokumente, Prioritätsservice |
| PREMIUM | 39,90 €/Monat | höchste Servicepriorität, jährlicher Hauscheck, automatische Wartungsorganisation, erweiterte Betreuung |

Jahrespakete sind zusätzlich möglich und erzeugen konkrete Aufgaben im Hausjahresplan.

## CRM & Leadgewinnung

Das dedizierte Akquise-/Outreach-Control-Plane liegt im separaten Repository `einfach-hausen-crm` und wird standalone unter `https://crm.einfachhausen.de` betrieben. Cloudflare Worker + D1 übernehmen dort Dedupe, Queue/Claims, Contact-History, Inbox/Replies und Follow-ups. Generic Research/Outreach bleibt in den gemeinsamen SIN-Fähigkeiten; es wird nicht in diesem Repo dupliziert.

Die Hauptanwendung enthält weiterhin `/admin/crm` und das SQLite-Leadmodell als ursprüngliche plattformintegrierte Operator-/Konvertierungsoberfläche und als Quellbestand für die erste verifizierte D1-Migration. Beide dürfen **nicht als zwei konkurrierende CRMs** weiterentwickelt werden. Recherchierte Betriebe bleiben zunächst Leads und werden **nicht** künstlich als registrierte Partner angelegt.

- Projektneutrale Handwerker-/Hausmeister-Recherche über `SIN-Business-Research`
- Deutschlandweiter Overture-Import mit E-Mail, Telefon, Website, Social-Links
  und Quellen-Provenienz soweit öffentlich vorhanden
- Pipeline von `Gesammelt` bis `Konvertiert`, plus `Nicht kontaktieren`
- Kontaktfreigabe/Einwilligung getrennt vom Vertriebsstatus
- Filter nach Leadtyp, Status, Gewerk, Firma, Ort und PLZ
- öffentliche Bedarfssignale (`public_intent`) aus kostenlosen RSS-/Forum-Quellen
  getrennt von identifizierten Eigentümer-Leads
- nicht-personenbezogene Objektchancen (`property`) aus offenen Geodaten
- manuelle Eigentümer-Leads aus Website, Empfehlung, Facebook-Gruppen, Foren,
  Communities und Kampagnen
- ein idempotenter Research-Sync importiert Betriebe, Intent-Signale und Objektchancen
- keine automatische Social-Profil-Ernte, Deanonymisierung oder Massen-DMs

Betrieb und Datenmodell: [`docs/CRM.md`](docs/CRM.md).

## Partner-App

Ein Unternehmen wird erst nach Unternehmensprüfung und aktivem Partnervertrag disponiert. Professionelle Anbieter verwenden **ein gemeinsames Konto**. Darin können mehrere Tätigkeiten gleichzeitig aktiviert werden, z. B. Handwerk, Dienstleistung, Immobilienmakler, Gutachter, Energieberatung oder Hausverwaltung. Tätigkeiten und konkrete Leistungsprofile sind getrennte Daten und später erweiterbar.

Makler können zusätzlich ein Suchprofil für Regionen, Immobilientypen, Preis- und Flächenbereiche pflegen. Freigegebene Immobilien-Leads erscheinen im selben Partnerzugang unter `/pro/leads`; Eigentümerkontaktdaten werden erst nach ausdrücklicher Freigabe sichtbar.

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

Optional laufen sowohl die freie Hausfrage als auch die Anfrageextraktion über einen OpenAI-kompatiblen Gateway. Auf der OCI-Installation wird dafür OmniRoute lokal genutzt. Ohne Gateway bleibt die strukturierte Auftrags-/Kontaktlogik deterministisch funktionsfähig; die freie Hausfrage fällt auf eine kurze sichere Orientierung zurück.

```env
AI_BASE_URL=http://127.0.0.1:20128/v1
AI_MODEL=auto/best-fast
AI_API_KEY=
# Alternativ wird OMNIROUTE_MASTER_KEY gelesen.
```

Ohne Gateway bleibt die Kernfunktion über einen deterministischen Parser funktionsfähig.

## Stack (Produktion HA)

- Next.js 16 / React 19 / TypeScript
- **Supabase (Auth, self-hosted OSS)** — `AUTH_MODE=supabase`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`; App-Daten via `DATABASE_PATH` (SQLite)
- **SQLite + WAL via `better-sqlite3` nur Fallback/Local Dev** (`DATABASE_PATH`)
- **Capacitor 6** für iOS + Android (native Hülle um Next.js)
- HttpOnly Sessions + bcrypt
- Stripe / Stripe Connect
- OpenAI-kompatibler KI-Gateway
- serverseitige Actions
- PLZ-Geocoding + Distanzmatching
- Playwright E2E

## Lokal starten

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Authentifizierung: Produktionsgrenze

Die Zielarchitektur für die geschützten Owner-/Provider-Flächen ist **Supabase serverautoritativ**. Lokale SQLite-/`mh_session`-Authentifizierung ist ausschließlich als expliziter Development-Fallback zulässig und darf in Produktion nicht stillschweigend greifen. Details, Testmatrix und T-0168-Visual-Acceptance: [`docs/T0168_DEEP_RESEARCH.md`](docs/T0168_DEEP_RESEARCH.md).

## Qualitätschecks

```bash
npm run lint
npm run build
E2E_ADMIN_PASSWORD='<lokales-testpasswort>' npm run test:e2e
E2E_ADMIN_PASSWORD='<lokales-testpasswort>' npm run test:e2e:architecture
npm run test:crm
```

## Aktueller technischer Vervollständigungsplan

Der kanonische `.sin-gpt-web/taskplan.sqlite3` enthält die aktuelle OCI-Convergence-Kette (T-0170 Auth, T-0169/T-0005 Notion-Visual, T-0171 Final Convergence). Historische Roadmap-Prosa (T-0100..T-0131, T-0166/T-0167) beschreibt frühere Planungsstände, nie ausgeführte Migrations-Tasks sind aus dem Plan gefallen. Der README ist nur ein Wegweiser; Status, Akzeptanz und Abhängigkeiten bleiben ausschließlich im kanonischen Taskplan (`sin-gpt-web-state --repo . summary`).

Nächster kanonischer Task: siehe `sin-gpt-web-state --repo . next`. Externe Blocker: siehe `docs/EXTERNAL-BLOCKERS.md` (nur verifizierte Fakten).

## Produktion (HA)

Die Produktion läuft auf OCI `sin-supabase` hinter Cloudflare Tunnel (Loopback-only, TLS nur via Cloudflare).

- **Supabase Postgres** als primärer DB-Cluster (HA) + **Supabase Storage** für private Dateien — Secrets in Infisical (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `SUPABASE_STORAGE_BUCKET`)
- **Lokaler Fallback** SQLite `/var/lib/einfach-hausen/einfach-hausen.db` nur für Dev/Notfall, nicht mehr Primary
- systemd-Dienst mit automatischem Restart
- Cloudflare Tunnel
- Admin-Passwort außerhalb von Git
- KI-Gateway-Key außerhalb von Git
- Stripe-/WhatsApp-Secrets außerhalb von Git
- Stripe-Betrieb über `wow-my-zsh/shared/skills/sin-stripe`; Secrets in Infisical, injiziert in OCI-Runtime
- **Capacitor iOS/Android Builds** aus selbem Next.js Artefakt (`npx cap sync` + `npx cap open ios/android`)

## Repository

GitHub: `Delqhi/einfach-hausen`

## Repository intelligence

This repository uses the fleet-wide Graphify architecture graph from `wow-my-zsh`. The graph is derived locally and kept out of Git.

```bash
npm run graph:install
npm run graph:update
npm run graph:check
graphify query "where is partner assignment handled?"
```

The local Graphify post-commit and post-checkout hooks keep `graphify-out/graph.json` current for agent architecture queries. Product truth remains `docs/PRODUCT_VISION.md`; Graphify is a technical code/dependency graph, not product or customer data storage.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0171`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen und vor allem App und Website auf Produktionsqualität verbessern
- Resume rule: read/validate the canonical taskplan and continue its highest-priority eligible task; do not create a competing roadmap.
- State 2026-08-29: DONE T-0170/T-0004/T-0169/T-0005/T-0171 (main=2307493, production bdebe9f, Smoke 17/17); open: T-0006 e2e modernization
- Taskplan sync: `pass`
- Synchronized at: `2026-08-29T18:59:08+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-31T20:53:01+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-31T20:53:03+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-31T20:52:53+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-31T20:52:54+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-29T05:56:51+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-29T08:50:05+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0200
updated: 2026-08-30T04:10:43+00:00
actor: local-agent
evidence-sha256: 425e861d61478080b23cc52ad6b64973eb901e909bbe35dd7fb24a555e299358
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0201
updated: 2026-08-30T04:29:48+00:00
actor: local-agent
evidence-sha256: c5758386de9a32943594941ee15b2faf7dd48bcd822565e0419448383e33c180
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0202
updated: 2026-08-30T04:39:54+00:00
actor: local-agent
evidence-sha256: 0bc75649da580b92e8c385c0ce01f150f9b48f18b1ac0d2c9ee40525373e504f
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0203
updated: 2026-08-30T04:59:52+00:00
actor: local-agent
evidence-sha256: b734c3298856af57db7cbd01c11010da44ffcc25472c8142ae1011378a1a4699
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0204
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: 26d2c37b44b0e2ecdd412fa38e9987742b09de7fdb3d65324b840eee1997f5d8
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0205
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: f1288185ef3bec19c87d3ccaf8e935f8a33480e8db7f734bae58d6874f3a4d43
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0042
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: b0522c720f2d26ef171afa4f8b0bd77eb82cd987694ae7791144c8df2c9124fd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0043
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: 7690208a2287a2d7d24bc2b266c299ac0cdbdaac3e76839323fb142c4ea23138
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0049
updated: 2026-08-31T20:52:49+00:00
actor: local-agent
evidence-sha256: 0d6781d978ed15bc779a17b686785e5efe3810adb2563c2731c51acc8f2f82c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0157
updated: 2026-08-31T21:16:05+00:00
actor: local-agent
evidence-sha256: 7f99e3ef8bfd11d211e6dbda80fa766914a185971e4f6883515209aba957fb5f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0160
updated: 2026-08-31T22:25:51+00:00
actor: local-agent
evidence-sha256: a0374312071e4a6d50a86e2706a720cb563cff292dd03c20102c6c0ac8b63098
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0161
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: 8347892ea96120456d7b66b9aba1440561a66d689fce427bda41928e3e8003b4
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0162
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: ff5ccd0484ed2266c6ce264e4b9f21b41f1bd97f7e8c73ff4c98e9216edf19cd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0163
updated: 2026-08-31T22:56:47+00:00
actor: local-agent
evidence-sha256: fb1882e2df32385413315728fdb2731a84376c39873250aa2cf0335a2c913c98
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0154
updated: 2026-09-01T00:56:58+00:00
actor: local-agent
evidence-sha256: 83e5ed487aff86dee8b825d9f06d859654d292349ec6538442ac1f725c3dbe1b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0152
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 75fc109f1509113951e589eae987093b5e6ae117d9fd29e758a6c673897685d3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0153
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 08da5c23cd9a4bb84512af6dc432989154d9da35f011f18bf9ef15fb7a650193
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0155
updated: 2026-09-01T01:47:14+00:00
actor: local-agent
evidence-sha256: 02c7cb988ff4f3990fdd17d9a4772d50152245ab2becbbd66f768202ec391bc8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0156
updated: 2026-09-01T03:30:24+00:00
actor: local-agent
evidence-sha256: 994ea2169cfa09d65fa7fa4e2b29c4f8e02de905c613b7d24ebd946ec7c7d4b0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0115
updated: 2026-09-01T03:30:25+00:00
actor: local-agent
evidence-sha256: ef7edcae3cf6bd3ad470c34205fa815916c109e4709b0298ac4f0a4068e48968
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0111
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: 87e072d5e2c574dbf26ce3c530c85fb1d6a5a871034892d6adf8dc40ec8a3ae9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0112
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: f193fa11049f920c888558209118f7b7592a95a4e86ace0c92274995b906db8d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0138
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: 0ab111892a30d55ad46e7f6232b32f64656dee72cc4b9937613c3f2a3d9c925a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0142
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: bceab63e963dd389c859027e3e4221a6a50386a99dfad656912ed9445f0038fe
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0113
updated: 2026-09-01T13:55:36+00:00
actor: local-agent
evidence-sha256: 07b6275707f950b590ed96ec928ab841e01791e4761d591f616d20f0fc5e80cc
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0114
updated: 2026-09-01T13:57:24+00:00
actor: local-agent
evidence-sha256: db6e60f478405d43372683fbf7d760ddb32ef5fb7c5c608ca152e3115cca052b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0116
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: cfbef8fb88b67a309e81fa923357ecfc6f2a6808005e9d697e457401171f9ce5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0117
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: 32b178026b6612aa0bc5ea8813b094a8e7b84293e8c9f8a5706a02435767ed03
-->
