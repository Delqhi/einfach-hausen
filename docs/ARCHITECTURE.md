# Einfach Hausen — Architektur-Grundsätze

Diese Datei beschreibt die langlebigen Produktbeziehungen hinter der bewusst einfachen Oberfläche.

## Oberstes Prinzip

Komplexität gehört in die Technik, nicht in die Benutzeroberfläche. Ein Eigentümer soll immer in Alltagssprache starten können: **Was möchtest du erledigen?** Ein professioneller Anbieter hat **ein Konto** und erweitert darin seine Tätigkeiten und Leistungen.

## Kernmodell

![Plattformarchitektur](diagrams/platform-architecture.svg)

[Interaktive Architektur öffnen](diagrams/platform-architecture.html)

Die Immobilie ist ein eigener Datensatz. Sie gehört nicht technisch für immer zu einem einzelnen User. `property_ownerships` bildet den zeitlichen Eigentumsverlauf ab.

## Eigentümer-Serviceflow

![Eigentümer-Serviceflow](diagrams/homeowner-service-flow.svg)

[Interaktiven Serviceflow öffnen](diagrams/homeowner-service-flow.html)

## Anbieter: ein Login, flexible Tätigkeiten

Professionelle Nutzer verwenden immer denselben Provider-Zugang. Tätigkeiten sind relationale Kategorien und keine getrennten Login-Typen:

- Handwerker
- Dienstleister
- Immobilienmakler
- Gutachter / Sachverständiger
- Energieberatung
- Hausverwaltung

Ein Unternehmen kann mehrere Kategorien gleichzeitig aktivieren und später ändern. Konkrete Handwerksleistungen liegen separat in `provider_service_offerings` und werden für das Matching verwendet.

## Hausakte und Historie

Hausbezogene Daten hängen nach Möglichkeit an `property_id`:

- Aufträge
- Hausanlagen
- Wartungen
- Haus-Historie
- hausbezogene Ansprechpartner
- Anbieter-Einladungen
- Eigentumsübergaben

Abgeschlossene Plattformaufträge werden automatisch in die Haus-Historie übernommen. Frühere Arbeiten können manuell mit Kosten, Garantie, Wartung, Ansprechpartner, Vorher-/Nachher-Fotos und privaten Dokumenten ergänzt werden.

## Eigentümerwechsel

Eine Übergabe erzeugt **keine neue Kopie des Hauses**. Die bestehende Immobilie bleibt erhalten:

1. bisherige aktive Eigentümerschaft wird beendet,
2. neue `property_ownerships`-Zeile wird angelegt,
3. Haus-Historie bleibt am selben `property_id`,
4. hausbezogene Anlagen, Wartungen und Ansprechpartner gehen mit,
5. private alte Nachrichten, Zahlungen und persönliche Kommunikation werden nicht übertragen.

## Zahlungs-Lifecycle

![Zahlungs-Lifecycle](diagrams/payment-lifecycle.svg)

[Interaktiven Zahlungs-Lifecycle öffnen](diagrams/payment-lifecycle.html)

## Rechnungen

Der ausführende Partner kann direkt am Auftrag eine Rechnung erstellen und senden. Rechnungen enthalten Rechnungsnummer, Leistungs-/Rechnungsdatum, Zahlungsziel, Rechnungssteller/-empfänger, Positionen, Netto, Umsatzsteuer und Brutto. Der Eigentümer erhält die Rechnung in seiner Dokumentenansicht. Bei eingerichtetem Stripe Connect ist direkte Zahlung möglich; Einfach Hausen behält **0 % Auftragsprovision**.

## Beratung und Notfall

Beratung und Auftrag sind getrennte Absichten. Eine Beratung verbindet zunächst nur mit einem passenden Menschen. Notfallanfragen berücksichtigen zusätzlich aktuelle Bereitschaft, Entfernung, Qualifikation, Bewertung und hinterlegten Notfallzuschlag. 24/7-Anbieter und Anbieter mit eigenen Notfallzeiten verwenden dasselbe Partnerkonto.

## Datenschutz-Dataflow

![Hausakte und Datenschutz](diagrams/property-privacy-dataflow.svg)

[Interaktiven Datenschutz-Dataflow öffnen](diagrams/property-privacy-dataflow.html)

## Datenschutz und Freigaben

Anbieter sehen nicht automatisch die Hausakte. Zweckgebundene Freigaben liegen in `property_shares` und enthalten:

- Immobilie
- Eigentümer
- Anbieter
- Zweck
- explizite Berechtigungen
- Freigabezeit
- Widerruf

Beispiel Verkauf: Ein Makler sieht den Eigentümerkontakt und eine begrenzte Objektzusammenfassung erst nach **Kontakt freigeben**. Rechnungen, Versicherungen, private Nachrichten, Zahlungsdaten und vollständige Dokumente bleiben gesperrt.

## Verkauf, Bewertung und Makler-Matching

Immobilienbewertungen sind eigene Datensätze in der Hausakte. Bei Verkaufsinteresse wird ein `sale_lead` erzeugt. Makler hinterlegen Suchprofile für Region, Immobilientyp, Kaufpreis, Wohn-/Grundstücksfläche, Wohnen/Gewerbe und Spezialisierungen. Matching erzeugt nachvollziehbare Passungswerte; Kontaktdaten werden erst nach Eigentümerfreigabe sichtbar.

Leadstatus sind messbar: vorgeschlagen → Kontakt freigegeben → Interesse → Besichtigung → Auftrag → verkauft bzw. abgelehnt/widerrufen.

## CRM- und Outreach-Grenze

Die Plattformanwendung und das Akquise-/Outreach-Control-Plane sind bewusst getrennt, aber arbeiten auf einem gemeinsamen fachlichen Lead-Lifecycle:

- `einfach-hausen` besitzt Nutzer/Provider-Konvertierung, plattforminterne CRM-Referenzen und den ursprünglichen SQLite-Leadbestand.
- `einfach-hausen-crm` besitzt die standalone Operator-/Agent-Oberfläche auf `crm.einfachhausen.de`, Cloudflare-D1-Queue, Dedupe, Lease-Claims, Contact-History, Inbox und Follow-ups.
- Generische Recherche-/Outreach-/Connectorlogik bleibt in den gemeinsamen SIN-Fähigkeiten und wird nicht in einem der beiden Produktrepos kopiert.
- Während der initialen D1-Konvergenz wird der bestehende Haupt-App-Leadbestand idempotent in D1 synchronisiert. Unbekannte Kontaktfreigabe bleibt unbekannt; `do_not_contact` bleibt fail-closed.

Agents dürfen daraus **keine zwei konkurrierenden CRMs** machen. Repository-Ziele und aktuelle Fortsetzung stehen jeweils in `docs/NEXT_AGENT.md` und dem kanonischen `.sin-gpt-web`-Taskplan des Repos.

## Technische Vervollständigung v2 + Produktions-HA

Der kanonische Plan erweitert um **Supabase HA + Capacitor**. Roadmap ist **T-0100..T-0131 plus T-0166 Supabase Migration + T-0167 Capacitor Release** und erweitert die Architektur ohne das Produktmodell zu ändern. Technische Grenzen:

- **Onboarding/account lifecycle:** homeowner and partner first-run journeys plus recovery/session revocation remain on the existing identity model.
- **Notification pipeline:** business transactions emit a durable, versioned outbox event; dispatch/retry/channel adapters and user-visible inbox state consume that event idempotently.
- **Matching quality:** the existing matcher gains privacy-safe decision traces, freshness/capacity rules and deterministic benchmark fixtures; monetization remains excluded from ranking quality.
- **Trust/reviews:** reviews are derived only from verified completed service relationships, with moderation/audit and truthful low-sample aggregates.
- **i18n/a11y/performance:** typed locale boundaries, WCAG-critical shared interaction rules and measurable CWV/server budgets become release gates rather than one-off audits.
- **Security/observability:** adversarial regression, supply-chain gates, structured redacted correlation and SLO probes reuse the current OCI/Next.js stack.
- **Feature flags/admin/privacy:** minimal server-authoritative flags, one restrained admin operations console, and authenticated export/request workflows avoid a second control plane.
- **Release proof:** T-0129 production-style browser E2E and T-0130 deterministic visual regression converge into T-0131 final technical completion.

External-authority reduziert auf **#16 STRATO-DNSSEC, #11 Rechtstexte, #14 SEPA/Stripe-live**. **#12 App Stores ist kein Blocker mehr** — Capacitor iOS/Android ist aktiver Produktionspfad (T-0167).

## Authentifizierungsarchitektur — Deep-Research-Konvergenz T-0168

Die Zielarchitektur für geschützte Owner-/Provider-Flächen ist serverautoritativ:

- **Supabase ist die einzige Produktions-Identity-Authority.** Browser-Sessionzustand darf UI steuern, aber keine Produktionsberechtigung erteilen.
- `currentUser()`, `requireUser()` und `requirePro()` müssen auf eine konsistente serverseitig verifizierte App-Identity konvergieren.
- `mh_session`/SQLite-Auth ist nur als **expliziter Local-Dev-Fallback** zulässig. Es gibt keinen stillen Fallback von Supabase auf lokal.
- Ein Local-Auth-Modus in Produktion muss **fail closed** enden.
- `AuthContext` ist UI-State und darf weder gültige Server-Autorisierung überschreiben noch geschützten Zugriff gewähren.
- Server Actions autorisieren vor jeder sensiblen Mutation erneut.
- Die Zuordnung zwischen Supabase-Subject und bestehendem Application-User ist explizit zu modellieren; `supabase user.id == app users.id` darf nicht ungeprüft angenommen werden.

```text
Production
  Supabase verified identity
    -> AppIdentity
    -> requireUser()/requirePro()
    -> protected Server Components / Route Handlers / Server Actions

Development
  AUTH_BACKEND=supabase -> gleiche Semantik wie Produktion
  AUTH_BACKEND=local    -> mh_session/SQLite nur wenn NODE_ENV != production

Production + AUTH_BACKEND=local -> fail closed
```

Die vollständigen Forschungs-, Test- und visuellen Acceptance-Regeln stehen in [`T0168_DEEP_RESEARCH.md`](T0168_DEEP_RESEARCH.md).

## Produktions-Infrastruktur (HA)

Produktion ist **HA, Multi-User** — kein Pilot:

- OCI VM als Runtime hinter Cloudflare Tunnel
- **Supabase Postgres (HA, managed)** als primäre transaktionale DB — `DATABASE_URL` / `SUPABASE_DB_URL` via Infisical
- **Supabase Storage** als primärer Blob-Store für `private/` und `uploads/` (Fotos, Dokumente, Rechnungen) — `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- **SQLite + WAL via `better-sqlite3` nur Fallback/Local Dev** (`DATABASE_PATH=./data/einfach-hausen.db`), nicht Primary in Produktion
- **Capacitor 6** für iOS + Android native Auslieferung derselben Next.js App (`@capacitor/core`, `@capacitor/ios`, `@capacitor/android`)
- Kestra für geplante Checks
- OmniRoute für optionale Assistenzfunktionen
- Stripe/Connect für Abos und Zahlungen

Migration von SQLite → Supabase Postgres läuft als **Zero-Downtime Cutover** mit idempotenter Backfill-Verifikation (siehe `docs/OPERATIONS.md`). Keine neue Infrastruktur mehr als „pilot-optional“ — Supabase + Capacitor sind aktiver Produktionspfad.

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
