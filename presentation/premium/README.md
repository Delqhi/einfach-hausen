# Premium-Deck einfachhausen.de

Produkt-spezifischer Präsentations-Source für T-0165. Die wiederverwendbare Render-/QA-/Exportlogik liegt zentral in `wow-my-zsh/connectors/slides-generator/`; dieses Repository enthält nur Deck-Source, deck-spezifische QA-Konfiguration, benötigte Assets und die daraus erzeugten Release-Artefakte.

## Faktenmodell

- `deck.html`: 15 Folien à 1280×720.
- `quality.json`: deck-spezifische QA-Regeln.
- `sourceCommit` `3a8aa93054df7ec897c1dc3fec200ecf8526965a` bezeichnet den Produkt-/Screenshot-Snapshot. Er ist **nicht** automatisch der aktuelle Präsentations-HEAD oder Deployment-SHA.
- Live-Health und DB-Readiness dürfen separat verifiziert werden; eine Deployment==Git-HEAD-Aussage ist nur zulässig, wenn das Live-System selbst einen belastbaren SHA liefert.

## Portable Pipeline

`SLIDES_GENERATOR_ROOT` zeigt auf den zentralen Connector-Checkout, zum Beispiel auf dem Mac:

```bash
export SLIDES_GENERATOR_ROOT=/Users/jeremy/dev/wow-my-zsh/connectors/slides-generator
```

Auf OCI entsprechend auf den dortigen `wow-my-zsh/connectors/slides-generator`-Pfad zeigen. Optional `SIN_SLIDES_BROWSER=/absolute/path/to/chromium` setzen, falls Browser-Autodiscovery nicht eindeutig ist.

### QA

```bash
node "$SLIDES_GENERATOR_ROOT/bin/quality-html-deck.mjs" \
  --deck "$PWD/presentation/premium/deck.html" \
  --config "$PWD/presentation/premium/quality.json" \
  --repo "$PWD"
```

### Render 15 PNG-Slides

```bash
node "$SLIDES_GENERATOR_ROOT/bin/render-html-deck.mjs" \
  --deck "$PWD/presentation/premium/deck.html" \
  --out-dir "$PWD/presentation/premium/rendered" \
  --width 1280 --height 720
```

Nach jedem Render müssen alle 15 PNGs einzeln visuell geprüft werden. Ein grüner technischer Build allein ist keine Design-Abnahme.

### PDF

```bash
node "$SLIDES_GENERATOR_ROOT/bin/build-image-pdf.mjs" \
  --slides-dir "$PWD/presentation/premium/rendered" \
  --output "$PWD/presentation/premium/einfachhausen-premium.pdf"
```

### PPTX

Der Fleet-Connector installiert bewusst kein globales `pptxgenjs`. Das konsumierende Produkt stellt einen explizit geprüften/gepinnten Modulpfad bereit:

```bash
node "$SLIDES_GENERATOR_ROOT/bin/build-image-pptx.mjs" \
  --slides-dir "$PWD/presentation/premium/rendered" \
  --output "$PWD/presentation/premium/einfachhausen-premium.pptx" \
  --title "einfachhausen.de Premium-Präsentation" \
  --pptxgen-module /absolute/path/to/project/node_modules/pptxgenjs
```

## Abnahme

Siehe `DESIGN_REVIEW_T0165.md`. Final erwartet werden 15 PNGs à 1280×720, ein 15-seitiges PDF und eine PPTX mit 15 Slides, jeweils aus demselben akzeptierten Renderstand.
