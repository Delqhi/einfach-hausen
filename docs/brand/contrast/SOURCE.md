# Vollständige Quelldateien der Lieferung

Basiscommit: d86a7e6. Pfade relativ zu diesem Repository. Dateien vollständig, keine Auslassungszeichen. Binärdateien werden im Manifest mit SHA256 referenziert. Dieses Dokument ist ein Nachschlagewerk; implementiert wird aus den versionierten Quelldateien.

## .gitattributes

`````text

# Generated verbatim source packet preserves inherited Markdown/code whitespace.
docs/brand/system/SOURCE.md whitespace=-blank-at-eol

docs/brand/composition-repair/SOURCE.md whitespace=-blank-at-eol

docs/brand/contrast/SOURCE.md whitespace=-blank-at-eol

`````

## DESIGN.md

`````markdown
# Einfachhausen · Designsystem 1.0

**Verbindlich seit 6. September 2026.** Jerry hat Atelier 02 ausdrücklich angenommen: „omg das ist MEGA!“ Diese Freigabe ersetzt den früheren Status „noch nicht visuell freigegeben“. Die drei alten Stilproben aus PR40 sind verworfen. Der angenommene Entwurf und seine ursprüngliche Begutachtung bleiben unter `design/brand-atelier/` und `docs/brand/ATELIER_02.md` als historische Referenz erhalten.

## 1. Autorität und Geltungsbereich

Dieses Dokument und `packages/eh-design/` definieren die Marke für Website, Unterseiten, Hausakte, Owner-App, Handwerker-App, CRM, Portalhub und Präsentationen. **Andere Agenten dürfen das Design nicht eigenständig verändern.** Der Auftrag, eine neue Seite zu bauen, ist keine Erlaubnis, Farben, Schrift, Logo, Radien, Effekte oder eine eigene Komponentenfamilie zu erfinden. Nur eine ausdrückliche Anweisung von Jerry zum Markendesign autorisiert eine neue Designversion. Ein fehlender Baustein wird als Bedarf dokumentiert; bis zur Entscheidung wird eine bestehende passende Komposition verwendet.

Inhalt, Reihenfolge, Seitenstruktur, echte Bilder, fachliche Daten, erlaubte Komponentenvarianten und bestehende Aktionen dürfen passend zum Thema kombiniert werden. Unterschiedliche Seiten sollen unterschiedlich aufgebaut sein. Einheitlichkeit bedeutet gemeinsame Gestaltungssprache, nicht identische Seiten.

Bei widersprüchlichen alten Dokumenten gilt diese angenommene Version. Historische Freigaben, Screenshots und Aufgaben bleiben nachvollziehbar, dürfen aber nicht als heutige Gestaltungsanweisung wiederverwendet werden.

## 2. Das Eigene an Einfachhausen

**Zuhause, mit Überblick.** Die Marke verbindet ein persönliches Zuhause mit klarer, nachvollziehbarer Ordnung. Die Gestaltung fühlt sich warm und entschieden an. Sie zeigt echte Inhalte und Beziehungen: Menschen, Unterlagen, Arbeiten, Termine und Hausgeschichte.

- **Hauskante:** genau eine bewusst geschnittene 45°-Ecke an großen Bildflächen und Aktenumschlägen. Keine abgeschnittenen Eingabefelder oder Schaltflächen. Wichtige Gesichter und Bildaussagen bleiben sichtbar. Interaktive Elemente liegen nicht im abgeschnittenen Bereich.
- **Hauslinie:** feine, funktionale Linien gliedern Register, Abläufe, Listen, Vergleiche und Chroniken. Nummern geben Orientierung. Keine zufälligen farbigen Streifen als Dekoration.
- **Wortbild:** kräftige, eng gesetzte Inter-Überschriften mit ruhigem Fließtext. Keine zweite Displayschrift. Der handschriftliche Teil des unveränderten Original-Logos bleibt die einzige Schreibschrift.
- **Rhythmus:** helle Arbeitsflächen und Lesestrecken, dunkle Kapitel oder Aktenumschläge. Sand setzt inhaltlich begründete Flächen ab. Keine beliebige Sammlung gleichförmiger Karten.
- **Fotografie:** glaubwürdige Wohnsituationen und persönliche Zusammenarbeit. Keine erfundenen Kunden, Mitarbeiter, Bewertungen oder Erfolgszahlen. Illustrative Bilder werden entsprechend bezeichnet. Bilder nie pauschal so beschneiden, dass Köpfe verschwinden.

Verboten sind neue Verläufe, Glow, Glassmorphism, schwebende Kugeln, dekorative Dauerschleifen, beliebige Pillen, nachgebaute Logos und autonome „Verbesserungen“ der Marke.

## 3. Eine einzige Markenquelle

| Quelle | Aufgabe |
| --- | --- |
| `packages/eh-design/src/tokens.json` | Kanonische, versionierte Werte |
| `packages/eh-design/src/tokens.css` und `tokens.ts` | Daraus generierte CSS- und TypeScript-Ausgaben |
| `packages/eh-design/src/styles.module.css` | Einzige neue Komponentenstilquelle |
| `packages/eh-design/src/primitives.tsx` | Grundlagen |
| `packages/eh-design/src/blocks.tsx` | Inhaltsblöcke |
| `packages/eh-design/src/app.tsx` | Interaktive und funktionale App-Komponenten |
| `packages/eh-design/src/recipes.tsx` | Vollständige, ausführbare Seitenvorlagen |
| `src/design-system/index.ts` | Importstelle der Website |
| `src/app/design-system/` | Browserbibliothek unter /design-system; noindex |
| `src/components/marketing/ui.tsx` | Kompatible Adapter für vorhandene Unterseiten |
| `src/components/marketing/tokens.css` | Alte Namen als Aliase, keine zweite Palette |
| `design/design-lock.json` | Prüfsummen des geschützten Designkerns |

Andere Repositories erhalten eine identische, versionierte Kopie nach `vendor/eh-design/` und eine Prüfsummenliste unter `design/eh-design-vendor.json`. Diese Kopie wird niemals lokal umgestaltet.

### Farben

| Rolle | Wert | Verwendung |
| --- | --- | --- |
| Papier | #faf8f4 | Grundfläche |
| Petrol | #105258 | Primäre Aktion, Orientierung |
| Tiefes Petrol | #0a3539 | Aktenumschlag, Kapitel, Abschluss |
| Tinte | #10222a | Fließtext und Überschriften |
| Sekundärtext | #4b5b60 | Lesbare Metadaten |
| Linie | #e4e2dc | Gliederung auf hellen Flächen |
| Sand | #ecdfc9 | Hinweise und sachliche Hervorhebungen |
| Terra | #a84d29 | Kleine Registersignale und begründete Hinweise |
| Weiß | #ffffff | Eingaben und funktionale Arbeitsflächen |

Statusfarben `error` und `success` gehören ebenfalls zu den kanonischen Tokens. Status braucht immer Text; Farbe alleine ist keine Information. Dunkle Flächen verwenden Papier als Textfarbe und Sand als Sekundärtext.

### Schrift und Lesbarkeit

Inter Variable wird selbst gehostet. Originaldatei: `src/fonts/InterVariable.woff2`; identische Paketkopie: `packages/eh-design/assets/inter-variable.woff2`. Keine externen Google-Font-Anfragen.

| Verwendung | Mindestwert / Skala |
| --- | --- |
| Website-Fließtext | 17–18 px; lesende Artikel 18 px |
| App-Fließtext | 16 px |
| Beschriftungen und Aktionen | 15 px; bestehende Übergangsflächen mindestens 14 px |
| Metadaten und Bildunterschriften | 13 px |
| Kurze, nicht entscheidende Großbuchstabenregister | 12 px |
| Input, Select, Textarea | 16 px, auch mobil |
| Startseiten-Display | 56–112 px, responsive |
| Unterseiten-H1 | 44–68 px |
| App-H1 | 32–44 px |
| Präsentation bei 1920×1080 | Bild-/Fußtexte mindestens 24 px, Inhalt 32–36 px, Titel 56–88 px |

Eine überladene Folie wird inhaltlich aufgeteilt. Text wird nicht bis zur Unlesbarkeit verkleinert oder abgeschnitten. Numerische Schritte bleiben ungebrochen. Absätze haben kurze, sinnvolle Leselängen; lange Fachtexte kommen in `EHProse`.

### Form, Abstand und Bewegung

Eingaben und Schaltflächen: 6 px Radius. Funktionale Panels: 8 px. Fotografien und Aktenumschläge: die kanonische Hauskante. Touch-Ziele mindestens 44×44 px, reguläre Buttons 48 px hoch. Sichtbarer Fokus mit 3-px-Kontur und Abstand, keine Entfernung ohne gleichwertigen Ersatz.

Bewegung unterstützt einen Zustand oder einen Wechsel. Kurze endliche Übergänge; keine Typewriter-Platzhalter, Hintergrunddrifts oder erzwungenen Scroll-Animationen. `prefers-reduced-motion` zeigt den vollständigen Endzustand. Keine Animation darf den Inhalt für Tastatur- oder Screenreader-Nutzer verbergen.

## 4. Komponentenregister

| Familie | Kanonische Komponenten |
| --- | --- |
| Grundlagen | EHScope, EHLogo, EHContainer, EHSection, EHEyebrow, EHHeading, EHText, EHButton, EHTextLink, EHActions, EHImageFrame, EHRecordCover, EHStatus, EHDivider |
| Einstieg und Erzählung | EHPageHero, EHPromiseRow, EHSplitStory, EHMediaStory, EHClosing |
| Leistung und Erklärung | EHFeatureRows, EHSteps, EHTimeline, EHFacts, EHComparison, EHFAQ, EHCallout, EHServiceIndex, EHPricing |
| Lesen und Navigation | EHProse, EHArticleHeader, EHArticleLayout, EHContents, EHRelated |
| Arbeitsflächen | EHAppHeader, EHPanel, EHList, EHDataTable, EHDocumentList |
| Eingaben | EHField, EHInput, EHTextarea, EHSelect, EHCheckbox, EHComposer |
| Interaktion und Zustände | EHTabs, EHDialog, EHEmptyState, EHLoadingState, EHErrorState |

Die vollständigen TypeScript-Props sind die API-Referenz; sie stehen mit dem vollständigen Code in der Quellkapsel. Keine zusätzlichen `style`- oder `className`-Schlupflöcher an den neuen öffentlichen Komponenten. Bestehende Adapter behalten ihre bisherigen Schnittstellen, damit Unterseiten nicht brechen.

`EHField` verknüpft Label und Eingabe über dieselbe ID. Hinweise und Fehler werden mit `aria-describedby` verbunden; Fehlerzustand über `aria-invalid`. `EHTabs` unterstützt Links/Rechts, Home/End und deaktivierte Einträge. `EHDialog` nutzt den nativen modalen Dialog, Fokusbindung und Escape. Datenlisten behalten eindeutige IDs. Tabellen haben Caption und Spaltenköpfe; auf kleinen Bildschirmen ist ausschließlich der Tabellenbereich horizontal scrollbar.

## 5. Seiten individuell zusammensetzen

| Inhalt | Vollständige Vorlage | Schwerpunkt |
| --- | --- | --- |
| Startseite | EHHomePage | Starkes Wortbild, Fotografie, Versprechen, Hausakte, Ablauf |
| Leistungsdetail | EHServicePage | Bedarf, Leistungsumfang, Entscheidung, Fragen |
| Ratgeber / Fachartikel | EHArticlePage | Inhaltsverzeichnis, Lesespalte, Zwischenüberschriften, verwandte Themen |
| Leistungsübersicht | EHServiceIndexPage | Themenregister und konkrete nächste Wege |
| Kontakt | EHContactPage | Persönlicher Kontext, vollständiges Formular, tatsächliche Kontaktdaten |
| Preise / Umfang | EHPricingPage | Klarer Leistungsumfang, gültige Preise, Bedingungen |
| Owner-App | EHOwnerPage | Hausakte, Unterlagen, Menschen, Chronik, Anliegen |
| Handwerker-App | EHProviderPage | Anfragen, Bearbeitungsstatus, Termine |

Die Vorlagen nehmen Inhalte und echte Handler als Props entgegen. Datenzugriff, Authentifizierung, Routing, Speicherung und Beauftragung werden aus dem bestehenden Produkt angebunden. Die Browserbibliothek enthält gekennzeichnete Vorschauhandlungen und Beispieldaten; sie sind keine produktiven Endpunkte. Keine Vorschau-Antwort oder Beispieladresse wird in eine echte App übernommen.

Eine neue Seite beginnt mit der passenden vollständigen Vorlage. Fachlich begründete Umstellungen mit vorhandenen Blöcken sind erlaubt. Eine neue Seitenfarbe, Schrift oder lokale Komponentenfamilie ist es nicht.

## 6. Präsentationen

Kanonischer Verbraucher: `einfachhausen-de/einfachhausen-presentation-generator`.

- Die 13 Schema-Typen bleiben kompatibel: title, section, bullets, cards, comparison, steps, stats, quote, timeline, chart, image, split, closing.
- Die 25 vorhandenen Remotion-Geschichten behalten ihre Inhalte, Aufrufwege und fachlichen Einschränkungen.
- Beide Renderer lesen dieselben vendorten Tokens; Logo und Inter kommen aus den unveränderten Paketassets.
- Karten werden als lesbare Registereinträge gestaltet. Aktenpanels verwenden die Hauskante.
- Der historische API-Name `Phone` bleibt erhalten; sein Inhalt wird als lesbare Hausakte dargestellt.
- Keine zweite Palette, kein nachgebautes Wortzeichen, keine zusätzliche Schrift.
- Diagramme bilden tatsächlich übergebene Zahlen ab. Beispielzahlen sind keine Belege.
- Remotion bleibt im Generator. Die früher entfernten Website-Präsentationsbereiche werden durch diese Arbeit nicht wieder eingeführt.

## 7. Schutz vor unbeabsichtigter Änderung

`node scripts/eh-design-generate.mjs --check` verhindert Abweichungen generierter Tokens.
`node scripts/eh-design-check.mjs` prüft die versiegelten Kerndateien und neue Verstöße.
`node --test scripts/eh-design-check.test.mjs` beweist Positiv- und Negativfälle.
`node scripts/eh-design-browser.mjs` prüft die echte Bibliothek auf responsives Verhalten, WCAG-Meldungen, Lesbarkeit und Bedienung.

Vorhandene Altlasten stehen präzise pro Datei und Fundtyp in `design/design-debt.json`. Sie dürfen abnehmen, aber nicht durch eine neue Baseline versteckt werden. Neue CSS-Dateien und UI-Dateien ohne kanonischen Import scheitern im PR-Check. Ein Umbruch oder Verschieben von Zeilen schafft kein neues Kontingent für Verstöße.

Der GitHub-Check verwendet gewöhnliche, unprivilegierte PR-Jobs mit Leserechten. Er verwendet weder fremden Code mit Produktionsgeheimnissen noch einen Produktionsrunner. Der öffentliche Haupt-Repository kann GitHub-Actions-Prüfungen ohne bezahlten Bot verwenden. Bei privaten Organisations-Repositories hängt verpflichtender Branch-Schutz vom vorhandenen GitHub-Plan ab.

**Technische Grenze:** Prüfungen können definierte Abweichungen blockieren und Review erzwingen; sie beurteilen nicht automatisch jede gestalterische Qualität. Agenten mit denselben Administratorrechten wie der Eigentümer sind keine separat absperrbare Identität. Kein Dokument oder kostenloser CI-Check rechtfertigt das Versprechen, ein Administrator könne das System niemals umgehen. Ein Agent darf deshalb weder Schutzregeln lockern noch den Designkern neu versiegeln, um seinen eigenen fehlgeschlagenen Check grün zu machen.

## 8. Übergabe und Änderung

Pflichtreihenfolge: `AGENTS.md` → `DESIGN.md` → `NEXT_AGENT.md` → konkrete Aufgabe → `sin-eh-design` → passende vollständige Recipe-Datei → tatsächlicher betroffener Code.

Vor Änderungen an geteilten Funktionen: GitNexus-Auswirkung und echte Aufrufer prüfen. UNKNOWN bedeutet nicht unbenutzt. PageHero, LinkButton, MarketingShell und der Präsentationsrenderer haben große Auswirkung; Schnittstellen bleiben stabil.

Jede Übergabe enthält Repository, Branch, Basis-Commit, absolute Workspace-Pfade, vollständigen neuen/geänderten Quelltext, unveränderte Assets mit Hash, exakte Befehle, Prüfergebnisse, tatsächliche Restarbeit und nächste Aufgabe. Keine Ellipsen, „den Rest analog“, TODO-Komponenten oder erfundenen Freigaben.

Die aktuellen vollständigen Quellkapseln und Prüfsummen liegen unter `docs/brand/system/`. Die alte Atelier-Quellkapsel bleibt unverändert historisch erhalten. Neue Freigaben werden mit ihrer tatsächlichen Aussage in Aufgaben, Handoff und den verfügbaren Memory-Systemen fortgeschrieben.

## Native HTML / Worker

CRM verwendet denselben Vertrag ohne React-Umbau: packages/eh-design/src/html.mjs, html.css und html-style.mjs. Der Generator erzeugt diese aus den kanonischen CSS-Modulen und Original-Assets. html-style.mjs enthält Schrift und Logo eingebettet. Vollständige datenabhängige CRM-Komposition: docs/brand/system/CRM_RECIPE.mjs. Ausschließlich dokumentierte HTML-Slots dürfen bereits sicher gerendertes HTML enthalten; Daten werden escaped, URLs validiert. Keine zweite Palette oder lokale Komponenten-Kopie.


## Fachliche Kompositionen · Edition 2

Acht weitere festgelegte Seitenkompositionen in packages/eh-design/src/domain-recipes.tsx ergänzen die acht Grundrezepte. Verbindliche Auswahl, Daten-/Formularslots, vollständiger Code und lokaler Übernahmeauftrag: docs/brand/system/DOMAIN_RECIPES_HANDOFF.md. Keine neuen Farben, Styles oder Grundkomponenten; 49 Basisbausteine, insgesamt 16 Seitenkompositionen. Neue Rendering-/Verhaltensprüfung und Verteilung sind an lokale Agenten delegiert.

## Verbindliche Komposition (7. September 2026)

Siehe `docs/brand/system/COMPOSITION.md` und `packages/eh-design/src/composition.tsx`. Vollständige Abschnitte statt vermischter Legacy-Layouts. EHProcess trennt Text/Medien; EHCaseStudy besitzt genau einen Abschnittskopf; EHProductExcerpt ist ein gekennzeichnetes Marketingbeispiel, keine echte App. Bestehende EHSteps bleiben reine Textschritte.

## Kontrastentscheidung 2026-09-07
Badge-Text auf Sand nutzt Ink; Terra nur als ergänzender Icon-Akzent. Verbindlicher Umfang und Nachweis: docs/brand/contrast/DECISION.md. Kein offener Brand-Blocker für pillTerra/Lexikon-Badges.

`````

## design/design-lock.json

`````json
{
  "version": "1.0.0",
  "authority": "Jerry explicitly accepted Atelier 02 and commissioned this release on 2026-09-06.",
  "files": {
    ".github/CODEOWNERS": "344048476ff047355aa71baf270bf7ebe41f418ad90195a32009424cc0670e79",
    ".github/workflows/eh-design.yml": "79881db9c76ed3111d37017ea987cb4561d0758d401a1f64a4e2e756183730e1",
    "DESIGN.md": "3dc5c76fa259cc0dcdf93a5f8d1a3db2e25e22170161e4c9b32b288d4ca84223",
    "design/design-debt.json": "272c062b8fedf63def95c347adf45242336ff4667955649c4f4c5e3302de093b",
    "design/design-policy.json": "8858aec4e3d565827a8b744fd8591b1aeaa433cd3dc3ce8bac8447e0dae37881",
    "packages/eh-design/assets/inter-variable.woff2": "0de3908cf5ef213ab1404cc5da94a976faaa886c3479a274a7d66ad80b37c64a",
    "packages/eh-design/assets/logo-full.png": "ca128f0ecfcffc93853f5271453f318be28ed4462850b06072c33afbeb1353cd",
    "packages/eh-design/package.json": "46fdcc913d21cca9abdb515caa916494f6568fddd2a66f32e724c59c8fa79b24",
    "packages/eh-design/src/app.tsx": "e0fd056724bfeb4f6244264c2daba68df73709cb7645bfc7ba2db9a531d8376d",
    "packages/eh-design/src/blocks.tsx": "5f2d07e6883c8958410150192631dc03283d05a31fad164796d48a1cba82935d",
    "packages/eh-design/src/composition.tsx": "b81e331888eeceb4d1af3d5da8abb989129f869c78562101d0e2f977b8ce9829",
    "packages/eh-design/src/domain-recipes.tsx": "4ab6bc03926690539761d73b55a18ed08da43688cb04c907b80429226d1876a7",
    "packages/eh-design/src/html-style.mjs": "63e1b4717c5591728625824be46fa87296c959354d1af54e9adb07323bc66555",
    "packages/eh-design/src/html.css": "468298c0016ca5ee786d5e4febc1ee80f0e8c3a0a24307afb87a2c1be873e1bb",
    "packages/eh-design/src/html.mjs": "7dde2a71e7eccbe9ddd7888bfb7b8d96a0a91c74e6fd07a2501070abf72d6033",
    "packages/eh-design/src/index.ts": "cf214d3af12718f8f5e9a16b180f6c2291824a724dc64172f99aec8bb477c5b8",
    "packages/eh-design/src/primitives.tsx": "d90af74e98fc45c3af3acb90134621b226902b6aaa0b3d74c9ab558a2fde6edb",
    "packages/eh-design/src/recipes.tsx": "0b56b2c76d10f031aedc5375922495711e61759a57cda1a99a63ecfbc563931f",
    "packages/eh-design/src/request-form.tsx": "efaa49e4d8a8329f350e26c75e85b1d5d61c910eae78a70222486229114d8002",
    "packages/eh-design/src/styles.module.css": "235ac8de099390ed7f2a6048ec32d520eab02e60dc68d7e3edf65f4b6c6a4e48",
    "packages/eh-design/src/tokens.css": "4358aae0a1bcb0de84b2e97415b4c6f0356212dbdf67b901590f9dc90cbfc191",
    "packages/eh-design/src/tokens.json": "b399d3041129b93605a0b0a3541424b7ca251032f1b07dbd2bee59289c417e35",
    "packages/eh-design/src/tokens.ts": "afc13c9121be6bf738635eaad8faa17150d27fb12984de9e964047a7e403a5f0",
    "scripts/eh-design-check.mjs": "2d4920188c4e961087b75543b5165c48d5d46ef2faa8f11dc33a598f2ac4aade",
    "scripts/eh-design-check.test.mjs": "dbfe6716678ecbad9bf3b1466326f21e8083a78a567fe467e3a21ea32a5b4287",
    "scripts/eh-design-generate.mjs": "55fd71312a134e475c25043da10d11f93ad0ae310310261f153750593dc543f3",
    "scripts/eh-design-seal.mjs": "7be13b011f7cf28530e46d65089b514b4158d036471f768400e5b824e5214024",
    "scripts/eh-design-sync.mjs": "b33e7f99b92b7a717dd6a8794a78ac7d4d2e962553888783c9e416daa1674629",
    "src/app/app/homeowner.module.css": "a483bea8f8ae24cd74dddf79da6fd556217559aa659e532961d972c695877d80",
    "src/app/design-system.css": "234971f6eeb51a6f6c96fb4e3b73190e159944d7a7ed9d371a5d38874e45c9bd",
    "src/app/globals.css": "4721b8a3af2685c2fbd629be5b2916d643fd0b09f1907f205df791d51818841a",
    "src/app/pro/provider-workspace.module.css": "7b718c05d6a19d7dcb8bdb5b773267538ca0ca0a34645f8228587329adfb706d",
    "src/components/marketing/home-hero.tsx": "8fef8ff8fa9624a178635222a5ff21864ee5685d6bf0ea961735f16fa4ed6532",
    "src/components/marketing/mkt.module.css": "58a850da9f437dd328fca9b5780abcbcde574829ee006ff3d4cd261127adcf7c",
    "src/components/marketing/site-shell.tsx": "fa9bf21cc77ba7da421b493ef72c555547317bd40e800c4dce5a12b0bc9aa0b4",
    "src/components/marketing/tokens.css": "7cd827cb75fceabf3222b1420dce2524cf1e22789d799be55eb001d3bb4da88b",
    "src/components/marketing/ui.tsx": "a8a03cf1d32ecbc80fd5205d90cbcce48afcdd9b9721f5f7583cb2cce040012b",
    "src/design-system/index.ts": "c5880f7f92770415c9a60609a9c6bd927e44217893bb16f81469b0231d2f9ab7"
  }
}

`````

## docs/brand/contrast/DECISION.md

`````markdown
# Verbindliche Kontrastentscheidung · 2026-09-07

Jerry hat die direkte Korrektur von pillTerra und Lexikon-Badges beauftragt. Keine weitere Markenentscheidung erforderlich.

Terra #a84d29 auf Sand #ecdfc9: 4.247678:1, für kleinen normalen Text unzureichend. Text jetzt Ink #10222a auf Sand #ecdfc9: 12.431167:1. Vorhandenes Terra bleibt nur beim SVG-Icon als ergänzendem Akzent (4.247678:1); Bedeutung weiterhin ausgeschrieben. Tokens unverändert.

Geänderte Selektoren: src/components/marketing/app-frames.module.css .pill/.pillTerra und src/components/marketing/lexikon/lexikon.module.css .badge/.badge[data-tone=pflicht]/.explorer .badge. Textgröße var(--eh-font-label) (15px bei 16px Root). Lexikon min-height statt starrer Höhe; 11px-Override entfernt. Empfohlen/Wissen behalten ihre vorhandenen kontrastreichen Tokenpaare.

Prüfung: rechnerische sRGB-Luminanz der kanonischen Farben, diff --check. Keine Live-CSS-Messung oder visuelle Abnahme behauptet. Lokaler Agent übernimmt diesen eigenständigen main-basierten Commit, prüft die gemeldeten Axe-Fälle samt 390/736/1440px, Zoom und Wrapping und kann danach den Kontrast-Unterpunkt schließen. Keine weiteren Workflows eigenständig designen. Nicht die gesamte Designmigration schließen. Andere offene App-Vorgaben: PR49 und PR51.

`````

## src/components/marketing/app-frames.module.css

`````css
/* Phone frame + realistic app screen mockups for the public website. */
.frame {
  --w: 320px;
  width: var(--w); max-width: 100%;
  aspect-ratio: 9 / 18.5;
  border-radius: 40px; padding: 10px;
  background: linear-gradient(160deg, #1f3339, #0b1a1e);
  box-shadow: var(--eh-shadow-lg), inset 0 0 0 1px rgba(255,255,255,.08);
  position: relative; flex: none;
}
.frameSm { --w: 240px; border-radius: 32px; padding: 8px; }
.frameSm .screen { border-radius: 26px; font-size: 12px; }
.frameSm .notch { width: 70px; height: 18px; }
.frameSm .body { mask-image: linear-gradient(#000 78%, transparent 98%); -webkit-mask-image: linear-gradient(#000 78%, transparent 98%); }
.screen {
  width: 100%; height: 100%; border-radius: 32px; overflow: hidden;
  background: #f6f7f7; color: var(--eh-ink);
  display: flex; flex-direction: column; font-size: 13.5px; line-height: 1.35;
  font-family: var(--eh-font);
}
.notch {
  position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
  width: 96px; height: 24px; border-radius: 999px; background: #0b1a1e; z-index: 2;
}
.status { display: flex; justify-content: space-between; padding: 14px 22px 0; font-size: 11px; font-weight: 600; color: var(--eh-ink-soft); }
.bar { display: flex; flex-direction: column; gap: 2px; padding: 22px 18px 12px; }
.bar small { font-size: 11px; color: var(--eh-ink-mute); font-weight: 500; }
.bar strong { font-size: 19px; letter-spacing: -0.02em; font-weight: 700; color: var(--eh-teal-900); }
.body { display: flex; flex-direction: column; gap: 10px; padding: 0 14px 14px; flex: 1 1 auto; overflow: hidden; }
.tile { background: var(--eh-surface); border-radius: 16px; padding: 12px 13px; display: flex; flex-direction: column; gap: 6px; border: 1px solid var(--eh-line); }
.tileRow { display: flex; align-items: center; gap: 10px; }
.tileRow > div { display: flex; flex-direction: column; gap: 1px; flex: 1 1 auto; min-width: 0; }
.tileRow strong { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tileRow > div span { font-size: 11.5px; color: var(--eh-ink-mute); }
.icon { width: 34px; height: 34px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; flex: none; background: var(--eh-teal-050); color: var(--eh-teal-700); }
.iconWarm { composes: icon; background: var(--eh-terra-soft); color: var(--eh-terra); }
.iconSand { composes: icon; background: var(--eh-sand-100); color: #7a5a2a; }
.pill { display: inline-flex; align-items: center; gap: 5px; align-self: flex-start; padding: 3px 8px; border-radius: 999px; font-size: var(--eh-font-label); font-weight: 700; letter-spacing: .02em; }
.pillTeal { composes: pill; background: var(--eh-teal-100); color: var(--eh-teal-900); }
.pillTerra { composes: pill; background: var(--eh-color-sand); color: var(--eh-color-ink); }
.pillTerra svg { color: var(--eh-color-terra); }
.pillSand { composes: pill; background: var(--eh-sand-100); color: #7a5a2a; }
.pillGreen { composes: pill; background: #e3f1e6; color: #1f6b3a; }
.cta { margin-top: auto; display: flex; align-items: center; justify-content: center; gap: 6px; background: var(--eh-teal-700); color: var(--eh-on-dark); border-radius: 12px; padding: 11px; font-weight: 600; font-size: 13px; }
.section { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--eh-ink-mute); padding: 4px 2px 0; }

/* timeline inside screen */
.tl { display: flex; flex-direction: column; gap: 0; }
.tlRow { display: flex; gap: 10px; }
.tlRail { display: flex; flex-direction: column; align-items: center; width: 14px; flex: none; }
.tlDot { width: 8px; height: 8px; border-radius: 50%; background: var(--eh-teal-700); margin-top: 6px; flex: none; }
.tlDotSand { background: var(--eh-sand-400); }
.tlLine { width: 2px; flex: 1 1 auto; background: var(--eh-line); margin: 3px 0; }
.tlRow:last-child .tlLine { display: none; }
.tlBody { display: flex; flex-direction: column; gap: 1px; padding-bottom: 12px; min-width: 0; }
.tlBody small { font-size: 10.5px; color: var(--eh-ink-mute); }
.tlBody strong { font-size: 12.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* contact card */
.person { display: flex; align-items: center; gap: 12px; }
.avatar { width: 46px; height: 46px; border-radius: 50%; background: var(--eh-teal-100); color: var(--eh-teal-900); display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex: none; }
.person strong { font-size: 15px; font-weight: 700; display: block; }
.person span { font-size: 12px; color: var(--eh-ink-soft); }
.actions { display: flex; gap: 8px; }
.actions span { flex: 1 1 0; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; border-radius: 10px; background: var(--eh-teal-050); color: var(--eh-teal-700); font-weight: 600; font-size: 12px; }
.bubble { align-self: flex-start; max-width: 88%; background: var(--eh-surface); border: 1px solid var(--eh-line); border-radius: 14px 14px 14px 4px; padding: 9px 12px; font-size: 12.5px; }
.bubbleMe { composes: bubble; align-self: flex-end; background: var(--eh-teal-700); color: var(--eh-on-dark); border-color: transparent; border-radius: 14px 14px 4px 14px; }

/* progress */
.progress { display: flex; gap: 4px; }
.progress i { flex: 1 1 0; height: 5px; border-radius: 3px; background: var(--eh-line); }
.progress i[data-on='true'] { background: var(--eh-teal-700); }

/* Mini card visuals for benefits (no frame) */
.miniStack { display: flex; flex-direction: column; gap: 10px; width: min(100%, 340px); }
.miniStack .tile { box-shadow: var(--eh-shadow-sm); }

`````

## src/components/marketing/lexikon/lexikon.module.css

`````css
/* ============================================================
   Lexikon — Wissens-Archetyp der öffentlichen Website.
   Nutzt ausschließlich .mkt-Tokens (tokens.css). Motion: transform/opacity,
   eine Kurve (--eh-ease), reduced-motion kollabiert über die Dauer-Tokens.
   Keine Text-Gradients, kein Glas, keine Accent-Stripes (DESIGN.md §2).
   ============================================================ */

/* ---------- Hero ---------- */
.hero {
  position: relative;
  padding: clamp(40px, 6vw, 84px) 0 clamp(36px, 5vw, 64px);
  background: var(--eh-canvas);
  overflow: clip;
}
.heroGrid {
  composes: container from '../mkt.module.css';
  display: flex; flex-direction: column; gap: 44px;
}
.heroCopy { display: flex; flex-direction: column; gap: 22px; max-width: 640px; }
.heroCopy h1 {
  font-size: var(--eh-display); line-height: 1.0; letter-spacing: -0.04em; font-weight: 800; color: var(--eh-teal-900);
}
.heroCopy h1 .word { display: inline-block; white-space: pre; }
.heroCopy h1 .accent { color: var(--eh-teal-700); }
.heroLead { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-ink-soft); max-width: 560px; }
.heroMeta { display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: var(--eh-small); color: var(--eh-ink-mute); font-weight: 500; }
.heroMeta span { display: inline-flex; align-items: center; gap: 6px; }
.heroMeta svg { color: var(--eh-teal-500); }

.heroVisual { position: relative; display: flex; justify-content: center; min-height: 360px; perspective: 1400px; }

@media (min-width: 960px) {
  .heroGrid { flex-direction: row; align-items: center; justify-content: space-between; }
  .heroCopy { flex: 1 1 54%; }
  .heroVisual { flex: 0 1 42%; justify-content: flex-end; min-height: 440px; }
}

/* Stacked preview cards (mouse parallax, 3D-tilt via transform only). */
.stack { position: relative; width: min(100%, 420px); height: 400px; transform-style: preserve-3d; }
.stackCard {
  position: absolute; inset: auto 0 0 0; margin: 0 auto;
  width: 100%; padding: 26px 26px 22px;
  display: flex; flex-direction: column; gap: 12px;
  background: var(--eh-surface); border: 1px solid var(--eh-line); border-radius: var(--eh-r-card);
  box-shadow: var(--eh-shadow-md);
  color: inherit; text-decoration: none;
  will-change: transform;
  transition: box-shadow var(--eh-dur) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease);
}
.stackCard:hover { border-color: var(--eh-teal-300); box-shadow: var(--eh-shadow-lg); }
.stackCard h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.025em; color: var(--eh-teal-900); line-height: 1.15; }
.stackCard p { font-size: 15px; line-height: 1.55; color: var(--eh-ink-soft); }
.stackFoot { margin-top: 6px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 13px; color: var(--eh-ink-mute); }
.stackFoot strong { color: var(--eh-teal-700); font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }

/* ---------- Search ---------- */
.search { position: relative; display: flex; align-items: center; gap: 12px; width: 100%; max-width: 620px;
  padding: 6px 6px 6px 20px; border-radius: var(--eh-r-pill);
  background: var(--eh-surface); border: 1px solid var(--eh-line-strong);
  box-shadow: var(--eh-shadow-sm);
  transition: border-color var(--eh-dur) var(--eh-ease), box-shadow var(--eh-dur-slow) var(--eh-ease), transform var(--eh-dur-slow) var(--eh-ease);
}
.search:focus-within { border-color: var(--eh-teal-500); box-shadow: var(--eh-shadow-md), 0 0 0 4px var(--eh-teal-100); transform: translateY(-1px); }
.search svg { flex: none; color: var(--eh-teal-700); }
.search input {
  flex: 1 1 auto; min-width: 0; height: 48px; border: 0; outline: 0; background: transparent;
  font: inherit; font-size: 17px; color: var(--eh-ink);
}
.search input::placeholder { color: var(--eh-ink-mute); }
.kbd {
  flex: none; display: none; align-items: center; justify-content: center; min-width: 30px; height: 30px; padding: 0 9px;
  border-radius: 8px; border: 1px solid var(--eh-line); background: var(--eh-canvas);
  font-size: 12px; font-weight: 700; color: var(--eh-ink-mute);
}
.searchClear {
  flex: none; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px;
  border: 0; border-radius: 50%; background: var(--eh-teal-050); color: var(--eh-teal-900); cursor: pointer;
  transition: background var(--eh-dur-fast) var(--eh-ease);
}
.searchClear:hover { background: var(--eh-teal-100); }
@media (min-width: 720px) { .kbd { display: inline-flex; } }

.quick { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; color: var(--eh-ink-mute); }
.quick a, .quick button {
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: var(--eh-r-pill);
  background: var(--eh-surface); border: 1px solid var(--eh-line); color: var(--eh-teal-900); font: inherit; font-size: 14px; font-weight: 600;
  cursor: pointer; text-decoration: none;
  transition: transform var(--eh-dur) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease), background var(--eh-dur) var(--eh-ease);
}
.quick a:hover, .quick button:hover { transform: translateY(-2px); border-color: var(--eh-teal-300); background: var(--eh-teal-050); }

/* ---------- Register bar (sticky filter rail) ---------- */
.registerWrap { position: sticky; top: 72px; z-index: 40; background: var(--eh-canvas); border-top: 1px solid var(--eh-line); border-bottom: 1px solid var(--eh-line); }
.register {
  composes: container from '../mkt.module.css';
  display: flex; flex-direction: column; gap: 10px; padding-top: 12px; padding-bottom: 12px;
}
.registerRow { display: flex; align-items: center; gap: 10px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.registerRow::-webkit-scrollbar { display: none; }
.registerLabel { flex: none; font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-ink-mute); margin-right: 4px; }
.chip {
  flex: none; position: relative; display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px;
  border-radius: var(--eh-r-pill); border: 1px solid var(--eh-line); background: var(--eh-surface);
  font: inherit; font-size: 14px; font-weight: 600; color: var(--eh-ink-soft); cursor: pointer; white-space: nowrap;
  transition: color var(--eh-dur) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease), background var(--eh-dur) var(--eh-ease), transform var(--eh-dur) var(--eh-ease);
}
.chip:hover { border-color: var(--eh-teal-300); color: var(--eh-teal-900); transform: translateY(-1px); }
.chip[aria-pressed='true'] { background: var(--eh-teal-900); border-color: var(--eh-teal-900); color: var(--eh-on-dark); }
.chip[aria-pressed='true'] .chipCount { background: rgba(255,255,255,.14); color: var(--eh-on-dark); }
.chipCount { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 6px; border-radius: 999px; background: var(--eh-teal-050); color: var(--eh-teal-700); font-size: 11.5px; font-weight: 700; }
.letter {
  flex: none; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px;
  border-radius: 10px; border: 1px solid transparent; background: transparent;
  font: inherit; font-size: 14px; font-weight: 700; color: var(--eh-ink-soft); cursor: pointer;
  transition: background var(--eh-dur-fast) var(--eh-ease), color var(--eh-dur-fast) var(--eh-ease), transform var(--eh-dur) var(--eh-ease);
}
.letter:hover:not(:disabled) { background: var(--eh-teal-050); color: var(--eh-teal-900); transform: translateY(-2px); }
.letter:disabled { color: var(--eh-line-strong); cursor: default; }
.letter[aria-pressed='true'] { background: var(--eh-teal-700); color: var(--eh-on-dark); }
.registerCount { margin-left: auto; flex: none; font-size: 13.5px; color: var(--eh-ink-mute); font-variant-numeric: tabular-nums; }
.registerCount strong { color: var(--eh-teal-900); }

/* ---------- Explorer grid ---------- */
.explorer { padding: clamp(40px, 6vw, 72px) 0 var(--eh-section-y); }
.explorerInner { composes: container from '../mkt.module.css'; }
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 720px) { .grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
@media (min-width: 1100px) { .grid { grid-template-columns: repeat(3, 1fr); } }

.entry {
  position: relative; display: flex; flex-direction: column; gap: 14px; padding: 26px 26px 22px; min-height: 100%;
  background: var(--eh-surface); border: 1px solid var(--eh-line); border-radius: var(--eh-r-card);
  color: inherit; text-decoration: none; overflow: hidden;
  transition: transform var(--eh-dur-slow) var(--eh-ease), box-shadow var(--eh-dur-slow) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease);
}
.entry::after {
  content: ''; position: absolute; left: 26px; right: 26px; bottom: 0; height: 2px; border-radius: 2px 2px 0 0;
  background: var(--eh-teal-700); transform: scaleX(0); transform-origin: left; transition: transform var(--eh-dur-slow) var(--eh-ease);
}
.entry:hover { transform: translateY(-5px); box-shadow: var(--eh-shadow-md); border-color: var(--eh-teal-300); }
.entry:hover::after { transform: scaleX(1); }
.entry:hover .entryArrow { transform: translateX(4px); background: var(--eh-teal-700); color: var(--eh-on-dark); }
.entryTop { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.entryCat { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: var(--eh-teal-700); }
.entryCat::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.entry h3 { font-size: 21px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.18; color: var(--eh-teal-900); }
.entry h3 mark { background: var(--eh-sand-200); color: inherit; border-radius: 4px; padding: 0 2px; }
.entry p { font-size: 15px; line-height: 1.6; color: var(--eh-ink-soft); }
.entryFoot { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--eh-line); display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.entryMeta { display: flex; align-items: center; gap: 14px; font-size: 12.5px; color: var(--eh-ink-mute); font-weight: 500; }
.entryArrow {
  flex: none; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;
  background: var(--eh-teal-050); color: var(--eh-teal-900);
  transition: transform var(--eh-dur-slow) var(--eh-ease), background var(--eh-dur) var(--eh-ease), color var(--eh-dur) var(--eh-ease);
}

/* Relevanz badge */
.badge { display: inline-flex; align-items: center; gap: 6px; min-height: 24px; padding: 4px 10px; border-radius: var(--eh-r-pill); font-size: var(--eh-font-label); font-weight: 700; letter-spacing: .02em; white-space: nowrap; }
.badge[data-tone='pflicht'] { background: var(--eh-color-sand); color: var(--eh-color-ink); }
.badge[data-tone='pflicht'] svg { color: var(--eh-color-terra); }
.badge[data-tone='empfohlen'] { background: var(--eh-teal-100); color: var(--eh-teal-900); }
.badge[data-tone='wissen'] { background: var(--eh-sand-100); color: var(--eh-ink-soft); }

/* Mini level bars (3 segments) */
.levels { display: flex; gap: 10px; }
.level { display: flex; flex-direction: column; gap: 5px; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--eh-ink-mute); }
.levelBar { display: flex; gap: 2px; }
.levelBar i { display: block; width: 9px; height: 5px; border-radius: 2px; background: var(--eh-line); }
.levelBar i[data-on='true'] { background: var(--eh-teal-700); }
.levelBar i[data-on='true'][data-hot='true'] { background: var(--eh-terra); }

.empty { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; padding: 40px 32px; border: 1px dashed var(--eh-line-strong); border-radius: var(--eh-r-card); background: var(--eh-surface); }
.empty h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: var(--eh-teal-900); }
.empty p { color: var(--eh-ink-soft); }

/* ---------- Category bento ---------- */
.bento { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 720px) { .bento { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
@media (min-width: 1100px) { .bento { grid-template-columns: repeat(4, 1fr); } .bento > :first-child { grid-column: span 2; } }
.cat {
  position: relative; display: flex; flex-direction: column; gap: 12px; padding: 28px; min-height: 220px;
  border-radius: var(--eh-r-card); background: var(--eh-surface); border: 1px solid var(--eh-line);
  color: inherit; text-decoration: none; overflow: hidden;
  transition: transform var(--eh-dur-slow) var(--eh-ease), box-shadow var(--eh-dur-slow) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease);
}
.cat:hover { transform: translateY(-5px); box-shadow: var(--eh-shadow-md); border-color: var(--eh-teal-300); }
.catDark { composes: cat; background: var(--eh-teal-900); border-color: var(--eh-teal-900); color: var(--eh-on-dark); }
.catDark h3, .catDark .catCount { color: var(--eh-on-dark); }
.catDark p { color: var(--eh-on-dark-soft); }
.catDark .catIcon { background: rgba(255,255,255,.1); color: var(--eh-teal-300); }
.catDark:hover { border-color: var(--eh-teal-500); }
.catIcon { width: 46px; height: 46px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; background: var(--eh-teal-050); color: var(--eh-teal-700); }
.cat h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.025em; color: var(--eh-teal-900); }
.cat p { font-size: 15px; line-height: 1.55; color: var(--eh-ink-soft); }
.catFoot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 10px; }
.catCount { font-size: 13px; font-weight: 700; color: var(--eh-teal-700); font-variant-numeric: tabular-nums; }
.catTerms { display: flex; flex-wrap: wrap; gap: 6px; }
.catTerms span { font-size: 12.5px; font-weight: 600; padding: 4px 9px; border-radius: 8px; background: var(--eh-canvas); border: 1px solid var(--eh-line); color: var(--eh-ink-soft); }
.catDark .catTerms span { background: rgba(255,255,255,.06); border-color: var(--eh-on-dark-line); color: var(--eh-on-dark-soft); }

/* ---------- Detail: progress + hero ---------- */
.progress { position: fixed; top: 72px; left: 0; right: 0; height: 3px; z-index: 55; pointer-events: none; }
.progress i { display: block; height: 100%; background: var(--eh-teal-700); transform: scaleX(0); transform-origin: left; }

.crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 13.5px; color: var(--eh-ink-mute); }
.crumbs a { color: var(--eh-ink-soft); font-weight: 500; transition: color var(--eh-dur-fast) var(--eh-ease); }
.crumbs a:hover { color: var(--eh-teal-900); }
.crumbs svg { color: var(--eh-line-strong); }

.dHero { padding: clamp(32px, 5vw, 64px) 0 clamp(32px, 5vw, 56px); background: var(--eh-canvas); }
.dHeroGrid { composes: container from '../mkt.module.css'; display: flex; flex-direction: column; gap: 36px; }
.dHeroCopy { display: flex; flex-direction: column; gap: 20px; max-width: 700px; }
.dHeroTags { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.dHeroCopy h1 { font-size: var(--eh-h1); line-height: 1.02; letter-spacing: -0.04em; font-weight: 800; color: var(--eh-teal-900); }
.dHeroCopy .lead { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-ink-soft); }
.synonyms { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13.5px; color: var(--eh-ink-mute); }
.synonyms span { padding: 4px 10px; border-radius: 8px; background: var(--eh-surface); border: 1px solid var(--eh-line); color: var(--eh-ink-soft); font-weight: 600; font-size: 12.5px; }
.dHeroActions { display: flex; flex-wrap: wrap; gap: 12px; }

.glance {
  display: flex; flex-direction: column; gap: 18px; padding: 26px; border-radius: var(--eh-r-card-lg);
  background: var(--eh-teal-900); color: var(--eh-on-dark); box-shadow: var(--eh-shadow-lg);
}
.glanceHead { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-teal-300); }
.kpis { display: grid; grid-template-columns: 1fr; gap: 12px; }
.kpi { display: flex; flex-direction: column; gap: 3px; padding: 14px 16px; border-radius: 16px; background: rgba(255,255,255,.06); border: 1px solid var(--eh-on-dark-line); }
.kpi small { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--eh-on-dark-soft); }
.kpi strong { font-size: 19px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
.kpi span { font-size: 13px; color: var(--eh-on-dark-soft); }
.gauges { display: flex; flex-direction: column; gap: 12px; padding-top: 4px; }
.gauge { display: grid; grid-template-columns: 110px 1fr auto; align-items: center; gap: 12px; font-size: 13px; }
.gauge small { font-weight: 700; color: var(--eh-on-dark-soft); }
.gaugeTrack { display: flex; gap: 4px; }
.gaugeTrack i { flex: 1 1 0; height: 8px; border-radius: 4px; background: rgba(255,255,255,.1); overflow: hidden; position: relative; }
.gaugeTrack i b { position: absolute; inset: 0; background: var(--eh-teal-300); transform: scaleX(0); transform-origin: left; }
.gaugeTrack i[data-hot='true'] b { background: #e9a487; }
.gauge strong { font-weight: 700; font-variant-numeric: tabular-nums; min-width: 64px; text-align: right; }
.glanceWhen { padding-top: 14px; border-top: 1px solid var(--eh-on-dark-line); display: flex; flex-direction: column; gap: 6px; }
.glanceWhen small { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--eh-teal-300); }
.glanceWhen p { font-size: 14.5px; line-height: 1.55; color: var(--eh-on-dark); }
.glanceNote { font-size: 12px; color: var(--eh-on-dark-soft); }

@media (min-width: 960px) {
  .dHeroGrid { flex-direction: row; align-items: flex-start; }
  .dHeroCopy { flex: 1 1 58%; }
  .glance { flex: 0 0 380px; position: sticky; top: 96px; }
  .kpis { grid-template-columns: 1fr; }
}

/* ---------- Detail: body layout with TOC ---------- */
.body { padding: var(--eh-section-y) 0; background: var(--eh-surface); border-top: 1px solid var(--eh-line); }
.bodyGrid { composes: container from '../mkt.module.css'; display: flex; flex-direction: column; gap: 40px; }
.toc { display: none; }
.article { display: flex; flex-direction: column; gap: clamp(48px, 6vw, 72px); min-width: 0; max-width: 760px; }
@media (min-width: 1024px) {
  .bodyGrid { flex-direction: row; align-items: flex-start; gap: 64px; }
  .toc { display: flex; flex: 0 0 220px; position: sticky; top: 104px; flex-direction: column; gap: 4px; }
  .article { flex: 1 1 auto; }
}
.tocLabel { font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-ink-mute); margin-bottom: 8px; }
.toc a {
  position: relative; display: block; padding: 8px 0 8px 16px; font-size: 14.5px; font-weight: 500; color: var(--eh-ink-soft);
  transition: color var(--eh-dur) var(--eh-ease), transform var(--eh-dur) var(--eh-ease);
}
.toc a::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2px; border-radius: 2px; background: var(--eh-line); transition: background var(--eh-dur) var(--eh-ease); }
.toc a:hover { color: var(--eh-teal-900); }
.toc a[aria-current='true'] { color: var(--eh-teal-900); font-weight: 700; transform: translateX(3px); }
.toc a[aria-current='true']::before { background: var(--eh-teal-700); }
.tocCta { margin-top: 18px; padding: 16px; border-radius: 16px; background: var(--eh-sand-100); display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--eh-ink-soft); }
.tocCta strong { color: var(--eh-teal-900); font-size: 14.5px; }

.block { display: flex; flex-direction: column; gap: 22px; scroll-margin-top: 110px; }
.blockHead { display: flex; flex-direction: column; gap: 10px; }
.blockHead h2 { font-size: var(--eh-h2); line-height: 1.1; letter-spacing: -0.03em; font-weight: 800; color: var(--eh-teal-900); }
.blockHead p { font-size: 16.5px; color: var(--eh-ink-soft); }
.blockNum { display: inline-flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-teal-700); }
.blockNum::before { content: ''; width: 18px; height: 2px; border-radius: 2px; background: currentColor; }

/* Timeline (Ablauf) with scrubbed rail */
.timeline { position: relative; display: flex; flex-direction: column; gap: 6px; padding-left: 44px; }
.rail { position: absolute; left: 15px; top: 14px; bottom: 14px; width: 2px; background: var(--eh-line); border-radius: 2px; }
.railFill { position: absolute; left: 15px; top: 14px; bottom: 14px; width: 2px; background: var(--eh-teal-700); border-radius: 2px; transform-origin: top; }
.tItem { position: relative; padding: 16px 0 22px; }
.tItem::before {
  content: ''; position: absolute; left: -36px; top: 20px; width: 18px; height: 18px; border-radius: 50%;
  background: var(--eh-surface); border: 2px solid var(--eh-line-strong);
  transition: border-color var(--eh-dur-slow) var(--eh-ease), background var(--eh-dur-slow) var(--eh-ease), transform var(--eh-dur-slow) var(--eh-ease);
}
.tItem:global(.isActive)::before { border-color: var(--eh-teal-700); background: var(--eh-teal-700); transform: scale(1.15); box-shadow: 0 0 0 5px var(--eh-teal-100); }
.tItem h3 { font-size: 19px; font-weight: 800; letter-spacing: -0.02em; color: var(--eh-teal-900); margin-bottom: 6px; display: flex; align-items: baseline; gap: 10px; }
.tItem h3 span { font-size: 12px; font-weight: 700; color: var(--eh-ink-mute); font-variant-numeric: tabular-nums; }
.tItem p { color: var(--eh-ink-soft); line-height: 1.6; }

/* Interactive checklist (Prüfpunkte) */
.check { display: flex; flex-direction: column; gap: 10px; }
.checkItem {
  display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; border-radius: 18px; text-align: left;
  background: var(--eh-canvas); border: 1px solid var(--eh-line); cursor: pointer; font: inherit; color: var(--eh-ink);
  transition: border-color var(--eh-dur) var(--eh-ease), background var(--eh-dur) var(--eh-ease), transform var(--eh-dur) var(--eh-ease);
}
.checkItem:hover { border-color: var(--eh-teal-300); transform: translateY(-1px); }
.checkItem[aria-pressed='true'] { background: var(--eh-teal-050); border-color: var(--eh-teal-300); }
.checkItem[aria-pressed='true'] span { color: var(--eh-ink-mute); text-decoration: line-through; text-decoration-color: var(--eh-teal-300); }
.checkBox {
  flex: none; width: 24px; height: 24px; border-radius: 8px; border: 2px solid var(--eh-line-strong); background: var(--eh-surface);
  display: inline-flex; align-items: center; justify-content: center; color: var(--eh-on-dark);
  transition: background var(--eh-dur) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease);
}
.checkItem[aria-pressed='true'] .checkBox { background: var(--eh-teal-700); border-color: var(--eh-teal-700); }
.checkItem span { font-size: 16px; line-height: 1.5; transition: color var(--eh-dur) var(--eh-ease); }
.checkSum {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; padding: 18px 20px; border-radius: 18px;
  background: var(--eh-sand-100); font-size: 15px; color: var(--eh-ink-soft);
}
.checkSum strong { color: var(--eh-teal-900); font-size: 16px; }
.checkBarTrack { flex: 1 1 160px; height: 6px; border-radius: 3px; background: var(--eh-sand-200); overflow: hidden; }
.checkBarTrack i { display: block; height: 100%; background: var(--eh-teal-700); border-radius: 3px; transform-origin: left; transition: transform var(--eh-dur-slow) var(--eh-ease); }

/* Cost bullets */
.costList { display: flex; flex-direction: column; gap: 12px; }
.costItem { display: flex; gap: 14px; align-items: flex-start; padding: 18px 20px; border-radius: 18px; background: var(--eh-canvas); border: 1px solid var(--eh-line); }
.costItem i { flex: none; width: 30px; height: 30px; border-radius: 10px; background: var(--eh-teal-100); color: var(--eh-teal-900); display: inline-flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 13px; }
.costItem p { color: var(--eh-ink); line-height: 1.55; font-size: 16px; }

/* Related terms */
.related { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 640px) { .related { grid-template-columns: repeat(2, 1fr); } }
.relCard {
  display: flex; flex-direction: column; gap: 8px; padding: 18px 20px; border-radius: 18px; background: var(--eh-canvas); border: 1px solid var(--eh-line);
  color: inherit; text-decoration: none;
  transition: transform var(--eh-dur-slow) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease), box-shadow var(--eh-dur-slow) var(--eh-ease);
}
.relCard:hover { transform: translateY(-3px); border-color: var(--eh-teal-300); box-shadow: var(--eh-shadow-sm); }
.relCard strong { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; color: var(--eh-teal-900); }
.relCard span { font-size: 14px; color: var(--eh-ink-soft); line-height: 1.5; }
.linkList { display: flex; flex-direction: column; gap: 8px; }
.linkList a { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--eh-line); background: var(--eh-canvas); font-weight: 600; color: var(--eh-teal-900); transition: border-color var(--eh-dur) var(--eh-ease), transform var(--eh-dur) var(--eh-ease); }
.linkList a:hover { border-color: var(--eh-teal-300); transform: translateX(3px); }
.linkList svg { flex: none; color: var(--eh-teal-500); }

/* Prev / next navigator */
.navi { padding: var(--eh-section-y-tight) 0; background: var(--eh-canvas); border-top: 1px solid var(--eh-line); }
.naviInner { composes: container from '../mkt.module.css'; display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 720px) { .naviInner { grid-template-columns: 1fr 1fr; } }
.naviCard {
  display: flex; flex-direction: column; gap: 8px; padding: 24px 26px; border-radius: var(--eh-r-card); background: var(--eh-surface); border: 1px solid var(--eh-line);
  color: inherit; text-decoration: none;
  transition: transform var(--eh-dur-slow) var(--eh-ease), box-shadow var(--eh-dur-slow) var(--eh-ease), border-color var(--eh-dur) var(--eh-ease);
}
.naviCard:hover { transform: translateY(-4px); box-shadow: var(--eh-shadow-md); border-color: var(--eh-teal-300); }
.naviCard[data-dir='next'] { text-align: right; align-items: flex-end; }
.naviCard small { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-ink-mute); }
.naviCard strong { font-size: 22px; font-weight: 800; letter-spacing: -0.025em; color: var(--eh-teal-900); }
.naviCard span { font-size: 14px; color: var(--eh-ink-soft); }

/* Category page hero list / not-found */
.catHeroList { display: flex; flex-wrap: wrap; gap: 8px; }
.notFound { composes: container from '../mkt.module.css'; padding: clamp(64px, 10vw, 140px) var(--eh-gutter); display: flex; flex-direction: column; gap: 24px; max-width: 760px; }
.notFound h1 { font-size: var(--eh-h1); line-height: 1.04; letter-spacing: -0.035em; font-weight: 800; color: var(--eh-teal-900); }
.notFound p { font-size: var(--eh-lead); color: var(--eh-ink-soft); }
.code { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--eh-terra); }

/* ---------- Index polish (overview only) ---------- */
.hero {
  padding: clamp(34px, 3.4vw, 43px) 0 clamp(32px, 3vw, 39px);
}
.heroGrid { gap: clamp(28px, 4vw, 54px); }
.heroCopy { gap: 16px; max-width: 620px; }
.heroCopy h1 {
  font-size: clamp(44px, 4.8vw, 64px);
  line-height: .99;
  letter-spacing: -.035em;
  font-weight: 700;
  text-wrap: balance;
}
.heroLead { line-height: 1.5; max-width: 54ch; }
.heroEyebrow {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 6px 10px;
  border: 1px solid var(--eh-line);
  border-radius: var(--eh-r-pill);
  background: var(--eh-surface);
  color: var(--eh-teal-700);
  font-size: var(--eh-micro);
  font-weight: 700;
  letter-spacing: .075em;
  text-transform: uppercase;
}
.searchGroup { display: flex; flex-direction: column; gap: 10px; }
.search {
  max-width: 600px;
  min-height: 60px;
  padding: 5px 7px 5px 18px;
  border-radius: var(--eh-r-card);
  border-color: var(--eh-line);
  box-shadow: var(--eh-shadow-sm);
}
.search:focus-within { transform: none; box-shadow: var(--eh-shadow-sm), 0 0 0 3px var(--eh-teal-100); }
.quick { gap: 7px; font-size: 13px; }
.quick a, .quick button {
  min-height: 30px;
  padding: 6px 10px;
  background: var(--eh-teal-050);
  font-size: 12.5px;
  font-weight: 650;
}
.quick a:hover, .quick button:hover { transform: translateY(-1px); background: var(--eh-teal-100); }
.heroMeta { gap: 7px 16px; font-size: 13px; }
.heroVisual { min-height: 300px; }
.stack { width: min(100%, 390px); height: 310px; }
.stackCard { padding: 22px 22px 19px; gap: 10px; }
.stackCard h3 { font-size: 20px; }
.stackCard p { font-size: 14px; }

.registerWrap {
  background: var(--eh-surface);
  border-top-color: var(--eh-line);
  border-bottom-color: var(--eh-line);
  box-shadow: 0 10px 28px -28px rgba(16, 34, 42, .4);
}
.register { gap: 8px; padding-top: 10px; padding-bottom: 10px; }
.chip { height: 34px; padding: 0 12px; font-size: 13px; }
.letter { width: 32px; height: 32px; border-radius: var(--eh-r-chip); font-size: 13px; }

.explorer { padding: 28px 0 var(--eh-section-y-tight); }
.explorerHead {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px 18px;
  margin-bottom: 22px;
}
.explorerTitle {
  margin-top: 7px;
  color: var(--eh-teal-900);
  font-size: var(--eh-h2);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: 1.08;
  text-wrap: balance;
}
.gridItem { min-width: 0; height: 100%; }
.explorer .grid { gap: 16px; }
.explorer .entry {
  gap: 12px;
  padding: 22px 22px 19px;
  box-shadow: 0 1px 0 rgba(16, 34, 42, .02);
}
.explorer .entry:hover { transform: translateY(-3px); box-shadow: var(--eh-shadow-sm); }
.explorer .entry h3 { font-size: 20px; font-weight: 700; line-height: 1.16; }
.explorer .entry p { font-size: 14.5px; line-height: 1.55; }
.explorer .entryFoot { padding-top: 12px; }
.explorer .entryMeta { gap: 12px; font-size: 12px; }
.explorer .level { font-size: 10px; letter-spacing: .045em; }
.explorer .badge { font-size: var(--eh-font-label); }

.bentoItem { min-width: 0; display: flex; }
.bentoItem > a { width: 100%; }
.bentoIndex { gap: 16px; }
.bentoIndex .cat,
.bentoIndex .catDark { min-height: 210px; padding: 24px; gap: 11px; }
.bentoIndex .cat:hover,
.bentoIndex .catDark:hover { transform: translateY(-3px); box-shadow: var(--eh-shadow-sm); }
.bentoIndex .catIcon { width: 42px; height: 42px; border-radius: var(--eh-r-btn); }
.bentoIndex .cat h3,
.bentoIndex .catDark h3 { font-size: 20px; font-weight: 700; }
.bentoIndex .cat p,
.bentoIndex .catDark p { font-size: 14px; line-height: 1.5; }
.bentoIndex .catDark h3 { color: var(--eh-on-dark); }
.bentoIndex .catDark p { color: var(--eh-on-dark-soft); }

@media (min-width: 960px) {
  .heroVisual { min-height: 330px; }
}
@media (max-width: 719px) {
  .hero { padding-top: 30px; padding-bottom: 28px; }
  .heroGrid { gap: 22px; }
  .heroCopy { gap: 14px; }
  .heroCopy h1 { font-size: clamp(42px, 12vw, 52px); line-height: 1; }
  .heroVisual { display: none; }
  .search { min-height: 56px; border-radius: 20px; }
  .quick { gap: 6px; }
  .heroMeta { margin-top: 2px; }
  .register { gap: 7px; }
  .explorer { padding-top: 24px; }
}

`````
