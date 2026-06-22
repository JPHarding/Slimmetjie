// pattern-complete (math-07 Patrone)
// Herhalende patroon met 'n leë slot aan die einde. Kies wat volgende kom.

import { say } from '../audio.js';
import { celebrate, wobble, makeScorer } from '../feedback.js';

const TOKENS = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'];

export function render(view, { content, award, finish }) {
  const vraag = (content.phrases || {}).vraag_volgende || 'Wat kom volgende?';
  const scorer = makeScorer();
  const ROUNDS = 6;
  let ronde = 0;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);

  function vra() {
    if (ronde >= ROUNDS) return klaar();
    const toks = shuffle(TOKENS).slice(0, ronde > 2 ? 3 : 2);   // 2, dan 3 tokens
    let seq = [];
    for (let r = 0; r < 3; r++) seq = seq.concat(toks);          // ABAB.. / ABCABC..
    const answer = seq[seq.length - 1];
    const shown = seq.slice(0, seq.length - 1);
    const options = shuffle([answer, ...shuffle(TOKENS.filter(t => t !== answer)).slice(0, 2)]);

    stage.innerHTML = `
      <p class="prompt">${vraag}</p>
      <div class="pat-row">${shown.map(t => `<span class="pat-cell">${t}</span>`).join('')}<span class="pat-cell pat-slot">❓</span></div>
      <div class="row" id="opts"></div>`;
    say('vraag_volgende', vraag);

    const opts = stage.querySelector('#opts');
    options.forEach(t => {
      const b = document.createElement('button');
      b.className = 'choice pat-opt';
      b.textContent = t;
      b.addEventListener('click', () => kies(t, b, answer));
      opts.appendChild(b);
    });
  }

  function kies(t, b, answer) {
    if (t === answer) {
      scorer.right();
      const slot = stage.querySelector('.pat-slot');
      slot.textContent = t; slot.classList.remove('pat-slot');
      celebrate(b); ronde++;
      setTimeout(vra, 1000);
    } else { scorer.miss(); wobble(b); }
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
