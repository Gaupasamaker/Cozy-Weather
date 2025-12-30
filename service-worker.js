const CACHE_NAME = 'cozy-weather-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use { cache: 'reload' } to ensure we get fresh versions from server
      return cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'reload' })));
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches immediately
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

// Fetch event: Network first strategy is safer for SPAs on Vercel to avoid stale content
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like API calls)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // API calls should always go to network
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request).then((response) => {
            if (response) return response;
            // If offline and request is navigation, return index.html
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        });
      })
  );
});