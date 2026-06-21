// Slimmetjie — SVG-illustrasieformaatbiblioteek
// Plat karton-styl, vet buitelyn, groot vriendelike oë. Alles op 0 0 400 400.

const OUT = '#2B2140';   // buitelyn
const S = 6;             // stroke-wydte

// Groot vriendelike oë (hergebruik oral)
function eyes(lx, rx, y, r = 18) {
  const p = r * 0.5;
  return `
    <circle cx="${lx}" cy="${y}" r="${r}" fill="#fff" stroke="${OUT}" stroke-width="4"/>
    <circle cx="${rx}" cy="${y}" r="${r}" fill="#fff" stroke="${OUT}" stroke-width="4"/>
    <circle cx="${lx + 2}" cy="${y + 2}" r="${p}" fill="${OUT}"/>
    <circle cx="${rx + 2}" cy="${y + 2}" r="${p}" fill="${OUT}"/>
    <circle cx="${lx + 4}" cy="${y - 1}" r="3" fill="#fff"/>
    <circle cx="${rx + 4}" cy="${y - 1}" r="3" fill="#fff"/>`;
}

function wrap(inner) {
  return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <g stroke="${OUT}" stroke-width="${S}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>
  </svg>`;
}

export const ANIMALS = {
  hond: () => wrap(`
    <ellipse cx="92" cy="150" rx="34" ry="64" fill="#8B5E34"/>
    <ellipse cx="308" cy="150" rx="34" ry="64" fill="#8B5E34"/>
    <ellipse cx="200" cy="210" rx="118" ry="110" fill="#C68642"/>
    <ellipse cx="200" cy="252" rx="74" ry="62" fill="#F0D2A8"/>
    ${eyes(162, 238, 188)}
    <ellipse cx="200" cy="244" rx="22" ry="16" fill="${OUT}"/>
    <path d="M200 260 v26" stroke="${OUT}" stroke-width="5"/>
    <path d="M200 286 q-22 0 -22 -18" fill="none"/>
    <path d="M200 286 q22 0 22 -18" fill="none"/>
    <path d="M188 296 q12 22 24 0 z" fill="#EF476F"/>`),

  kat: () => wrap(`
    <path d="M104 96 L150 168 L74 168 Z" fill="#F4A24B"/>
    <path d="M296 96 L326 168 L250 168 Z" fill="#F4A24B"/>
    <path d="M112 110 L140 158 L92 158 Z" fill="#FFC9A3"/>
    <path d="M292 110 L308 158 L262 158 Z" fill="#FFC9A3"/>
    <circle cx="200" cy="218" r="116" fill="#F4A24B"/>
    ${eyes(160, 240, 200, 20)}
    <path d="M188 240 q12 14 24 0 z" fill="#EF476F"/>
    <path d="M200 252 v12" />
    <path d="M200 264 q-16 8 -30 4 M200 264 q16 8 30 4" fill="none"/>
    <path d="M120 220 h-58 M124 240 h-58 M280 220 h58 M276 240 h58" fill="none" stroke-width="4"/>`),

  koei: () => wrap(`
    <ellipse cx="96" cy="150" rx="30" ry="44" fill="#C99" />
    <ellipse cx="304" cy="150" rx="30" ry="44" fill="#C99"/>
    <path d="M118 96 q-26 -44 -2 -58 q18 18 18 46 z" fill="#EDEDED"/>
    <path d="M282 96 q26 -44 2 -58 q-18 18 -18 46 z" fill="#EDEDED"/>
    <ellipse cx="200" cy="212" rx="120" ry="112" fill="#F4F4F4"/>
    <path d="M118 150 q40 -30 70 6 q-20 40 -64 24 z" fill="${OUT}"/>
    <path d="M300 250 q-30 30 -70 8 q14 -40 60 -28 z" fill="${OUT}"/>
    ${eyes(160, 240, 188, 19)}
    <ellipse cx="200" cy="262" rx="78" ry="58" fill="#F7C9D6"/>
    <circle cx="176" cy="262" r="11" fill="${OUT}"/>
    <circle cx="224" cy="262" r="11" fill="${OUT}"/>`),

  perd: () => wrap(`
    <path d="M150 70 q-26 -10 -34 14 q20 6 30 18 z" fill="#5A3A22"/>
    <path d="M250 70 q26 -10 34 14 q-20 6 -30 18 z" fill="#5A3A22"/>
    <path d="M150 80 q50 -24 100 0 q22 14 22 50 l0 80 q0 60 -72 60 q-72 0 -72 -60 l0 -80 q0 -36 22 -50 z" fill="#9C6B3F"/>
    <path d="M148 84 q-10 60 6 150 q14 -4 16 -150 z" fill="#5A3A22"/>
    <path d="M252 84 q10 60 -6 150 q-14 -4 -16 -150 z" fill="#5A3A22"/>
    <ellipse cx="200" cy="280" rx="56" ry="50" fill="#C99467"/>
    ${eyes(166, 234, 168, 17)}
    <ellipse cx="180" cy="288" rx="9" ry="12" fill="${OUT}"/>
    <ellipse cx="220" cy="288" rx="9" ry="12" fill="${OUT}"/>
    <path d="M178 312 q22 12 44 0" fill="none"/>`),

  skaap: () => wrap(`
    <g fill="#F2EFEA">
      <circle cx="140" cy="150" r="44"/><circle cx="200" cy="120" r="48"/>
      <circle cx="260" cy="150" r="44"/><circle cx="110" cy="210" r="44"/>
      <circle cx="290" cy="210" r="44"/><circle cx="150" cy="262" r="46"/>
      <circle cx="250" cy="262" r="46"/><circle cx="200" cy="280" r="46"/>
    </g>
    <ellipse cx="200" cy="210" rx="82" ry="90" fill="#3F3A44"/>
    <ellipse cx="120" cy="200" rx="22" ry="14" fill="#3F3A44"/>
    <ellipse cx="280" cy="200" rx="22" ry="14" fill="#3F3A44"/>
    ${eyes(170, 230, 196, 18)}
    <ellipse cx="200" cy="240" rx="14" ry="10" fill="${OUT}"/>
    <path d="M180 262 q20 16 40 0" fill="none" stroke="#fff"/>`),

  hoender: () => wrap(`
    <g fill="#EF476F">
      <circle cx="180" cy="74" r="16"/><circle cx="205" cy="62" r="18"/><circle cx="228" cy="74" r="16"/>
    </g>
    <ellipse cx="200" cy="220" rx="112" ry="118" fill="#FFFDF5"/>
    ${eyes(166, 234, 196, 19)}
    <path d="M170 232 L150 252 L170 268 q30 6 60 0 L250 252 L230 232 q-30 -8 -60 0 z" fill="#FFB703"/>
    <path d="M186 268 q14 26 28 0 z" fill="#EF476F"/>`),

  olifant: () => wrap(`
    <path d="M70 130 q-46 0 -46 70 q0 70 70 78 q40 -2 40 -60 z" fill="#A7B0BD"/>
    <path d="M330 130 q46 0 46 70 q0 70 -70 78 q-40 -2 -40 -60 z" fill="#A7B0BD"/>
    <ellipse cx="200" cy="190" rx="110" ry="106" fill="#BCC5D1"/>
    ${eyes(160, 240, 168, 18)}
    <path d="M200 210 q-14 60 -8 120 q-26 18 -44 0 q18 -10 18 -34 q-2 -54 10 -86 z" fill="#A7B0BD"/>
    <path d="M168 252 q-10 -10 -24 -8 M232 252 q10 -10 24 -8" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round"/>`),

  leeu: () => wrap(`
    <g fill="#C77F2E">
      ${Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const x = 200 + Math.cos(a) * 132, y = 210 + Math.sin(a) * 132;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="34"/>`;
      }).join('')}
    </g>
    <circle cx="200" cy="210" r="104" fill="#F4A24B"/>
    ${eyes(166, 234, 190, 19)}
    <path d="M188 224 L212 224 L200 240 Z" fill="${OUT}"/>
    <path d="M200 240 v12 M200 252 q-20 12 -34 2 M200 252 q20 12 34 2" fill="none"/>`),

  slang: () => wrap(`
    <path d="M120 330 q-60 -20 -40 -80 q16 -48 70 -44 q70 6 70 60 q0 40 -44 42 q-34 0 -34 -30 q0 -22 24 -22"
      fill="none" stroke="#06D6A0" stroke-width="46" stroke-linecap="round"/>
    <circle cx="252" cy="150" r="44" fill="#06D6A0"/>
    ${eyes(240, 270, 138, 13)}
    <path d="M252 188 v18 M252 206 l-10 10 M252 206 l10 10" fill="none" stroke="#EF476F" stroke-width="5"/>`),

  aap: () => wrap(`
    <circle cx="96" cy="150" r="46" fill="#7B5230"/>
    <circle cx="304" cy="150" r="46" fill="#7B5230"/>
    <circle cx="96" cy="150" r="24" fill="#C79A6B"/>
    <circle cx="304" cy="150" r="24" fill="#C79A6B"/>
    <circle cx="200" cy="200" r="116" fill="#7B5230"/>
    <path d="M200 110 q86 0 86 96 q0 86 -86 86 q-86 0 -86 -86 q0 -96 86 -96 z" fill="#C79A6B"/>
    ${eyes(166, 234, 184, 20)}
    <ellipse cx="200" cy="236" rx="40" ry="28" fill="#C79A6B"/>
    <ellipse cx="186" cy="232" rx="5" ry="7" fill="${OUT}"/>
    <ellipse cx="214" cy="232" rx="5" ry="7" fill="${OUT}"/>
    <path d="M180 254 q20 16 40 0" fill="none"/>`),

  seekoei: () => wrap(`
    <ellipse cx="150" cy="120" rx="20" ry="16" fill="#9B7FB0"/>
    <ellipse cx="250" cy="120" rx="20" ry="16" fill="#9B7FB0"/>
    <ellipse cx="200" cy="220" rx="130" ry="118" fill="#B59BCB"/>
    ${eyes(158, 242, 158, 18)}
    <ellipse cx="200" cy="268" rx="104" ry="64" fill="#C9B3DA"/>
    <ellipse cx="166" cy="258" rx="14" ry="18" fill="${OUT}"/>
    <ellipse cx="234" cy="258" rx="14" ry="18" fill="${OUT}"/>
    <path d="M150 296 q50 26 100 0" fill="none"/>`),

  sebra: () => wrap(`
    <path d="M150 72 q50 -22 100 0 q22 14 22 50 l0 86 q0 60 -72 60 q-72 0 -72 -60 l0 -86 q0 -36 22 -50 z" fill="#FAFAFA"/>
    <g fill="${OUT}">
      <path d="M150 90 q14 30 8 70 l-12 -2 q4 -38 -6 -60 z"/>
      <path d="M250 90 q-14 30 -8 70 l12 -2 q-4 -38 6 -60 z"/>
      <path d="M140 170 q60 -16 120 0 l0 12 q-60 -16 -120 0 z"/>
      <path d="M146 200 q54 -14 108 0 l0 12 q-54 -14 -108 0 z"/>
    </g>
    <path d="M148 70 q-8 -30 6 -44 q10 18 12 44 z" fill="${OUT}"/>
    <path d="M252 70 q8 -30 -6 -44 q-10 18 -12 44 z" fill="${OUT}"/>
    <ellipse cx="200" cy="280" rx="54" ry="48" fill="#E9E4EC"/>
    ${eyes(168, 232, 172, 16)}
    <ellipse cx="184" cy="288" rx="8" ry="10" fill="${OUT}"/>
    <ellipse cx="216" cy="288" rx="8" ry="10" fill="${OUT}"/>`),
};

// Telbare voorwerp (math-01): 'n vrolike ster
export function star(counted = false) {
  const fill = counted ? '#FFD166' : '#FFFFFF';
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 6 L61 38 L96 38 L67 59 L78 92 L50 71 L22 92 L33 59 L4 38 L39 38 Z"
      fill="${fill}" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>
  </svg>`;
}

// Liggaamsfiguur (ls-02 tap-and-label). Elke deel dra data-part.
export function bodyFigure() {
  return `<svg viewBox="0 0 400 470" xmlns="http://www.w3.org/2000/svg">
    <g stroke="${OUT}" stroke-width="${S}" stroke-linejoin="round" stroke-linecap="round" fill="#F4C9A3">
      <!-- bene + knieë + voete + tone -->
      <g data-part="voete"><ellipse cx="168" cy="448" rx="34" ry="16"/><ellipse cx="232" cy="448" rx="34" ry="16"/></g>
      <g data-part="tone"><circle cx="146" cy="448" r="9" fill="#E8B187"/><circle cx="254" cy="448" r="9" fill="#E8B187"/></g>
      <rect x="156" y="330" width="28" height="110" rx="14"/>
      <rect x="216" y="330" width="28" height="110" rx="14"/>
      <g data-part="knieë"><circle cx="170" cy="372" r="16" fill="#E8B187"/><circle cx="230" cy="372" r="16" fill="#E8B187"/></g>
      <!-- romp / maag -->
      <rect data-part="maag" x="150" y="210" width="100" height="130" rx="34" fill="#06D6A0"/>
      <!-- arms + elmboog + hande -->
      <rect x="104" y="206" width="26" height="118" rx="13"/>
      <rect x="270" y="206" width="26" height="118" rx="13"/>
      <g data-part="elmboog"><circle cx="117" cy="262" r="15" fill="#E8B187"/><circle cx="283" cy="262" r="15" fill="#E8B187"/></g>
      <g data-part="hande"><circle cx="117" cy="330" r="20"/><circle cx="283" cy="330" r="20"/></g>
      <!-- skouers -->
      <g data-part="skouers"><circle cx="150" cy="212" r="20" fill="#05B98A"/><circle cx="250" cy="212" r="20" fill="#05B98A"/></g>
      <!-- nek -->
      <rect x="186" y="158" width="28" height="40"/>
      <!-- kop -->
      <circle data-part="kop" cx="200" cy="110" r="72"/>
      <!-- ore -->
      <g data-part="ore"><circle cx="130" cy="112" r="18"/><circle cx="270" cy="112" r="18"/></g>
      <!-- oë -->
      <g data-part="oë">
        <circle cx="176" cy="100" r="15" fill="#fff"/><circle cx="224" cy="100" r="15" fill="#fff"/>
        <circle cx="178" cy="102" r="7" fill="${OUT}"/><circle cx="226" cy="102" r="7" fill="${OUT}"/>
      </g>
      <!-- neus -->
      <path data-part="neus" d="M200 108 q-8 18 0 22 q8 -4 0 -22 z" fill="#E8B187"/>
      <!-- mond -->
      <path data-part="mond" d="M178 138 q22 20 44 0" fill="none"/>
    </g>
  </svg>`;
}
