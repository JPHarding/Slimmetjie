// sort-and-count (math-10 Sorteer dit!)
// Tik 'n item, tik dan die regte groep. Tel elke groep aan die einde.

import { say } from '../audio.js';
import { celebrate, wobble, makeScorer } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const cfg = content.sort || {};
  const bins = cfg.bins || [];
  const items = cfg.items || [];
  if (!bins.length || !items.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  const scorer = makeScorer();
  const counts = {};
  bins.forEach(b => counts[b.key] = 0);
  let picked = null, placed = 0;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);
  stage.innerHTML = `
    <p class="prompt">${cfg.prompt || 'Sorteer dit!'}</p>
    <div class="sort-items" id="items"></div>
    <div class="sort-bins" id="bins"></div>`;
  const itemsEl = stage.querySelector('#items');
  const binsEl = stage.querySelector('#bins');

  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);

  shuffle(items).forEach((it) => {
    const b = document.createElement('button');
    b.className = 'choice sort-item';
    b.dataset.cat = it.cat;
    b.innerHTML = `<span class="sort-emoji">${it.emoji}</span>`;
    b.addEventListener('click', () => pickItem(b));
    itemsEl.appendChild(b);
  });

  bins.forEach(bn => {
    const d = document.createElement('button');
    d.className = 'choice sort-bin';
    d.dataset.key = bn.key;
    d.innerHTML = `<span class="sort-emoji">${bn.emoji}</span><span class="seq-label">${bn.afrikaans}</span><span class="bin-count">0</span>`;
    d.addEventListener('click', () => dropBin(bn, d));
    binsEl.appendChild(d);
  });

  function pickItem(b) {
    if (b.classList.contains('vas')) return;
    itemsEl.querySelectorAll('.gekies').forEach(x => x.classList.remove('gekies'));
    picked = b; b.classList.add('gekies');
  }

  function dropBin(bn, d) {
    if (!picked) return;
    if (picked.dataset.cat === bn.key) {
      scorer.right();
      picked.classList.remove('gekies'); picked.classList.add('vas');
      picked.style.visibility = 'hidden';
      counts[bn.key]++; d.querySelector('.bin-count').textContent = counts[bn.key];
      say(bn.key, bn.afrikaans); celebrate(d);
      placed++; picked = null;
      if (placed >= items.length) setTimeout(klaar, 900);
    } else {
      scorer.miss(); wobble(d);
    }
  }

  function klaar() {
    const s = scorer.stars();
    award(s); say('klaar', 'Klaar gedoen!');
    const summary = bins.map(b => `${b.emoji} ${counts[b.key]}`).join('   ');
    stage.innerHTML = `
      <h2 class="module-titel">Klaar gedoen!</h2>
      <p class="prompt">${summary}</p>
      <div style="font-size:clamp(36px,10vmin,90px);color:#FFD166">${'★'.repeat(s)}${'☆'.repeat(3 - s)}</div>
      <button class="foto-knop" id="tuis">Tuis toe 🏠</button>`;
    stage.querySelector('#tuis').addEventListener('click', () => finish(s));
  }
}
