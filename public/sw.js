/* eslint-disable no-restricted-globals */

// Cache name
const CACHE_NAME = 'agri-price-helper-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Fetch event - enable offline functionality
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/favicon.ico',
    data: data.url,
    actions: data.actions || [],
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action) {
    // Handle notification action clicks
    const action = event.action;
    const actionUrl = event.notification.data + '?action=' + action;
    event.waitUntil(clients.openWindow(actionUrl));
  } else {
    // Handle notification clicks
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          const hadWindowToFocus = clientList.some((client) => {
            if (client.url === event.notification.data) {
              return client.focus();
            }
            return false;
          });

          if (!hadWindowToFocus) {
            clients.openWindow(event.notification.data)
              .then((windowClient) => (windowClient ? windowClient.focus() : null));
          }
        })
    );
  }
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-prices') {
    event.waitUntil(syncPrices());
  }
});

async function syncPrices() {
  try {
    const offlinePrices = await localforage.getItem('offline_prices');
    if (!offlinePrices || !offlinePrices.length) return;

    const responses = await Promise.all(
      offlinePrices.map(price => 
        fetch('/api/prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(price)
        })
      )
    );

    if (responses.every(r => r.ok)) {
      await localforage.removeItem('offline_prices');
      self.registration.showNotification('Sync Complete', {
        body: 'Your offline price submissions have been synced',
        icon: '/logo192.png'
      });
    }
  } catch (error) {
    console.error('Error syncing prices:', error);
  }
}
