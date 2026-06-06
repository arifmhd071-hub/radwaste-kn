// RadWaste KN — Service Worker
// Versi cache: update string ini setiap deploy baru
const CACHE_NAME = 'radwaste-kn-v1.0.0';

// Aset yang di-cache saat install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // CDN fonts & chart (cache saat runtime jika tersedia)
];

// CDN resources yang ikut di-cache saat runtime
const RUNTIME_CACHE_PATTERNS = [
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /cdnjs\.cloudflare\.com\/ajax\/libs\/Chart\.js/,
  /www\.gstatic\.com\/firebasejs/,
];

// ── INSTALL ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH STRATEGY ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Firestore / Firebase Auth — selalu network-first, jangan cache
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // CDN statics — cache-first
  const isRuntime = RUNTIME_CACHE_PATTERNS.some(p => p.test(request.url));
  if (isRuntime) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        }).catch(() => cached || new Response('', { status: 503 }));
      })
    );
    return;
  }

  // App shell (HTML, JS, CSS, icons) — network-first dengan fallback cache
  if (
    request.destination === 'document' ||
    request.destination === 'script'   ||
    request.destination === 'style'    ||
    request.destination === 'image'
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ── BACKGROUND SYNC (opsional, untuk pending writes) ──
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-entries') {
    event.waitUntil(syncPendingEntries());
  }
});

async function syncPendingEntries() {
  // Notifikasi ke semua client untuk mencoba sync ulang
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'SYNC_PENDING' }));
}

// ── PUSH NOTIFICATIONS (siap pakai, aktifkan dari app) ──
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'Ada notifikasi dari RadWaste KN',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open',    title: 'Buka App' },
      { action: 'dismiss', title: 'Tutup'    }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'RadWaste KN', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
