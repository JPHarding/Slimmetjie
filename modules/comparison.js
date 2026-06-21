// comparison (math-03 Meer of Minder?, math-08 Vergelyk groottes)
// Twee panele. Tik die regte een. mode "count" = meer/minder; "size" = groter/kleiner/langer/korter.

import { say } from '../audio.js';
import { celebrate, wobble, makeScorer } from '../feedback.js';

export function render(view, { content, award, finish }) {
  const mode = content.compare || 'count';
  const phrases = content.phrases || {};
  const emojis = content.emojis || ['🍎', '⭐', '🐟', '🌸', '🍌'];

  const scorer = makeScorer();
  const ROUNDS = 6;
  let ronde = 0;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const repeatEmoji = (e, c) => Array.from({ length: c }, () => `<span class="compare-emoji">${e}</span>`).join('');

  function vra() {
    if (ronde >= ROUNDS) return klaar();
    stage.innerHTML = `<p class="prompt" id="vraag"></p><div class="compare-wrap" id="wrap"></div>`;
    const wrap = stage.querySelector('#wrap');
    const vraagEl = stage.querySelector('#vraag');
    let correctIdx;

    const ask = (key, fallback) => { vraagEl.textContent = phrases[key] || fallback; say(key, phrases[key] || fallback); };
    const panel = (html, i, extra = '') => {
      const d = document.createElement('button');
      d.className = 'compare-panel ' + extra;
      d.innerHTML = html;
      d.addEventListener('click', () => kies(i, d, correctIdx));
      wrap.appendChild(d);
    };

    if (mode === 'count') {
      const e = pick(emojis);
      let a = 1 + rnd(6), b = 1 + rnd(6); while (b === a) b = 1 + rnd(6);
      const wantMore = Math.random() < 0.5;
      ask(wantMore ? 'vraag_meer' : 'vraag_minder', wantMore ? 'Watter een het meer?' : 'Watter een het minder?');
      correctIdx = wantMore ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
      [a, b].forEach((c, i) => panel(repeatEmoji(e, c), i));
    } else if (Math.random() < 0.5) {        // grootte
      const e = pick(emojis);
      const wantBig = Math.random() < 0.5;
      ask(wantBig ? 'vraag_groter' : 'vraag_kleiner', wantBig ? 'Watter een is groter?' : 'Watter een is kleiner?');
      const bigIdx = rnd(2);
      correctIdx = wantBig ? bigIdx : 1 - bigIdx;
      for (let i = 0; i < 2; i++) panel(`<span class="${i === bigIdx ? 'compare-big' : 'compare-small'}">${e}</span>`, i);
    } else {                                 // lengte
      const wantLong = Math.random() < 0.5;
      ask(wantLong ? 'vraag_langer' : 'vraag_korter', wantLong ? 'Watter een is langer?' : 'Watter een is korter?');
      const longIdx = rnd(2);
      correctIdx = wantLong ? longIdx : 1 - longIdx;
      for (let i = 0; i < 2; i++) panel(`<div class="bar" style="height:${i === longIdx ? '85%' : '40%'}"></div>`, i, 'kolom');
    }
  }

  function kies(i, el, correctIdx) {
    if (i === correctIdx) { scorer.right(); celebrate(el); ronde++; setTimeout(vra, 1000); }
    else { scorer.miss(); wobble(el); }
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
