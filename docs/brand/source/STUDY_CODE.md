# Vollständige Zielquellen — Markenstudie

Diese Dateien werden vom Prime-Ausführer neu angelegt. Alle Inhalte sind vollständig. Bestehende Produktionsdateien werden für diese Studie nicht ersetzt.

## design/brand-study/index.html

````html
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>einfachhausen · Markenstudie</title>
<link rel="stylesheet" href="/study.css">
<script src="/study.js" defer></script>
</head>
<body>
<div class="study-controls">
<div class="study-title"><strong>einfachhausen · Markenstudie</strong><span>Entwurf · identische Inhalte · Beispieldaten</span></div>
<div class="choice-row" role="group" aria-label="Markenrichtung">
<button type="button" data-direction="architecture" aria-pressed="true">01 Warme Architektur</button>
<button type="button" data-direction="companion" aria-pressed="false">02 Persönlicher Hausbegleiter</button>
<button type="button" data-direction="journal" aria-pressed="false">03 Das Hausjournal</button>
</div>
<div class="choice-row secondary" role="group" aria-label="Ansicht">
<button type="button" data-view="home" aria-pressed="true">Startseite</button>
<button type="button" data-view="file" aria-pressed="false">Mobile Hausakte</button>
<button type="button" data-view="contact" aria-pressed="false">Kontakt</button>
</div>
<p class="direction-note" id="direction-note" aria-live="polite">Präzise Formen, warme Materialien und eine offene architektonische Rahmung.</p>
</div>
<main class="brand-world" id="brand-world" data-direction="architecture" data-view="home">
<header class="brand-header">
<img class="original-logo" src="/brand/logo.png" alt="einfachhausen" width="150" height="104">
<span class="header-note">Dein persönlicher Hausmanager.</span>
<button class="quiet-action" type="button" data-open-view="contact">Kontakt aufnehmen <span aria-hidden="true">↗</span></button>
</header>
<section class="home-view" data-panel="home" aria-label="Startseitenpassage">
<div class="hero">
<div class="hero-copy">
<p class="eyebrow"><span class="chapter-number">01</span> Zuhause, mit Überblick.</p>
<h1>Dein Haus.<br><em>Einfach geregelt.</em></h1>
<p class="lead">Weniger kümmern. Mehr zuhause sein. Behalte im Blick, was ansteht, und finde die passenden Menschen für dein Haus.</p>
<button class="primary-action" type="button" data-open-view="file">Deine Hausakte entdecken <span aria-hidden="true">↗</span></button>
<div class="hero-foot"><span>Hauswissen bewahren</span><span>Persönlich verbunden</span></div>
</div>
<div class="hero-media">
<div class="architectural-frame" aria-hidden="true"></div>
<img class="home-photo" src="/images/home.jpg" alt="Bestandsmotiv: Familie vor ihrem Zuhause" width="1000" height="800">
<div class="photo-caption"><span>Ein Zuhause. Viele Geschichten.</span><span aria-hidden="true">↗</span></div>
<div class="home-record"><span class="record-index">HAUSAKTE / 01</span><strong>Gut aufgehoben.</strong><span>Dein Hauswissen an einem Ort.</span></div>
</div>
</div>
<div class="brand-promises">
<div><span>01</span><strong>Alles wissen.</strong><p>Dokumente und die Geschichte deines Hauses.</p></div>
<div><span>02</span><strong>Nichts vergessen.</strong><p>Anstehende Wartungen und wichtige Termine.</p></div>
<div><span>03</span><strong>Nicht alles selbst machen.</strong><p>Passende Ansprechpartner, wenn Hilfe nötig ist.</p></div>
</div>
</section>
<section class="file-view" data-panel="file" aria-label="Mobile Hausakte" hidden>
<div class="file-intro"><p class="eyebrow">Dein Hausgedächtnis</p><h1>Alles an<br><em>seinem Platz.</em></h1><p class="lead">Die Geschichte deines Hauses bleibt bei dir. Klar geordnet und schnell wiedergefunden.</p></div>
<div class="house-file">
<div class="file-heading"><span>MEIN ZUHAUSE</span><span class="file-number">HA / 01</span></div>
<h2>Mein Haus</h2><p class="file-subtitle">Dein Überblick für heute.</p>
<div class="register-tabs" role="group" aria-label="Hausakte-Register">
<button type="button" data-register="overview" aria-pressed="true">Überblick</button>
<button type="button" data-register="documents" aria-pressed="false">Dokumente</button>
<button type="button" data-register="people" aria-pressed="false">Menschen</button>
</div>
<div data-register-panel="overview">
<div class="next-item"><span class="record-index">ALS NÄCHSTES</span><h3>Heizungswartung planen</h3><p>Prüfe den Wartungsrhythmus deiner Anlage.</p><button class="text-action" type="button" data-open-register="people">Ansprechpartner ansehen ↗</button></div>
<div class="file-timeline">
<div><span class="timeline-dot"></span><div><strong>Die Geschichte bleibt.</strong><p>Wartungen, Rechnungen und Notizen an einem Ort.</p></div></div>
<div><span class="timeline-dot hollow"></span><div><strong>Der nächste Schritt wird klar.</strong><p>Offene Fragen übersichtlich sammeln.</p></div></div>
</div>
</div>
<div data-register-panel="documents" hidden><h3>Deine Dokumente</h3><details><summary>Wartung &amp; Technik <span>↗</span></summary><p>Hier stehen im Produkt deine hinterlegten Unterlagen. Diese Stilprobe verwendet keine Kundendaten.</p></details><details><summary>Rechnungen &amp; Belege <span>↗</span></summary><p>Dokumente bleiben dem richtigen Haus zugeordnet.</p></details></div>
<div data-register-panel="people" hidden><h3>Deine Ansprechpartner</h3><div class="person-row"><span class="person-symbol" aria-hidden="true">↗</span><div><strong>Die richtigen Menschen.</strong><p>Bewährte Kontakte bleiben bei deinem Haus.</p></div></div><button class="primary-action" type="button" data-open-view="contact">Kontaktansicht öffnen ↗</button></div>
<p class="local-status" id="file-status" aria-live="polite"></p>
</div>
</section>
<section class="contact-view" data-panel="contact" aria-label="Kontaktansicht" hidden>
<div class="contact-story"><p class="eyebrow"><span class="chapter-number">03</span> Persönlich verbunden.</p><h1>Dein Anliegen.<br><em>Ein offenes Ohr.</em></h1><p class="lead">Beschreib, was dich beschäftigt. Gemeinsam wird der nächste Schritt klar.</p><img src="/images/partner.jpg" alt="Bestandsmotiv: persönliches Gespräch an der Haustür" width="900" height="650"><p class="image-source">Bestehendes Bildmaterial · Motivstudie</p></div>
<form class="contact-form" id="contact-form">
<p class="record-index">WIR HÖREN ZU</p><h2>Was können wir für dich tun?</h2>
<label for="contact-name">Dein Name</label><input id="contact-name" name="name" autocomplete="off" placeholder="Vorname" required maxlength="80">
<label for="contact-message">Dein Anliegen</label><textarea id="contact-message" name="message" rows="5" placeholder="Was steht bei deinem Haus an?" required maxlength="2000"></textarea>
<button class="primary-action" type="submit">Rückmeldung ansehen <span aria-hidden="true">↗</span></button>
<p class="prototype-note">Stilprobe: Eingaben bleiben in dieser Ansicht und werden nicht versendet oder gespeichert.</p>
<p class="local-status" id="contact-status" role="status"></p>
</form>
</section>
<footer class="brand-footer"><span>Dein Haus. Einfach geregelt.</span><span>Regional. Menschlich. Organisiert.</span></footer>
</main>
</body>
</html>

````

## design/brand-study/study.css

````css
@font-face{font-family:EHInter;src:url('/fonts/inter.woff2') format('woff2');font-weight:100 900;font-display:swap}
*{box-sizing:border-box}
body{margin:0;background:#eae8e3;color:#10222a;font-family:EHInter,Arial,sans-serif}
button,input,textarea{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #147078;outline-offset:4px}
[hidden]{display:none!important}
.study-controls{max-width:1320px;margin:auto;padding:22px 28px 18px;background:#eae8e3}
.study-title{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:13px}
.study-title>span{color:#4b5b60}
.choice-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:15px}
.choice-row button{min-height:44px;padding:10px 15px;border:1px solid #b9bfbd;background:#f8f8f5;border-radius:8px;font-size:13px;color:#10222a}
.choice-row button[aria-pressed=true]{background:#105258;color:#fff;border-color:#105258}
.choice-row.secondary{margin-top:9px}.choice-row.secondary button{padding:8px 14px}
.direction-note{font-size:13px;color:#4b5b60;margin:14px 0 0;line-height:1.5}
.brand-world{--ink:#10222a;--muted:#4b5b60;--brand:#105258;--deep:#0a3539;--canvas:#faf8f4;--surface:#fff;--soft:#f4ebdd;--line:#e4e2dc;--terra:#a84d29;--radius:14px;max-width:1320px;margin:0 auto 30px;background:var(--canvas);color:var(--ink);overflow:clip}
.brand-header{padding:18px 6%;min-height:116px;display:flex;align-items:center;gap:36px;border-bottom:1px solid var(--line)}
.original-logo{width:112px;height:78px;object-fit:contain;flex-shrink:0}
.header-note{color:var(--muted);font-size:13px}.quiet-action{margin-left:auto;background:transparent;border:1px solid var(--line);padding:12px 18px;min-height:46px;border-radius:10px;color:var(--ink);font-size:13px}
.quiet-action span{margin-left:20px}.eyebrow{display:flex;align-items:center;gap:14px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;margin:0 0 25px}
.chapter-number{font-variant-numeric:tabular-nums;color:var(--terra)}
.hero{display:grid;grid-template-columns:1.08fr 1fr;gap:55px;padding:70px 6% 60px;align-items:center}
h1{font-size:clamp(42px,5.1vw,72px);line-height:1.02;letter-spacing:-.05em;font-weight:650;margin:0 0 26px;text-wrap:balance}
h1 em{color:var(--brand);font-style:normal}h2{font-size:30px;font-weight:600;line-height:1.15;letter-spacing:-.03em;margin:0 0 15px}h3{font-size:19px;line-height:1.35;font-weight:600;margin:12px 0}
.lead{font-size:17px;line-height:1.75;max-width:460px;color:var(--muted);margin:0 0 28px}
.primary-action{display:inline-flex;align-items:center;justify-content:space-between;gap:22px;min-height:50px;max-width:100%;padding:15px 21px;border:1px solid var(--brand);border-radius:var(--radius);background:var(--brand);color:#fff;font-size:14px;text-align:left}
.primary-action:hover{background:var(--deep)}.hero-foot{display:flex;gap:20px;flex-wrap:wrap;margin-top:32px;font-size:11px;color:var(--muted)}
.hero-media{position:relative;padding:24px 0 45px 22px;min-width:0}.home-photo{display:block;width:100%;height:395px;object-fit:cover;object-position:center;border-radius:0 36px 0 0}
.architectural-frame{position:absolute;inset:0 25px 28px 0;border:2px solid var(--brand);border-radius:0 45px 0 0;pointer-events:none}
.photo-caption{display:flex;justify-content:space-between;position:relative;font-size:11px;color:var(--muted);margin-top:13px;padding-right:45px}
.home-record{position:absolute;right:18px;bottom:45px;background:var(--canvas);padding:21px 25px;width:220px;border:1px solid var(--line);box-shadow:0 8px 25px #10222a0b;display:grid;gap:7px}
.record-index{font-size:10px;letter-spacing:.12em;font-weight:650;color:var(--brand)}.home-record strong{font-size:23px;font-weight:600;letter-spacing:-.03em}.home-record>span:last-child{font-size:11px;color:var(--muted)}
.brand-promises{display:grid;grid-template-columns:repeat(3,1fr);margin:0 6%;padding:25px 0 38px;border-top:1px solid var(--line);gap:35px}
.brand-promises>div>span{font-size:11px;color:var(--terra);display:block;margin-bottom:15px}.brand-promises strong{font-size:18px;font-weight:600;display:block}.brand-promises p{font-size:13px;line-height:1.7;color:var(--muted);margin-bottom:0}
.brand-footer{display:flex;gap:18px;justify-content:space-between;padding:25px 6%;border-top:1px solid var(--line);font-size:11px;color:var(--muted)}
.file-view{display:grid;grid-template-columns:1fr 410px;gap:70px;padding:65px 10%;align-items:center}
.house-file{max-width:410px;width:100%;padding:27px 24px 30px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:0 24px 60px #10222a08}
.file-heading{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.1em;color:var(--brand);padding-bottom:22px}.file-number{color:var(--muted)}
.file-subtitle{margin:0 0 22px;font-size:13px;color:var(--muted)}
.register-tabs{display:flex;gap:0;border-bottom:1px solid var(--line);margin-bottom:25px}.register-tabs button{flex:1;min-height:46px;padding:10px 7px;border:0;background:transparent;color:var(--muted);font-size:12px;border-radius:9px 9px 0 0}
.register-tabs button[aria-pressed=true]{background:var(--soft);color:var(--brand);font-weight:650}
.next-item{padding:23px;background:var(--canvas);border-radius:var(--radius);border:1px solid var(--line)}
.next-item p,.file-timeline p,.person-row p{font-size:12px;color:var(--muted);line-height:1.7}
.text-action{background:transparent;border:0;border-bottom:1px solid var(--brand);padding:8px 0;min-height:44px;color:var(--brand);font-size:12px}
.file-timeline{padding-top:20px}.file-timeline>div{display:flex;gap:14px;padding:15px 0;border-bottom:1px solid var(--line)}
.timeline-dot{width:9px;height:9px;border-radius:50%;background:var(--brand);margin-top:6px;flex-shrink:0}.timeline-dot.hollow{background:transparent;border:1px solid var(--brand)}.file-timeline strong{font-size:13px;font-weight:600}.file-timeline p{margin:7px 0 0}
details{border-top:1px solid var(--line);padding:13px 0;font-size:13px;line-height:1.7}summary{cursor:pointer;min-height:44px;padding-top:10px}summary span{float:right}details p{color:var(--muted)}
.person-row{display:flex;gap:15px;align-items:center;margin:25px 0}.person-row strong{font-size:14px}.person-symbol{padding:15px;background:var(--soft);border-radius:50%;color:var(--brand)}
.contact-view{display:grid;grid-template-columns:1fr .85fr;gap:90px;padding:65px 7%;align-items:start}.contact-story h1{font-size:clamp(40px,4.2vw,58px)}
.contact-story img{width:100%;height:270px;object-fit:cover;border-radius:0 32px 0 0}.image-source{font-size:10px;color:var(--muted);margin-top:10px}
.contact-form{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:32px;margin-top:45px}
.contact-form .record-index{margin:0 0 18px}.contact-form h2{font-size:28px;margin-bottom:25px}.contact-form label{font-size:13px;display:block;margin:20px 0 8px;font-weight:550}
.contact-form input,.contact-form textarea{width:100%;border:1px solid #b8c3c3;background:var(--canvas);border-radius:8px;font-size:16px;padding:13px;color:var(--ink);resize:vertical}
.contact-form .primary-action{margin-top:22px;width:100%}.prototype-note{font-size:11px;line-height:1.6;color:var(--muted)}.local-status{font-size:13px;line-height:1.6;color:var(--brand)}
.brand-world[data-direction=companion]{--canvas:#fbf6ee;--soft:#f3e5d1;--line:#e7dac9;--radius:27px}
[data-direction=companion] h1{font-weight:540;letter-spacing:-.045em}
[data-direction=companion] .hero{grid-template-columns:1fr;gap:30px;text-align:center;padding-top:48px}
[data-direction=companion] .hero-copy{max-width:760px;margin:auto}
[data-direction=companion] .eyebrow,[data-direction=companion] .hero-foot{justify-content:center}
[data-direction=companion] .hero h1{font-size:clamp(43px,5.1vw,69px)}
[data-direction=companion] .hero h1 br{display:none}
[data-direction=companion] .hero .lead{margin-left:auto;margin-right:auto;max-width:620px}
[data-direction=companion] .hero-media{max-width:900px;width:100%;margin:auto;padding:0 0 30px}
[data-direction=companion] .home-photo{height:330px;border-radius:44px}
[data-direction=companion] .architectural-frame{display:none}
[data-direction=companion] .home-record{right:25px;bottom:45px;border-radius:23px;text-align:left}
[data-direction=companion] .photo-caption{padding:0 16px}
[data-direction=companion] .brand-promises{border-top:0;gap:15px}
[data-direction=companion] .brand-promises>div{background:var(--soft);border-radius:24px;padding:24px}
[data-direction=companion] .house-file{border-radius:30px}
[data-direction=companion] .contact-story{text-align:center}
[data-direction=companion] .contact-story img{border-radius:32px}
[data-direction=companion] .contact-story .lead{margin-left:auto;margin-right:auto}
.brand-world[data-direction=journal]{--canvas:#f7f4ec;--soft:#ebe5d7;--line:#cec8b8;--radius:3px}
[data-direction=journal] h1,[data-direction=journal] h2,[data-direction=journal] .home-record strong{font-family:Georgia,'Times New Roman',serif;font-weight:400;letter-spacing:-.045em}
[data-direction=journal] h1 em{font-style:italic}
[data-direction=journal] .hero{grid-template-columns:.9fr 1fr;border-bottom:1px solid var(--line);margin:0 6%;padding:55px 0 48px;gap:65px}
[data-direction=journal] .hero-media{padding:0 0 56px}
[data-direction=journal] .home-photo{border-radius:0;height:405px}
[data-direction=journal] .architectural-frame{display:none}
[data-direction=journal] .home-record{right:0;bottom:0;box-shadow:none;border-width:1px 0 0;width:100%;padding:16px 0;background:var(--canvas);grid-template-columns:1fr 1fr;align-items:center}
[data-direction=journal] .home-record strong{font-size:27px}.home-record .record-index{grid-column:1/-1}
[data-direction=journal] .home-record>span:last-child{text-align:right}
[data-direction=journal] .photo-caption{display:none}
[data-direction=journal] .brand-promises{border-top:0}
[data-direction=journal] .brand-promises strong{font-family:Georgia,serif;font-size:24px;font-weight:400}
[data-direction=journal] .house-file{box-shadow:none;border-width:2px 1px 1px}
[data-direction=journal] .contact-story img{border-radius:0}
[data-direction=journal] .contact-form{border-width:2px 0 1px;padding:30px 0;background:transparent}
@media(max-width:900px){
.hero{gap:26px}.hero-media{padding-left:12px}.home-photo{height:340px}.home-record{right:8px;width:190px;padding:18px}
.file-view{gap:35px;padding:45px 6%;grid-template-columns:1fr 360px}
.contact-view{gap:36px;padding:45px 6%}.contact-form{padding:24px}
[data-direction=journal] .hero{gap:32px}.header-note{display:none}
}
@media(max-width:620px){
.study-controls{padding:17px 16px}.choice-row{gap:6px}.choice-row button{flex:1 1 130px;font-size:11px;padding:10px 8px}.choice-row.secondary button{flex:1 1 80px}.study-title{font-size:12px}
.brand-header{padding:14px 20px;min-height:95px;gap:10px}.original-logo{width:94px;height:65px}.quiet-action{font-size:11px;padding:11px 12px}.quiet-action span{margin-left:5px}
.hero,[data-direction=journal] .hero{grid-template-columns:1fr;padding:36px 22px 30px;gap:28px;margin:0}
h1{font-size:44px}.hero .lead{font-size:16px;line-height:1.65}.hero h1{margin-bottom:22px}.eyebrow{font-size:10px;margin-bottom:20px}
.hero-media{max-width:450px;margin:auto;padding:18px 0 42px 15px;width:100%}.home-photo{height:300px}.home-record{bottom:28px;right:10px}.hero-foot{margin-top:23px;gap:14px;font-size:10px}
.brand-promises{grid-template-columns:1fr;gap:0;margin:0 22px;padding-bottom:25px}.brand-promises>div{padding:20px 0;border-bottom:1px solid var(--line)}.brand-promises>div>span{margin-bottom:9px}
.brand-footer{flex-direction:column;gap:8px;padding:22px}.file-view{grid-template-columns:1fr;padding:32px 16px;gap:20px}.file-intro{display:none}.house-file{margin:auto;padding:24px 20px}
.contact-view{grid-template-columns:1fr;padding:34px 22px;gap:24px}.contact-form{margin-top:0;padding:25px 22px}.contact-story h1{font-size:42px}.contact-story img{height:225px}
[data-direction=companion] .hero{padding-top:35px}.hero-copy{min-width:0}[data-direction=companion] .hero h1{font-size:42px}
[data-direction=companion] .home-photo{height:265px;border-radius:28px}[data-direction=companion] .home-record{right:14px;bottom:43px;width:185px}
[data-direction=companion] .brand-promises{gap:12px}[data-direction=companion] .brand-promises>div{padding:24px}
[data-direction=journal] .home-photo{height:300px}[data-direction=journal] .hero-media{padding:0 0 89px}
[data-direction=journal] .home-record{display:block}[data-direction=journal] .home-record>*{display:block;margin-top:6px}[data-direction=journal] .home-record>span:last-child{text-align:left}
}
@media(prefers-reduced-motion:no-preference){.primary-action,.choice-row button{transition:background-color 140ms cubic-bezier(.22,1,.36,1)}}

````

## design/brand-study/study.js

````javascript
'use strict';
const world = document.getElementById('brand-world');
const note = document.getElementById('direction-note');
const descriptions = {
  architecture: 'Präzise Formen, warme Materialien und eine offene architektonische Rahmung.',
  companion: 'Persönliche Nähe, weichere Flächen und Raum für Menschen und Alltag.',
  journal: 'Redaktionelle Typografie, Register und die nachvollziehbare Geschichte eines Hauses.'
};
function chooseDirection(direction) {
  if (!Object.hasOwn(descriptions, direction)) return;
  world.dataset.direction = direction;
  document.querySelectorAll('[data-direction][aria-pressed]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.direction === direction));
  });
  note.textContent = descriptions[direction];
}
function chooseView(view) {
  if (!['home', 'file', 'contact'].includes(view)) return;
  world.dataset.view = view;
  document.querySelectorAll('[data-panel]').forEach(panel => {
    panel.hidden = panel.dataset.panel !== view;
  });
  document.querySelectorAll('[data-view][aria-pressed]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
  });
}
function chooseRegister(register) {
  if (!['overview', 'documents', 'people'].includes(register)) return;
  document.querySelectorAll('[data-register-panel]').forEach(panel => {
    panel.hidden = panel.dataset.registerPanel !== register;
  });
  document.querySelectorAll('[data-register][aria-pressed]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.register === register));
  });
  document.getElementById('file-status').textContent = {
    overview: 'Überblick geöffnet.',
    documents: 'Dokumente geöffnet.',
    people: 'Ansprechpartner geöffnet.'
  }[register];
}
document.querySelectorAll('[data-direction][aria-pressed]').forEach(button => {
  button.addEventListener('click', () => chooseDirection(button.dataset.direction));
});
document.querySelectorAll('[data-view][aria-pressed], [data-open-view]').forEach(button => {
  button.addEventListener('click', () => chooseView(button.dataset.openView || button.dataset.view));
});
document.querySelectorAll('[data-register][aria-pressed], [data-open-register]').forEach(button => {
  button.addEventListener('click', () => chooseRegister(button.dataset.openRegister || button.dataset.register));
});
document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('contact-status').textContent =
    'So könnte deine Rückmeldung aussehen: Dein Anliegen ist verständlich beschrieben. In dieser Stilprobe wurde nichts versendet oder gespeichert.';
});

````

## design/brand-study/server.mjs

````javascript
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(directory, '../..');
const routes = new Map([
  ['/', ['design/brand-study/index.html', 'text/html; charset=utf-8']],
  ['/study.css', ['design/brand-study/study.css', 'text/css; charset=utf-8']],
  ['/study.js', ['design/brand-study/study.js', 'text/javascript; charset=utf-8']],
  ['/brand/logo.png', ['public/brand/logo-full.png', 'image/png']],
  ['/fonts/inter.woff2', ['src/fonts/InterVariable.woff2', 'font/woff2']],
  ['/images/home.jpg', ['public/images/marketing/family-home.jpg', 'image/jpeg']],
  ['/images/partner.jpg', ['public/images/marketing/partner-doorstep.jpg', 'image/jpeg']]
]);

export async function startServer(port = 0) {
  const server = http.createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    response.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; font-src 'self'; script-src 'self'; style-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405); response.end('Method not allowed'); return;
    }
    const url = new URL(request.url, 'http://127.0.0.1');
    const route = routes.get(url.pathname);
    if (!route) { response.writeHead(404); response.end('Not found'); return; }
    try {
      const bytes = await readFile(path.join(repository, route[0]));
      response.writeHead(200, { 'Content-Type': route[1], 'Content-Length': bytes.length });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      response.writeHead(500); response.end('Required study asset unavailable');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const requested = process.env.EH_BRAND_PORT === undefined ? 4179 : Number(process.env.EH_BRAND_PORT);
  if (!Number.isInteger(requested) || requested < 0 || requested > 65535) throw new Error('Invalid EH_BRAND_PORT');
  const server = await startServer(requested);
  process.stdout.write(JSON.stringify({ url: 'http://127.0.0.1:' + server.address().port }) + '\n');
}

````

## design/brand-study/verify.mjs

````javascript
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { startServer } from './server.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(directory, '../..');
const dependencies = process.env.EH_VERIFY_DEPENDENCIES || repository;
const { chromium } = await import(pathToFileURL(path.join(dependencies, 'node_modules/playwright-core/index.mjs')).href);
const evidence = path.join(repository, 'docs/brand/evidence/study');
await mkdir(evidence, { recursive: true });
const server = await startServer();
let browser;
const records = [];
try {
  const base = 'http://127.0.0.1:' + server.address().port;
  const missing = await fetch(base + '/.env');
  assert.equal(missing.status, 404, 'Server must never expose arbitrary repository files');
  browser = await chromium.launch({
    headless: true,
    ...(process.env.EH_CHROMIUM_PATH ? { executablePath: process.env.EH_CHROMIUM_PATH } : {})
  });
  for (const width of [390, 736, 1320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.original-logo').evaluate(img => img.complete && img.naturalWidth > 0), true);
    for (const direction of ['architecture', 'companion', 'journal']) {
      await page.locator('button[data-direction="' + direction + '"]').click();
      assert.equal(await page.locator('#brand-world').getAttribute('data-direction'), direction);
      for (const view of ['home', 'file', 'contact']) {
        await page.locator('button[data-view="' + view + '"]').click();
        assert.equal(await page.locator('[data-panel="' + view + '"]').isVisible(), true);
        assert.equal(await page.locator('[data-panel]:visible').count(), 1);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        assert.equal(overflow, false, direction + '/' + view + '/' + width + ' overflows');
        const image = direction + '-' + view + '-' + width + '.png';
        await page.screenshot({ path: path.join(evidence, image), fullPage: true });
        records.push({ direction, view, width, image, overflow: false });
      }
    }
    await page.locator('button[data-view="file"]').click();
    await page.locator('button[data-register="documents"]').click();
    assert.equal(await page.locator('[data-register-panel="documents"]').isVisible(), true);
    await page.locator('[data-register-panel="documents"] summary').first().click();
    assert.equal(await page.locator('details[open]').count(), 1);
    await page.locator('button[data-view="contact"]').click();
    await page.locator('#contact-name').fill('Stilprobe');
    await page.locator('#contact-message').fill('Ich möchte meine nächste Wartung planen.');
    await page.locator('#contact-form button[type="submit"]').click();
    await page.locator('#contact-status').filter({ hasText: 'nichts versendet' }).waitFor();
    await page.locator('button[data-direction="architecture"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#brand-world').getAttribute('data-direction'), 'architecture');
    assert.deepEqual(errors, []);
    await page.close();
  }
  const report = { status: 'pass', screenshots: records.length, originalLogo: true, localOnlyForm: true, keyboardSwitch: true, reducedMotion: true, sourceExposureGuard: true, records };
  await writeFile(path.join(evidence, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}

````

