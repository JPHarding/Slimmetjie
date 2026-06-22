// Slimmetjie — gedeelde terugvoer-logika (maskot + oudio + animasie + sterre)
// "Geen-mislukking"-beleid: nooit "jy het gefaal" nie; positief en bemoedigend.

import { mascot } from './mascot.js';
import { playEncourage, playTryAgain } from './audio.js';

// Korrekte antwoord
export function celebrate(el) {
  if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
  mascot.jump();
  return playEncourage();
}

// Verkeerde antwoord — sagte skud + hartseer maskot + "probeer weer"
export function wobble(el) {
  if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  mascot.sad();
  return playTryAgain();
}

// Wys die regte antwoord na 3 pogings (geen mislukking nie)
export function highlightAnswer(el) {
  if (el) el.classList.add('regte-antwoord');
  mascot.pose('wave');
}

// Gedeelde "Klaar gedoen!"-paneel met sterre + tuis-knoppie
export function klaarPaneel(stage, stars, onTuis) {
  stage.innerHTML = `
    <h2 class="module-titel">Klaar gedoen!</h2>
    <div style="font-size:clamp(40px,12vmin,110px);color:#FFD166">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    <button class="foto-knop" id="tuis">Tuis toe 🏠</button>`;
  stage.querySelector('#tuis').addEventListener('click', onTuis);
}

// Punt-teller per sessie -> 1..3 sterre op akkuraatheid
export function makeScorer() {
  let correct = 0, total = 0;
  return {
    right() { correct++; total++; },
    miss()  { total++; },
    stars() {
      if (total === 0) return 1;
      const acc = correct / total;
      return acc >= 0.85 ? 3 : acc >= 0.55 ? 2 : 1;
    },
  };
}
