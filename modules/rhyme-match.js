// rhyme-match (hl-04 Rymwoorde)
// "Wat rym met kat?" -> kies die prent wat rym.

import { say } from '../audio.js';
import { celebrate, wobble, highlightAnswer, makeScorer, klaarPaneel } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const rounds = content.rounds || [];
  if (!rounds.length) { view.innerHTML = '<p style="padding:24px">Kom binnekort!</p>'; return; }

  const scorer = makeScorer();
  let ri = 0, tries = 0;
  const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  function vra() {
    if (ri >= rounds.length) { const s = scorer.stars(); award(s); say('klaar', 'Klaar gedoen!'); return klaarPaneel(stage, s, () => finish(s)); }
    tries = 0;
    const r = rounds[ri];
    const keuses = shuffle([r.rym, ...r.opsies]);

    stage.innerHTML = `
      <p class="prompt">Wat rym met <b>${r.afrikaans}</b>?</p>
      <div class="rym-teiken"><span class="emoji-mid">${r.emoji}</span></div>
      <div class="row" id="wrap"></div>`;
    say(r.key, r.afrikaans);

    const wrap = stage.querySelector('#wrap');
    keuses.forEach(o => {
      const b = document.createElement('button');
      b.className = 'choice klank-tile';
      b.dataset.key = o.key;
      b.innerHTML = `<span class="emoji-mid">${o.emoji}</span>`;
      b.addEventListener('click', () => {
        say(o.key, o.afrikaans);
        if (o.key === r.rym.key) { scorer.right(); celebrate(b); ri++; setTimeout(vra, 1000); }
        else {
          tries++; scorer.miss(); wobble(b);
          if (tries >= 3) {
            const reg = [...wrap.querySelectorAll('.klank-tile')].find(x => x.dataset.key === r.rym.key);
            highlightAnswer(reg); ri++; setTimeout(vra, 1300);
          }
        }
      });
      wrap.appendChild(b);
    });
  }

  vra();
}
