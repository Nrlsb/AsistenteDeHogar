// Este es el archivo de configuración estándar de Create React App para registrar un Service Worker.
// Permite que la aplicación funcione sin conexión y se cargue más rápido.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] es la dirección IPv6 de localhost.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 se considera localhost para IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // El constructor de URL está disponible en todos los navegadores que soportan SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Nuestro service worker no funcionará si PUBLIC_URL está en un origen diferente
      // de donde se sirve nuestra página. Esto puede suceder si se utiliza una CDN para
      // servir los assets; consulta https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Esto se está ejecutando en localhost. Verifiquemos si todavía existe un service worker o no.
        checkValidServiceWorker(swUrl, config);

        // Añade algunos registros adicionales a localhost, apuntando a los desarrolladores a la
        // documentación de service worker/PWA.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // No es localhost. Simplemente registra el service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // En este punto, el contenido precached actualizado ha sido obtenido,
              // pero el service worker anterior seguirá sirviendo el contenido más antiguo
              // hasta que todas las pestañas del cliente se cierren.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Ejecutar callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // En este punto, todo ha sido precached.
              // Es el momento perfecto para mostrar un
              // mensaje de "El contenido está cacheado para uso sin conexión.".
              console.log('Content is cached for offline use.');

              // Ejecutar callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Comprueba si se puede encontrar el service worker. Si no se puede, recarga la página.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Asegúrate de que el service worker exista y de que realmente estamos obteniendo un archivo JS.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No se encontró el service worker. Probablemente sea una aplicación diferente. Recarga la página.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker encontrado. Procede con normalidad.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
