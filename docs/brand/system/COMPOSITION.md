# Verbindliche Seitenkomposition · Atelier 02
Stand: 7. September 2026. Autorisiert durch Jerry: „mach jetzt was nötig ist bitte“.

Diese Korrektur ergänzt DESIGN.md und das kanonische Paket. Palette, Logo und Schrift bleiben unverändert. Sie ist keine Freigabe für autonome Neugestaltung durch Migrationsagenten.

## Aus dem tatsächlichen Fehler lernen
Der frühere Steps-Adapter legte die Produktansicht in den Text-Slot von EHSteps. Dadurch blieben Semantik und TypeScript kompatibel, die Komposition war aber ungeeignet. home-sections.tsx vermischte alte Layouts mit neuen Bausteinen. Technische Checks belegten keine gestalterische Qualität.
Im Screenshot war die Fallüberschrift doppelt; im geprüften Basiscommit dc70cd6 steht sie nur einmal. Der Screenshot-Build ist nicht eindeutig identifiziert. Keine unbelegte Schuldzuweisung.
Die Tedy-Datei inspirierte Beziehungen zwischen Inhalt, Medien und Freiraum. Deren Palette, Rundungen, Schrift und teils widersprüchlichen Einzelwerte werden nicht übernommen.

## Exakte Auswahl
| Aufgabe | Baustein | Verbindliche Verwendung |
| --- | --- | --- |
| Abschnittseinstieg | EHSectionHeading | Genau eine Überschrift mit optionalem Register und Einleitung. In EHSection setzen. |
| Ablauf mit Produktansichten | EHProcess | Text und media getrennt. Drei Spalten ab 1100px; darunter Zeilen mit zwei Bereichen; unter 760px stapeln. |
| Reine Schrittliste | EHSteps | Ohne Medien. Kein Telefon, Bild oder Formular in text verstecken. |
| Produkt erklären | EHProductExcerpt | Titel, beschriftete Werte, optionale Einordnung. Als Beispiel gekennzeichnet, keine vorgetäuschte Interaktion. |
| Problem spiegeln | EHProblemNotes | Drei kurze, redaktionelle Einträge; keine gemeinsame riesige beige Box. |
| Nutzen erklären | EHBenefitStories | Text/Medien 1:1, abwechselnd; mobil Text zuerst. Titel ist h3 unter einem gemeinsamen h2. |
| Fallgeschichte | EHCaseStudy | Besitzt Abschnitt und Überschrift selbst. Niemals in einen weiteren betitelten Abschnitt einbetten. |
| Vergleich | EHComparison | Zwei gegenübergestellte Spalten, mobil untereinander. |
| Kernaussage | EHEditorialStatement | Markierung mit definierter Unterstreichung; keine gelbe Browser-Standardfläche. |
| Echte App-Bedienung | app.tsx und domain-recipes.tsx | Echte Zustände, Controls und Handler. Marketingbeispiele niemals als App implementieren. |

## Lesbarkeit und Komposition
Website-Text 17–18px, App-Text 16px, Produktbeispiel-Werte 15px, Beispielüberschriften 16px, Metadaten 13px. Die Größen werden nicht per transform/zoom verkleinert. Die Werte kommen aus vorhandenen Tokens.
Produktbeispiele zeigen relevante Informationen in natürlicher Höhe. Keine Notch, kein dicker Geräterahmen, keine Miniaturansicht mit abgeschnittenem Inhalt. Beispielpersonen, Beträge und Zeiten sind als Beispiel zu kennzeichnen.
Abschnittsabstände übernimmt EHSection, die Abstände des Abschnittskopfs EHSectionHeading. Agenten fügen keine lokalen margin-/padding-Korrekturen hinzu.
Auf der Startseite bleiben Hero, Problem, Vergleich, Ablauf, Nutzen, Vertrauen, Leistungen, Pilot, FAQ und Abschluss vorhanden. Auth-Redirect, Intake und Navigation bleiben produktiv angebunden. Keine entfernten Präsentationsvideos wieder einsetzen.
Auf „So funktioniert's“ stehen ein großer Beispielvorgang im Hero, drei Prozessschritte mit lesbaren Ausschnitten und genau eine Fallgeschichte. Medienflächen sind eigene Bereiche.

## Integration durch lokalen Agenten
1. Laufenden Branch und uncommittierte Arbeit sichern; niemals reset, clean, force oder vollständige fremde Dateien blind überschreiben.
2. Diesen Korrekturbranch relativ zur gemeinsamen Basis dc70cd6 prüfen. Neue Arbeit anderer Agenten gezielt mit den Änderungen zusammenführen.
3. Vollständiger neuer/geänderter Quelltext: docs/brand/composition-repair/SOURCE.md. Import aus @/design-system. Kein Nachbauen anhand der Beschreibung.
4. Fehlende Exporte, inkompatible Datenformen oder Workflow-Lücken melden; keine neue Stilfamilie erfinden. APP_COVERAGE_GAPS.md bleibt offen.
5. Alle betroffenen Seiten in voller Browsergröße bei 390/736/1440px persönlich prüfen. Release-Tests, Regressionen, Schutzregeln und tatsächlichen Produktionsstand übernimmt der lokale Agent.
6. Nicht aus einem bestandenen Farb-/Tokencheck auf eine professionelle Gesamtseite schließen.
7. Kein Merge/Deploy durch diese Designlieferung. Bei Konflikten mit dem vertrauenswürdigen Design-Guard den ausdrücklich autorisierten Designrelease-Prozess verwenden; niemals Checks deaktivieren oder eine gewöhnliche Migrationsänderung neu versiegeln.

## Vollständigkeit
Diese Lieferung korrigiert sieben Kompositionsbausteine und zwei Referenzseiten. Sie behauptet nicht, dass alle Apps, Unterseiten, globalen Skillinstallationen oder Produktionsmigrationen abgeschlossen sind. Genau nächste Aktion: diesen Quellstand in den laufenden EH-BRAND-05-WEB-Branch übernehmen und die realen Seiten überprüfen.

## Anliegenformular
EHRequestForm bietet lesbare kanonische Controls, eindeutige IDs und statische Beispiele. IntakeForm behält seine Props und GET /register mit role=homeowner und request. Keine neue Backend-Aktion. Die frühere ausdrücklich entfernte Hero-Frage und Zusatz-Badges werden nicht wieder eingeführt.
