// matching-game (ls-03 Sintuie, ls-11 Gesin)
// Twee kolomme. Tik 'n linker-teël, dan die regte regterkant -> pas. 3-4 pare per ronde.

import { say } from '../audio.js';
import { celebrate, wobble, makeScorer } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const cfg = content.matching || {};
  const allPairs = cfg.pairs || [];
  if (!allPairs.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  // verdeel in rondes van 4; voeg 'n enkel-oorblyfsel by die vorige ronde
  const ROUND = 4;
  const rounds = [];
  for (let k = 0; k < allPairs.length; k += ROUND) rounds.push(allPairs.slice(k, k + ROUND));
  if (rounds.length >= 2 && rounds[rounds.length - 1].length === 1) {
    rounds[rounds.length - 2] = rounds[rounds.length - 2].concat(rounds.pop());
  }

  const scorer = makeScorer();
  let ri = 0;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
  const leftHTML = (p) => `${p.leftEmoji ? `<span class="m-emoji">${p.leftEmoji}</span> ` : ''}${p.afrikaans}`;
  const rightHTML = (p) => `<span class="m-emoji">${p.right}</span>`;

  function speelRonde() {
    if (ri >= rounds.length) return klaar();
    const pairs = rounds[ri];
    let matched = 0;
    let picked = null;

    stage.innerHTML = `
      <p class="prompt">${cfg.prompt || 'Pas die pare!'}</p>
      <div class="match-wrap">
        <div class="match-col" id="links"></div>
        <div class="match-col" id="regs"></div>
      </div>`;
    const links = stage.querySelector('#links');
    const regs = stage.querySelector('#regs');

    const tile = (p, side, html) => {
      const b = document.createElement('button');
      b.className = 'choice match-tile';
      b.dataset.key = p.key;
      b.dataset.side = side;
      b.innerHTML = html;
      b.addEventListener('click', () => pick(b, p));
      return b;
    };

    shuffle(pairs).forEach(p => links.appendChild(tile(p, 'L', leftHTML(p))));
    shuffle(pairs).forEach(p => regs.appendChild(tile(p, 'R', rightHTML(p))));

    function pick(b, p) {
      if (b.classList.contains('vas')) return;
      say(p.key, p.afrikaans);

      if (!picked) { picked = { b, p }; b.classList.add('gekies'); return; }
      if (picked.b === b) { b.classList.remove('gekies'); picked = null; return; }
      if (picked.b.dataset.side === b.dataset.side) {     // dieselfde kolom -> wissel keuse
        picked.b.classList.remove('gekies'); picked = { b, p }; b.classList.add('gekies'); return;
      }

      if (picked.p.key === p.key) {                       // pas!
        scorer.right();
        [picked.b, b].forEach(x => { x.classList.remove('gekies'); x.classList.add('vas', 'regte-antwoord'); });
        celebrate(b);
        matched++; picked = null;
        if (matched === pairs.length) { ri++; setTimeout(speelRonde, 1000); }
      } else {                                            // verkeerd
        scorer.miss();
        wobble(b); picked.b.classList.remove('gekies'); picked = null;
      }
    }
  }

  function klaar() {
    const stars = scorer.stars();
    award(stars); say('klaar', 'Klaar gedoen!');
    stage.innerHTML = `
      <h2 class="module-titel">Klaar gedoen!</h2>
      <div style="font-size:clamp(40px,12vmin,110px);color:#FFD166">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <button class="foto-knop" id="tuis">Tuis toe 🏠</button>`;
    stage.querySelector('#tuis').addEventListener('click', () => finish(stars));
  }

  speelRonde();
}
