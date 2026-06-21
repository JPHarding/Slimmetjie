# Slimmetjie — Afrikaanse Leerapp vir Kinders
## Volledige App Spesifikasie vir Claude Code

---

## App Identiteit

- **Naam:** Slimmetjie
- **Tagline:** *"Leer saam met Slimmetjie!"*
- **Maskot:** 'n Vriendelike cartoon springbok genaamd Slimmetjie — gebruik op die tuisskerm, laai-skerm, en as aanmoedigingskarakter wanneer 'n kind iets reg kry. Genereer as SVG in dieselfde plat karton-styl as alle ander illustrasies. Die springbok het groot vriendelike oë, 'n groot glimlag, en dra 'n klein skooltas.

---

## Jou Rol

Jy is die **enigste ontwikkelaar** van hierdie app. Die menslike gebruiker het die navorsing gedoen en die inhoud-kaart gebou. Jy implementeer alles. Jy vra nie toestemming nie — jy bou, en rapporteer wat jy gebou het. As iets 'n keuse verg, kies die eenvoudigste, mees robuuste opsie en verduidelik jou keuse kortliks.

---

## Projekdoelwit

'n Offline-first, Afrikaanse opvoedkundige web-app vir:
- **Primêre gebruiker:** 'n Afrikaanse 4-jarige seun (Graad R vlak)
- **Sekondêre gebruiker:** Sy 1-jarige suster (baba-vriendelike modules)
- **Platform:** iPad en laptop (Chrome/Safari)
- **Konnektiwiteit:** Lae konnektiwiteit / geen internet na eerste laai
- **Hosting:** GitHub Pages + PWA Service Worker vir offline gebruik

---

## Tegniese Argitektuur

### Stapel
- **Vanilla HTML/CSS/JavaScript** — geen raamwerk (Vue/React overkill vir hierdie projek)
- **Enkellêer per module** waar moontlik, anders 'n klein lêerhiërargie
- **Progressive Web App (PWA)** met Service Worker vir volledige offline-ondersteuning
- **GitHub Pages** hosting — alle paaie moet werk met 'n `/slimmetjie/` basis-URL subgids
- **Geen databasis** — alle inhoud is JSON + statiewe lêers

### GitHub Pages Konfigurasie
- Repo naam: `slimmetjie`
- Basis URL: `https://[gebruikersnaam].github.io/slimmetjie/`
- Alle absolute paaie in SW, manifest en HTML moet die `/slimmetjie/` voorvoegsel hanteer
- Gebruik 'n `BASE_PATH` konstante in `app.js` sodat dit maklik verander kan word
- `404.html` moet na `index.html` herlei vir SPA-navigasie

### Lêerstruktuur
```
slimmetjie/
├── index.html              # Hoof tuisskerm (modulekieser)
├── 404.html                # GitHub Pages SPA herlei
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (offline caching)
├── style.css               # Globale style
├── app.js                  # Hoof navigasie-logika + BASE_PATH
├── modules.json            # Inhoudsdata (CAPS-gegrond, verskaf apart)
├── modules/
│   ├── diere/              # Een gids per module
│   │   ├── index.html
│   │   ├── module.js
│   │   └── assets/
│   │       ├── images/     # SVG illustrasies + JPG fotos
│   │       └── audio/      # .mp3 lêers gegenereer deur TTS
│   └── [ander modules...]
├── assets/
│   ├── icons/              # App-ikone vir PWA (slimmetjie springbok)
│   ├── mascot/             # Slimmetjie springbok SVG variasies
│   ├── sounds/             # Gedeelde klanke (reg, verkeerd, applous)
│   └── fonts/              # Optioneele kindervriendelike font
└── tools/
    └── generate_audio.py   # TTS-skrip (Edge TTS, eenmalig hardloop)
```

### Offline Strategie
- Service Worker cache-first strategie
- Alle assets (SVG, JPG, MP3, JSON) word by installasie ge-cache
- App werk 100% sonder internet na eerste laai
- `manifest.json` laat iPad toe om app op tuisskerm te installeer as "Slimmetjie"

---

## Visuele Ontwerp

### Styl
- **Groot, vet, kleurryke** UI — minimum 80px tik-teikens (vingers, nie muise)
- **Plat karton illustrasie** styl — eenvoudige SVG-tekeninge
- **Warm, helder kleurpalet:** geel (#FFD166), koraal (#EF476F), teal (#06D6A0), pers (#7B2FBE), wit agtergrond
- **Geen klein teks** — alles bo 28px op iPad
- **Ronde hoeke** oral (border-radius: 20px+)
- **Vrye spasie** — kinders raak verkeerde items aan as dinge te naby is

### Foto vs SVG gebruik
- **Diere, Voëls, Vrugte, Groente, Vervoer, Weer, Dinosaurusse** — het BEIDE:
  - SVG karton-weergawe (interaktief, tik-reaktief)
  - Regte JPG foto (wys met 'n klein "📷 Regte foto"-knoppie onderaan)
- **Gesin (ls-11)** — gebruik SLEGS SVG karton-karakters (ma, pa, ouma, oupa, baba, suster, broer) — geen fotos nie
- **Liggaam, Vorms, Kleure, Wiskundige konsepte** — SVG slegs

### Foto-lêers
Fotos word deur die gebruiker verskaf en geplaas in elke module se `assets/images/photos/` gids.
Verwag JPG-lêers met hierdie name (sien foto-aflaailys vir volledige lys):
- Diere: `hond.jpg`, `kat.jpg`, `koei.jpg`, `perd.jpg`, `skaap.jpg`, `hoender.jpg`, `olifant.jpg`, `leeu.jpg`, `slang.jpg`, `aap.jpg`, `seekoei.jpg`, `sebra.jpg`
- Voëls: `volstruis.jpg`, `pikkewyn.jpg`, `arend.jpg`, `duif.jpg`
- Vrugte: `appel.jpg`, `piesang.jpg`, `lemoen.jpg`, `druiwe.jpg`, `mango.jpg`, `aarbei.jpg`, `peer.jpg`, `waatlemoen.jpg`
- Groente: `wortel.jpg`, `aartappel.jpg`, `tamatie.jpg`, `mielies.jpg`, `soetrissie.jpg`
- Vervoer: `motor.jpg`, `bus.jpg`, `trein.jpg`, `vliegtuig.jpg`, `fiets.jpg`, `taxi.jpg`
- Weer: `son.jpg`, `reen.jpg`, `wolke.jpg`, `reenboog.jpg`
- Dinosaurusse: `trex.jpg`, `triceratops.jpg`, `stegosaurus.jpg`

As 'n foto-lêer nie bestaan nie, wys net die SVG — geen fout nie.

### Maskot — Slimmetjie die Springbok
- Verskyn op die tuisskerm bo-aan, groot en vrolik
- Verskyn klein in die hoek tydens modules
- Animeer (spring op en af) wanneer 'n kind 'n korrekte antwoord gee
- Wys 'n hartseer gesig (maar nog steeds vriendelik) by verkeerde antwoord
- SVG variasies benodig: `slimmetjie_happy.svg`, `slimmetjie_jump.svg`, `slimmetjie_sad.svg`, `slimmetjie_wave.svg`

### Navigasie
- Tuisskerm: groot module-kaarte in 'n roostertjie (2 per ry op iPad)
- Elke kaart: groot ikoon + module naam in Afrikaans + sterre-badge
- "Terug"-knoppie altyd sigbaar — groot, linkerbo
- Geen spyskaart of hamburger-ikoon — te ingewikkeld vir 4-jarige
- Ouerkontrolebalk: bereikbaar via lang-druk op Slimmetjie se logo

### Baba-modus
- Modules gemerk `suitable_for_baby: true` het 'n baba-ikoon-badge (👶)
- Baba-modus-skakelaar op tuisskerm wys slegs baba-modules
- Tydens baba-modules: ALLES op die skerm speel 'n klank as dit aangeraak word

---

## Oudio-Stelsel

### Edge TTS (Outomaties gegenereer)
Gebruik `edge-tts` Python-pakket om alle oudio te genereer:

```python
# tools/generate_audio.py
import edge_tts
import asyncio

# Afrikaanse stem: af-ZA-AdriNeural (vroulik) of af-ZA-WillemNeural (manlik)
# Gebruik af-ZA-AdriNeural as verstek — sagter vir kinders

VOICE = "af-ZA-AdriNeural"
```

**Wat gegenereer word:**
- Elke sleutelwoord in modules.json
- Aanmoedigingfrases
- Module-titel-aankondigings

**Aanmoedigingfrases:**
```
baie_goed.mp3       → "Baie goed!"
uitstekend.mp3      → "Uitstekend!"
probeer_weer.mp3    → "Probeer weer!"
ja_reg.mp3          → "Ja, dis reg!"
slim_kind.mp3       → "Jy's 'n slim kind!"
nog_een.mp3         → "Nog een keer!"
klaar.mp3           → "Klaar gedoen!"
welkom.mp3          → "Welkom by Slimmetjie!"
```

### Oudio-speellogika
- **Tik op enige item → speel naam-oudio onmiddellik**
- Geen vertraging nie — `AudioContext` voorgelaai by app-begin
- Speelvolume: 80% verstek
- Korrekte antwoord: naam-oudio + `baie_goed.mp3` + Slimmetjie spring-animasie
- Verkeerde antwoord: `probeer_weer.mp3` + sagte visuele skud-animasie

---

## Module-Aktiwiteitsipes

Elke `app_activity_type` in die JSON word soos volg geïmplementeer:

### `tap-and-name`
Groot prent op die skerm (SVG karton voor, foto agter via knoppie). Tik → klank + naam.
- Navigasie: links/regs swiep of pyltjie-knoppies
- Toepaslik vir: ls-01, ls-09, ls-10, ls-15, math-02

### `tap-and-sound`
Soos tap-and-name maar met EKSTRA klank (dieregeluid / vervoerklank) + naam.
- Twee oudio-grepe: `[item]_sound.mp3` + `[item]_name.mp3`
- Toepaslik vir: ls-06, ls-07, ls-12

### `tap-and-label`
Liggaamskaart. Tik op 'n spesifieke deel → naam + oudio.
- Hotspot-areas op SVG-illustrasie
- Toepaslik vir: ls-02

### `matching-game`
Twee kolomme. Sleep of tik-tik om te pas. 3-4 pare per slag.
- SVG karton-karakters vir Gesin (ls-11) — geen fotos
- Toepaslik vir: ls-03, ls-05, ls-11

### `colour-tap`
Groot kleurblokke. Oudio vra "Watter een is [kleur]?" Kind tik regte blok.
- Begin 2 keuses, verhoog na 4
- Toepaslik vir: ls-04

### `shape-matching` / `shape-sort`
Vorms met sleuwe/skaduwee.
- Toepaslik vir: ls-05, math-04

### `animal-sound-tap`
Primêre baba-module. Groot dier-SVG + foto-knoppie. HELE skerm tikbaar.
- Toepaslik vir: ls-06

### `counting-tap`
Telbare SVG-voorwerpe. Tik → kleurverander + telklank.
- Kwartaal-progressie: 1-5 → 1-10
- Toepaslik vir: math-01

### `number-recognition`
Groot syfer. Oudio sê naam. "Tik op die [getal]" uit 3 keuses.
- Toepaslik vir: math-02

### `comparison-game` / `comparison-visual`
Twee groepe items. "Watter een het meer?" / "Watter een is langer?"
- Toepaslik vir: math-03, math-08

### `position-game`
Dier + voorwerp prentjie. Posisie-vraag via oudio.
- Toepaslik vir: math-06

### `pattern-complete`
Patroon-ry met leë slot. Kind kies volgende item uit 2-3 opsies.
- Toepaslik vir: math-07

### `sort-and-count`
Drag-en-drop sorteer. Tel elke groep daarna.
- Toepaslik vir: math-10

### `sequence-tap` / `sequence-calendar`
Prente in verkeerde volgorde. Sleep/tik om te rangskik.
- Toepaslik vir: ls-13, ls-14, math-09

### `story-listen`
Oudio-storie/rympie + illustrasie. Herhaal-knop.
- Toepaslik vir: hl-01

### `sound-match`
Hoor klank. Tik prente wat begin met daardie klank.
- Toepaslik vir: hl-02

### `vocab-flashcard`
Flitskaart: prent + woord + oudio. Kind tik "Volgende".
- Toepaslik vir: hl-03

### `rhyme-match`
Hoor woord. Kies rymwoord uit 3 prente.
- Toepaslik vir: hl-04

### `interactive-book`
Prenteboek met blaai-animasie. Elke bladsy: prent + sin uitgespreek.
- Toepaslik vir: hl-05

### `picture-describe`
Toneel-prent. Tik item → naam oudio. Vraag-knoppie vir geleidde vrae.
- Toepaslik vir: hl-06

### `alphabet-tap`
Alfabet-rooster. Tik letter → klank + woordprent.
- Toepaslik vir: hl-07

### `sing-along`
Liedjie + geanimeerde ikone. Herhaal-knop.
- Toepaslik vir: hl-08

### `scene-tap`
Visuele toneel. Tik elemente om name te hoor.
- Toepaslik vir: ls-08

---

## SVG Illustrasie-riglyne

Claude Code genereer ALLE SVG-illustrasies self.

**Styl:**
- Plat, eenvoudig, vriendelik
- Vet swart buitelyn (2-3px stroke)
- Helder primêre kleure
- Groot vriendelike oë op alle karakters
- Min besonderhede — 4-jarige moet dit onmiddellik herken
- Dieselfde styl as die toets-leeu wat goedgekeur is

**Gesin SVG-karakters (ls-11 — geen fotos):**
Teken hierdie karakters in 'n warm, diverse SA-styl:
`ma.svg`, `pa.svg`, `ouma.svg`, `oupa.svg`, `baba.svg`, `suster.svg`, `broer.svg`, `tannie.svg`, `oom.svg`

**Grootte:** Alle SVGs op 400x400 viewBox, gesentreer.

---

## Voortgang en Gamifikasie

### Sterre-stelsel
- Elke module-sessie: 1-3 sterre (gebaseer op akkuraatheid)
- Gestoor in `localStorage`
- Tuisskerm wys sterre per module as badge

### Geen-mislukking-beleid
- Nooit "Jy het gefaal" nie
- Na 3 verkeerde pogings: antwoord outomaties gewys + Slimmetjie wys dit
- Altyd positief: "Goed probeer! Kom ons kyk na die volgende een."

### Vordering
- `localStorage` stoor voltooide modules
- Klein groen kol op voltooide module-kaarte
- Alle modules altyd toeganklik — geen slotmeganismes

---

## Ouerkontrolebalk

Bereikbaar via: lang-druk (3 sekondes) op Slimmetjie se logo op tuisskerm.

**Opsies:**
- Getalvlak: 1-5 of 1-10 vir tel-modules
- Volume-aanpassing
- Baba-modus aan/af
- Vordering-oorsig: sterre per module
- "Reset vordering"-knop

---

## Bou-volgorde

### Fase 1 — Fondament
1. Stel projeklêerstruktuur op (GitHub Pages-gereed met `/slimmetjie/` basis-URL)
2. Genereer Slimmetjie springbok-maskot SVGs
3. Bou `index.html` tuisskerm met module-rooster
4. Implementeer PWA manifest + Service Worker
5. Bou globale CSS en navigasie-logika
6. Hardloop `generate_audio.py` om alle oudio te skep

### Fase 2 — Eerste 5 modules (Bewys van konsep)
1. **`ls-06` Diere** (`animal-sound-tap`) — SVG + fotos + dierklanke
2. **`ls-04` Kleure** (`colour-tap`) — eenvoudig, visueel
3. **`math-01` Tel** (`counting-tap`) — kern wiskunde
4. **`ls-02` My Liggaam** (`tap-and-label`) — SVG karakter met hotspots
5. **`hl-08` Liedjies** (`sing-along`) — musiek + animasie

### Fase 3 — Oorblywende 25 modules
- Alle `tap-and-name` modules (insluitend ls-11 met SVG gesin-karakters)
- Alle `matching-game` modules
- Alle wiskunde-modules
- Alle taal-modules
- Komplekse modules (`sort-and-count`, `interactive-book`)

### Fase 4 — Afwerking
- Voortgang-stelsel (localStorage sterre)
- Ouerkontrolebalk
- GitHub Pages deployment toets
- PWA installasie-toets op iPad (Safari "Voeg by tuisskerm")
- Prestasie-optimering

---

## Inhoud JSON

Die `graad_r_caps_modules.json` lêer is die enigste databron vir alle module-inhoud.

Claude Code moet:
1. JSON lees om module-lys te genereer
2. SVG-illustrasies genereer op grond van `keywords`
3. Oudio-lêers genereer op grond van `keywords` + `afrikaans_label`
4. Aktiwiteite bou op grond van `app_activity_type`
5. Foto-lêers gebruik waar beskikbaar (graceful fallback na SVG as foto ontbreek)

---

## Sleutel Tegniese Vereistes

- **Geen laaivertraging** — alle oudio voorgelaai by module-begin
- **Groot tik-areas** — minimum 80x80px, eerder 120x120px
- **Portret en landskap** — werk in beide oriëntasies op iPad
- **Geen scrolling** — elke skerm pas op die skerm sonder scroll
- **Vinnige terugvoer** — minder as 100ms van tik na visuele respons
- **Geen teks-invoer** — kinders tik slegs, nooit tik nie
- **Kleurblindheid-vriendelik** — gebruik ook vorm/ikoon, nie net kleur
- **GitHub Pages gereed** — alle paaie relatief of via BASE_PATH konstante

---

## Lêers wat aan Claude Code verskaf word

1. **`SLIMMETJIE_SPEC.md`** — hierdie dokument
2. **`graad_r_caps_modules.json`** — CAPS-gegronde inhoudskaart

Claude Code bou alles anders self. Fotos word later deur die gebruiker bygevoeg.

---

## Eerste Opdrag aan Claude Code

```
Bou Slimmetjie — 'n Afrikaanse kinders-leerapp — volgens SLIMMETJIE_SPEC.md en graad_r_caps_modules.json.

Die app word op GitHub Pages gehost. Repo naam: slimmetjie.

Begin met Fase 1 (fondament + Slimmetjie maskot) en Fase 2 (eerste 5 modules).

Gebruik:
- Vanilla HTML/CSS/JS (geen raamwerk)
- Edge TTS Python-skrip vir oudio-generering (af-ZA-AdriNeural stem)
- Self-gegenereerde SVG-illustrasies (plat karton-styl, groot vriendelike oë)
- PWA Service Worker vir offline gebruik
- GitHub Pages-korrekte basis-URL hantering

Rapporteer wat jy gebou het na elke fase.
```
