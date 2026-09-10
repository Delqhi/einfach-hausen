# Preisübersicht – Frontend und Angebotsklarheit
Host OCI sin-supabase; Branch fix/eh-pricing-clarity-20260910.
Basis 1005fb5. Worktree /home/ubuntu/orca/workspaces/eh-pricing-clarity-20260910.

## Umsetzung
/preise nutzt ausschließlich vorhandene EH-Komponenten: Hero mit Hausakten-Umschlag, EHPricing, Vergleich von Tarif und Auftrag, Preisprinzip, eigener Betriebsbereich, FAQ.
Alte kleinteilige horizontale Vergleichstabelle wird nicht mehr eingebunden. Ihre Dateien bleiben unangetastet für mögliche fremde Verbraucher.
Aktive Preise/Anfragegrenzen kommen aus derselben DB wie der Checkout. Kein zweiter statischer Preiskatalog.
Keine erfundene „beliebteste“-Auszeichnung, unbegrenzte KI oder Rundum-Betreuung.
Paid-CTA führt bewusst zur Klärung des Leistungsumfangs /kontakt; Konto-Tarifverwaltung bleibt zugänglich.
/ app/plans (ohne Leerzeichen) zeigt Centbeträge mit euroExact. Checkout/DB/Bestandsabos unverändert.

## Lokaler Agent – nächste Aktion
1. Branch-Diff prüfen, fremde laufende Arbeit erhalten. SOURCE.md enthält alle geänderten Quelldateien vollständig.
2. Steuer-/Endpreiskennzeichnung verbindlich klären. Keine unbelegte Steuerbehauptung ergänzen.
3. Tatsächliche PLUS/PREMIUM-Leistungserfüllung und Unterschiede der Partnerstufen belegen. BUSINESS-MODEL.md lesen; keine neuen Features nur per Marketingtext erfinden.
4. DB-Preise und Centbeträge gegen Checkout vergleichen (0 / 19,90 / 39,90 sowie Betriebstarife).
5. Mobile/Tablet/Desktop, Anker, alle CTAs, Keyboard und lange Tarifnamen prüfen. Aktiv/inaktiv sowie abweichende DB-Preise testen.
6. Screenshots visuell abnehmen; bestehende Release-Gates ausführen; gemeinsamer Merge/Deploy, Taskplan Evidence render/validate.
7. Kein pauschales „alles fertig“: Geschäftsmodellvalidierung und Produktabnahme sind unterschiedliche Nachweise.

## Prüfgrenzen
TypeScript, gezieltes ESLint und diff --check erfolgreich. GitNexus impact UNKNOWN mit veraltetem Index; manueller Diff auf zwei Seiten begrenzt.
Keine Abos/Preise verändert, kein Produktionsdeploy, keine Zahlungsanfrage.
Browsernachweise werden separat im selben Ordner abgelegt.
