# Premium-Deck einfachhausen.de (handgebaut)

Quelle: `deck.html` (15 Folien à 1280×720, reines CSS, Brand-Palette siehe :root).

## Rebuild
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
      --disable-gpu --hide-scrollbars --window-size=1280,10800 \
      --screenshot=deck-full.png "file://$PWD/deck.html"
    # Slices: PIL crop je 720px → slide-NN.png
    # PDF:   PIL save_all(resolution=200)
    # PPTX: node build_pptx.js (pptxgenjs, Vollbild-PNGs)

## Krönen (final tauschen)
    ./crown-premium.sh
