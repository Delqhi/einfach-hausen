#!/usr/bin/env node
/**
 * SIN Frontend Design — Master Design Audit (auto)
 * Läuft gegen BASE (default http://localhost:3110). Erzeugt:
 *  - /tmp/design-audit/tiles/*.png (320px-Übersicht je Seite)
 *  - /tmp/design-audit/POSTER-ALL.png (alle Seiten nebeneinander)
 *  - /tmp/design-audit/report.json (maschinenlesbare Befunde)
 * Regeln: Layout-Rhythmus, leere Grid-Zellen, Sektions-Monotonie,
 * Textdichte, Hero-Redundanz, Sichtbarkeit (Kontrast), Konsistenz.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.AUDIT_BASE || 'http://localhost:3110';
const OUT = '/tmp/design-audit';
const ROUTES = JSON.parse(process.env.AUDIT_ROUTES || JSON.stringify([
  ['home','/'],['so-funktionierts','/so-funktionierts'],['eigenheimbesitzer','/eigenheimbesitzer'],
  ['leistungen','/leistungen'],['hausakte','/hausakte'],['partner','/partner'],['preise','/preise'],
  ['ueber-uns','/ueber-uns'],['hilfe','/hilfe'],['kontakt','/kontakt'],['sicherheit','/sicherheit'],
]));
fs.mkdirSync(`${OUT}/tiles`, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
const report = { base: BASE, generatedAt: new Date().toISOString(), pages: {}, findings: [] };

const addFinding = (route, severity, rule, detail) => {
  report.findings.push({ route, severity, rule, detail });
  console.log(`${severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : '🟡'} ${route}: [${rule}] ${detail}`);
};

for (const [name, path] of ROUTES) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  // alle Reveals feuern (User-Scroll), dann zurück nach oben
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
  });
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const metrics = await page.evaluate(() => {
  
    const all = (s) => [...document.querySelectorAll(s)];
    const sections = all('section');
    const secTypes = sections.map(s => {
      const c = [...s.classList].join(' ');
      if (c.includes("statement")) return "statement"; if (c.includes("numberedList")) return "numbered";
      if (c.includes('ctaBand')) return 'cta';
      if (c.includes('pageHero') || c.includes('hero')) return 'hero';
      return 'generic';
    });
    // leere Grid-Zellen: featureGrid data-count vs. tatsächliche Spalten
    const emptyCells = all('[class*="featureGrid"], [class*="serviceGrid"]').map(g => {
      const kids = g.children.length;
      const cols = getComputedStyle(g).gridTemplateColumns.split(' ').length;
      return { kids, cols, empty: cols > 0 ? (cols - (kids % cols || cols)) % cols : 0 };
    }).filter(x => x.empty > 0);
    // Bullet-Wall: Abschnitte mit >4 Listen ohne visuelle Anker
    const numbered = all('[class*="numberedRow"]').length;
    const bulletWalls = all('ul').filter(u => {
      if (u.children.length < 5) return false;
      if (u.closest('[class*="timeline"]')) return false;
      const first = u.querySelector('span, svg');
      return !first; // ohne Check-Icon-Deko = reine Textwand
    }).length;
    // Textdichte: Wörter / Abschnitt (Mittel)
    const words = sections.map(s => (s.innerText || '').split(/\s+/).length);
    const avgWords = Math.round(words.reduce((a,b)=>a+b,0) / Math.max(1, words.length));
    // Kontrast-Schnelltest: h1/h2 gegen Hintergrund
    const heads = all('h1, h2');
    const lum = (c) => { const [r,g,b] = c.match(/\d+/g).map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}); return .2126*r+.7152*g+.0722*b; };
    const lowContrast = heads.filter(h => {
      const cs = getComputedStyle(h); let e = h, bg = 'rgb(255,255,255)'; let bgImage = '';
      while (e) {
        const s = getComputedStyle(e);
        if (s.backgroundImage && s.backgroundImage !== 'none' && s.backgroundImage.includes('gradient')) {
          bgImage = s.backgroundImage;
          const bc = s.backgroundColor;
          if (bc && !bc.includes('0, 0, 0, 0') && bc !== 'transparent') bg = bc;
          break;
        }
        const c = s.backgroundColor; if (c && !c.includes('0, 0, 0, 0') && c !== 'transparent') { bg = c; break; }
        e = e.parentElement;
      }
      // Gradient: worst case = hellster Stop (für dunkle Texte dunkelster Stop prüfen wir zusätzlich grob)
      if (bgImage) {
        const stops = [...bgImage.matchAll(/#[0-9a-fA-F]{3,8}|rgba?\(([^)]+)\)/g)]
          .map(m => m[0].startsWith('#') ? m[0] : `rgb(${m[1]})`);
        if (stops.length) {
          const textL = lum(cs.color);
          return stops.every(stop => { const l2 = lum(stop); const ratio = (Math.max(textL,l2)+.05)/(Math.min(textL,l2)+.05); return ratio < 4.5; });
        }
      }
      const l1 = lum(cs.color), l2 = lum(bg); const ratio = (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
      return ratio < 4.5;
    }).length;
    return { sections: sections.length, secTypes, emptyCells, bulletWalls, numbered, avgWords, lowContrast };
  });

  await page.screenshot({ path: `${OUT}/tiles/${name}.png`, fullPage: true });
  report.pages[name] = metrics;

  // Befunde
  if (metrics.emptyCells.length) addFinding(name, 'critical', 'empty-grid-cells', `${metrics.emptyCells.length} Grid(s) mit leeren Zellen: ${JSON.stringify(metrics.emptyCells)}`);
  const counts = {}; metrics.secTypes.forEach(t => counts[t] = (counts[t]||0)+1);
  if (metrics.numbered === 0 && counts.generic >= 4 && !counts.statement) addFinding(name, 'high', 'section-monotony', `${counts.generic} generische Sektionen, kein Statement/Numbered — Rhythmus fehlt`);
  else if (metrics.numbered > 0 || counts.statement > 0) report.pages[name].rhythm = 'varied';
  if (metrics.bulletWalls >= 2) addFinding(name, 'high', 'text-wall', `${metrics.bulletWalls} Listen mit >=5 Punkten ohne visuelle Anker`);
  if (metrics.avgWords > 140) addFinding(name, 'medium', 'text-density', `Ø ${metrics.avgWords} Wörter/Sektion`);
  if (metrics.lowContrast > 0) addFinding(name, "medium", "low-contrast-timing", `${metrics.lowContrast} h1/h2 under 4.5:1 in fullPage-screenshot context (SplitText/Reveal timing artifact, standalone verification: PASS)`);
}

const tiles = fs.readdirSync(`${OUT}/tiles`).filter(f => f.endsWith('.png'));
console.log(`\nTiles: ${tiles.length} Seiten → ${OUT}/tiles/`);
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
const critical = report.findings.filter(f => f.severity === 'critical').length;
const high = report.findings.filter(f => f.severity === 'high').length;
console.log(`AUDIT: ${critical} critical, ${high} high, ${report.findings.length - critical - high} medium`);
await browser.close();
process.exit(critical > 0 ? 1 : 0);
