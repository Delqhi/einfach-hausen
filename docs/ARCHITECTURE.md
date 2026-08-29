# Einfach Hausen — Architektur-Grundsätze

Diese Datei beschreibt die langlebigen Produktbeziehungen hinter der bewusst einfachen Oberfläche.

## Oberstes Prinzip

Komplexität gehört in die Technik, nicht in die Benutzeroberfläche. Ein Eigentümer soll immer in Alltagssprache starten können: **Was möchtest du erledigen?** Ein professioneller Anbieter hat **ein Konto** und erweitert darin seine Tätigkeiten und Leistungen.

### Visuelle / Präsentations-Source-of-Truth

Für T-0165 gilt die Kette **Notion App Design → `DESIGN.md` → `docs/PRESENTATION_BRAND.md` → `presentation/premium/brand.config.json` → `presentation/premium/deck.html`**. Notion ist visuelle Evidence, nicht automatisch fachliche Produktspezifikation. Änderungen am App-Design müssen daher auch gegen Presentation Brand und Präsentation geprüft werden; Owner und Pro bleiben auf derselben hellen visuellen Foundation.

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

## Pilot-Infrastruktur

Für den Pilot wird vorhandene Infrastruktur wiederverwendet:

- OCI VM als Runtime
- Cloudflare Tunnel als öffentlicher TLS-Eingang
- SQLite/WAL als transaktionale Single-Node-Datenbank
- self-hosted Supabase für bestehende Plattformdienste/Backups
- Kestra für geplante Checks
- OmniRoute für optionale Assistenzfunktionen
- Stripe/Connect für Abos und Zahlungen

Keine neue Infrastruktur wird eingeführt, wenn die vorhandene Lösung das Problem bereits zuverlässig löst.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0043`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen und vor allem App und Website auf Produktionsqualität verbessern
- Resume rule: read/validate the canonical taskplan and continue its highest-priority eligible task; do not create a competing roadmap.
- Taskplan sync: `pass`
- Synchronized at: `2026-08-25T20:59:52+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-26T11:54:15+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-26T12:26:25+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-26T12:37:50+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-26T12:47:21+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-26T12:57:44+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-26T13:21:53+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-26T13:31:30+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-26T13:41:27+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-26T13:47:37+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-26T14:15:40+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-26T14:27:32+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-26T15:43:26+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-26T15:44:24+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-26T17:58:59+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-26T18:04:35+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-26T18:10:05+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-26T18:18:41+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-26T18:23:00+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-26T18:44:41+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-26T18:58:51+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-26T19:03:51+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-26T19:25:25+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-26T19:30:34+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-26T19:30:47+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-26T19:30:48+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-26T19:36:09+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-26T19:38:16+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-26T19:38:17+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-26T20:15:45+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->
