// number-recognition (math-02 Syfers leer ken)
// Wys 'n syfer / vra "Tik op die syfer N" uit 3 keuses. Bereik volg ouervlak (1-5 / 1-10).

import { say } from '../audio.js';
import { celebrate, wobble, highlightAnswer, makeScorer } from '../feedback.js';

const NAMES = { 0: 'nul', 1: 'een', 2: 'twee', 3: 'drie', 4: 'vier', 5: 'vyf', 6: 'ses', 7: 'sewe', 8: 'agt', 9: 'nege', 10: 'tien' };

export function render(view, { telVlak, award, finish }) {
  const max = telVlak === 10 ? 10 : 5;
  const scorer = makeScorer();
  const ROUNDS = 6;
  let ronde = 0, tries = 0;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);

  function vra() {
    if (ronde >= ROUNDS) return klaar();
    tries = 0;
    const target = 1 + Math.floor(Math.random() * max);
    const opts = new Set([target]);
    while (opts.size < 3) opts.add(1 + Math.floor(Math.random() * max));
    const choices = shuffle([...opts]);

    stage.innerHTML = `<p class="prompt">Tik op die syfer <b>${target}</b></p><div class="row" id="keuses" style="flex:1"></div>`;
    say('getal_' + target, NAMES[target]);

    const wrap = stage.querySelector('#keuses');
    choices.forEach(n => {
      const b = document.createElement('button');
      b.className = 'choice syfer';
      b.textContent = n;
      b.dataset.n = n;
      b.addEventListener('click', () => kies(n, b, target));
      wrap.appendChild(b);
    });
  }

  function kies(n, b, target) {
    say('getal_' + n, NAMES[n]);
    if (n === target) {
      scorer.right(); celebrate(b);
      ronde++; setTimeout(vra, 1000);
    } else {
      tries++; scorer.miss(); wobble(b);
      if (tries >= 3) {
        const reg = [...stage.querySelectorAll('.syfer')].find(x => +x.dataset.n === target);
        highlightAnswer(reg);
        ronde++; setTimeout(vra, 1300);
      }
    }
  }

  function klaar() {
    const s = scorer.stars();
    award(s); say('klaar', 'Klaar gedoen!');
    stage.innerHTML = `
      <h2 class="module-titel">Klaar gedoen!</h2>
      <div style="font-size:clamp(40px,12vmin,110px);color:#FFD166">${'★'.repeat(s)}${'☆'.repeat(3 - s)}</div>
      <button class="foto-knop" id="tuis">Tuis toe 🏠</button>`;
    stage.querySelector('#tuis').addEventListener('click', () => finish(s));
  }

  vra();
}
