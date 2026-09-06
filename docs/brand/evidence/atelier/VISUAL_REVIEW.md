# Atelier 02 — persönliche visuelle Prüfung
Root Codex, 2026-09-06. Keine fremde Designausführung / kein Design-Subagent.

## Ausgangskritik
Die vom Nutzer eingereichte Vergleichstabelle wurde sichtbar geprüft: drei ähnliche Kompositionen, zu kleine Darstellungen, kein überzeugender Markenkern. Verantwortung für das erste Codepaket liegt bei Root, nicht allein beim ausführenden manuellen Agenten. Alle drei alten Varianten gelten als verworfen.

## Selbst geprüfte tatsächliche Browserbilder
- Erste Desktopöffnung 1440: ausreichende Größenhierarchie gegenüber der alten Studie, aber zu enger Display-Buchstabenabstand.
- Erste mobile Vollseite 390: Wörter liefen durch ausgeblendete br-Elemente zusammen; die Textbreite lief bei 320 über. Der Hausakten-Einleger verdeckte die Familie.
- Korrigierte Öffnung 390 und komplette Homepage 1440: klare dreizeilige Headline, kohärentes Papier/Petrol/Hausthema. Die Hauszeichnung führt zum physischen System und seiner Historie.
- Hausakte 390: lesbare Hauptaufgabe, eine nächste Wartung, chronologisches Hauswissen. Beispielhaus und Demo ausdrücklich erkennbar.
- Kontakt 1440: Foto zeigte abgeschnittene Köpfe; Bildhöhe und Position anschließend korrigiert und erneut betrachtet.
- Kontakt 390: Kopf-/Handbereich im Foto erhalten; sichtbare Formularlabels, 16px Eingabetext; noch entdeckten fehlenden Wortabstand nach einem ausgeblendeten Zeilenumbruch korrigiert.
- Homepage 736: Header und beide Spalten funktionieren; Overlay verdeckte dort ebenfalls Gesichter. Anschließend für Tablet wie mobil unter das Bild gerückt.
- Finale Screenshots home-736, hausakte-1440 und kontakt-390 wurden erneut persönlich gelesen: Gesichter sind sichtbar, keine zusammenlaufenden Sätze; Header, Hausregister und Formulare behalten klare Hierarchie.

## Tatsächliche Korrekturen
1. Displaytracking -.072em → -.052em; mobile -.068em → -.052em.
2. Mobile Überschrift behält ihre echten Zeilenumbrüche. Kein zusammengeschobenes Einfachgeregelt.
3. Auf Mobil und Tablet wird die Akte unter dem Foto angesetzt; Gesichter werden nicht durch einen beliebigen Floating-Block verdeckt.
4. Kontaktbild: Desktophöhe 254 → 310px, Fokusposition 45% → 30%.
5. Formulare auf Mobil: Eingabetext 16px.
6. Leerzeichen vor textlichen br-Unterbrechungen verhindern zusammenlaufende Sätze bei responsivem Ausblenden.
7. Die Prüfung läuft auch auf 320px; zwölf finale Vollseiten plus zwei Öffnungsbilder statt winziger Vergleichsmatrix.

## Bewertung mit Grenzen
Der Vorschlag übersetzt das Hausgedächtnis in Hauszeichnung, Register, Chronik, Hausecke und große Wortbilder. Website, Akte und Kontakt teilen eine erkennbare Grammatik. Das ist eine konkrete Grundlage zur Diskussion; "genial", "einzigartig im Markt" und Nutzerfreigabe werden nicht aus den technischen Tests abgeleitet.
Die Bilder sind bestehende Illustrationsfotos des Repos, keine belegten Kunden/Teamfotos. Die eigene Bildsprache sollte später um echte Hausdetails und echte Menschen erweitert werden, wenn solche Aufnahmen vorliegen. Original-Logo und Quellassets bleiben byte-identisch.
Der Entwurf ist noch kein abschließend implementiertes zentrales Markensystem. Diese Überführung folgt der tatsächlichen Richtungsentscheidung in EH-BRAND-04..06.

## Bytegenaue Quellen und Whitespace
ATELIER_02_SOURCE.md enthält bestehende Dokumente vollständig und bytegetreu in Codeblöcken, einschließlich ihrer historischen Markdown-Doppelspaces und leeren updated-Felder. Deshalb meldet ein globales git diff --check dort übernommene Whitespace-Zeilen. Primärdateien werden separat ohne diesen abgeleiteten Quelltextcontainer geprüft; die Kopien werden nicht heimlich normalisiert.
