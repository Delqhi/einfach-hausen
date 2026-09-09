# Verbindliche Übernahme und verbleibende App-Abnahme

Stand: 2026-09-09. Ergänzung zum bestehenden EH-BRAND-07-WORKSPACE, kein zweiter Taskplan. Produktstand der Prüfung: db70210; PR71 offen. Keine Aussage zum zwischenzeitlichen Deploy. Dieser Branch verändert keine Produktansichten und keine Backend-Logik.

## Belegte Restbefunde

| Priorität | Datei / Symbol | Beobachtung | Verbindliche nächste Prüfung |
| --- | --- | --- | --- |
| P1 | src/components/invoice-view.tsx / InvoiceView | invoice-wordmark ist ausgeschriebener Text „einfachhausen“, kein Original-Logo; verwendet eigenes invoice-paper-Layout. | Original-Logo im fertigen Rechnungsdokument verwenden; die Rechnung bleibt ausdrücklich vom Partnerbetrieb. Beide Verbraucher gemeinsam prüfen. Keine Verkäufer-/Steuer-/Betragsdaten verändern. |
| P1 | src/app/pro/invoices/[id]/page.tsx / ProviderInvoice | Eigenes main ohne AppShell; „Drucken / PDF“ ist ein span im Buttonstil. | Druckansicht ist zulässig, aber kein scheinbar klickbarer Button ohne Aktion. Druckhinweis als Text oder echte Druckaktion; Desktop/Mobil und Druckansicht getrennt abnehmen. |
| P1 | src/app/app/home/passport/page.tsx / HousePassport | Eigenständige Druckseite; leere Technik-/Historienlisten erhalten keine Erklärung. | Keine Ausstattung/Historie, langer Hausname und mehrere Druckseiten prüfen; passende Leertexte und Seitenumbrüche gestalten. Original-Logo wird bereits über Logo importiert; nicht als fehlend melden. |
| P1 | src/app/app/documents/[jobId]/receipt/page.tsx / Receipt | Eigenständiger Zahlungsbeleg mit Eigentümer-/paid-Filter und vorhandener Logo-Komponente. | Lange Namen/Beträge und Druckumbrüche prüfen; expliziten Unterschied Zahlungsbeleg vs. steuerliche Rechnung erhalten. Kein fehlender canonical Import allein als Fehlernachweis. |
| Kein Mangel | src/app/app/partners/page.tsx / PartnersIndex | Authentifizierte Weiterleitung nach /app/messages. | Keine zusätzliche Partnerübersicht erfinden; Weiterleitung und Ziel prüfen. |
| P1 | design/workspace-preview/integrated/evidence.json | Nachweis 390/1536 mit Testdaten; keine 736er oder vollständige Zustandsmatrix. | 736px, lange Inhalte, Fehler, Berechtigungen und tatsächliche Nutzerdatenzustände ergänzen. |

37 Owner-/Pro-page.tsx-Dateien wurden auf direkte Komponentenimporte inventarisiert. Das ist keine vollständige Prüfung aller abhängigen Komponenten oder Laufzeitzustände. Die oben genannten Detailbefunde wurden im Quelltext nachgelesen. Andere Familien aus APP_COVERAGE_GAPS.md bleiben offen, sofern kein jüngerer konkreter Nachweis sie schließt.

## Skill-Regeln für jeden ausführenden Agenten

1. sin-eh-design laden; aktuelle Repository-Dateien haben Vorrang vor historischen Skill-Codekopien. Danach DETAIL-INTEGRATION.md und dieses Dokument lesen.
2. EHInvoiceEditor: in Detailseiten embedded setzen (h2); native Server-Aktion über action. Redirect-Ausnahmen nicht durch catch als Fehler verschlucken. preview ist nicht produktiv. Empfänger und Titel aus dem autorisierten Auftrag.
3. EHAttachmentPanel: upload-Slot mit vorhandenem DocumentForm. Keine zweite parallele Upload-API, kein clientseitiger Erfolgsstatus vor bestätigtem Serverergebnis. Ohne Handler keine scheinbar funktionsfähige Auswahl.
4. Formularkomposition ist nicht durch einen EH-Import abgenommen. Labels, Feldabstände, Summen, Fehler, Pending und tatsächliche Weiterleitung prüfen.
5. Dokumentseiten unterscheiden sich von einer App-Shell. Keine Sidebar mitdrucken; Logo und Empfänger-/Verkäuferidentität korrekt; lange Tabellen dürfen nicht abgeschnitten werden.
6. Keine Token-, Guard-, Debt- oder Logo-Änderungen zum Bestehen von Prüfungen. Fehlende Komposition konkret mit Route/Zustand/Screenshot dokumentieren. Keine pauschale Premium-Fertigmeldung.
7. Diese Regeln sind versionierte Repository-Vorgaben. Eine globale Skillinstallation auf Macs/OCI ist damit NICHT nachgewiesen; lokale Agenten müssen den installierten Skill mit diesen Referenzen abgleichen.

## Mindestnachweis für fachliche Abläufe

| Ablauf | Zu belegen |
| --- | --- |
| Rechnung | Position hinzufügen/entfernen, unterschiedliche Steuersätze, Dezimalmenge, Pflichtfelder, Pending, Fehlerredirect, erfolgreicher Redirect, gespeicherte Summe; keine echten Rechnungen für QA versenden. |
| Anhänge | Auswahl, erlaubte/abgelehnte Datei, Uploadfehler, Pending, erfolgreiche Liste, geschützter Download; keine bestehenden Dateien überschreiben. |
| Auftragsdetail | Kontaktanfrage und Leistung; vor/nach Annahme; Ansprechpartner fehlt/vorhanden; abgeschlossener Auftrag; alle bisherigen Aktionen erhalten. |
| Druck | A4, mehrseitig, lange Leistungsbeschreibung, Original-Logo, keine Bediennavigation im Ausdruck, rechtliche Bestandshinweise erhalten. |
| Geräte | 390/736/1536; Screenshot nach scrollTo(0,0), Schriften fertig geladen. Full-page-Screenshot fixierter Elemente ist kein alleiniger Beweis ihrer Bildschirmposition. |

Pro Befund festhalten: Commit, Route, Rolle, Testdatenzustand, Viewport, Ist, Soll, Screenshot, Korrektur und Ergebnis. Ungeprüft bleibt ungeprüft; grüne Farb-/Overflow-Prüfungen ersetzen keine Sichtprüfung.

## Sichere vollständige Codeübergabe

Der Exporter nimmt jetzt ausschließlich Git-Commit-Inhalte. Vor Export alle EIGENEN Lieferdateien gezielt committen; niemals git add . in einem gemeinsam benutzten Verzeichnis. Nicht versionierte und abweichende Working-Tree-Dateien anderer Agenten bleiben ausgeschlossen. Dynamische Codezäune verhindern kaputte verschachtelte Markdownblöcke.

```bash
python3 scripts/eh-design-source.py --root "$PWD" --base 20b096517e97c5b532f57870bb7adf5e5b638f62 --ref db70210dc34c94a833328e79958e12121d8e9a27 --out docs/brand/workspace
```

Dieser Befehl exportiert exakt PR71s überprüften Stand; für eine spätere eigene Lieferung --ref bewusst auf deren vollständigen Commit setzen. Quellkapseln als Referenz nutzen, nicht blind über fremde Weiterentwicklungen kopieren. Git-Merge erhält Dreiwege-Konfliktinformation. Vollständiger Code dieser Dokumentations-/Tooling-Ergänzung steht in docs/brand/agent-acceptance/SOURCE.md.
