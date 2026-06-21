// Slimmetjie — globale konfigurasie
//
// BASE word OUTOMATIES bepaal uit hierdie lêer se eie URL. So werk alle paaie
// onveranderd by "/" (plaaslike http.server) én by "/slimmetjie/" (GitHub Pages)
// sonder dat 'n gebruikersnaam êrens hardgekodeer hoef te word.
export const BASE = new URL('.', import.meta.url).href;

export const PHOTO_BASE = new URL('Images/', BASE).href;
export const AUDIO_BASE = new URL('audio/', BASE).href;
export const MASCOT_BASE = new URL('assets/mascot/', BASE).href;

// Warm, helder kleurpalet (sien spec)
export const PALETTE = {
  geel: '#FFD166',
  koraal: '#EF476F',
  teal: '#06D6A0',
  pers: '#7B2FBE',
  wit: '#FFFFFF',
};

// Aanmoedigingfrases (sleutel -> teks). Sleutels stem ooreen met die MP3-name
// wat generate_audio.py skep, en met die Web Speech terugvalteks.
export const PHRASES = {
  baie_goed: 'Baie goed!',
  uitstekend: 'Uitstekend!',
  probeer_weer: 'Probeer weer!',
  ja_reg: 'Ja, dis reg!',
  slim_kind: "Jy's 'n slim kind!",
  nog_een: 'Nog een keer!',
  klaar: 'Klaar gedoen!',
  welkom: 'Welkom by Slimmetjie!',
};

// Frases wat lukraak gespeel word by 'n korrekte antwoord
export const ENCOURAGE_KEYS = ['baie_goed', 'uitstekend', 'ja_reg', 'slim_kind'];
