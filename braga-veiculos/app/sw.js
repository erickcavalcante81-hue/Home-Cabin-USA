/* Braga Veículos — Service Worker (PWA offline-first)
   Faz cache do "app shell" (HTML, ícones, scripts locais) para o app abrir
   instantaneamente e funcionar sem internet. Requisições de outras origens
   (Firebase/Firestore, gstatic) passam direto pela rede — não são cacheadas. */
const CACHE = 'braga-v1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './firebase-config.js',
  './cloud-sync.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Só tratamos recursos da própria origem; Firebase/CDN passam direto pela rede.
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
