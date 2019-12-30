console.info("service-worker");

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js");

workbox.clientsClaim();

workbox.skipWaiting();

// workbox.setConfig({ debug: true });

workbox.routing.registerRoute(/\/[^\.]*\.[^\.]*\.(?:js|css)$/, workbox.strategies.cacheFirst({ cacheName: "static" }));

workbox.routing.registerRoute(/\/[^\.]*\.(?:js|css)$/, workbox.strategies.networkFirst({ cacheName: "static" }));

workbox.routing.registerRoute(/\/.*\.(?:png|jpg|jpeg|svg|gif|ico)$/, workbox.strategies.cacheFirst({ cacheName: "static" }));

workbox.routing.registerRoute(/\/api\/.*$/, workbox.strategies.networkFirst({ cacheName: "api" }));

workbox.routing.registerRoute(/^https:\/\/(fonts.gstatic.com|fonts.googleapis.com|cdn.jsdelivr.net)/, workbox.strategies.cacheFirst({ cacheName: "external" }));

workbox.routing.registerRoute(/\/[^\.]*(?!\.)$/, workbox.strategies.networkFirst({ cacheName: "page" }));
