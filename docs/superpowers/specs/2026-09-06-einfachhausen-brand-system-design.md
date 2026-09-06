# Einfachhausen — Markenidentität und Designkonvergenz
Stand: 2026-09-06 Europe/Berlin; verifizierter Ausgangscommit: 3d7d84ed100c21ecfe6a27074d7a22aa7ff92c04.
Repository: https://github.com/Delqhi/einfach-hausen
Arbeitsbranch: design/einfachhausen-brand-system-20260906
Designleitung: ursprünglicher ChatGPT-Agent. Ausführung ausschließlich Prime Agent, Provider bai, Modell glm-5.3-flash, OCI-VM / sinsupabase. Kein stiller Wechsel zu OpenCode, einem anderen Modell oder einem Mac.

## 1. Originalaufträge des Nutzers
Erster Auftrag, wortgetreu:
> @Remote Desktop Commander  repo https://github.com/Delqhi/einfach-hausen. agenten arbeiten aktuell an webseite und design. aber hand aufs herz einfachhausen hat zwar ein design system , aber an das wurde sich ersten nicht immer korrekt gehalten und zweitens ist das auch nicht das wahre. wir haben keine marken-design, wir brauchen was einzigartiges, was individuelles , etwas das einfachhausen aus macht. (arbeite auf mac i9) . was schlägst du vor zu tun? wir müssen design sytem nicht nur aufwerten sondern einzigartig genial machen . wir brauchen einen richtigen eigenen einfachhausen stil

Zweiter Auftrag, wortgetreu:
> alles genannte und festgestellte unbedingt festhalten auch in tasks und plänen und handoffs und issues und brains und memories. du bist leider sehr teuer aber mein bester designer. subagent prime-agent glm-5.3-flash auf maschine @OCI-VM also sin-supabase, soll für dich alles ausführen usw. du deligierst an ihn und übergibst ihm wirklich 100% alles an informationen lückenlos ohne auch nur ein einziges detail auszulassen , inkl dateipfade, inkl vollständig code in blöcken für alle fehlenden und alle zu verändernen dateien.

Die erste Bestandsaufnahme wurde ausschließlich über Remote Desktop Commander auf dem verifizierten Mac i9 durchgeführt. Der zweite Auftrag pinnt die neue Ausführung ausdrücklich auf OCI-VM und Prime Agent glm-5.3-flash. Der Nutzer hat den OCI-VM-Pluginzugang für diese Ausführungswelle ausdrücklich ausgewählt.

## 2. Autorisierung und Entscheidungsstand
Autorisiert sind vollständige Speicherung, Aufgabenplanung, Issues, Handoffs, technische und dauerhafte Erinnerungen sowie Delegation/Ausführung der konkret beschriebenen Studie auf isoliertem Branch.
„Warme Architektur“ ist die Empfehlung der Designleitung. Die drei sichtbaren Alternativen sind noch nicht vom Nutzer gegeneinander beurteilt worden; keine Behauptung einer bereits erfolgten visuellen Auswahl.
Die aktuelle Welle liefert drei vollständige Stilproben mit identischem Inhalt, vollständigen Quellen und prüfbarer Evidenz. Die folgende produktive Umstellung wird im selben kanonischen Taskplan festgehalten und hängt an der dokumentierten Markenentscheidung. Keine eigenmächtige Veröffentlichung eines neuen Markenstils.
Der neu angefragte Markenprozess ist eine ausdrückliche Erweiterung des älteren „kein Rebrand“-Auftrags. Er hebt Schutz vor Datenverlust, bestehende Produktlogik und Parallel-Arbeitsgrenzen nicht auf.
Die optionale Automation „Design-Konsistenz nach dem nächsten Deploy prüfen“ wurde nur angeboten, nicht bestellt; keine Automation behaupten oder ungefragt erstellen.

## 3. Unveränderliche Produkt- und Teamvorgaben
- Original-Logo vollständig und unverändert verwenden; keine Nachschrift mit Systemtext, kein nachgezeichnetes Ersatzlogo. Vorhandene helle/inverse Originalvarianten können nach Beleg benutzt werden.
- Website, Eigentümer-App und Partner-App bilden eine helle, ruhige Produktfamilie. Partner-App nicht als dunkles ERP gestalten.
- Vorhandene Navigation, Leistungsbereiche, Inhalte, Backend, Auth, Daten und Sicherheitsgrenzen erhalten. Keine beliebigen Menüeinträge hinzufügen/entfernen.
- Gina Schulze ist Inhaberin und Geschäftsführerin; Jeremy/Jerry Schulze ist Developer, nicht Betreiber/Geschäftsführer.
- KI organisiert; eigenständige regionale Partner führen aus; menschlicher Ansprechpartner bleibt erhalten. Keine automatische Beauftragung aus einer normalen Frage.
- Keine erfundenen Kunden, Bewertungen, Partnerzahlen, Zertifikate, Garantien oder 24/7-Zusagen.
- Keine Reaktivierung der ausdrücklich entfernten Präsentations-/Remotion-Sektionen. Deren letzte Integration wurde wegen Designabweichungen vom Nutzer verworfen.
- Andere Agenten arbeiten an Hero, Lexikon, Kontakt und Footer; Änderungen erhalten. Kein reset, clean, force-push oder ungeprüftes Vollüberschreiben.
- Der Nutzer schätzt die neue Kontaktseite des anderen Agenten ausdrücklich. Sie ist eine wertvolle Referenz, nicht pauschal zu ersetzen.
- Keine weitere kostenpflichtige Modellwahl ohne Nutzerentscheidung. Ein definierter Prime-Ausführer; die Designleitung prüft Ergebnisse.
- Geheimnisse, Tokens, Sitzungsdaten, private Kundendaten und vollständige Umgebungsvariablen niemals in Git, Issues, Handoffs oder Memories.

## 4. Vollständige Befunde der Bestandsaufnahme
F01 — In src/components/marketing/site-shell.tsx importiert der Header logo-mark.png und setzt „einfach“/„hausen“ als HTML-Text zusammen. Der Footer verwendet logo-full.png. Die tatsächliche Originalwortmarke unterscheidet sich von dieser Nachbildung.
F02 — src/components/Logo.tsx enthält eine weitere Variante. Der compact-Zweig zeichnet ein Haus mit einem SVG-Pfad und zwei Rechtecken; die Wörter sind span-Texte. Der normale Zweig kombiniert einfachhausen-mark.svg, Text und einen Claim. src/components/logo.module.css setzt eigene 34px-Wortmarkenregeln. Nutzung vor einer produktiven Korrektur per GitNexus ermitteln.
F03 — src/app/design-system.css hatte am Ausgangscommit 1180 Zeilen, 67 Vorkommen von !important und vier :root-Vorkommen. Kommentare markieren v3, v4, v5, v6, v7 sowie spätere Konvergenz-/Override-Wellen. Das ist Wartungs-/Konsistenzrisiko, kein Beweis, dass jede Regel falsch ist. Nicht blind löschen: einzelne Guards erfüllen Barrierefreiheit oder Responsive-Verhalten.
F04 — src/app/globals.css hatte 846 Zeilen und viele direkt gesetzte Farbwerte. Häufig waren #fff (70), #105258 (26), #dcebec (22), #0d2031 (16), #f4f7f7 (15), #ffffff (14), #e3ece8 (13), #0d4448 (12). Diese Stichprobe umfasst auch sinnvolle semantische Farben; keine automatische Gleichsetzung aller Hex-Werte mit Fehlern.
F05 — src/components/marketing/mkt.module.css hatte 699 Zeilen und deutlich weniger direkt gesetzte Hexwerte; viele Marketingregeln nutzen bereits --eh-* Tokens. Vorhandene gute Strukturen weiterverwenden.
F06 — src/app/layout.tsx importiert globals.css, design-system.css und marketing/tokens.css. InterVariable.woff2 ist lokal als --font-marketing eingebunden, Gewicht 100–900, display swap. Keine unbewiesene Aussage, die aktuelle App habe die Schrift des alten Screenshots.
F07 — DESIGN.md umfasst am Ausgangsstand ca. 2500 Zeichen, Status 2026-09-03. Es benennt kanonische Tokens, helle Flächen, Seitenarchetypen, App-/Partner-Hierarchien, CSS-Module und Verbote wie Standard-Glassmorphism, Textverläufe und Akzentstreifen. Es ist eine knappe Produktleitlinie; ein vollständiger Markenbaukasten mit präziser Logo-, Bild-, Typo-, Zustands- und Motion-Anwendung ist noch auszuarbeiten.
F08 — docs/DESIGN_SYSTEM.md (ca. 2483 Zeichen) kennzeichnet frühere Grünwerte ausdrücklich als historische Referenz und verweist auf Petrol-Konvergenz. Es nennt 14–18px-Kartenradien, während Marketingtokens u.a. 24/28px nutzen. Unterschiedlicher Nutzungskontext kann Radien erklären; Regeln müssen eindeutig nach Rolle geordnet werden.
F09 — tokens.css und andere Kommentare verweisen auf DESIGN.md §3 oder weitere Abschnitte, die in der aktuellen kurzen Datei nicht existieren. Referenzhierarchie bereinigen und alte Regeln ausdrücklich als historisch markieren.
F10 — Die aktuelle Palette ist bereits brauchbar: Petrol #105258, tiefes Petrol #0a3539 bzw. Marketing #0b3a3f, Canvas #faf8f4, Weiß #ffffff, Ink #10222a, Sekundärtext #4b5b60, Linie #e4e2dc, Sand #f4ebdd/#ecdfc9/#d9b98a, Terra #a84d29/#f7e4da. Einen neuen Satz beliebiger Farben einzuführen, ist nicht die Markenidee.
F11 — Marketingtokens definieren bereits Radien 8/10/12/24/28/pill, Container 1180/760px, responsive Gutters, Abstandsskala 4/8/14/22/34/52/76px, eine Motion-Kurve cubic-bezier(0.22,1,0.36,1) und 140/240/420ms. Diese Werte sind Ausgangsmaterial; finale Festlegung anhand der Studie.
F12 — Betrachtet wurden Original public/brand/logo-full.png sowie eingecheckte Baselines home@desktop.png und app/owner_app_home__mobile.png. Die Home-Baseline stammt laut Git aus d53e8cc vom 2026-09-05, die App-Baseline aus 500b60a vom 2026-09-03. Sie sind Referenzartefakte, keine in diesem Auftrag frisch aufgenommenen Live-Screenshots.
F13 — Webabrufe lieferten Inhalte von /ueber-uns und /leistungen, aber der Homepage-Abruf scheiterte einmal mit 502. Kein belegter aktueller Produktionsausfall; nicht als solcher dokumentieren. Such-/Crawl-Inhalte enthielten damals noch entfernte Präsentations-/CTA-Texte. Der Git-Stand mit Entfernung ist maßgeblich; Crawls sind zeitlich versetzt.
F14 — GitHub meldete in der ersten Prüfung keine offenen PRs. Das bedeutet nicht, dass keine Agenten arbeiten: lokale Worktrees und Dirty Files belegen Parallel-Arbeit.
F15 — Bestehendes GitHub-Issue #33 betrifft visuelle Baselines und berichtete eine Actions-Billing-Sperre. Die Sperre wurde in dieser Welle nicht aktuell verifiziert. Nicht duplizieren, nicht pauschal Baselines erneuern, um Tests grün zu machen.
F16 — Auf OCI ist /srv/einfach-hausen aktuell bei 3d7d84e; seine taskplan.sqlite3 ist nur 0 Byte und kein gültiger kanonischer Taskplan. Der vollständige gültige Plan liegt unter /home/ubuntu/dev/einfach-hausen/.sin-gpt-web/, validiert, mit 113 done, 10 cancelled, 5 backlog zum Discovery-Zeitpunkt. Diese Zählung ist Momentaufnahme.
F17 — T-0151 „Visual Regression Website“ existiert bereits im gültigen Taskplan und ist backlog. Mit neuer Markenarbeit verknüpfen, nicht ohne Prüfung als erledigt/ersetzt markieren.
F18 — Prime-Agent-Start mit Standard-PATH scheiterte an Node v20.20.2. Bereits installiertes /home/ubuntu/.nvm/versions/node/v22.23.0/bin löst das; keine globale Node-Installation oder Standardänderung notwendig. Modellliste bestätigt bai/glm-5.3-flash, Kontext 1M, max-out 131.1K, Thinking und Images unterstützt.
F19 — GitHub-Connector konnte Issues lesen, verweigerte create_issue jedoch mit 403 „Resource not accessible by integration“. Vorhandene GitHub CLI auf OCI ist als Delqhi authentifiziert; native, vom Nutzer autorisierte Issue-Verwaltung kann darüber erfolgen. Keine Tokens ausgeben.

## 5. Markenpositionierung und kreative Empfehlung
Die vorhandene Positionierung beschreibt den persönlichen Hausmanager und eine dauerhafte Beziehung zwischen Eigentümer, Hauswissen und ausführenden Menschen. Kernnutzen: mentale Entlastung, Entscheidungssicherheit, nichts Wichtiges vergessen, Werterhalt und ein vertrauter Ansprechpartner. Quellen: docs/PRODUCT_VISION.md, docs/PRODUCT_POSITIONING.md und https://einfachhausen.de/ueber-uns.
Bestehende Kernbotschaft: „Dein Haus. Einfach geregelt.“ Emotional: „Weniger kümmern. Mehr zuhause sein.“
Empfehlung der Designleitung: „Warme Architektur“ — Klarheit guter Architektur, Nähe eines persönlichen Ansprechpartners und Ruhe einer gut geführten Hausakte.
Das Original-Logo verbindet sachliches kräftiges „einfach“, persönliches handschriftliches „hausen“ und eine durchgehende Dachlinie. Dieses Spannungsfeld ist die visuelle Ausgangsidee. Das Logo selbst bleibt unverändert.
Form: charakteristische offene Rahmenform aus der Dachgeometrie ableiten, mit festen Winkeln, Rundungen und Proportionen. Nur ausgewählte Bilder, Kapitel und Übergänge tragen das Motiv; Bedienflächen bleiben verständlich.
Farbe: Petrol als Anker, kalkiges Offwhite, Sand, sparsame Terra-Akzente; feste Rollen für Hintergrund, Oberfläche, Text, Interaktion, Fokus und Status.
Typografie: prägnante kompakte Headlines mit bewussten Zeilenumbrüchen und gut lesbare UI; Handschrift im Logo bleibt besonders. Eine neue Displaybehandlung ist Gegenstand sichtbarer Erprobung, nicht stiller globaler Austausch.
Bild: bewohnte Häuser, echte Ansprechpartner und präzise Handwerksdetails; konsistentes Tageslicht, Perspektiven und Ausschnitte. Bestehende Bildassets in Studien als Bestandsmaterial kennzeichnen; deren reale Herkunft wurde hier nicht belegt.
Produktmotive: Hausakte als Register/Chronik, Ansprechpartner als persönliche Kontaktfläche, Hausjahr als nachvollziehbare Zeitlinie. Website und Apps sollen dieselben Motive unterschiedlich dicht anwenden.
Motion: Anliegen wird geordnet, Termin bestätigt, Dokument abgelegt; einheitlicher Rhythmus, semantisch sinnvolle Übergänge, funktional gleichwertige reduzierte Bewegung.
Sprache: persönlich, konkret, entlastend. Keine technischen Implementierungsdetails wie Remotion-Auflösung/FPS im Produktfluss.

## 6. Drei gleichwertig ausgearbeitete Stilproben
A — Warme Architektur (Empfehlung): präzise Raster, offene geometrische Rahmung, warme Wohnlichkeit, Petrol/Canvas; Risiko unnötiger Kühle durch persönliche Bildsprache ausgleichen.
B — Persönlicher Hausbegleiter: zugänglicher, stärker menschenbezogen, weichere Flächen, großzügige Nähe; Eigenständigkeit muss über konsistente Bildregie und Formen entstehen.
C — Das Hausjournal: redaktionelle Typografie, Register, feine Linien und erklärende Ordnung; besonders passend für Hauswissen/Lexikon, aktive Hilfe muss sichtbar bleiben.
Jede Richtung zeigt exakt dieselben Inhalte/Aufgaben in drei Ansichten: Startseitenpassage, mobile Hausakte, Kontaktansicht.
Die Studie ist ein separater, funktionsfähiger HTML/CSS/JS-Prototyp unter design/brand-study/. Kein Ersatz aktueller Produktionsseiten, kein öffentlich verlinkter neuer Produkt-Menüpunkt.
Beispielzustände sind als Studie gekennzeichnet; keine echten Aufträge/Nachrichten versenden.
Akzeptanz: Richtung und Ansicht lassen sich per Tastatur wechseln; Inhalte bleiben vergleichbar; Original-Logo lädt; alle Assets lokal; keine Horizontalüberläufe bei 390, 736, 1320px; reduzierte Bewegung; Form gibt lokale nachvollziehbare Rückmeldung; keine Console-/Page-Errors; 27 Screenshots (3 Richtungen x 3 Ansichten x 3 Viewports).

## 7. Folgephasen nach dokumentierter visueller Entscheidung
1. Markenregeln mit autorisierten Logoanwendungen, Bildsprache, Formen, Typografie, Tonalität und Motion.
2. Zentraler Bausteinkatalog mit echten Komponenten für Desktop/Mobil sowie Fehler-, Lade-, Leer-, Erfolgs- und Fokuszustände.
3. Eindeutige Agentenregeln und Referenzbilder; Begriffe wie „premium“ allein sind kein prüfbares Acceptance-Kriterium.
4. Schrittweise Migration nach Oberfläche mit klaren Zuständigkeiten. Gute aktuelle Hero-/Kontakt-/Lexikon-/Footer-Arbeit integrieren.
5. Visuelle, responsive, funktionale und Accessibility-Prüfung; bestehendes T-0151 und Issue #33 integrieren.
Jede produktive Datei erhält vor Änderung eine aktuelle Source-of-Truth-Prüfung, GitNexus-Impact und vollständigen geprüften Zielquelltext. Noch nicht entschiedene Produktionsmigrationen sind explizite Folgeaufgaben, keine erfundenen vorab fertigen Replacements.
Maßstab: Wiedererkennbarkeit bei verdecktem Logo und ebenso klare, persönliche Bedienung. Dies ist ein Prüfkriterium, kein schon erwiesenes Ergebnis.

## 8. Vollständige relevanten Pfade und Parallel-Arbeitsstände
Mac i9: Device f90be40b-ccb9-4d10-a1c7-5f2d414ca51e; Host MacBook-Pro-von-Jeremy-3.local; Intel i9-9980HK; Home /Users/jeremyschulze.
- /Users/jeremyschulze/dev/einfachhausen-landing-page : eigenständiger Checkout, früher geprüft bei 194d1a6, dirty src/app/page.tsx, home-sections.tsx, mkt.module.css, site-shell.tsx sowie neue Footer-/Closing-CTA-Dateien und docs/FOOTER_CLOSING_REDESIGN.md. NICHT überschreiben.
- /Users/jeremyschulze/dev/einfachhausen-landing-page/einfach-hausen : verschachtelter unabhängiger Checkout bei bc77fd88d4e7476f8050f0e64c407703281f538d.
- /Users/jeremyschulze/orca/workspaces/einfach-hausen-a11y-deployfix-20260905 : fix/home-rail-keyboard-access-20260905, 959f6213c548ebfe31e54671782237f45e1c83f6.
- /Users/jeremyschulze/orca/workspaces/einfach-hausen-contact-redesign-20260906 : feat/contact-enterprise-motion-redesign-20260906, dc24a6d7a0630a2b495b9a40039ce995e60c249a.
- /Users/jeremyschulze/orca/workspaces/einfach-hausen-hero-20260905 : feat/home-hero-v2-final5-20260905, dc24a6d7a0630a2b495b9a40039ce995e60c249a.
- /Users/jeremyschulze/orca/workspaces/einfach-hausen-lexikon-20260905 : feat/lexikon-enterprise-redesign-20260905, 1b31f2b83bc2dd8b2ebf64a7eccb252b9e35a561.
- /Users/jeremyschulze/orca/workspaces/einfach-hausen-presentations-20260905 : feat/presentation-sections-20260905, ee3529b64a76c036071331ef7e5d985975ff8ab3. Entfernte Arbeit nicht reaktivieren.
- /Users/jeremyschulze/orca/workspaces/einfach-hausen-remove-presentations-20260905 : fix/remove-presentations-20260905, 3d7d84ed100c21ecfe6a27074d7a22aa7ff92c04. Quelle der ersten Detailprüfung.

OCI / sinsupabase, aarch64:
- /srv/einfach-hausen : Produktion, main 3d7d84e. Kein Design-Arbeitsverzeichnis.
- /home/ubuntu/dev/einfach-hausen : alter dirty main 84f333c, echter kanonischer Taskplan. Dirty AGENTS, README, ARCHITECTURE, NEXT_AGENT, PRODUCTION_HANDOVER plus andere Agentenartefakte. Nur Task-CLI darf seinen Taskplan aktualisieren.
- /home/ubuntu/einfach-hausen-oci-handoff : dirty Branch oci/t0171, f0346bf, älterer eigener Taskplan; nicht Hauptquelle.
- /home/ubuntu/einfach-hausen-lexikon-polish-20260905 : feat/lexikon-index-polish-20260905, 32b634b.
- /home/ubuntu/orca/workspaces/einfach-hausen-brand-system-20260906 : diese Welle, eigener Worktree vom aktuellen origin/main; Git-Common-Dir /home/ubuntu/dev/einfach-hausen/.git.
- /home/ubuntu/.local/bin/prime-agent : tatsächlicher Agent.
- /home/ubuntu/.nvm/versions/node/v22.23.0/bin : notwendiger Runtime-PATH.
- /home/ubuntu/.local/bin/sin-gpt-web-state : CLI-Symlink nach /home/ubuntu/orca/runtime/wow-my-zsh-main/scripts/sin-gpt-web-state.py.
- /home/ubuntu/.local/bin/sin-memory-write : CLI-Symlink nach /home/ubuntu/dev/sin-save-token/bin/sin-memory-write.
- /home/ubuntu/orca/runtime/wow-my-zsh-main/shared/skills/sin-brain/ : technische Konventions-Erinnerungen; src/sin_brain/cli.py ist die CLI.
- /home/ubuntu/orca/runtime/wow-my-zsh-main/shared/skills/sin-honcho/ : Verhaltens-/Präferenzgedächtnis. Stub/No-op ist kein Speichererfolg.
- /home/ubuntu/dev/sin-save-token/. : kanonisches Context/Memory-Control-Plane; keine Änderungen daran für dieses Designprojekt.

Relevante Repo-Quellen:
AGENTS.md; README.md; DESIGN.md; docs/DESIGN_SYSTEM.md; docs/PRODUCT_VISION.md; docs/PRODUCT_POSITIONING.md; docs/COMPANY_IDENTITY.md; docs/NEXT_AGENT.md; docs/PRODUCTION_HANDOVER.md; docs/ARCHITECTURE.md; docs/OPERATIONS.md; docs/LEXIKON.md; package.json; src/app/layout.tsx; src/app/globals.css; src/app/design-system.css; src/app/page.tsx; src/components/Logo.tsx; src/components/logo.module.css; src/components/marketing/site-shell.tsx; src/components/marketing/tokens.css; src/components/marketing/mkt.module.css; src/components/marketing/home-hero.tsx; src/components/marketing/home-hero.module.css; src/components/marketing/hero-orchestration.tsx; src/components/marketing/service-catalog.tsx; src/components/marketing/home-sections.tsx.
Logoassets: public/brand/logo-full.png, logo-mark.png, LOGO_white.png, LOGO_black.png, einfachhausen-mark.svg, einfachhausen-app-icon.svg; parallel src/components/marketing/assets/logo-full.png und logo-mark.png.
Schrift: src/fonts/InterVariable.woff2.
Bildmaterial: public/images/marketing/family-home.jpg, partner-doorstep.jpg, owner-kitchen.jpg; Bestandsmaterial, Herkunft hier nicht geprüft.
Baselines: tests/visual-baselines/home@desktop.png, tests/visual-baselines/app/owner_app_home__mobile.png sowie login/lexikon/kontakt Varianten.

## 9. Status-, Memory- und Übergabevertrag
Kanonische operative Aufgaben ausschließlich mit sin-gpt-web-state --repo /home/ubuntu/dev/einfach-hausen ... schreiben. TASKPLAN.md nicht manuell bearbeiten, DB nicht direkt schreiben. Dokumente und Issues referenzieren dieselben Task-IDs.
SIN-Brain enthält evidenzbasierte technische Konventionen; darf kein Produktions-Task als erledigt markieren.
OpenViking über sin-memory-write enthält belegte projektrelevante Fakten/Entscheidungen mit Quellpfad und SHA256. Lokaler Gateway-Ledger ist nur Receipt, nicht zweites semantisches Gedächtnis.
Honcho enthält ggf. die explizite Präferenz: ursprünglicher Agent übernimmt Designleitung, glm-5.3-flash führt auf OCI kostensparend aus. Keine doppelte Ablage von Infrastruktur-Fakten in Honcho.
Speichererfolg braucht positive Backend-Antwort und Rücklesebeleg. Wenn ein Dienst nicht erreichbar ist: genaue Fehlermeldung + wiederaufnehmbarer Auftrag in docs/brand/evidence/persistence.json; nicht als gespeichert ausgeben.
Anzupassende Handoffs: AGENTS.md, README.md, docs/NEXT_AGENT.md, docs/PRODUCTION_HANDOVER.md, docs/ARCHITECTURE.md nur additiv in eigenem Worktree. Existierende Handoffs fremder Aufgaben bleiben vollständig erhalten.
Vollständiger Quelltext für alle neuen/geänderten Textdateien dieser Welle wird mit eindeutigen Dateipfaden und sprachmarkierten Codeblöcken in docs/brand/SOURCE_PACKET.md bereitgestellt; unveränderte relevante Quellen als vollständiger Snapshot. Binärquellen erhalten Pfad und SHA256. Keine Ellipsen, keine Platzhalter-Replacements.
