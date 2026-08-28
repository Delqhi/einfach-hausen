#!/bin/bash
set -euo pipefail
P="/Users/jeremy/dev/einfach-hausen/presentation"
TS=$(date +%H%M%S)
cp "$P/einfachhausen-live-professional-2026-08-26.pptx" "$P/bakeoff/final-vorgaenger-$TS.bak.pptx"
cp "$P/premium/einfachhausen-premium.pptx" "$P/einfachhausen-live-professional-2026-08-26.pptx"
cp "$P/premium/einfachhausen-premium.pdf" "$P/einfachhausen-live-professional-2026-08-26.pdf"
cp "$P/premium/slide-01.png" "$P/bakeoff/final-render/premium-cover.png"
echo "GEKRÖNT: premium -> $P/einfachhausen-live-professional-2026-08-26.pptx (+pdf)"
