console.info("service-worker");

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js");

workbox.clientsClaim();

workbox.skipWaiting();

// workbox.setConfig({ debug: true });

workbox.routing.registerRoute(
  /\/[^\.]*\.[^\.]*\.(?:js|css)$/,
  workbox.strategies.cacheFirst({
    cacheName: "static",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 365 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/[^\.]*\.(?:js|css)$/,
  workbox.strategies.networkFirst({
    cacheName: "static",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/.*\.(?:png|jpg|jpeg|svg|gif|ico)$/,
  workbox.strategies.cacheFirst({
    cacheName: "static",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 365 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /^https:\/\/(fonts.gstatic.com|fonts.googleapis.com|cdn.jsdelivr.net)/,
  workbox.strategies.cacheFirst({
    cacheName: "external",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 365 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/[^\.]*(?!\.)$/,
  workbox.strategies.cacheFirst({
    cacheName: "page",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60
      })
    ]
  })
);
