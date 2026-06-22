// ls-01 "Wie is ek?" — persoonlike besonderhede
// Eerste keer: 'n vorm (ouer vul in). Daarna: tikbare kaarte. Alles net plaaslik gestoor.

import { say, speakText, stop } from '../audio.js';
import { getProfile, setProfile } from '../progress.js';
import { mascot } from '../mascot.js';

const FEELINGS = [
  { key: 'bly',      afrikaans: 'Bly',      emoji: '😊' },
  { key: 'hartseer', afrikaans: 'Hartseer', emoji: '😢' },
  { key: 'kwaad',    afrikaans: 'Kwaad',    emoji: '😠' },
  { key: 'bang',     afrikaans: 'Bang',     emoji: '😨' },
];

// Vir die Web Speech terugval-teks van die ouderdom-sin (die MP3 is reeds vooraf gebak)
const AGE_WORDS = ['nul', 'een', 'twee', 'drie', 'vier', 'vyf', 'ses', 'sewe', 'agt', 'nege', 'tien', 'elf', 'twaalf'];

export function render(view, { award }) {
  const stage = document.createElement('div');
  stage.className = 'module-stage';
  view.replaceChildren(stage);

  const profile = getProfile();
  if (!profile || !profile.naam) toonVorm(); else toonKaarte(profile);

  // ---- Opstel-vorm (ouer) ----
  function toonVorm(p = {}) {
    stage.innerHTML = `
      <div class="vorm">
        <h2 class="module-titel">Wie is ek?</h2>
        <label>Naam<input id="f-naam" type="text" maxlength="7" value="${esc(p.naam)}"></label>
        <label>Ouderdom<input id="f-age" type="number" min="0" max="12" value="${esc(p.age)}"></label>
        <label>Taal
          <select id="f-taal">
            <option${p.taal === 'Engels' ? '' : ' selected'}>Afrikaans</option>
            <option${p.taal === 'Engels' ? ' selected' : ''}>Engels</option>
          </select>
        </label>
        <label>Iets spesiaal (opsioneel)<input id="f-fact" type="text" maxlength="40" placeholder="Ek hou van dinosourusse" value="${esc(p.fact)}"></label>
        <label>Foto (opsioneel)<input id="f-foto" type="file" accept="image/*"></label>
        <p class="disclaimer">🔒 Hierdie inligting (en die foto) word net op hierdie toestel gestoor — dit word nêrens gestuur of opgelaai nie.</p>
        <button class="aksie" id="f-stoor">Stoor</button>
      </div>`;

    let fotoData = p.foto || '';
    stage.querySelector('#f-foto').addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) fotoData = await skaleerFoto(file);
    });
    stage.querySelector('#f-stoor').addEventListener('click', () => {
      let age = parseInt(stage.querySelector('#f-age').value, 10);
      age = isNaN(age) ? '' : String(Math.max(0, Math.min(12, age)));
      const prof = {
        naam: (stage.querySelector('#f-naam').value || '').trim().slice(0, 7) || 'Ek',
        age,
        taal: stage.querySelector('#f-taal').value || 'Afrikaans',
        fact: (stage.querySelector('#f-fact').value || '').trim(),
        foto: fotoData,
      };
      setProfile(prof);
      toonKaarte(prof);
    });
  }

  // ---- Kaarte ----
  function toonKaarte(p) {
    award(3);
    const avatar = p.foto
      ? `<div class="ek-foto"><img src="${p.foto}" alt="${esc(p.naam)}"></div>`
      : `<div class="ek-foto avatar-emoji">🧒</div>`;

    // Begrensde dele speel vooraf-gebakte AdriNeural MP3; net die naam + vrye feit gebruik Web Speech.
    const kaarte = [
      { html: `${avatar}<span class="seq-label">My naam is ${esc(p.naam)}</span>`,
        play: () => say('ek_naam_prefix', 'My naam is').then(() => speakText(p.naam)) },
    ];
    if (p.age !== '' && p.age != null) {
      const woord = AGE_WORDS[p.age] || p.age;
      kaarte.push({ html: `<span class="emoji-mid">🎂</span><span class="seq-label">Ek is ${esc(p.age)} jaar oud</span>`,
        play: () => say('ek_age_' + p.age, `Ek is ${woord} jaar oud`) });
    }
    if (p.taal) kaarte.push({ html: `<span class="emoji-mid">💬</span><span class="seq-label">Ek praat ${esc(p.taal)}</span>`,
      play: () => say('ek_taal_' + String(p.taal).toLowerCase(), `Ek praat ${p.taal}`) });
    if (p.fact) kaarte.push({ html: `<span class="emoji-mid">⭐</span><span class="seq-label">${esc(p.fact)}</span>`,
      play: () => speakText(p.fact) });
    FEELINGS.forEach(f => kaarte.push({ html: `<span class="emoji-mid">${f.emoji}</span><span class="seq-label">${f.afrikaans}</span>`,
      play: () => say(f.key, f.afrikaans) }));

    stage.innerHTML = `<p class="prompt">Tik en hoor!</p><div class="ek-grid" id="grid"></div><button class="foto-knop" id="wysig">✏️ Wysig</button>`;
    const grid = stage.querySelector('#grid');
    kaarte.forEach(k => {
      const b = document.createElement('button');
      b.className = 'choice ek-kaart';
      b.innerHTML = k.html;
      b.addEventListener('click', () => { mascot.pose('happy'); k.play(); });
      grid.appendChild(b);
    });
    stage.querySelector('#wysig').addEventListener('click', () => { stop(); toonVorm(p); });
  }
}

function esc(v) {
  return String(v == null ? '' : v).replace(/[<>"&]/g, c => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;' }[c]));
}

// Krimp die foto na maks 512px en stoor as JPEG DataURL (klein genoeg vir localStorage)
function skaleerFoto(file) {
  return new Promise((res) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 512;
      let w = img.width, h = img.height;
      if (w > h && w > max) { h = Math.round(h * max / w); w = max; }
      else if (h > max) { w = Math.round(w * max / h); h = max; }
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      try { res(c.toDataURL('image/jpeg', 0.82)); } catch (e) { res(''); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); res(''); };
    img.src = url;
  });
}
