if ("serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });

  // notification permission
  console.info("Notification.permission", Notification.permission);
  if (Notification.permission === "default") {
    Notification.requestPermission(function(status) {
      console.log("Notification permission status:", status);
    });
  }

  // subscribe Push Notification
  //   function subscribeUser() {
  //     if ("serviceWorker" in navigator) {
  //       navigator.serviceWorker.ready.then(function(reg) {
  //         reg.pushManager
  //           .subscribe({
  //             userVisibleOnly: true
  //           })
  //           .then(function(sub) {
  //             console.log("Endpoint URL: ", sub.endpoint);
  //           })
  //           .catch(function(e) {
  //             if (Notification.permission === "denied") {
  //               console.warn("Permission for notifications was denied");
  //             } else {
  //               console.error("Unable to subscribe to push", e);
  //             }
  //           });
  //       });
  //     }
  //   }
}
