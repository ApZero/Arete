// Bump this version string on every deploy to force clients to refresh cached assets.
const CACHE_VERSION = 'arete-v9';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './quotes.xlsx',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Network-first for the Excel file so a fresh commit is picked up when online.
  if (request.url.endsWith('quotes.xlsx')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for everything else.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
