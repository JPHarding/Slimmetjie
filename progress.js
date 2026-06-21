// Slimmetjie — vordering in localStorage (sterre, voltooide modules, instellings)

const KEY = 'slimmetjie.v1';

const DEFAULTS = {
  stars: {},          // { moduleId: 0..3 }
  done: {},           // { moduleId: true }
  babyMode: false,
  volume: 0.8,
  telVlak: 5,         // tel-modules: maksimum getal (5 of 10)
};

function load() {
  try {
    return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}'));
  } catch (e) {
    return Object.assign({}, DEFAULTS);
  }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* privaat-modus: ignoreer */ }
}

let state = load();

export function getStars(id) { return state.stars[id] || 0; }

export function recordStars(id, n) {
  n = Math.max(0, Math.min(3, n | 0));
  if (n > (state.stars[id] || 0)) state.stars[id] = n;   // hou beste telling
  if (n > 0) state.done[id] = true;
  save(state);
}

export function isDone(id) { return !!state.done[id]; }

export function isBabyMode() { return !!state.babyMode; }
export function setBabyMode(on) { state.babyMode = !!on; save(state); }

export function getVolume() { return state.volume; }
export function setVolume(v) { state.volume = Math.max(0, Math.min(1, +v)); save(state); }

export function getTelVlak() { return state.telVlak; }
export function setTelVlak(v) { state.telVlak = (+v === 10 ? 10 : 5); save(state); }

export function resetProgress() {
  state = Object.assign({}, DEFAULTS, { babyMode: state.babyMode, volume: state.volume });
  save(state);
}
