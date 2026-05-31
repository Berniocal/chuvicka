
const CACHE_NAME = "chuvicka-pwa-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
  "./keepalive.mp4",
  "./rain-real.mp3",
  "./sea-real.mp3",
  "./waterfall-real.mp3",
  "./wind-real.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(response => {
        const copy = response.clone();
        if(req.method === "GET" && new URL(req.url).origin === location.origin){
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return response;
      });
    })
  );
});
