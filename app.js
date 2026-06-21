// Slimmetjie — hoof-app: roetering, tuisrooster, ouerkontrole, SW-registrasie

import { BASE } from './config.js';
import { initAudio, stop, say, playPhrase } from './audio.js';
import { mascot } from './mascot.js';
import {
  getStars, recordStars, isDone,
  isBabyMode, setBabyMode,
  getVolume, setVolume,
  getTelVlak, setTelVlak,
  resetProgress,
} from './progress.js';

// ---- Emoji-ikone per module ----
const ICONS = {
  'ls-01': '🙋', 'ls-02': '🧍', 'ls-03': '👀', 'ls-04': '🎨', 'ls-05': '🔷',
  'ls-06': '🐾', 'ls-07': '🐦', 'ls-08': '☀️', 'ls-09': '🍎', 'ls-10': '🥕',
  'ls-11': '👨‍👩‍👧‍👦', 'ls-12': '🚗', 'ls-13': '🪥', 'ls-14': '📅', 'ls-15': '🦕',
  'math-01': '🔢', 'math-02': '🔟', 'math-03': '⚖️', 'math-04': '⬛', 'math-05': '🧊',
  'math-06': '📍', 'math-07': '🔁', 'math-08': '📏', 'math-09': '⏰', 'math-10': '🗂️',
  'hl-01': '📖', 'hl-02': '🔤', 'hl-03': '💬', 'hl-04': '🎶', 'hl-05': '📚',
  'hl-06': '🖼️', 'hl-07': '🔡', 'hl-08': '🎵',
};

// ---- Module-renderers (dinamies gelaai per aktiwiteitstipe) ----
const RENDERERS = {
  'animal-sound-tap': () => import('./modules/animal-sound-tap.js'),
  'colour-tap':       () => import('./modules/colour-tap.js'),
  'counting-tap':     () => import('./modules/counting-tap.js'),
  'tap-and-label':    () => import('./modules/tap-and-label.js'),
  'sing-along':       () => import('./modules/sing-along.js'),
};

let MODULES = [];
let CONTENT = {};

const view    = document.getElementById('view');
const backBtn = document.getElementById('backBtn');
const baby    = document.getElementById('babyToggle');
const titleEl = document.getElementById('appTitle');
const mascotImg = document.getElementById('mascot');
const mascotBtn = document.getElementById('mascotBtn');
const overlay = document.getElementById('overlay');

// ----------------------------------------------------------------------------
async function boot() {
  mascot.init(mascotImg);
  await initAudio();

  // welkom by eerste aanraking (oudio is voor dit geblokkeer)
  window.addEventListener('pointerdown', () => playPhrase('welkom'), { once: true });

  try {
    const [mods, content] = await Promise.all([
      fetch(new URL('graad_r_modules.json', BASE)).then(r => r.json()),
      fetch(new URL('data/content.json', BASE)).then(r => r.json()).catch(() => ({})),
    ]);
    MODULES = mods.modules || [];
    CONTENT = content || {};
  } catch (e) {
    view.innerHTML = '<p style="padding:24px">Kon nie inhoud laai nie.</p>';
    return;
  }

  baby.setAttribute('aria-pressed', String(isBabyMode()));
  backBtn.addEventListener('click', () => { location.hash = '#/'; });
  baby.addEventListener('click', toggleBaby);
  wireMascotLongPress();

  window.addEventListener('hashchange', route);
  route();
  registerSW();
}

// ---- Roetering (hash-gebaseer) ----
function route() {
  const h = location.hash.replace(/^#/, '');
  stop();
  if (h.startsWith('/module/')) openModule(decodeURIComponent(h.slice('/module/'.length)));
  else renderHome();
}

// ---- Tuisskerm ----
function renderHome() {
  showBack(false);
  setTitle('Slimmetjie');
  mascot.pose('wave');

  const onlyBaby = isBabyMode();
  const grid = document.createElement('div');
  grid.className = 'grid';

  MODULES
    .filter(m => !onlyBaby || m.suitable_for_baby)
    .forEach(m => grid.appendChild(makeCard(m)));

  view.replaceChildren(grid);
}

function makeCard(m) {
  const card = document.createElement('button');
  card.className = 'card';
  card.dataset.vak = m.subject;
  card.setAttribute('aria-label', m.afrikaans_label);

  const stars = getStars(m.id);
  card.innerHTML = `
    ${isDone(m.id) ? '<span class="klaar-kol" aria-hidden="true"></span>' : ''}
    ${m.suitable_for_baby ? '<span class="baba-badge" aria-hidden="true">👶</span>' : ''}
    <span class="ikoon" aria-hidden="true">${ICONS[m.id] || '⭐'}</span>
    <span class="naam">${m.afrikaans_label}</span>
    <span class="vak">${m.subject}</span>
    <span class="sterre" aria-hidden="true">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>
  `;
  card.addEventListener('click', () => {
    // Titel-aankondiging gebeur ná navigasie (in openModule), anders word dit
    // deur route() se stop() doodgemaak.
    location.hash = '#/module/' + m.id;
  });
  return card;
}

// ---- Module open ----
async function openModule(id) {
  const m = MODULES.find(x => x.id === id);
  if (!m) { location.hash = '#/'; return; }

  showBack(true);
  setTitle(m.afrikaans_label);
  mascot.pose('happy');
  view.replaceChildren();

  const loader = RENDERERS[m.app_activity_type];
  if (!loader) { renderBinnekort(m); return; }

  try {
    const mod = await loader();
    mod.render(view, {
      module: m,
      content: CONTENT[id] || {},
      telVlak: getTelVlak(),
      award(stars) { recordStars(id, stars || 1); },
      finish(stars) { recordStars(id, stars || 1); location.hash = '#/'; },
    });
    // kondig die module se naam aan by binnekoms (ná render, sodat dit nie afgesny word nie)
    say(m.id + '_titel', m.afrikaans_label);
  } catch (e) {
    console.error('Module-fout:', e);
    renderBinnekort(m);
  }
}

function renderBinnekort(m) {
  const d = document.createElement('div');
  d.className = 'binnekort';
  d.innerHTML = `
    <div class="groot" aria-hidden="true">${ICONS[m.id] || '🚧'}</div>
    <p><strong>${m.afrikaans_label}</strong></p>
    <p>Kom binnekort!</p>
  `;
  view.replaceChildren(d);
}

// ---- Topbalk-helpers ----
function showBack(on) { backBtn.hidden = !on; }
function setTitle(t)  { titleEl.textContent = t; }

function toggleBaby() {
  const on = !isBabyMode();
  setBabyMode(on);
  baby.setAttribute('aria-pressed', String(on));
  if (!location.hash.startsWith('#/module/')) renderHome();
}

// ---- Maskot lang-druk -> ouerkontrole ----
function wireMascotLongPress() {
  let timer = null, fired = false;
  const start = () => { fired = false; timer = setTimeout(() => { fired = true; openParentPanel(); }, 3000); };
  const cancel = () => clearTimeout(timer);
  mascotBtn.addEventListener('pointerdown', start);
  mascotBtn.addEventListener('pointerup', cancel);
  mascotBtn.addEventListener('pointerleave', cancel);
  mascotBtn.addEventListener('pointercancel', cancel);
  mascotBtn.addEventListener('click', (e) => {
    if (fired) { e.preventDefault(); fired = false; return; }
    playPhrase('welkom');
  });
}

// ---- Ouerkontrolebalk ----
function openParentPanel() {
  const starsRows = MODULES
    .filter(m => getStars(m.id) > 0)
    .map(m => `<div class="ry"><span>${ICONS[m.id] || ''} ${m.afrikaans_label}</span><span class="sterre">${'★'.repeat(getStars(m.id))}</span></div>`)
    .join('') || '<p>Nog geen sterre nie.</p>';

  overlay.innerHTML = `
    <div class="panel" role="dialog" aria-label="Ouerkontrole">
      <h2>Ouerkontrole</h2>
      <div class="ry">
        <span>Getalvlak</span>
        <span>
          <button class="aksie" data-vlak="5"  ${getTelVlak() === 5 ? 'style="outline:4px solid #2B2140"' : ''}>1–5</button>
          <button class="aksie" data-vlak="10" ${getTelVlak() === 10 ? 'style="outline:4px solid #2B2140"' : ''}>1–10</button>
        </span>
      </div>
      <div class="ry">
        <span>Volume</span>
        <input id="volRange" type="range" min="0" max="1" step="0.1" value="${getVolume()}" style="width:200px">
      </div>
      <div class="ry">
        <span>Baba-modus</span>
        <button class="aksie" id="babyPanelBtn">${isBabyMode() ? 'Aan' : 'Af'}</button>
      </div>
      <h2 style="margin-top:18px">Sterre</h2>
      ${starsRows}
      <div class="ry" style="justify-content:center;margin-top:18px">
        <button class="aksie gevaar" id="resetBtn">Reset vordering</button>
        <button class="aksie toemaak" id="closeBtn">Toemaak</button>
      </div>
    </div>`;
  overlay.hidden = false;

  overlay.querySelectorAll('[data-vlak]').forEach(b =>
    b.addEventListener('click', () => { setTelVlak(+b.dataset.vlak); openParentPanel(); }));
  overlay.querySelector('#volRange').addEventListener('input', e => setVolume(e.target.value));
  overlay.querySelector('#babyPanelBtn').addEventListener('click', () => { toggleBaby(); openParentPanel(); });
  overlay.querySelector('#resetBtn').addEventListener('click', () => {
    if (confirm('Reset alle sterre en vordering?')) { resetProgress(); overlay.hidden = true; renderHome(); }
  });
  overlay.querySelector('#closeBtn').addEventListener('click', () => { overlay.hidden = true; });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.hidden = true; }, { once: true });
}

// ---- Service Worker ----
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW-fout:', err));
  }
}

boot();
