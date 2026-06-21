// ls-06 Diere — animal-sound-tap
// Groot dier-SVG, heel skerm tikbaar -> dierklank + naam. Foto-knoppie wys regte foto.

import { ANIMALS } from '../assets/svg.js';
import { PHOTO_BASE } from '../config.js';
import { say } from '../audio.js';
import { mascot } from '../mascot.js';

export function render(view, { content, award }) {
  const items = content.items || [];
  if (!items.length) { view.textContent = 'Geen diere nie.'; return; }

  let i = 0;
  const seen = new Set();

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  stage.innerHTML = `
    <h2 class="module-titel" id="dierNaam"></h2>
    <div class="dier-middel">
      <button class="nav-arrow" id="vorige" aria-label="Vorige">◀</button>
      <div class="full-tap" id="tapZone"></div>
      <button class="nav-arrow" id="volgende" aria-label="Volgende">▶</button>
    </div>
    <button class="foto-knop" id="fotoKnop">📷 Regte foto</button>
  `;
  view.replaceChildren(stage);

  const naam = stage.querySelector('#dierNaam');
  const zone = stage.querySelector('#tapZone');
  const fotoKnop = stage.querySelector('#fotoKnop');

  // Teken net die prentjie (geen klank) — so word die titel-aankondiging by
  // binnekoms nie onderbreek nie.
  function wys() {
    const a = items[i];
    naam.textContent = a.afrikaans;
    zone.innerHTML = ANIMALS[a.svg] ? ANIMALS[a.svg]() : '<p>?</p>';
    fotoKnop.style.visibility = a.photo ? 'visible' : 'hidden';
  }

  function speel(a) {
    seen.add(a.key);
    say(a.klankKey, a.klank).then(() => say(a.key, a.afrikaans));   // klank dan naam
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
    img.onerror = () => laag.remove();            // ontbrekende foto -> net SVG
    laag.appendChild(img);
    laag.addEventListener('click', () => laag.remove());
    zone.appendChild(laag);
  }

  zone.addEventListener('click', () => speel(items[i]));
  fotoKnop.addEventListener('click', (e) => { e.stopPropagation(); wysFoto(items[i]); });
  stage.querySelector('#vorige').addEventListener('click', () => { i = (i - 1 + items.length) % items.length; wys(); speel(items[i]); });
  stage.querySelector('#volgende').addEventListener('click', () => { i = (i + 1) % items.length; wys(); speel(items[i]); });

  wys();   // net prentjie by binnekoms; titel-aankondiging speel intussen
}
