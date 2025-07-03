/* eslint-disable no-restricted-globals */

// Este es el service worker con Workbox.
// Workbox es una librería de Google que simplifica el trabajo con service workers y cache.

// Importamos las librerías de Workbox desde la CDN de Google.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Este código se ejecuta en cuanto el service worker se activa.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Precaching: Workbox tomará la lista de archivos generada por el proceso de build
// y los guardará en caché. Esto incluye tu HTML, JS, CSS, etc.
// `self.__WB_MANIFEST` es una variable especial que el build de Workbox inyectará.
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// --- Estrategias de Caché para Rutas en Tiempo de Ejecución ---

// 1. Estrategia para las páginas de la App (Navegación)
// Usa una estrategia NetworkFirst: intenta ir a la red, si falla, usa el caché.
// Esto asegura que el usuario siempre vea la última versión si está online.
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages-cache',
  })
);

// 2. Estrategia para las llamadas a la API
// NetworkFirst también es ideal aquí. Queremos datos frescos, pero si el usuario
// está offline, le mostramos lo último que vimos.
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50, // Guardar hasta 50 respuestas de la API
        maxAgeSeconds: 5 * 60, // 5 Minutos
      }),
    ],
  })
);

// 3. Estrategia para Assets (CSS, JS, Workers)
// StaleWhileRevalidate: Sirve desde el caché para que sea súper rápido,
// y en segundo plano, busca una versión nueva en la red para la próxima vez.
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'asset-cache',
  })
);

// 4. Estrategia para Imágenes
// CacheFirst: Una vez que tenemos la imagen, la servimos siempre desde el caché.
// No suelen cambiar a menudo.
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
      }),
    ],
  })
);
