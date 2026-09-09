# Detail, Anhang und Rechnung – Integration 2026-09-09

## Verbindliche Verwendung

EHInvoiceEditor ist jetzt mit der vorhandenen createInvoiceAction verbunden, über das native action-Prop. Server-Weiterleitungen niemals in einem allgemeinen Client-catch abfangen. onSubmit bleibt nur für callbackbasierte Verbraucher; preview verhindert Versand. embedded erzeugt h2 statt einer zweiten h1. Cent-Rundung der Anzeige entspricht der vorhandenen Serverberechnung; der Server bleibt verbindlich.

InvoiceForm verwendet echte Empfänger-/Auftragstitel. Beide bestehenden Aufrufstellen bleiben erhalten. EHAttachmentPanel nimmt ein upload-Slot entgegen; DocumentForm liefert den bestehenden uploadDocumentAction mit unveränderten Feldnamen kind/title/document. Ohne Upload-Slot, Callback oder expliziten preview-Modus wird keine funktionslose Dateiauswahl angeboten. Keine neue Upload- oder Rechnungs-API, keine Auth-/SQL-/Zahlungsänderung.

Owner-Service-/Kontakt- und Pro-Detailübersichten verwenden EHWorkspaceGrid für Beschreibung und Fakten. Alle bisherigen Buchungs-, Storno-, Nachrichten-, Servicefall-, Bewertungs- und Zahlungsaktionen bleiben erhalten. Das ist keine Behauptung, dass sämtliche historischen Detailblöcke endgültig visuell abgenommen wären.

## Nachweise

Isolierter Next-Development-Server 127.0.0.1:4197, ausdrücklich lokale Entwicklungs-Auth, eigene /tmp/eh-detail-review.db, Fixture-Fabrik scripts/e2e-fixtures.mjs. Keine Produktionsdaten und kein externer Rechnungsversand. Screenshots design/workspace-preview/integrated zeigen die echten Routen mit gekennzeichneten Fixture-Daten, keine statische Komponentenattrappe.

- Owner/Pro bei 390 und 1536: eine h1, kein horizontaler Overflow.
- Position hinzufügen und Betrag ändern im echten React-Editor erfolgreich.
- Dokument über bestehende Server-Aktion hochgeladen, anschließend in der Dateiliste sichtbar.
- Zwei Rechnungspositionen: 15090 Cent; DB-Nachweis und Weiterleitung nach /pro/invoices/[id]?sent=1 erfolgreich.
- TypeScript, gezieltes ESLint und Design-Guard bestanden. HTML-Adapter neu generiert; keine Palette oder Schrift geändert.
- GitNexus konnte wegen npm ENOTEMPTY nicht starten; Aufrufer manuell geprüft. Kein Graph-Erfolg behauptet.

## Genau nächste Aktion

Lokaler Agent auf sin-supabase integriert diesen Branch in seinen aktuellen Stand, prüft die vollständigen Release-Gates und veröffentlicht über den bestehenden autorisierten Deployweg. Kein reset/clean/force. Unser vorheriger Deploy scheiterte an no-new-privileges; diese Sicherheitsregel nicht umgehen. Aktuelle Produktions-SHA selbst prüfen. Vor Produkt-Komplettabnahme reale Rollen-/Datenzustände und Screenshots bewerten. SOURCE.md enthält jede geänderte Textdatei vollständig, Manifest die Binärnachweise.
