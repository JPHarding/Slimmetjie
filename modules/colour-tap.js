// ls-04 Kleure — colour-tap
// Verken: tik blok -> hoor naam. Speletjie: "Watter een is [kleur]?" (2 -> 4 keuses).

import { say } from '../audio.js';
import { celebrate, wobble, highlightAnswer, makeScorer } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const items = content.items || [];
  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  verken();

  function blok(item, klik) {
    const b = document.createElement('button');
    b.className = 'kleur-blok';
    b.style.background = item.hex;
    if (item.key === 'wit') b.style.color = '#2B2140';
    b.innerHTML = `<span class="etiket">${item.afrikaans}</span>`;
    b.dataset.key = item.key;
    b.addEventListener('click', () => klik(item, b));
    return b;
  }

  // ---- Verken ----
  function verken() {
    stage.innerHTML = '<p class="prompt">Tik op \'n kleur!</p>';
    const wrap = document.createElement('div');
    wrap.className = 'row';
    wrap.style.flex = '1';
    items.forEach(it => wrap.appendChild(blok(it, (item) => say(item.key, item.afrikaans))));
    stage.appendChild(wrap);

    const speel = document.createElement('button');
    speel.className = 'foto-knop';
    speel.textContent = 'Speletjie ▶';
    speel.addEventListener('click', spel);
    stage.appendChild(speel);
  }

  // ---- Speletjie ----
  function spel() {
    const scorer = makeScorer();
    let ronde = 0, n = 2, tries = 0;
    const ROUNDS = 6;

    function shuffle(a) { return a.slice().sort(() => Math.random() - 0.5); }

    function vra() {
      if (ronde >= ROUNDS) return klaar(scorer.stars());
      tries = 0;
      const teiken = items[Math.floor(Math.random() * items.length)];
      const distract = shuffle(items.filter(x => x.key !== teiken.key)).slice(0, n - 1);
      const keuses = shuffle([teiken, ...distract]);

      stage.innerHTML = `<p class="prompt">Watter een is <b>${teiken.afrikaans}</b>?</p>`;
      say(teiken.key, teiken.afrikaans);

      const wrap = document.createElement('div');
      wrap.className = 'row';
      wrap.style.flex = '1';
      keuses.forEach(it => wrap.appendChild(blok(it, (item, el) => kies(item, el, teiken))));
      stage.appendChild(wrap);
    }

    function kies(item, el, teiken) {
      if (item.key === teiken.key) {
        scorer.right();
        celebrate(el);
        n = Math.min(4, n + 1);
        ronde++;
        setTimeout(vra, 1100);
      } else {
        tries++;
        scorer.miss();
        wobble(el);
        say(item.key, item.afrikaans);
        if (tries >= 3) {
          const reg = [...stage.querySelectorAll('.kleur-blok')].find(b => b.dataset.key === teiken.key);
          highlightAnswer(reg);
          ronde++;
          setTimeout(vra, 1400);
        }
      }
    }

    vra();
  }

  function klaar(stars) {
    award(stars);
    say('klaar', 'Klaar gedoen!');
    stage.innerHTML = `
      <h2 class="module-titel">Klaar gedoen!</h2>
      <div style="font-size:clamp(40px,12vmin,110px);color:#FFD166">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <button class="foto-knop" id="tuis">Tuis toe 🏠</button>
    `;
    stage.querySelector('#tuis').addEventListener('click', () => finish(stars));
  }
}
