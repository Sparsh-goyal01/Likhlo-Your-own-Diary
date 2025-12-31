// ========================================
// SERVICE WORKER - Progressive Web App
// ========================================
// This service worker enables offline functionality and improves performance
// by caching static assets and handling network requests strategically.

// Cache version - increment this when you update files to force cache refresh
const CACHE_VERSION = 'v2.0.1';
const CACHE_NAME = `likhlo-cache-${CACHE_VERSION}`;

// Static assets to cache during service worker installation
// These files will be available offline after first visit
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/signup.html',
  '/reset.html',
  '/dashboard.html',
  '/css/style.css',
  '/js/auth.js',
  '/js/firebase-config.js',
  '/js/notes.js',
  '/js/utils.js',
  '/public/config.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json'
];

// Firebase and external resources that should NOT be cached
// These need to always fetch fresh data from the network
const NETWORK_ONLY_PATTERNS = [
  'firebasestorage.googleapis.com',
  'firebaseapp.com',
  'googleapis.com',
  'gstatic.com',
  'identitytoolkit.googleapis.com'
];

// ========================================
// INSTALL EVENT
// ========================================
// Triggered when the service worker is first installed
// Pre-caches all static assets for offline use
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing service worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        // Cache all static files
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Activate immediately without waiting for page reload
        console.log('[Service Worker] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
});

// ========================================
// ACTIVATE EVENT
// ========================================
// Triggered when the service worker becomes active
// Cleans up old caches from previous versions
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating service worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Delete old caches that don't match current version
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages immediately
        console.log('[Service Worker] Service worker activated');
        return self.clients.claim();
      })
  );
});

// ========================================
// FETCH EVENT
// ========================================
// Intercepts all network requests
// Implements cache-first strategy for static assets
// Network-only strategy for Firebase and API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests that aren't from our domain
  // This includes Firebase and Google services
  const isNetworkOnly = NETWORK_ONLY_PATTERNS.some(pattern => 
    url.href.includes(pattern)
  );

  // Network-only for Firebase, authentication, and API calls
  if (isNetworkOnly || request.method !== 'GET') {
    event.respondWith(
      fetch(request)
        .catch((error) => {
          console.error('[Service Worker] Network request failed:', error);
          // Return error response instead of failing silently
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  // Try cache first, fallback to network if not found
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Found in cache - return immediately
          console.log('[Service Worker] Serving from cache:', request.url);
          return cachedResponse;
        }

        // Not in cache - fetch from network
        console.log('[Service Worker] Fetching from network:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            // Clone the response before caching
            // (Response can only be consumed once)
            const responseToCache = networkResponse.clone();

            // Add successful response to cache for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // If offline and no cache, return offline page
            // You can create a custom offline.html page
            return new Response('You are offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// ========================================
// MESSAGE EVENT
// ========================================
// Handle messages from the main application
// Allows manual cache updates and skip waiting
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // Force service worker to activate immediately
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    // Manually cache specific URLs from the application
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// ========================================
// SYNC EVENT (Optional - Background Sync)
// ========================================
// Handles background sync for offline actions
// Uncomment if you want to implement offline note creation
/*
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-notes') {
    event.waitUntil(
      // Sync offline notes to Firebase when back online
      syncOfflineNotes()
    );
  }
});

async function syncOfflineNotes() {
  // Implementation for syncing offline notes
  // This would read from IndexedDB and sync to Firebase
  console.log('[Service Worker] Syncing offline notes...');
}
*/

console.log('[Service Worker] Service worker loaded');
