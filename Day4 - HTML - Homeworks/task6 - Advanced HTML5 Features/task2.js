// Define the cache name and files to cache
const CACHE_NAME = 'offline-cache-v1';
const CACHE_FILES = [
    '/',
    '/index.html',
    '/styles.css'  // Add more resources like CSS or images if needed
];

// Install the service worker and cache the files
self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching files.');
            return cache.addAll(CACHE_FILES);
        })
    );
});

// Activate the service worker and remove old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Intercept network requests and serve cached content if offline
self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            // Fallback if the request is not cached
            return caches.match('/index.html');
        })
    );
});
