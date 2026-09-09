# Dokumente und Abschlussintegration · 2026-09-09

Jerry hat den Abschluss einschließlich Integration/Release erneut ausdrücklich beauftragt. Alle eigenen Änderungen liegen getrennt von fremden Working Trees.

## Implementiert

EHDocumentFrame in packages/eh-design/src/documents.tsx kapselt Rechnung, Zahlungsbeleg und Hauspass. Stile ausschließlich kanonisches styles.module.css; HTML-Adapter neu generiert. Dokumenttext 16px, Metadaten 13px; mobile Rechnungspositionen mit Datenlabels statt abgeschnittener Spalten; Druck ohne Bediennavigation. Original EHLogo ersetzt alte Ersatzschriftzüge und die historisch nachgebaute Logo-Komponente in diesen Verbrauchern. Andere Verbraucher von src/components/logo.tsx werden durch diesen Patch nicht verändert.

PrintButton in src/components/print-button.tsx ruft window.print auf. Kein PDF-Backend, keine Übermittlung. InvoiceView hat genau eine h1. Hauspass erklärt leere Technik-/Historienlisten.

euroExact in src/lib/format.ts erhält Centbeträge in InvoiceView und Zahlungsbeleg; die bisherige allgemeine euro-Funktion rundete auf ganze Euro. Backend-Berechnung, gespeicherte Beträge, Berechtigungen und Zahlungsaktionen bleiben unverändert.

## Verifikation und Grenzen

Isolierter Development-Server 127.0.0.1:4198 mit eigener /tmp/eh-final-review.db und Entwicklungs-Auth. Kein Produktionsnutzer und keine echte Zahlung. Owner-/Pro-Rechnung, Hauspass und Zahlungsbeleg bei390/736/1536 mit Original-Logo, einer h1 und ohne Seitenüberlauf geprüft. Rechnung und Beleg zeigen exakt150,90 Euro. Druckbutton geprüft; print-hide im Druck verborgen. Vier A4-PDFs erzeugt; keine Behauptung einer vollständigen mehrseitigen PDF-Abnahme. Nachweise design/workspace-preview/documents/.

Erster vollständiger Release-Lauf:14/15, weil im frischen Worktree vor Next-Build next-env.d.ts fehlte. Danach TypeScript bestanden. Abschließender vollständiger Release-Lauf auf dem endgültigen Produktcode:15/15 bestanden, /tmp/eh-final-gate-v2.log, Exit0. Danach nur Dokumentation ergänzt.

OCI-Skills sin-eh-design und sin-frontend-design aus wow-my-zsh Commit5ed0b95 in ~/.codex/skills und ~/.config/opencode/skills installiert und Hash-verifiziert; frühere Dateien gesichert. Keine Installation auf Macs oder in anderen Harnesses behauptet. Neue Referenz workspace-delivery.md erklärt native Aktionen, Original-Logo, Druckdokumente und commitbasierte vollständige Codeübergaben.

## Aktuell belegter Betriebsblocker

Produktion zuletzt f554939. Health503: database/storage ready, auth_authority unreachable. Aufruf der konfigurierten Supabase-Health-URL wurde von Cloudflare mit HTTP403/Fehler1010 abgewiesen. Kein Beweis eines Datenbankfehlers. Keine Sperre durch User-Agent-Täuschung oder Abschwächen der Healthprüfung umgehen. Vor Live-Abnahme Auth-Erreichbarkeit über den autorisierten Infrastrukturweg wiederherstellen.

Vorheriger Standarddeploy scheiterte an sudo/no-new-privileges. Ein neuer Deploy-Erfolg muss durch tatsächliches Kommandoergebnis, Produktions-SHA und Health belegt werden. Keine Komplettabnahme allein wegen Merge oder Tests.

Vollständiger Code: docs/brand/final-documents/SOURCE.md und source-manifest.json. Genau nächste Aktion: vollständigen Release-Check abschließen, PR-Kette integrieren und den autorisierten Standarddeploy versuchen; bei Zugriffssperre exakten Blocker dokumentieren.
