// interactive-book (hl-05 Boeke lees)
// Blaai deur bladsye; elke bladsy se sin word voorgelees. Herhaal-knoppie.

import { say } from '../audio.js';
import { mascot } from '../mascot.js';

export function render(view, { content, award }) {
  const pages = content.pages || [];
  if (!pages.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  let i = 0;
  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);
  stage.innerHTML = `
    <div class="boek-stage">
      <button class="nav-arrow" id="v" aria-label="Vorige">◀</button>
      <div class="boek-blad" id="blad"></div>
      <button class="nav-arrow" id="n" aria-label="Volgende">▶</button>
    </div>
    <p class="prompt" id="teks"></p>
    <button class="foto-knop" id="herhaal">🔁 Lees weer</button>`;

  const blad = stage.querySelector('#blad');
  const teks = stage.querySelector('#teks');

  function wys() {
    const p = pages[i];
    blad.innerHTML = `<span class="emoji-groot">${p.emoji}</span>`;
    teks.textContent = p.text;
    mascot.pose('happy');
    say(p.key, p.text);
    if (i === pages.length - 1) award(3);
  }

  stage.querySelector('#v').addEventListener('click', () => { if (i > 0) { i--; wys(); } });
  stage.querySelector('#n').addEventListener('click', () => { if (i < pages.length - 1) { i++; wys(); } });
  stage.querySelector('#herhaal').addEventListener('click', () => say(pages[i].key, pages[i].text));

  wys();
}
