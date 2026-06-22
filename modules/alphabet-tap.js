// alphabet-tap (hl-07 Die Alfabet)
// Letter-rooster. Tik 'n letter -> hoor die letter + sien 'n woordprent.

import { say } from '../audio.js';
import { mascot } from '../mascot.js';

export function render(view, { content, award }) {
  const letters = content.letters || [];
  if (!letters.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  const seen = new Set();
  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);
  stage.innerHTML = `<div class="alf-toon" id="toon"><span class="seq-label">Tik 'n letter!</span></div><div class="alf-grid" id="grid"></div>`;

  const toon = stage.querySelector('#toon');
  const grid = stage.querySelector('#grid');

  letters.forEach(L => {
    const b = document.createElement('button');
    b.className = 'choice alf-tile';
    b.textContent = L.l.toUpperCase();
    b.addEventListener('click', () => {
      say('letter_' + L.l, L.l.toUpperCase());
      mascot.pose('happy');
      toon.innerHTML = L.word
        ? `<span class="emoji-groot">${L.emoji || ''}</span><span class="seq-label">${L.l.toUpperCase()} — ${L.word}</span>`
        : `<span class="seq-label">${L.l.toUpperCase()}</span>`;
      seen.add(L.l);
      if (seen.size >= letters.length) award(3);
      else if (seen.size >= letters.length / 2) award(2);
      else award(1);
    });
    grid.appendChild(b);
  });
}
