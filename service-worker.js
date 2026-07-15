/* ================================================================
   RVS PEINTURE — Service Worker
   Met en cache l'application pour un fonctionnement 100% hors-ligne
   une fois installée sur l'écran d'accueil.
   Les données des demandes ne passent jamais par ce fichier :
   elles restent uniquement dans IndexedDB, sur l'appareil.
================================================================ */

const CACHE_NAME = "rvs-chantier-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Stratégie : réseau si disponible, sinon cache (et repli sur index.html)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
