// Slimmetjie — oudio
//
// Strategie: gegenereerde MP3 (Edge TTS) eerste; val terug op die blaaier se
// Web Speech API ("af-ZA") as die MP3 nie bestaan nie. So práát die app selfs
// voordat enige MP3 gegenereer is, of as die bou-rekenaar geen internet gehad het.

import { AUDIO_BASE, PHRASES, ENCOURAGE_KEYS } from './config.js';
import { getVolume } from './progress.js';

let GENERATED = new Set();   // sleutels waarvoor 'n MP3 bestaan (ge-slug)
let afVoice = null;
let current = null;          // huidige <audio> sodat ons vinnige tikke kan onderbreek
let token = 0;               // elke say()/stop() verhoog dit; identifiseer die "huidige" versoek

// ASCII-veilige lêernaam. MOET presies ooreenstem met slug() in generate_audio.py.
export function slug(k) {
  return String(k).toLowerCase()
    .replace(/[ëéêè]/g, 'e').replace(/[ïî]/g, 'i').replace(/[ôöó]/g, 'o')
    .replace(/[ûüú]/g, 'u').replace(/[áàâä]/g, 'a').replace(/ç/g, 'c').replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export async function initAudio() {
  // 1) laai die lys van gegenereerde MP3-sleutels (geskryf deur generate_audio.py)
  try {
    const res = await fetch(AUDIO_BASE + 'index.json', { cache: 'no-cache' });
    if (res.ok) GENERATED = new Set(await res.json());
  } catch (e) { /* geen MP3s nie — Web Speech neem oor */ }

  // 2) ontsluit oudio op die eerste aanraking (iOS/Safari vereiste)
  const unlock = () => {
    if ('speechSynthesis' in window) { try { speechSynthesis.resume(); } catch (e) {} }
  };
  window.addEventListener('pointerdown', unlock, { once: true });

  // 3) kies 'n Afrikaanse Web Speech stem indien beskikbaar
  if ('speechSynthesis' in window) {
    const pick = () => {
      const v = speechSynthesis.getVoices();
      afVoice = v.find(x => /af[-_]?ZA/i.test(x.lang)) || v.find(x => /^af\b/i.test(x.lang)) || null;
    };
    pick();
    speechSynthesis.addEventListener('voiceschanged', pick);
  }
}

// Speel 'n sleutel; gee 'n Promise wat oplos wanneer dit klaar speel.
export function say(key, text) {
  stop();                       // onderbreek vorige + verhoog token
  const my = token;             // hierdie versoek se identiteit
  return new Promise((resolve) => {
    const file = slug(key);
    if (GENERATED.has(file)) {
      const a = new Audio(AUDIO_BASE + file + '.mp3');
      a.volume = getVolume();
      current = a;
      a.onended = () => resolve();
      // Val SLEGS terug op Web Speech as die MP3 werklik nie kan speel nie —
      // NIE wanneer 'n latere tik dit doelbewus onderbreek het nie (AbortError).
      const maybeFallback = () => { if (my === token) speak(text).then(resolve); else resolve(); };
      a.onerror = maybeFallback;
      a.play().catch(maybeFallback);
    } else {
      speak(text).then(resolve);   // geen MP3 vir dié sleutel -> Web Speech
    }
  });
}

// Praat teks via Web Speech API.
function speak(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window) || !text) { resolve(); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (afVoice) u.voice = afVoice;
      u.lang = 'af-ZA';
      u.rate = 0.9;
      u.volume = getVolume();
      u.onend = () => resolve();
      u.onerror = () => resolve();
      speechSynthesis.speak(u);
    } catch (e) { resolve(); }
  });
}

// Praat dinamiese teks direk (bv. persoonlike besonderhede wat nie vooraf as
// MP3 gegenereer kan word nie). Gebruik die af-ZA Web Speech stem indien beskikbaar.
export function speakText(text) { stop(); return speak(text); }

export function stop() {
  token++;                      // ongeldig maak enige in-vlug terugval
  if (current) { try { current.pause(); } catch (e) {} current = null; }
  if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) {} }
}

// Aanmoediging: lukrake positiewe frase.
export function playEncourage() {
  const idx = Math.floor(Math.random() * ENCOURAGE_KEYS.length);
  const key = ENCOURAGE_KEYS[idx];
  return say(key, PHRASES[key]);
}
export function playTryAgain() { return say('probeer_weer', PHRASES.probeer_weer); }
export function playPhrase(key) { return say(key, PHRASES[key] || ''); }
