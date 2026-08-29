#!/usr/bin/env python3
"""T-0169 visual comparison: reference/actual/overlay/diff + metrics.

References: public/notion/notion-originals (authoritative Notion originals).
Actuals:    .sin-gpt-web/evidence/T-0169/oci/round3/<state>-actual.png
Outputs:    <state>-reference.png / -overlay-50.png / -diff.png + visual-metrics.json
            notion-parity-contact-sheet.png

Rules (T-0169 / docs/T0168_DEEP_RESEARCH.md §7):
- references with alpha are auto-cropped to content (phone frame removal)
- "screen" refs: resized to 390x844; the iOS status-bar band (top 48px) is
  excluded from the numeric metric (documented, not hidden in the overlay)
- "top-fold" refs (taller than one screen): resized to width 390, compared
  against the top 844px of the actual
- numeric diffs are diagnostic only; the manual overlay verdict is authoritative
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageChops
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
EVID = ROOT / ".sin-gpt-web/evidence/T-0169/oci"
R3 = EVID / "round3"
REFS = ROOT / "public/notion/notion-originals"
W, H = 390, 844
STATUS_BAR_MASK = 48  # px excluded from metrics (iOS status bar in mockups)

PAIRS = [
    # (state, reference file, fit, required)
    ("first-screen", "LogIn_oder_Neu.png", "screen", True),
    ("login", "eigentumer.login.png", "screen", True),
    ("owner-dashboard", "Homesceen_EH_02.png", "screen", True),
    ("menu-closed", "Menuepunkte_01.png", "top-fold", True),
    ("menu-open", "menuepunkte_offen.png", "top-fold", True),
]
SUPPLEMENTARY = [
    ("register", "eigentumer.login.png", "screen", False),
    ("onboarding", "kontoerstellung.eigentumer.png", "screen", False),
    ("role", "first_action.png", "screen", False),
]

def load_rgb(p: Path) -> Image.Image:
    im = Image.open(p)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        alpha = im.getchannel("A")
        bbox = alpha.point(lambda a: 255 if a > 8 else 0).getbbox()
        if bbox:
            im = im.crop(bbox)
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    return im.convert("RGB")

def ref_for_state(ref_file: Path, fit: str) -> Image.Image:
    im = load_rgb(ref_file)
    if fit == "screen":
        return im.resize((W, H), Image.LANCZOS)
    # top-fold: width fit, compare top H
    w2 = W
    h2 = round(im.height * (W / im.width))
    im = im.resize((w2, h2), Image.LANCZOS)
    return im.crop((0, 0, W, min(H, h2)))

def metrics(ref: Image.Image, act: Image.Image, mask_top: int) -> dict:
    a = np.asarray(ref, dtype=np.int16)
    b = np.asarray(act.resize(ref.size, Image.LANCZOS), dtype=np.int16)
    d = np.abs(a - b).max(axis=2)
    region = d[mask_top:, :]
    pct = float((region > 8).mean() * 100)
    return {
        "pct_pixels_diff_gt8": round(pct, 2),
        "mean_abs_diff": round(float(np.abs(a - b).mean()), 2),
        "region": f"y>{mask_top} (status-bar band excluded)",
        "ref_size": list(ref.size),
    }

def overlay(ref: Image.Image, act: Image.Image) -> Image.Image:
    return Image.blend(ref.convert("RGB"), act.convert("RGB").resize(ref.size, Image.LANCZOS), 0.5)

def diffimg(ref: Image.Image, act: Image.Image) -> Image.Image:
    a = np.asarray(ref, dtype=np.int16)
    b = np.asarray(act.resize(ref.size, Image.LANCZOS), dtype=np.int16)
    d = np.abs(a - b).max(axis=2)
    d = np.clip(d.astype(np.int32) * 4, 0, 255).astype(np.uint8)
    return Image.fromarray(d).convert("RGB")

def main() -> int:
    results = {"pairs": [], "supplementary": [], "historie": {}}
    sheet_cells = []
    for group, pairs in (("pairs", PAIRS), ("supplementary", SUPPLEMENTARY)):
        for state, reffile, fit, required in pairs:
            actual_path = R3 / f"{state}-actual.png"
            if not actual_path.exists():
                if required:
                    print(f"MISSING required actual: {state}", file=sys.stderr)
                    return 2
                continue
            act = Image.open(actual_path).convert("RGB")
            ref = ref_for_state(REFS / reffile, fit)
            mask_top = STATUS_BAR_MASK if fit == "screen" else 0
            m = metrics(ref, act, mask_top)
            ov = overlay(ref, act)
            df = diffimg(ref, act)
            ref.save(R3 / f"{state}-reference.png")
            ov.save(R3 / f"{state}-overlay-50.png")
            df.save(R3 / f"{state}-diff.png")
            m.update({"state": state, "reference": reffile, "fit": fit, "required": required})
            results[group].append(m)
            sheet_cells.append((state, ref, act, ov, df))
            print(f"{state:18} ref={reffile:32} fit={fit:9} diff>8={m['pct_pixels_diff_gt8']:6.2f}%  mean={m['mean_abs_diff']}")

    # Historie: no dedicated reference exists on the authoritative page.
    hist_actual = R3 / "historie-actual.png"
    if hist_actual.exists():
        act = Image.open(hist_actual).convert("RGB")
        act.save(R3 / "historie-actual.png")
        dash_ref = load_rgb(REFS / "Homesceen_EH_02.png")
        # component-level anchor: "Haus-Historie ansehen" card crop (documented)
        cw, ch = dash_ref.size
        card = dash_ref.crop((round(cw * 0.05), round(ch * 0.72), round(cw * 0.95), round(ch * 0.86)))
        card.save(R3 / "historie-component-reference.png")
        results["historie"] = {
            "dedicated_full_screen_reference": None,
            "verified_absence": "authoritative Notion page inspected 2026-08-29: all 12 embedded images + full-page render; no Historie mockup",
            "anchors": ["Haus-Historie ansehen card (Homesceen_EH_02.png)", "menu section '4. Haus-Historie' (menuepunkte_offen.png)"],
            "acceptance_basis": "shared design system parity (docs/T0168_DEEP_RESEARCH.md §7); no 1:1 claim",
        }
        print("historie        dedicated reference: NONE (parity basis, documented)")

    # contact sheet
    if sheet_cells:
        cols = 4
        cw, ch = W // 2, H // 2
        rows = len(sheet_cells)
        sheet = Image.new("RGB", (cols * cw + (cols + 1) * 8, rows * ch + (rows + 1) * 8 + 20), (240, 240, 240))
        y = 8
        for i, (state, ref, act, ov, df) in enumerate(sheet_cells):
            x = 8
            for im in (ref, act, ov, df):
                sheet.paste(im.resize((cw, ch), Image.LANCZOS), (x, y))
                x += cw + 8
            y += ch + 8
        sheet.save(R3 / "notion-parity-contact-sheet.png")

    (R3 / "visual-metrics.json").write_text(json.dumps(results, indent=1, ensure_ascii=False))
    print("visual-metrics.json + contact sheet written")
    return 0

if __name__ == "__main__":
    sys.exit(main())
