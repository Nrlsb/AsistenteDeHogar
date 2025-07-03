const CACHE_NAME = 'asistente-hogar-cache-v1';
// Lista de archivos para cachear inicialmente.
// Incluimos la raíz y el index.html para que la app cargue offline.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Evento de instalación: se abre el caché y se añaden los archivos base.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento fetch: intercepta las peticiones de red.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Intenta encontrar la respuesta en el caché.
    caches.match(event.request)
      .then(response => {
        // Si se encuentra en caché, la devuelve.
        if (response) {
          return response;
        }
        // Si no, hace la petición a la red.
        return fetch(event.request);
      }
    )
  );
});
