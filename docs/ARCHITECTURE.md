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
