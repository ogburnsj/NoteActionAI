const CACHE_NAME = "noteactionai-cache-v1";
const OFFLINE_URL = "/index.html";
const assetsToCache = [OFFLINE_URL, "/manifest.json", "/"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assetsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match(OFFLINE_URL));
    })
  );
});
