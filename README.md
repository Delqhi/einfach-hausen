# Einfach Hausen

> **Ein Ansprechpartner für alles rund ums Eigenheim.**
>
> **Du sagst, was dein Haus braucht. Wir kümmern uns um den Rest.**

Einfach Hausen ist die zentrale Anlaufstelle für Eigenheimbesitzer. Der Kunde beschreibt ein Problem und entscheidet selbst: **nur einen konkreten menschlichen Ansprechpartner sprechen** oder **einen echten Auftrag organisieren lassen**. Kontakte, Hausdaten, Termine und Dokumente bleiben dauerhaft beim Haus. Die KI arbeitet im Hintergrund als Assistenz- und Organisationsschicht, ist aber nicht das eigentliche Kundenversprechen.

Die verbindliche Produktdefinition steht in [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md). Die strategische Positionierung als **persönlicher Hausmanager / Betriebszentrale für das eigene Zuhause** steht in [`docs/PRODUCT_POSITIONING.md`](docs/PRODUCT_POSITIONING.md). Das langlebige Daten- und Berechtigungsmodell steht in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Agenten & kanonischer Arbeitsstand

Alle Agents arbeiten in diesem Repository **am selben Ziel**. Es gibt keinen zweiten Engineering-Taskplan in README, Issues oder Worker-Reports. Der verbindliche Einstieg ist [`docs/NEXT_AGENT.md`](docs/NEXT_AGENT.md); der transaktionale Taskstatus liegt in `.sin-gpt-web/taskplan.sqlite3` und wird nach `.sin-gpt-web/TASKPLAN.md` gerendert.

Aktueller Endpfad: **T-0042 Final Acceptance → T-0043 Final Convergence/Handover**. Bereits erledigte oder abgelöste Wellen werden nicht erneut begonnen. Neue Implementierungsarbeit entsteht nur aus einem reproduzierbaren Acceptance-Fehler und wird als kanonischer Remediation-Task erfasst.

## Systemübersicht

![Einfach Hausen Plattformarchitektur](docs/diagrams/platform-architecture.svg)

[Interaktive Architektur öffnen](docs/diagrams/platform-architecture.html) · Detailansichten: [Eigentümer-Serviceflow](docs/diagrams/homeowner-service-flow.html), [Partner-/Auftrags-Lifecycle](docs/diagrams/partner-job-lifecycle.html), [Hausakte & Datenschutz](docs/diagrams/property-privacy-dataflow.html), [Zahlungen](docs/diagrams/payment-lifecycle.html), [CRM & Outreach](docs/diagrams/crm-outreach-flow.html), [Production & Recovery](docs/diagrams/production-recovery-flow.html).


## Live Produktion (HA)

- App: `https://einfachhausen.de`
- Runtime: OCI `sin-supabase`
- Cloudflare: `sin-kestra` tunnel
- Process supervisor: systemd (`einfach-hausen.service`)
- **Primäre DB: Supabase Postgres** (HA, managed, Replikation) — `DATABASE_URL` / `SUPABASE_DB_URL`
- **Primärer Storage: Supabase Storage** für `private/` und `uploads/` (Fotos, Dokumente, Rechnungen, Haus-Historie) — `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_STORAGE_BUCKET`
- **Fallback/Local Dev: SQLite + WAL via `better-sqlite3`** (`DATABASE_PATH=./data/einfach-hausen.db`) nur für lokale Entwicklung und als Offline-Fallback, nicht mehr als Produktions-Primary
- **Mobile HA: Capacitor 6** — Next.js App wird als native iOS/Android Hülle ausgeliefert (siehe `Mobile App / Capacitor`)
- Scheduled health checks: Kestra

Produktion läuft ab sofort als **echter Multi-User/HA-Betrieb**. Supabase Postgres ist die transaktionale Primär-DB, Supabase Storage der primäre Blob-Store. SQLite bleibt nur für `npm run dev` und als lokaler Fallback. Siehe `docs/OPERATIONS.md` und `docs/ARCHITECTURE.md`.

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
- **Supabase Postgres ( Primary ) + Supabase Storage (private/uploads)** — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`
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

Der kanonische `.sin-gpt-web/taskplan.sqlite3` enthält **Produktions-HA** inkl. **T-0100..T-0131 (32 Tasks)** + neue Migrations-Tasks **T-0166 Supabase Postgres+Storage Migration** + **T-0167 Capacitor iOS/Android Auslieferung**. Schwerpunkte sind Onboarding-E2E, Notification-Outbox/Delivery, Matching-Qualität, Reviews/Trust, i18n/A11y, Core Web Vitals, Security, Observability, Restore-Drills, Feature Flags, Admin-Minimalfläche, Datenschutz-Export, Browser-E2E, Visual Regression sowie **Supabase-Cutover und Capacitor Release**. Der README ist nur ein Wegweiser; Status, Akzeptanz und Abhängigkeiten bleiben ausschließlich im kanonischen Taskplan.

Nächster kanonischer Task: **T-0100 — Homeowner onboarding: first-session to first useful outcome**. Externe Blocker reduziert auf **#16 STRATO-DNSSEC, #11 Rechtstexte, #14 SEPA/Stripe-Live** — **#12 App Stores ist kein Blocker mehr** (Capacitor-Produktionspfad aktiv).

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

- Last synchronized task: `T-0043`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen und vor allem App und Website auf Produktionsqualität verbessern
- Resume rule: product-completion v2 is T-0100..T-0131; continue the highest-priority eligible canonical task (currently T-0100) and do not create a competing roadmap.
- Taskplan sync: `pass`
- Synchronized at: `2026-08-26T03:34:55+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-27T18:40:34+00:00
actor: local-agent
evidence-sha256: de1ac5bafab8293536d80337218610d962b3b1fcc8baef17a9aa555ecf98ab4e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-28T00:13:59+00:00
actor: chatgpt-web
evidence-sha256: 7b95d7194762ef3fe8831d35665f826d7c08738a8ccfb0862391b464590a7dd9
-->
