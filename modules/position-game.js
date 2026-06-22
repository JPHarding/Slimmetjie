// position-game (math-06 Waar is dit?)
// 'n Kat by 'n doos in 'n posisie. "Waar is die kat?" -> kies die regte woord.

import { say } from '../audio.js';
import { celebrate, wobble, highlightAnswer, makeScorer } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const positions = content.positions || [];
  const waar = (content.phrases || {}).waar_kat || 'Waar is die kat?';
  if (!positions.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  const scorer = makeScorer();
  const ROUNDS = 6;
  let ronde = 0, tries = 0, n = 2;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);

  function vra() {
    if (ronde >= ROUNDS) return klaar();
    tries = 0;
    const teiken = positions[Math.floor(Math.random() * positions.length)];
    const distract = shuffle(positions.filter(p => p.key !== teiken.key)).slice(0, n - 1);
    const keuses = shuffle([teiken, ...distract]);

    stage.innerHTML = `
      <p class="prompt">${waar}</p>
      <div class="pos-stage"><div class="pos-box">📦</div><div class="pos-cat pos-${teiken.key}">🐱</div></div>
      <div class="row" id="keuses"></div>`;
    say('waar_kat', waar);

    const wrap = stage.querySelector('#keuses');
    keuses.forEach(p => {
      const b = document.createElement('button');
      b.className = 'choice woord';
      b.textContent = p.afrikaans;
      b.dataset.key = p.key;
      b.addEventListener('click', () => kies(p, b, teiken));
      wrap.appendChild(b);
    });
  }

  function kies(p, b, teiken) {
    say(p.key, p.afrikaans);
    if (p.key === teiken.key) {
      scorer.right(); celebrate(b);
      n = Math.min(3, n + 1); ronde++;
      setTimeout(vra, 1000);
    } else {
      tries++; scorer.miss(); wobble(b);
      if (tries >= 3) {
        const reg = [...stage.querySelectorAll('.woord')].find(x => x.dataset.key === teiken.key);
        highlightAnswer(reg); ronde++; setTimeout(vra, 1300);
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
