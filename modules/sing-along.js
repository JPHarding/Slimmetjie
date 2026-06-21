// hl-08 Liedjies — sing-along
// Bekende Afrikaanse rympies. TTS reciteer reël-vir-reël met aktiewe-reël uitlig
// + geanimeerde ikoon. Herhaal-knoppie. (Reciteer, sing nie — sien spec-nota.)

import { say, stop } from '../audio.js';
import { celebrate } from '../feedback.js';
import { mascot } from '../mascot.js';

export function render(view, { content, award }) {
  const songs = content.songs || [];
  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  kies();

  function kies() {
    stage.innerHTML = '<h2 class="module-titel">Kies \'n liedjie</h2>';
    const wrap = document.createElement('div');
    wrap.className = 'row';
    songs.forEach(s => {
      const b = document.createElement('button');
      b.className = 'card';
      b.style.minHeight = 'auto';
      b.innerHTML = `<span class="ikoon">${s.icon}</span><span class="naam">${s.title}</span>`;
      b.addEventListener('click', () => speelBlad(s));
      wrap.appendChild(b);
    });
    stage.appendChild(wrap);
  }

  function speelBlad(s) {
    stage.innerHTML = `
      <div class="lied-icoon" id="icoon">${s.icon}</div>
      <div class="lied-reels" id="reels">
        ${s.lines.map((l, i) => `<div class="lied-reel" data-i="${i}">${l.text}</div>`).join('')}
      </div>
      <div class="lied-knoppe">
        <button class="nav-arrow" id="terug" aria-label="Kies ander">◀</button>
        <button class="foto-knop" id="speel">▶ Speel</button>
      </div>
    `;
    const icoon = stage.querySelector('#icoon');
    const reels = [...stage.querySelectorAll('.lied-reel')];
    const speelBtn = stage.querySelector('#speel');
    stage.querySelector('#terug').addEventListener('click', () => { stop(); kies(); });
    speelBtn.addEventListener('click', () => speel(s, icoon, reels, speelBtn));
  }

  async function speel(s, icoon, reels, btn) {
    stop();
    btn.disabled = true;
    btn.textContent = '🎵 ...';
    for (let i = 0; i < s.lines.length; i++) {
      if (!stage.isConnected) return;                 // gebruiker het weggegaan
      reels.forEach(r => r.classList.remove('aktief'));
      reels[i].classList.add('aktief');
      icoon.classList.remove('bounce'); void icoon.offsetWidth; icoon.classList.add('bounce');
      mascot.pose('happy');
      await say(s.lines[i].key, s.lines[i].text);
    }
    if (!stage.isConnected) return;
    reels.forEach(r => r.classList.remove('aktief'));
    celebrate(icoon);
    award(3);
    btn.disabled = false;
    btn.textContent = '🔁 Herhaal';
  }
}
