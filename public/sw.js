
const CACHE_NAME = 'agri-price-helper-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', (event) => {
  // Don't try to handle non-GET requests or API calls
  if (event.request.method !== 'GET' || 
      event.request.url.includes('/api/') || 
      event.request.url.includes('open-meteo.com') ||
      event.request.url.includes('kilimo.go.ke')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Don't cache API requests with query parameters
                if (!event.request.url.includes('?')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // If fetch fails (offline), try to serve cached versions of pages
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // For images and other resources
            return caches.match('/placeholder.svg');
          });
      })
  );
});

// Update service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle offline synchronization
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-market-prices') {
    event.waitUntil(syncMarketPrices());
  }
});

// Function to sync market prices when back online
async function syncMarketPrices() {
  try {
    const offlinePricesStr = localStorage.getItem('offline_prices');
    if (!offlinePricesStr) return;
    
    const offlinePrices = JSON.parse(offlinePricesStr);
    if (offlinePrices.length === 0) return;
    
    console.log('Service worker attempting to sync', offlinePrices.length, 'offline submissions');
    
    // Notify the main thread to attempt sync
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_OFFLINE_DATA',
          payload: { count: offlinePrices.length }
        });
      });
    });
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
}
