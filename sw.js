
const CACHE_NAME = 'chrono-cyber-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
<<<<<<< HEAD
  '/dist/output.css',
  '/vendor/topojson-client.min.js',
  '/vendor/fontawesome/css/all.min.css',
  '/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  '/vendor/fontawesome/webfonts/fa-solid-900.woff',
  '/fonts/Orbitron-Regular.woff2',
  '/fonts/SpaceGrotesk-Regular.woff2'
];


=======
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/topojson-client@3',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Grotesk:wght@300;700&display=swap'
];

>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
