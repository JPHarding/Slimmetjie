// Slimmetjie — Service Worker (offline-first, self-scoped)
// Scope kom outomaties van die SW se eie ligging, so dit werk by "/" en "/slimmetjie/".

// Verhoog hierdie weergawe by elke ontplooiing sodat kliënte vars lêers kry.
const CACHE = 'slimmetjie-v5';

// Kern-app — moet bestaan; cache by installasie.
const CORE = [
  './',
  'index.html',
  '404.html',
  'style.css',
  'manifest.json',
  'config.js',
  'app.js',
  'audio.js',
  'progress.js',
  'mascot.js',
  'feedback.js',
  'graad_r_caps_modules.json',
  'data/content.json',
  'assets/svg.js',
  'assets/icons/icon.svg',
  'assets/mascot/slimmetjie_happy.svg',
  'assets/mascot/slimmetjie_jump.svg',
  'assets/mascot/slimmetjie_sad.svg',
  'assets/mascot/slimmetjie_wave.svg',
  'modules/animal-sound-tap.js',
  'modules/colour-tap.js',
  'modules/counting-tap.js',
  'modules/tap-and-label.js',
  'modules/sing-along.js',
  // Fase 2 diere-fotos (bestaan reeds)
  'Images/hond.jpg', 'Images/kat.jpg', 'Images/koei.jpg', 'Images/perd.jpg',
  'Images/skaap.jpg', 'Images/hoender.jpg', 'Images/olifant.jpg', 'Images/leeu.jpg',
  'Images/slang.jpg', 'Images/aap.jpg', 'Images/seekoei.jpg', 'Images/sebra.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // individueel sodat een ontbrekende lêer nie die hele installasie breek nie
    await Promise.allSettled(CORE.map((u) => cache.add(u)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Cache-first; runtime-cache nuwe suksesvolle GETs (oudio MP3s, fotos, ikone).
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const res = await fetch(req);
      if (res && res.ok && (res.type === 'basic' || res.type === 'default')) {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(req, clone));
      }
      return res;
    } catch (err) {
      // Offline + nie in cache nie: vir navigasie gee die app-skil terug.
      if (req.mode === 'navigate') {
        return (await caches.match('index.html')) || (await caches.match('./'));
      }
      return Response.error();
    }
  })());
});
