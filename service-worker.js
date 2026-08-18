/* Sous réserve — service worker
   Page : réseau d'abord, cache en secours (l'app se met à jour toute seule).
   Icônes et manifeste : cache d'abord (ils ne changent jamais).
   Pour forcer un renouvellement complet du cache, incrémenter CACHE. */

const CACHE = 'sous-reserve-v1';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(
        noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // La page : réseau d'abord, pour ne pas rester coincée sur une vieille version.
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(req)
        .then((rep) => {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(req, copie));
          return rep;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Le reste : cache d'abord.
  e.respondWith(
    caches.match(req).then((r) => r || fetch(req).then((rep) => {
      const copie = rep.clone();
      caches.open(CACHE).then((c) => c.put(req, copie));
      return rep;
    }))
  );
});
