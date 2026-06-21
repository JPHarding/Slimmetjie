// Generiese galery-module vir: tap-and-name, tap-and-sound, vocab-flashcard
// (ls-01, ls-07, ls-09, ls-10, ls-12, ls-15, math-05, hl-03)
//
// Groot visuele (emoji of SVG) met naam; ◀ ▶ om te blaai; tik -> klank + naam.
// "📷 Regte foto"-knoppie wys die regte JPG/PNG waar 'n foto beskikbaar is.

import { PHOTO_BASE } from '../config.js';
import { say } from '../audio.js';
import { mascot } from '../mascot.js';
import { ANIMALS } from '../assets/svg.js';

export function render(view, { content, award }) {
  const items = content.items || [];
  if (!items.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  let i = 0;
  const seen = new Set();

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  stage.innerHTML = `
    <h2 class="module-titel" id="itemNaam"></h2>
    <div class="dier-middel">
      <button class="nav-arrow" id="vorige" aria-label="Vorige">◀</button>
      <div class="full-tap" id="tapZone"></div>
      <button class="nav-arrow" id="volgende" aria-label="Volgende">▶</button>
    </div>
    <button class="foto-knop" id="fotoKnop">📷 Regte foto</button>
  `;
  view.replaceChildren(stage);

  const naam = stage.querySelector('#itemNaam');
  const zone = stage.querySelector('#tapZone');
  const fotoKnop = stage.querySelector('#fotoKnop');

  function visual(a) {
    if (a.svg && ANIMALS[a.svg]) return ANIMALS[a.svg]();
    return `<div class="emoji-groot" aria-hidden="true">${a.emoji || '⭐'}</div>`;
  }

  function wys() {
    const a = items[i];
    naam.textContent = a.afrikaans;
    zone.innerHTML = visual(a);
    fotoKnop.style.visibility = a.photo ? 'visible' : 'hidden';
  }

  function speel(a) {
    seen.add(a.key);
    if (a.klankKey) say(a.klankKey, a.klank).then(() => say(a.key, a.afrikaans));
    else say(a.key, a.afrikaans);
    mascot.pose('happy');
    if (seen.size >= items.length) award(3);
    else if (seen.size >= Math.ceil(items.length / 2)) award(2);
    else award(1);
  }

  function wysFoto(a) {
    if (!a.photo) return;
    const laag = document.createElement('div');
    laag.className = 'foto-laag';
    const img = document.createElement('img');
    img.src = PHOTO_BASE + a.photo;
    img.alt = a.afrikaans;
    img.onerror = () => laag.remove();          // ontbrekende foto -> net die visuele
    laag.appendChild(img);
    laag.addEventListener('click', () => laag.remove());
    zone.appendChild(laag);
  }

  zone.addEventListener('click', () => speel(items[i]));
  fotoKnop.addEventListener('click', (e) => { e.stopPropagation(); wysFoto(items[i]); });
  stage.querySelector('#vorige').addEventListener('click', () => { i = (i - 1 + items.length) % items.length; wys(); speel(items[i]); });
  stage.querySelector('#volgende').addEventListener('click', () => { i = (i + 1) % items.length; wys(); speel(items[i]); });

  wys();   // net die prentjie by binnekoms; titel-aankondiging speel intussen
}
