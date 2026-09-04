const CACHE_NAME = 'ah-comensales-v1';
const ASSETS = [
'./',
'./index.html',
'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(ASSETS);
})
);
self.skipWaiting();
});

self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(keys => {
return Promise.all(
keys.map(key => {
if (key !== CACHE_NAME) {
return caches.delete(key);
}
})
);
})
);
self.clients.claim();
});

self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request).then(cachedResponse => {
if (cachedResponse) {
return cachedResponse;
}
return fetch(event.request);
})
);
});