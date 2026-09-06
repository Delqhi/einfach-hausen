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
