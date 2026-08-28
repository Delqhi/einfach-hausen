#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const deckArg = process.argv[2] || 'presentation/premium/deck.html';
const deckPath = path.resolve(process.cwd(), deckArg);
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!existsSync(deckPath)) throw new Error(`Deck fehlt: ${deckPath}`);
if (!existsSync(chromePath)) throw new Error(`Chrome fehlt: ${chromePath}`);

const expectedHead = execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim();
const profile = mkdtempSync(path.join(tmpdir(), 'eh-presentation-qa-'));
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--window-size=1280,720', pathToFileURL(deckPath).href,
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitForPort() {
  const file = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 80; i++) {
    if (existsSync(file)) return Number(readFileSync(file, 'utf8').split(/\r?\n/)[0]);
    if (chrome.exitCode !== null) throw new Error(`Chrome beendet mit ${chrome.exitCode}`);
    await sleep(50);
  }
  throw new Error('Chrome DevTools Port nicht verfügbar');
}
async function waitForTarget(port) {
  for (let i = 0; i < 80; i++) {
    const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json()).catch(() => []);
    const page = targets.find(t => t.type === 'page' && t.url.startsWith('file:'));
    if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    await sleep(50);
  }
  throw new Error('Deck-Target nicht verfügbar');
}
async function evaluate(wsUrl, expression) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    const id = 1;
    const timeout = setTimeout(() => { ws.close(); reject(new Error('CDP evaluate timeout')); }, 10000);
    ws.onopen = () => ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression, returnByValue: true, awaitPromise: true } }));
    ws.onerror = () => { clearTimeout(timeout); reject(new Error('CDP websocket error')); };
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== id) return;
      clearTimeout(timeout); ws.close();
      if (msg.error) reject(new Error(msg.error.message));
      else if (msg.result?.exceptionDetails) reject(new Error(msg.result.exceptionDetails.text || 'CDP evaluation failed'));
      else resolve(msg.result?.result?.value);
    };
  });
}

let report;
try {
  const port = await waitForPort();
  const target = await waitForTarget(port);
  let deckReady = false;
  for (let i = 0; i < 80; i++) {
    const state = await evaluate(target, `({ readyState: document.readyState, slides: document.querySelectorAll('.slide').length })`);
    if (state?.readyState === 'complete' && state?.slides === 15) { deckReady = true; break; }
    await sleep(50);
  }
  if (!deckReady) throw new Error('Deck DOM wurde nicht vollständig geladen');
  report = await evaluate(target, `(() => {
    const slides = [...document.querySelectorAll('.slide')];
    const issues = [];
    const badCopy = [
      ['through-line', 'unpräzise/fehlerhafte Mischsprache'],
      ['Nichts Mockup', 'defensive statt premium Copy'],
      ['Produktion · nicht Mockup', 'defensive statt premium Copy'],
      ['Website-Vollseiten', 'irreführend bei gecroppten Ansichten'],
      ['App-Screens (vollständig)', 'irreführend bei komprimierter Übersicht']
    ];
    const rect = el => { const r = el.getBoundingClientRect(); return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; };
    if (slides.length !== 15) issues.push('deck: erwartet 15 Slides, gefunden ' + slides.length);
    slides.forEach((slide, idx) => {
      const n = String(idx + 1).padStart(2, '0');
      const sr = rect(slide);
      if (Math.round(sr.width) !== 1280 || Math.round(sr.height) !== 720) issues.push('slide-' + n + ': ' + sr.width + 'x' + sr.height + ', erwartet 1280x720');
      const text = slide.textContent || '';
      for (const [needle, why] of badCopy) if (text.includes(needle)) issues.push('slide-' + n + ': Copy enthält “' + needle + '” (' + why + ')');
      const contentImages = [...slide.querySelectorAll('img')].filter(img => !img.closest('.foot'));
      if (contentImages.length > 4) issues.push('slide-' + n + ': ' + contentImages.length + ' Inhaltsbilder; max. 4 für lesbare Präsentation');
      [...slide.querySelectorAll('.phone')].forEach((phone, pi) => {
        const pr = rect(phone); const ratio = pr.height / pr.width;
        if (ratio < 1.7 || ratio > 2.35) issues.push('slide-' + n + ': phone ' + (pi+1) + ' Seitenverhältnis ' + ratio.toFixed(2) + ' außerhalb 1.70–2.35');
        if (pr.left < sr.left - .5 || pr.right > sr.right + .5 || pr.top < sr.top - .5 || pr.bottom > sr.bottom + .5)
          issues.push('slide-' + n + ': phone ' + (pi+1) + ' ragt aus Slide (bottom=' + Math.round(pr.bottom-sr.top) + ')');
        if (idx > 0 && pr.bottom > sr.bottom - 50) issues.push('slide-' + n + ': phone ' + (pi+1) + ' verletzt 50px Footer-Safe-Area (bottom=' + Math.round(pr.bottom-sr.top) + ')');
      });
    });
    const bodyText = document.body.textContent || '';
    const commits = [...bodyText.matchAll(/\\b(?:main\\s+|Commit main\\s+)([0-9a-f]{7,40})\\b/gi)].map(m => m[1].slice(0,7).toLowerCase());
    return { issues, commits:[...new Set(commits)] };
  })()`);
} finally {
  chrome.kill('SIGTERM');
  if (chrome.exitCode === null) {
    await new Promise(resolve => {
      const timer = setTimeout(resolve, 1500);
      chrome.once('exit', () => { clearTimeout(timer); resolve(); });
    });
  }
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}

if (report.commits.length > 1) report.issues.push(`deck: widersprüchliche Commit-Claims: ${report.commits.join(', ')}`);
if (report.commits.length === 1 && report.commits[0] !== expectedHead.toLowerCase()) report.issues.push(`deck: Commit-Claim ${report.commits[0]} != git HEAD ${expectedHead}`);
if (report.issues.length) {
  console.error(`PRESENTATION_QA_FAIL (${report.issues.length})`);
  for (const issue of report.issues) console.error(`- ${issue}`);
  process.exit(1);
}
console.log(`PRESENTATION_QA_PASS slides=15 size=1280x720 head=${expectedHead}`);
