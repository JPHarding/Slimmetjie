// sequence (ls-13 Bly Gesond, ls-14 Dae, math-09 Tyd)
// Tik die prente in die regte volgorde. Korrekte tik kry 'n nommer; verkeerde skud.

import { say } from '../audio.js';
import { celebrate, wobble, makeScorer } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const steps = content.items || [];
  if (!steps.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  const order = steps.map(s => s.key);   // korrekte volgorde
  const scorer = makeScorer();
  let next = 0;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);
  stage.innerHTML = `<p class="prompt">${content.prompt || 'Sit in die regte volgorde!'}</p><div class="seq-wrap" id="wrap"></div>`;
  const wrap = stage.querySelector('#wrap');

  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);

  shuffle(steps).forEach(s => {
    const b = document.createElement('button');
    b.className = 'choice seq-tile';
    b.dataset.key = s.key;
    b.innerHTML = `<span class="seq-num"></span><span class="seq-emoji">${s.emoji || ''}</span><span class="seq-label">${s.afrikaans}</span>`;
    b.addEventListener('click', () => tik(s, b));
    wrap.appendChild(b);
  });

  function tik(s, b) {
    if (b.classList.contains('vas')) return;
    say(s.key, s.afrikaans);
    if (s.key === order[next]) {
      scorer.right();
      b.classList.add('vas', 'regte-antwoord');
      b.querySelector('.seq-num').textContent = (next + 1);
      celebrate(b);
      next++;
      if (next >= order.length) setTimeout(klaar, 900);
    } else {
      scorer.miss(); wobble(b);
    }
  }

  function klaar() {
    const st = scorer.stars();
    award(st); say('klaar', 'Klaar gedoen!');
    stage.innerHTML = `
      <h2 class="module-titel">Klaar gedoen!</h2>
      <div style="font-size:clamp(40px,12vmin,110px);color:#FFD166">${'★'.repeat(st)}${'☆'.repeat(3 - st)}</div>
      <button class="foto-knop" id="tuis">Tuis toe 🏠</button>`;
    stage.querySelector('#tuis').addEventListener('click', () => finish(st));
  }
}
