self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});