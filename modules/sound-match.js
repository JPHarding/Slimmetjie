// sound-match (hl-02 Begin Klanke)
// "Tik alles wat met K begin." Tik die prente met die regte beginklank.

import { say } from '../audio.js';
import { celebrate, wobble, makeScorer, klaarPaneel } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const pool = content.items || [];
  if (!pool.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  const byLetter = {};
  pool.forEach(it => { (byLetter[it.letter] = byLetter[it.letter] || []).push(it); });
  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
  const letters = shuffle(Object.keys(byLetter).filter(l => byLetter[l].length >= 2));

  const scorer = makeScorer();
  const order = letters.slice(0, Math.min(4, letters.length));
  let ri = 0;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  function ronde() {
    if (ri >= order.length) { const s = scorer.stars(); award(s); say('klaar', 'Klaar gedoen!'); return klaarPaneel(stage, s, () => finish(s)); }
    const L = order[ri];
    const matches = byLetter[L].slice(0, 3);
    const others = shuffle(pool.filter(it => it.letter !== L)).slice(0, Math.max(2, 5 - matches.length));
    const tiles = shuffle([...matches, ...others]);
    let found = 0;

    stage.innerHTML = `<p class="prompt">Tik alles wat met <b>${L.toUpperCase()}</b> begin</p><div class="row" id="wrap" style="flex:1"></div>`;
    const wrap = stage.querySelector('#wrap');
    tiles.forEach(it => {
      const b = document.createElement('button');
      b.className = 'choice klank-tile';
      b.innerHTML = `<span class="emoji-mid">${it.emoji}</span>`;
      b.addEventListener('click', () => {
        if (b.classList.contains('vas')) return;
        say(it.key, it.afrikaans);
        if (it.letter === L) {
          scorer.right(); b.classList.add('vas', 'regte-antwoord'); celebrate(b); found++;
          if (found === matches.length) { ri++; setTimeout(ronde, 1000); }
        } else { scorer.miss(); wobble(b); }
      });
      wrap.appendChild(b);
    });
  }

  ronde();
}
