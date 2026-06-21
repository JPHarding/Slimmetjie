#!/usr/bin/env python3
"""Slimmetjie — genereer alle oudio met Edge TTS (af-ZA-AdriNeural).

Eenmalig hardloop:   python tools/generate_audio.py
Forseer her-genereer: python tools/generate_audio.py --force

Skryf MP3s na ../audio/ (plat) plus 'n audio/index.json met die lys sleutels wat
bestaan. Die app speel daardie MP3s; waar 'n sleutel ontbreek val dit terug op die
blaaier se Web Speech API — netwerk hier is dus opsioneel, die app práát altyd.

Alles word data-gedrewe afgelei uit graad_r_caps_modules.json + data/content.json,
so brei nuwe modules vanself uit sodra hul inhoud bygevoeg word.
"""

import asyncio
import json
import re
import sys
from pathlib import Path

# Windows-konsole gebruik soms cp1252 — forseer UTF-8 sodat Afrikaanse teks druk.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    import edge_tts
except ImportError:
    sys.exit("edge-tts ontbreek. Installeer met:  pip install edge-tts")

VOICE = "af-ZA-AdriNeural"          # sagter vroulike stem vir kinders
ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "audio"
FORCE = "--force" in sys.argv or "-f" in sys.argv

# Aanmoedigingfrases — MOET ooreenstem met PHRASES in config.js
PHRASES = {
    "baie_goed": "Baie goed!",
    "uitstekend": "Uitstekend!",
    "probeer_weer": "Probeer weer!",
    "ja_reg": "Ja, dis reg!",
    "slim_kind": "Jy's 'n slim kind!",
    "nog_een": "Nog een keer!",
    "klaar": "Klaar gedoen!",
    "welkom": "Welkom by Slimmetjie!",
}

_ACCENTS = str.maketrans({
    "ë": "e", "é": "e", "ê": "e", "è": "e", "ï": "i", "î": "i",
    "ô": "o", "ö": "o", "ó": "o", "û": "u", "ü": "u", "ú": "u",
    "á": "a", "à": "a", "â": "a", "ä": "a", "ç": "c", "ñ": "n",
})


def slug(key: str) -> str:
    """ASCII-veilige lêernaam. MOET ooreenstem met slug() in audio.js."""
    s = str(key).lower().translate(_ACCENTS)
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")


def collect() -> dict:
    """Bou {ge-slugde sleutel: teks} vir alles wat gegenereer moet word."""
    jobs = dict(PHRASES)

    # Module-titels (alle modules — die tuiskaarte kondig dit aan)
    caps = json.loads((ROOT / "graad_r_caps_modules.json").read_text(encoding="utf-8"))
    for m in caps.get("modules", []):
        jobs[f"{m['id']}_titel"] = m["afrikaans_label"]

    # Module-inhoud (Fase 2; verdere modules kom vanself by)
    content = json.loads((ROOT / "data" / "content.json").read_text(encoding="utf-8"))

    for item in content.get("ls-06", {}).get("items", []):       # diere
        jobs[item["key"]] = item["afrikaans"]
        if item.get("klankKey"):
            jobs[item["klankKey"]] = item.get("klank", item["afrikaans"])

    for item in content.get("ls-04", {}).get("items", []):       # kleure
        jobs[item["key"]] = item["afrikaans"]

    for n, word in content.get("math-01", {}).get("numbers", {}).items():   # tel
        jobs[f"getal_{n}"] = word

    for p in content.get("ls-02", {}).get("parts", []):          # liggaam
        jobs[p["part"]] = p["afrikaans"]

    for song in content.get("hl-08", {}).get("songs", []):       # liedjies
        for line in song.get("lines", []):
            jobs[line["key"]] = line["text"]

    return {slug(k): v for k, v in jobs.items()}


async def synth(name: str, text: str) -> bool:
    path = AUDIO_DIR / f"{name}.mp3"
    if path.exists() and not FORCE:
        return True
    try:
        await edge_tts.Communicate(text, VOICE).save(str(path))
        print(f"  [ok] {name}.mp3  -> {text}")
        return True
    except Exception as e:                                       # geen netwerk, ens.
        print(f"  [x]  {name}.mp3  ({e})")
        return False


async def main():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    jobs = collect()
    print(f"Genereer {len(jobs)} oudio-grepe met stem {VOICE} ...")

    ok = 0
    for name, text in jobs.items():
        if await synth(name, text):
            ok += 1
        await asyncio.sleep(0.15)                                # vermy tempo-beperking

    # index.json = alle MP3s wat nou werklik bestaan (ge-slugde stamname)
    existing = sorted(p.stem for p in AUDIO_DIR.glob("*.mp3"))
    (AUDIO_DIR / "index.json").write_text(
        json.dumps(existing, ensure_ascii=False), encoding="utf-8"
    )

    print(f"\nKlaar: {ok}/{len(jobs)} verwerk. {len(existing)} MP3s totaal.")
    print(f"audio/index.json geskryf met {len(existing)} sleutels.")
    if ok < len(jobs):
        print("Let wel: ontbrekende grepe gebruik die Web Speech terugval tydens looptyd.")


if __name__ == "__main__":
    asyncio.run(main())
