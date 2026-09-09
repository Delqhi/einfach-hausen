# Vollständige Quelldateien der Lieferung

Basiscommit: db70210dc34c94a833328e79958e12121d8e9a27. Implementierungscommit: cfe9eca957410c69c5641c61b40941a8c3c2c3b5.
Ausschließlich versionierte Dateien dieses Commits. Änderungen im Arbeitsverzeichnis und unversionierte Dateien werden niemals übernommen.
Textdateien stehen vollständig in Codeblöcken; Binärdateien im Manifest mit SHA256. Gelöschte Dateien sind gesondert ausgewiesen.

## docs/brand/workspace/AGENT-ACCEPTANCE.md

`````markdown
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

`````

## docs/brand/workspace/NEXT_AGENT.md

`````markdown
> Zusätzliche verbindliche Restabnahme und Skill-Regeln: AGENT-ACCEPTANCE.md. Quellübergaben nur aus expliziten Git-Commits; keine unversionierten Agentendateien.

> Aktueller Stand 2026-09-09: Detail-/Upload-/Rechnungsintegration siehe DETAIL-INTEGRATION.md. Ältere Aussagen unten zu ausschließlich unverbundenen Vorschauen sind für InvoiceForm und DocumentForm überholt.

# App-Komposition neu aufbauen · 2026-09-08

Jerry hat die bisherige Shell/Owner-/Pro-Komposition ausdrücklich gestalterisch zurückgewiesen. Historische technische Gates bleiben Nachweise für Technik, nicht für Produktgestaltung. Basis: 7eabe4a. Branch: design/eh-workspace-20260908. Kein Deployment.

## Implementiert
packages/eh-design/src/workspace.tsx: EHWorkspaceFrame, EHWorkspaceNavItem, EHWorkspaceGrid, EHWorkSection, EHPriorityAction, EHWorkMetrics, EHServiceDirectory, EHRequestList. Stile im kanonischen styles.module.css, vorhandene Markenfarben/Inter/Logo bleiben. Keine neue Palette.
248px Sidebar, bis 1240px tatsächlicher Inhalt, genau eine sichtbare Brand-Zone je Viewport, 22px Navigationsicons, deutlicher Petrol-Aktivzustand, Konto unten. Topbar ist globaler Kontext und Benachrichtigung; Seitenh1 ausschließlich im Inhalt. Mobile bestehende Menü- und BottomNav-Funktionen erhalten.
Owner /app: Entscheidung priorisiert, tatsächlicher Hausmeister-Composer neben nächsten Ereignissen, thematische Servicezugänge. /app/more: alle sieben vorhandenen Ziele mit ursprünglichen Icons in Haus/Konto gruppiert. Keine Mitgliedschaft oder Zustände erfunden.
Pro /pro: große Arbeitskennzahlen, Petrol-Prioritätsaktion, eigenständige Anfragezeilen mit vollständiger Beschreibung, Ort, Zeit, Preis und klarer Aktion; Termine daneben. Vorhandene Datenabfragen und Berechtigungsgrenzen bleiben. Vorschau von zwei Terminen wird nicht als Gesamtanzahl ausgegeben; Anfragezahl als geladene Teilmenge bezeichnet. Behauptung vollständiger Angebotsinformationen entfernt.

## Gestalterische Abnahme: noch NICHT bestanden
Implementierter Kandidat, kein abgeschlossenes Premium-Urteil. TypeScript bestanden. Isolierte Komponenten-Vorschau 390/736/1536: eine h1, ein sichtbares Logo, kein horizontaler Overflow. Desktop-Vorschau gesichtet. Die Vorschau benutzt Beispieldaten und ersetzt keine echte App-Ansicht; nicht als Produktion screenshotten oder als Kundennachweis verwenden. App-Mobile-Menü, Composer, bestehende globale Styles und echte Rollenflüsse wurden dort nicht geprüft.
GitNexus impact versucht für AppShell/Dashboard/More/Pro: Timeouts und defekte npx-Installation; kein aktueller Graphnachweis. AppShell aus vorherigem Index kritisch mit mindestens30 Verbrauchern. Vor Integration umfassend gegen bestehende Seiten prüfen.

## Nächster Agent
1. Aktuellen main und laufende Änderungen dreiwegeintegrieren; keine fremde Arbeit überschreiben. Dieser Branch ersetzt sichtbare Komposition, nicht Backend/Auth/Nav-Ziele.
2. Tatsächliche Owner-/Pro-Konten verwenden. Alle drei geänderten Seiten und repräsentative Shell-Verbraucher (Detail, Formular, Docs, Profil) bei390/736/1536 mit Inter prüfen. Mobile Drawer, BottomNav, Touch, Fokus, Benachrichtigungen und Composer wirklich bedienen. Fehlende Daten, sehr lange Titel und viele Anfragen zeigen.
3. Fehlende Fachkompositionen für Terminagenda, Dokumente, Wartung, Profile, Rechnungen gesondert inventarisieren. Kein EHPanel-für-alles. Keine neuen Funktionen erfinden. Nicht alle App-Seiten als fertig deklarieren.
4. Neue visuelle Baselines erst nach gestalteter Ansicht und Betreiberreview akzeptieren. Qualitätsmatrix muss Hierarchie, Arbeitsbreite, Dichte, Priorität und fachliche Unterschiede explizit bewerten; reine Token-/Overflow-/A11y-Ergebnisse reichen nicht.
5. Erst nach echter integrierter Prüfung normalen Merge-/Releaseprozess durchführen. Keine Guards abschwächen. Vollständige geänderte Dateien: SOURCE.md und source-manifest.json.

Aktueller Design-Check: FEHLGESCHLAGEN wegen bereits in Basis7eabe4a vorhandenen literal-color/unowned-style in src/app/docs-internal/{page.tsx,layout.tsx,[doc]/page.tsx}. Diese Dateien sind im Workspace-Branch unverändert. Nicht Baseline/Guard abschwächen; separate Docs-Korrektur nötig.


## Frontend-Erweiterung auf ausdrücklichen Auftrag 2026-09-08
Backend-Anbindungen, Tests und Release übernimmt ausdrücklich der lokale Agent. In dieser Erweiterung KEINE Tests/Builds durchgeführt und keine neue Backend-Logik implementiert.

Neue kanonische Datei packages/eh-design/src/workspace-records.tsx: EHRouteTabs, EHScheduleList, EHDossierList, EHOrderList, EHIdentitySummary. CSS ausschließlich styles.module.css. Vollständige Verbraucher: src/app/app/calendar/page.tsx, src/app/app/documents/page.tsx, src/app/app/year/page.tsx, src/app/app/profile/page.tsx, src/app/pro/orders/page.tsx.

Kalender: Monatsgruppen bleiben, jeder Termin erhält Datumskachel und ausgeschriebenen Status. Alte Termine bleiben separat. Keine neue Terminbearbeitung. Dokumente: Rechnungen, Nachweise, Zahlungsbelege erhalten eigene sichtbare Bereiche und Datei-/Betragsstruktur; originale geschützte Links bleiben. Jahresplan: echte Plan-/Historie-Links bleiben, Datumskacheln statt Textzeilen, Überfälligkeit bleibt. Pro-Aufträge: Art, Status, Kontakt, Preis und tatsächliche nächste Aktion einzeln dargestellt; rollenabhängige Datenabfragen unverändert. Profil: vollständig sichtbares, gruppiertes Formular plus Identitätsbereich; dieselben Feldnamen und Aktionen, alle Installations-/WhatsApp-/Privatsphäre-Hinweise bleiben.

GitNexus impact dieser fünf Routensymbole: UNKNOWN, keine aufgelösten Aufrufer; kein Beweis fehlender Risiken. Keine technischen oder visuellen Testergebnisse für diese neue Erweiterung behaupten. Lokaler Agent prüft Syntax/Typen/Build, echte Inhalte und alle bisherigen Funktionen und belegt mobile Ansichten. Auch die Kalender-Datumsinterpretation bleibt aus dem Backend übernommen und muss fachlich geprüft werden.

Noch keine Komplettabnahme aller App-Flächen. Offene Gestaltungskandidaten außerhalb dieser Welle: echte Nachrichten-/Anhangsansichten, Detailseiten, Rechnungseditor, Provider-Profil, Haus-Technik und Spezialabläufe. Keine generischen Ersatzformulare einsetzen. Vorhandene Funktionen erhalten und konkrete Designlücken sammeln. Nicht alleine durch einen kanonischen Import fertig melden.


### Weitere Frontendflächen derselben Lieferung
Zusätzlich src/app/app/jobs/page.tsx, src/app/pro/calendar/page.tsx, src/app/app/messages/page.tsx, src/app/pro/messages/page.tsx neu komponiert. Neue workspace-conversation.tsx: EHInbox, EHContactGroup, EHConversation. Beide Nachrichtenansichten besitzen getrennte Kontakt-/Gesprächsbereiche, aktiven Kontakt, eigene/fremde Nachrichten, Telefonlink, Fehl-/Leerzustand. Bestehende OwnerMessageComposer/ProviderMessageComposer samt Parametern unverändert; der lokale Agent prüft insbesondere ihre DOM-Abhängigkeiten nach dem Layoutwechsel. data-message-thread bleibt am Gespräch, keine Lesestatus- oder Sende-API geändert. Quellenauflistung direkter/auftragsbezogener Nachrichten erhalten.
Owner-Aufträge nutzen vorhandene aktive/geplante/abgeschlossene Filter und bestehende Ziele; Budget ausdrücklich als Budget, nicht Angebot. Pro-Kalender zeigt alle gelieferten Termine mit Status statt fälschlich alle als bestätigt/bevorstehend zu bezeichnen; doppelter Leerzustand entfernt. Keine Query-Änderungen.

Korrektur der vorigen Restliste: Beide Nachrichten-Hauptansichten gehören jetzt zum implementierten Frontendumfang. Anhänge, Client-Composer-Interna, Detailseiten, Rechnungseditor und übrige Fachseiten sind damit nicht automatisch fertig. Tests, Build, reale Datenanbindung, Rollen- und Browserprüfung bleiben wie von Jerry beauftragt beim lokalen Agenten. Keine neue visuelle Komplettabnahme behaupten.

`````

## scripts/eh-design-source.py

`````python
"""Export a committed delivery, never another agent's working files."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("--root", required=True)
parser.add_argument("--base", required=True)
parser.add_argument("--ref", default="HEAD", help="Committed delivery to export (default HEAD)")
parser.add_argument("--out", default="docs/brand/system")
args = parser.parse_args()
root = Path(args.root).resolve()
out = (root / args.out).resolve()
if not out.is_relative_to(root) or out == root:
    parser.error("--out must be a subdirectory of the repository")

def git(*argv):
    return subprocess.check_output(["git", *argv], cwd=root)

base = git("rev-parse", "--verify", args.base + "^{commit}").decode().strip()
head = git("rev-parse", "--verify", args.ref + "^{commit}").decode().strip()
paths = sorted(filter(None, git("diff", "--no-renames", "--name-only", "-z", base, head, "--").decode().split("\0")))
excluded = {(out / name).relative_to(root).as_posix() for name in ("SOURCE.md", "source-manifest.json")}
body = ["# Vollständige Quelldateien der Lieferung", "",
        f"Basiscommit: {base}. Implementierungscommit: {head}.",
        "Ausschließlich versionierte Dateien dieses Commits. Änderungen im Arbeitsverzeichnis und unversionierte Dateien werden niemals übernommen.",
        "Textdateien stehen vollständig in Codeblöcken; Binärdateien im Manifest mit SHA256. Gelöschte Dateien sind gesondert ausgewiesen.", ""]
manifest = {"base": base, "implementationCommit": head, "files": {}, "deleted": [], "symlinks": {}}
for rel in paths:
    if rel in excluded:
        continue
    entry = git("ls-tree", "-z", head, "--", rel)
    if not entry:
        manifest["deleted"].append(rel)
        continue
    mode = entry.split(b" ", 1)[0]
    if mode == b"160000":
        raise SystemExit("Submodule requires separate handoff: " + rel)
    data = git("show", head + ":" + rel)
    if mode == b"120000":
        manifest["symlinks"][rel] = data.decode()
        continue
    item = {"sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}
    try:
        text = data.decode("utf-8")
        is_text = "\0" not in text
    except UnicodeDecodeError:
        is_text = False
    item["kind"] = "text" if is_text else "binary"
    manifest["files"][rel] = item
    if is_text:
        fence = "`" * max(5, max((len(run) for run in re.findall(r"`+", text)), default=0) + 1)
        lang = {".tsx": "tsx", ".ts": "ts", ".mjs": "js", ".js": "js",
                ".css": "css", ".json": "json", ".py": "python",
                ".yml": "yaml", ".md": "markdown", ".html": "html"}.get(Path(rel).suffix, "text")
        body.extend(["## " + rel, "", fence + lang, text, fence, ""])
out.mkdir(parents=True, exist_ok=True)
(out / "SOURCE.md").write_text("\n".join(body))
(out / "source-manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print("EH_SOURCE_COMPLETE", len(manifest["files"]), head)

`````
