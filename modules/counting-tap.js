// math-01 Tel saam! — counting-tap
// Tik tel-voorwerpe (sterre) een vir een -> kleurverander + telklank in Afrikaans.
// Maksimum getal kom van die ouervlak (1-5 of 1-10).

import { star } from '../assets/svg.js';
import { say } from '../audio.js';
import { celebrate } from '../feedback.js';
import { mascot } from '../mascot.js';

export function render(view, { content, telVlak, award, finish }) {
  const numbers = content.numbers || {};
  const max = telVlak === 10 ? 10 : 5;

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  stage.innerHTML = `
    <div class="tel-teller" id="teller">0</div>
    <div class="tel-wrap" id="wrap"></div>
    <p class="prompt" id="prompt">Tik op die sterre om te tel!</p>
  `;
  view.replaceChildren(stage);

  const teller = stage.querySelector('#teller');
  const wrap = stage.querySelector('#wrap');
  const prompt = stage.querySelector('#prompt');

  let count = 0;

  function bou() {
    count = 0;
    teller.textContent = '0';
    prompt.textContent = 'Tik op die sterre om te tel!';
    wrap.innerHTML = '';
    for (let k = 0; k < max; k++) {
      const item = document.createElement('div');
      item.className = 'tel-item';
      item.innerHTML = star(false);
      item.addEventListener('click', () => tik(item), { once: false });
      wrap.appendChild(item);
    }
  }

  function tik(item) {
    if (item.dataset.done) return;
    item.dataset.done = '1';
    item.innerHTML = star(true);
    count++;
    teller.textContent = String(count);
    say('getal_' + count, numbers[count] || String(count));
    if (count === max) klaar();
  }

  function klaar() {
    mascot.jump();
    prompt.textContent = 'Jy het tot ' + (numbers[max] || max) + ' getel!';
    award(3);
    setTimeout(() => {
      celebrate(teller);
      const knoppe = document.createElement('div');
      knoppe.className = 'lied-knoppe';
      knoppe.innerHTML = `
        <button class="foto-knop" id="weer">Weer 🔄</button>
        <button class="foto-knop" id="tuis">Tuis toe 🏠</button>`;
      stage.appendChild(knoppe);
      knoppe.querySelector('#weer').addEventListener('click', () => { knoppe.remove(); bou(); });
      knoppe.querySelector('#tuis').addEventListener('click', () => finish(3));
    }, 700);
  }

  bou();
}
