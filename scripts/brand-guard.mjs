#!/usr/bin/env node
// EH-BRAND-04 brand guard: palette, min fonts, no new fonts, no slop patterns, core protection. Exit 1 on violation.
import fs from "node:fs";
import path from "node:path";
const repo = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const ALLOW = new Set(["#105258","#0a3539","#faf8f4","#10222a","#4b5b60","#e4e2dc","#ecdfc9","#a84d29","#dcebec","#ffffff","#0b3a3f","#0d474d","#147078","#1f7a80","#7fb7ba","#eef5f5","#edf5f5","#f2f5f5","#f3f6f5","#f4ebdd","#d9b98a","#f7e4da","#416468","#cbcfc8","#cfcbc2","#5f6e75","#f4f7f7","#0b1623","#f6f8f6","#1c2129"]); // #1c2129 = ink variant, binding DESIGN.md §0
const fails = [];
const scanDirs = ["src", "presentation/premium/deck.html", "presentation/premium/brand.config.json"];
function files(dir, out=[]) {
  const skip = new Set(["node_modules",".next",".git","dist","build","coverage"]);
  let st; try { st = fs.statSync(dir); } catch { return out; }
  if (st.isFile()) { out.push(dir); return out; }
  for (const e of fs.readdirSync(dir)) {
    if (skip.has(e)) continue;
    const p = path.join(dir, e);
    const s = fs.statSync(p);
    if (s.isDirectory()) files(p, out);
    else if (/\.(tsx?|css|html|json|mjs|js)$/.test(e)) out.push(p);
  }
  return out;
}
import { execSync } from "node:child_process";
let changed = null;
try {
  const base = execSync("git merge-base HEAD origin/main", { cwd: repo }).toString().trim();
  const tracked = execSync(`git diff --name-only ${base} HEAD`, { cwd: repo }).toString();
  let untracked = "";
  try { untracked = execSync("git status --porcelain", { cwd: repo }).toString().split("\n").filter(l => l.startsWith("??")).map(l => l.slice(3).trim()).join("\n"); } catch {}
  changed = new Set((tracked + "\n" + untracked).split("\n").map(s => s.trim().replace(/^"|"$/g, "")).filter(Boolean));
} catch { changed = null; }
const STRICT_SURFACES = [/^docs\/brand\//, /^src\/components\/marketing\/atelier-signatures\.css$/, /^src\/components\/marketing\/tokens\.css$/, /^presentation\/premium\/deck\.html$/, /^presentation\/premium\/brand\.config\.json$/, /^DESIGN\.md$/, /^AGENTS\.md$/];
const roots = [];
for (const d of ["src", "presentation/premium", "docs/brand"]) { const p = path.join(repo, d); if (fs.existsSync(p)) roots.push(p); }
for (const f of ["DESIGN.md", "AGENTS.md"] ) { const p = path.join(repo, f); if (fs.existsSync(p)) roots.push(p); }
const all = roots.flatMap(r => files(r));
// ChatGPT-Trennung: fertige Bibliothek strikt, zu migrierende Alt-Screens (05) nur wenn angefasst.
const list = all.filter(f => {
  const rel = path.relative(repo, f);
  if (STRICT_SURFACES.some(re => re.test(rel))) return true;
  if (changed && changed.has(rel)) return true;
  return false;
});
const hexRe = /#(?:[0-9a-fA-F]{6})/g; // 6-digit only: 3-digit matches issue numbers (#193) — false positives
for (const f of list) {
  const t = fs.readFileSync(f, "utf8");
  const rel = path.relative(repo, f);
  // palette: brand-role vars only for deck (illustration tints in slide bodies are 05 content, not tokens)
  { // palette: every listed file is already scoped (strict surfaces + touched files)
    const scope = /deck\.html$/.test(rel) ? t.split("\n").filter(l => /--(brand|deep|deeper|ink|muted|line|bg|mint|white)\s*:/.test(l)).join("\n") : t;
    for (const m of (scope.match(hexRe) || [])) {
      const v = m.length === 4 ? "#" + [...m.slice(1)].map(c => c + c).join("") : m;
        if (!ALLOW.has(v.toLowerCase()) && !ALLOW.has(v.toUpperCase()) && ![...ALLOW].map(x=>x.toLowerCase()).includes(v.toLowerCase())) {
        // deck legacy gold/warn illustration accents are grandfathered ONLY inside deck.html illustration blocks, not brand tokens
        if (/deck\.html$/.test(rel) && /F4D27A|FFF8E2|EEDFAE|54420D|E8D598|FFF3CC|6E5206|FFF8E2/i.test(m)) continue; // Illustrations-Warnakzente, kein Brand-Token (05-Pass)
        fails.push(`${rel}: new hex ${m} outside Atelier palette (additive-only)`);
        break;
      }
    }
  }
  // tiny text: font-size < 12px hard fail; 12px only inside .eh-meta/metadata context
  for (const m of t.match(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi) || []) {
    if (/deck\.html$/.test(rel)) continue; // Deck-QA (quality.json, min 15px) bleibt zustaendig; Guard prueft dort nur Palette/Fonts
    const n = parseFloat(m.replace(/[^0-9.]/g, ""));
    if (n < 12) { fails.push(`${rel}: font-size ${n}px < 12px minimum`); break; }
  }
  // new font imports (allow InterVariable + system fallback only)
  for (const m of t.match(/@import[^;]+;|font-family\s*:[^;}]+/gi) || []) {
    if (/manrope|roboto|poppins|open sans|googleapis/i.test(m)) { fails.push(`${rel}: forbidden font import ${m.slice(0,80)}`); break; }
  }
  // slop patterns per DESIGN §2
  if (/border-left\s*:[^;]+solid|border-right\s*:[^;]+solid/i.test(t) && /accent/i.test(t)) { fails.push(`${rel}: accent border stripe (DESIGN §2)`); }
  if (/-webkit-background-clip\s*:\s*text|background\s*:[^;]*linear-gradient[^;]*;[^}]*color\s*:\s*transparent/i.test(t)) { fails.push(`${rel}: text gradient (DESIGN §2)`); }
  if (/backdrop-filter\s*:\s*blur\s*\(\s*[1-9]/i.test(t) && /glass/i.test(t)) { fails.push(`${rel}: glassmorphism default (DESIGN §2)`); }
}
// protected core must exist
for (const p of ["public/brand/logo-full.png", "src/fonts/InterVariable.woff2", "src/components/marketing/tokens.css", "DESIGN.md"]) {
  if (!fs.existsSync(path.join(repo, p))) fails.push(`missing protected core ${p}`);
}
if (fails.length) { console.error("BRAND GUARD FAIL\n" + [...new Set(fails)].slice(0, 40).join("\n")); process.exit(1); }
console.log(`BRAND GUARD OK (${list.length} files)`);
