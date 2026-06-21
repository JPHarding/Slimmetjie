// Slimmetjie — die springbok-maskot (poses + animasie)

import { MASCOT_BASE } from './config.js';

const POSES = {
  happy: 'slimmetjie_happy.svg',
  jump:  'slimmetjie_jump.svg',
  sad:   'slimmetjie_sad.svg',
  wave:  'slimmetjie_wave.svg',
};

let el = null;
let resetTimer = null;

export const mascot = {
  init(imgEl) { el = imgEl; },

  pose(name) {
    if (el && POSES[name]) el.src = MASCOT_BASE + POSES[name];
  },

  // Korrekte antwoord: spring + bons, keer dan terug na bly.
  jump() {
    if (!el) return;
    this.pose('jump');
    el.classList.remove('bounce');
    void el.offsetWidth;            // herbegin animasie
    el.classList.add('bounce');
    this._resetSoon();
  },

  // Verkeerde antwoord: hartseer (maar steeds vriendelik).
  sad() {
    if (!el) return;
    this.pose('sad');
    this._resetSoon();
  },

  _resetSoon() {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => this.pose('happy'), 1300);
  },
};
