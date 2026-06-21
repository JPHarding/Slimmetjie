// ls-02 My Liggaam — tap-and-label
// Tik op 'n liggaamsdeel op die figuur -> hoor die Afrikaanse naam.

import { bodyFigure } from '../assets/svg.js';
import { say } from '../audio.js';
import { mascot } from '../mascot.js';

export function render(view, { content, award }) {
  const parts = content.parts || [];
  const names = Object.fromEntries(parts.map(p => [p.part, p.afrikaans]));
  const seen = new Set();

  const stage = document.createElement('div');
  stage.className = 'module-stage';
  stage.innerHTML = `
    <p class="prompt" id="naam">Tik op 'n liggaamsdeel!</p>
    <div class="svg-stage" id="fig"></div>
  `;
  view.replaceChildren(stage);

  const fig = stage.querySelector('#fig');
  const naam = stage.querySelector('#naam');
  fig.innerHTML = bodyFigure();

  fig.addEventListener('click', (e) => {
    const el = e.target.closest('[data-part]');
    if (!el) return;
    const part = el.dataset.part;
    const label = names[part] || part;

    el.classList.remove('tik'); void el.offsetWidth; el.classList.add('tik');
    setTimeout(() => el.classList.remove('tik'), 400);

    naam.textContent = label;
    say(part, label);
    mascot.pose('happy');

    seen.add(part);
    if (seen.size >= parts.length) award(3);
    else if (seen.size >= Math.ceil(parts.length / 2)) award(2);
    else award(1);
  });
}
