// Este service worker está preconfigurado para funcionar con Create React App.
// No necesitas modificar este archivo.

// eslint-disable-next-line no-restricted-globals
const ignored = self.__WB_MANIFEST;

// Lógica básica para un service worker.
// Se enfocará en el precaching de los assets generados por el build.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  // Podríamos añadir lógica de precaching aquí si fuera necesario,
  // pero Workbox inyectado por CRA ya lo maneja.
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
  // Limpia cachés antiguas si es necesario.
});

self.addEventListener('fetch', (event) => {
  // No interceptamos las peticiones fetch aquí,
  // dejamos que la estrategia de red por defecto de CRA funcione.
  // Esto es más simple y evita problemas con las llamadas a la API.
});
