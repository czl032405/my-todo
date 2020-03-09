importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js");

workbox.core.clientsClaim();

workbox.core.skipWaiting();

workbox.routing.registerRoute(
  /\/[^\.]*\.[^\.]*\.(?:js|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "static",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/[^\.]*\.(?:js|css)$/,
  new workbox.strategies.NetworkFirst({
    cacheName: "static",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/.*\.(?:png|jpg|jpeg|svg|gif|ico)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "static",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /^https:\/\/(fonts.gstatic.com|fonts.googleapis.com|cdn.jsdelivr.net)/,
  new workbox.strategies.CacheFirst({
    cacheName: "external",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/[^\.]*(?!\.)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "page",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60
      })
    ]
  })
);
