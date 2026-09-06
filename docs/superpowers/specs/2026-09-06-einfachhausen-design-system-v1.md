# Einfachhausen Designsystem 1.0 — verbindliche Freigabe und Auftrag
Stand: 2026-09-06. Kanonische Tasks: EH-BRAND-03 accepted/done; EH-BRAND-04 in progress.
Angenommene Referenz: Atelier 02, PR https://github.com/Delqhi/einfach-hausen/pull/41, Design-Code baea585e9de24c6d6bada491ac61c4537f2a5e4d, Dokumentationsstand 77e1e558afbfd27ae4d80cec571a6b2a6c2ad685.

## Nutzerfreigabe und Folgeauftrag — vollständig wörtlich
> omg das ist MEGA! aber wir haben ja nicht nur onepage seite sondern auch unterseiten usw. und die schrift ist manchmal etwas zu klein oder? und bitte direkt design sytem design.md design vorlagen von komponenten usw erstellen und fertigstellen. ich will dass es niemals wieder pasieren kann das andere agenten wieder eigenständig das design verändern! auch den skill sin-frontend-design der extrem hässliches design baut massiv korrigieren und verbessern. und erstelle einen skill SIN-EH-design (der skill soll agenten alles erläutern wo wie was und alle infromationen bzgl einfachhausen design) . alle die von dir erstellten design komponenten müssen ovn agenten beim bauen von anderen seiten wie unterseiten wiederverwendet werden und damit unterseiten individuell  gestalten je nach thema/content/inhalt. baue also ausreichend blöcke , sektionen und so weiter komponenten für alles was agenten benötigen werden. .. aktualisiere auch lokale agents.md und brains und memories usw dass agenten in einfachhausen repos nie wieder design selber erstellen und damit dein neues festgelegtes design verändern. das ist strikt verboten für andere agenten ab jetzt. das neue design soll auch für owner/handwerker apps gelten. alles was mit einfach hausen zutun hat. am besten bauen wir auch ein github bot wenn free der vor mergen immer auf design konsistens prüft oder so . und erstelle direkt tasks inkl heftigen anweisungen und next_agent für nächste agenten die sollen nächmlich auch andere einfach hausen projekt mit neuen design ausstatten. und auch die einfachhausen presentationsgenerator unbedingt an neues design anpassen damit präsentationen wirklich konstistente marken design besitzen. füge für agenten immer vollständig code in blöcken für alles hinzu - weil subagenten ncihtt so die klügsten mitdenker und nicht die besten entwickler sind leider daher immer bestmöglich vorgeben alles !

## Beschluss
Atelier 02 ist angenommen. Nur die drei früheren PR-40-Studien sind verworfen. Die neue Linie ist keine offene Richtungswahl mehr. Root Codex besitzt die gestalterische Verantwortung; ausführende Agenten verwenden die festgelegten Bausteine und ordnen sie nach Inhalt. Sie ändern nicht eigenständig Marke, Typo, Tokens, Formen, Motion oder Komponentenstile. Eine vom Nutzer ausdrücklich beauftragte Systemänderung bleibt möglich; bestehende Autorisierung dieses Auftrags umfasst Systemausarbeitung, Lesbarkeitskorrektur, Skill- und Regeländerung sowie technische Schutzmaßnahmen.

## Marken-Grammatik
- Claim: Dein Haus. Einfach geregelt.
- Leitidee: Ein Zuhause mit Gedächtnis.
- Hauskante: definierte 45-Grad-Ecke an Bild/Record-Cover, nicht an jedem Eingabeelement.
- Hauslinie: chronologische Einträge, funktionale Trennlinien und Register.
- Wortbild: kräftige Inter-Überschriften, ruhige Lesetexte, tatsächliche Hierarchie.
- Farben: vorhandenes Papier #faf8f4, Petrol #105258, tiefes Petrol #0a3539, Ink #10222a, Textsekundär #4b5b60, Linie #e4e2dc, Sand #ecdfc9, Terra #a84d29.
- Original-Logo byte-identisch. Keine nachgebaute Wortmarke, kein Ersatzzeichen, keine ungeprüften Filter.
- Owner, Handwerker, CRM und Hub bleiben helle Arbeitsflächen. Dunkles Petrol ist für narrative Kapitel, Cover und Abschlüsse vorgesehen.
- Motion nur als kurze, endliche Orientierung. Reduced Motion vollständig; keine ständig bewegten Deko-Elemente.

## Lesbarkeit
Die Kritik ist berechtigt: der Prototyp enthält 7–11px Metadaten. Im produktiven Vertrag: Body 16px (App) bzw. 17–18px (Website), Labels/Buttons 14–16px, Metadaten 13px, ausschließlich kurze nicht wesentliche Eyebrows mindestens 12px. Eingaben mindestens 16px. Kleine Schrift darf nicht dazu benutzt werden, ein Layout passend zu machen. Zoom 200%, 320/390/736/1440px und Kontrast werden geprüft.
Slides besitzen eine separate, aus derselben Skala abgeleitete Größe für 1920×1080: lesbare Caption mindestens 24px, Fließtext 32–36px, Überschriften 56–88px. Keine Web-Mikroschrift in Video/PDF.

## Implementierungsgrenzen
1. Ein kanonisches wiederverwendbares Paket packages/eh-design im Hauptrepo. Tokens in maschinenlesbarer Quelle; Styles, React-Komponenten, Assets und Seitenrezepte daraus.
2. Öffentliche Archetypen: Start/Hero, Leistung/Detail, Lexikon/Artikel, Kategorien/Index, Kontakt, Preise/Vergleich, Ablauf, Beratung und rechtliche Inhalte.
3. App-Bausteine: Seitenkopf, bestehende Navigation als übergebene Daten, Composer, Feld/Input/Textarea/Select, Tabs, Dialog, Liste/Tabelle, Status/Loading/Empty/Error, Historie und Dokumentregister. Bestehende Geschäfts-, Auth-, Daten- und Navigationslogik erhalten.
4. Präsentationsgenerator: beide Ausgabepfade (Editor/SlideRenderer und Remotion), Logo/Font/Palette, Layout- und Motion-Regeln an dieselbe Paketversion binden. Frühere Website-Video-Integration bleibt entfernt; keine ungefragte Wiedereinführung.
5. Andere Einfachhausen-Repos bekommen die Paketkopplung, Regeln und ausführbare Handback-Pakete. Konkrete Migrationsaufträge für nachfolgende Agenten sind ausdrücklich Teil des Auftrags. Nicht behaupten, unberührte Seiten seien schon migriert.
6. Vollständige aktuelle Codeblöcke, konkrete Pfade, Eingabe-/Ausgabeverträge, Prüfkommandos und Aufgabenstatus pro ausführendem Agenten. Kanonische Task-DB bleibt /home/ubuntu/dev/einfach-hausen/.sin-gpt-web/taskplan.sqlite3.

## Schutzmodell
Deterministische CI ohne kostenpflichtiges Vision-Modell: kanonische Tokens/Asset-Hashes, verbotene neue Literalfarben/Fonts/Inline-Designs, unzulässige neue Designvarianten, Mindestschrift, Import-/Versionskonsistenz und Browserreferenzen. Bestehende Designschuld wird exakt inventarisiert; eine Baseline darf nur bereits bestehende Verstöße zulassen, niemals neue.
CI- und Schutzdateien selbst als geschützte Designinfrastruktur behandeln. Keine PR-Code-Ausführung mit privilegiertem pull_request_target, keine produktive OCI-VM als unsandboxed Runner für fremden PR-Code. Prüferkomponenten brauchen echte positive/negative Tests.
GitHub Hauptrepo ist öffentlich, Adminrechte vorhanden, main bisher ungeschützt. Kostenlose erforderliche Statusprüfungen sind dort möglich. Privat-Repos der Org können für erzwungenen Schutz einen bezahlten Plan benötigen; kein Upgrade und keine Kostenbuchung durch diesen Auftrag.
Automatisierung kann Regelbrüche blockieren, aber weder menschlichen Geschmack beweisen noch einen Repo-Administrator mit denselben Zugangsdaten unüberwindbar aussperren. Diese Grenze wird ehrlich dokumentiert; kein falsches "niemals möglich".

## Verifizierte Orte
- Hauptrepo /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906, Branch design/einfachhausen-brand-atelier-20260906.
- Generator /home/ubuntu/orca/workspaces/einfachhausen-presentation-brand-20260906, Branch design/atelier-02-brand-system-20260906, GitHub einfachhausen-de/einfachhausen-presentation-generator.
- Skills /home/ubuntu/orca/workspaces/wow-my-zsh-eh-design-20260906, Branch design/eh-brand-skills-v1-20260906, GitHub OpenSIN-Code/wow-my-zsh. Ausgang origin/main nach frischem Sync; der frühere be03467-Runtime-Stand war 38 Commits zurück und 8 voraus. Er wurde unverändert erhalten; eine neue saubere Branch von origin/main wird verwendet.
- Installierte OCI-Skills: /home/ubuntu/.codex/skills/sin-frontend-design und /home/ubuntu/.config/opencode/skills/sin-frontend-design. Vor lokaler Aktualisierung Unterschiede sichern; kanonische Quellen müssen gepusht sein.
- Weitere Org-Repos: einfachhausen-de/einfach-hausen-crm und einfachhausen-de/portalhub (beide privat).
- Mac-i9-Review: /Users/jeremyschulze/orca/workspaces/einfach-hausen-brand-atelier-20260906, via GitHub synchronisieren.

## Plan und Abnahme
Ausführungsplan: docs/superpowers/plans/2026-09-06-einfachhausen-design-system-v1.md.
Die Freigabe ist erteilt; keine erneute A/B/C-Wahl und keine weitere Design-Delegation nötig. Nächste reale Abnahme betrifft die Ausführung dieses Vertrags, nicht die bereits angenommene Markenrichtung.
