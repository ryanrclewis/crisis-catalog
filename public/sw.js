const CACHE_VERSION = 'crisis-catalog-v1';
const CACHE_NAME = `${CACHE_VERSION}`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Graceful degradation if assets aren't available yet
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache GET requests for same-origin
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // Skip HTML pages (to prevent stale caching issues)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request) || new Response('Offline - page not cached');
      })
    );
    return;
  }

  // For JSON, CSS, JS, and images: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });

      return cached || fetchPromise;
    }).catch(() => {
      return cached || new Response('Offline');
    })
  );
});
