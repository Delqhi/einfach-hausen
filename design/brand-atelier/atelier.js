'use strict';
const allowedViews = new Set(['home','hausakte','kontakt']);
const requestedView = new URLSearchParams(location.search).get('view') || 'home';
const activeView = allowedViews.has(requestedView) ? requestedView : 'home';
document.querySelectorAll('[data-screen]').forEach(section => { section.hidden = section.dataset.screen !== activeView; });
document.title = ({home:'Dein Haus. Einfach geregelt.',hausakte:'Deine Hausakte',kontakt:'Dein Anliegen. Ein offenes Ohr.'})[activeView] + ' — einfachhausen';
document.querySelectorAll('.desktop-nav a').forEach(link => {
  if (new URL(link.href).searchParams.get('view') === activeView && !new URL(link.href).hash) link.setAttribute('aria-current','page');
});
const menuButton = document.querySelector('.menu-button');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  document.querySelector('#mobile-nav').hidden = !open;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded','false');
    document.querySelector('#mobile-nav').hidden = true;
    menuButton.focus();
  }
});
const houseRecords = {
  heat: { number:'02 / HAUSTECHNIK', title:'Wärme, die bleibt.', intro:'Alles zu deiner Heizung. Vom ersten Einbau bis zur nächsten Wartung.', rows:[
    ['Oktober 2024','Die Heizung zieht ein.','Gerätedaten und Anleitung hinterlegt.'],
    ['Oktober 2025','Gut gewartet.','Wartungsbericht und Ansprechpartner gespeichert.'],
    ['Als Nächstes','Die nächste Wartung planen.','Gemeinsam den passenden Termin finden.']
  ]},
  roof: { number:'01 / DACH & HÜLLE', title:'Ein gutes Dach darüber.', intro:'Die Geschichte deines Dachs. Berichte, Bilder und Menschen, die sich auskennen.', rows:[
    ['Mai 2024','Ein erster Überblick.','Baujahr, Material und Dachfotos hinterlegt.'],
    ['Mai 2025','Genau hingesehen.','Den letzten Kontrollbericht wiederfinden.'],
    ['Als Nächstes','Den nächsten Check besprechen.','Mit den Unterlagen des letzten Termins.']
  ]},
  garden: { number:'03 / GARTEN & GRUNDSTÜCK', title:'Platz zum Aufblühen.', intro:'Was draußen wächst, gehört auch dazu. Gartenwissen und vertraute Kontakte an einem Ort.', rows:[
    ['Frühjahr 2024','Der Garten wird Teil der Akte.','Flächen, Pflanzen und Fotos festgehalten.'],
    ['Herbst 2025','Gut vorbereitet.','Die erledigte Gartenpflege dokumentiert.'],
    ['Als Nächstes','Den nächsten Einsatz abstimmen.','Deine Wünsche und den Zeitraum besprechen.']
  ]}
};
document.querySelectorAll('[data-system]').forEach(button => button.addEventListener('click', () => {
  const record = houseRecords[button.dataset.system];
  document.querySelectorAll('[data-system]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  document.querySelector('#record-number').textContent = record.number;
  document.querySelector('#record-title').textContent = record.title;
  document.querySelector('#record-intro').textContent = record.intro;
  const list = document.querySelector('#record-timeline');
  list.replaceChildren(...record.rows.map((row,index) => {
    const li = document.createElement('li');
    if (index === record.rows.length-1) li.className='next-entry';
    ['time','strong','span'].forEach((tag,i) => { const element=document.createElement(tag);element.textContent=row[i];li.append(element); });
    return li;
  }));
}));
document.querySelectorAll('[data-register]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-register]').forEach(item => {
    if (item===button) item.setAttribute('aria-current','page'); else item.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-register-panel]').forEach(panel => { panel.hidden = panel.dataset.registerPanel !== button.dataset.register; });
}));
document.querySelector('#document-search').addEventListener('input', event => {
  const query = event.target.value.toLocaleLowerCase('de-DE').trim();
  let count=0;
  document.querySelectorAll('[data-document]').forEach(item => { item.hidden=!item.dataset.document.includes(query);if(!item.hidden)count++; });
  document.querySelector('#document-results').textContent = count ? count + (count===1?' Unterlage':' Unterlagen') : 'Keine passende Unterlage. Versuche zum Beispiel „Heizung“ oder „Dach“.';
});
document.querySelector('#house-composer').addEventListener('submit', event => {
  event.preventDefault();
  const input=document.querySelector('#house-message');
  const value=input.value.trim();
  if(!value){input.setCustomValidity('Beschreibe dein Anliegen in ein paar Worten.');input.reportValidity();return;}
  document.querySelector('#composer-echo').textContent='Dein Anliegen: „'+value+'“';
  document.querySelector('#composer-answer').hidden=false;
  document.querySelector('#intent-status').textContent='Beispielansicht: Es wurde nichts übermittelt und kein Auftrag angelegt.';
  document.querySelector('[data-intent]').focus();
});
document.querySelector('#house-message').addEventListener('input',event=>event.target.setCustomValidity(''));
document.querySelectorAll('[data-intent]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('#intent-status').textContent=button.dataset.intent==='contact'
    ? 'Gewählt: Ansprechpartner anfragen. In der echten Hausakte würdest du diesen Kontaktweg nun bestätigen. Im Entwurf wurde niemand kontaktiert.'
    : 'Gewählt: Auftrag vorbereiten. Als Nächstes würden Umfang und Zeitraum geklärt. Im Entwurf wurde kein Auftrag erstellt.';
}));
document.querySelector('#plan-maintenance').addEventListener('click',()=>{
  const input=document.querySelector('#house-message');
  input.value='Ich möchte die nächste Heizungswartung planen.';
  input.focus();input.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
document.querySelector('#contact-form').addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.querySelector('#contact-name');
  const message=document.querySelector('#contact-message');
  for(const field of [name,message]){if(!field.value.trim()){field.setCustomValidity('Bitte gib hier ein paar Worte ein.');field.reportValidity();return;}}
  document.querySelector('#contact-status').textContent='Danke, '+name.value.trim()+'. So würde deine Bestätigung aussehen. Dies ist ein Entwurf: Es wurde nichts versendet und nichts dauerhaft gespeichert.';
});
document.querySelectorAll('#contact-form input,#contact-form textarea').forEach(field=>field.addEventListener('input',()=>{field.setCustomValidity('');document.querySelector('#contact-status').textContent='';}));
