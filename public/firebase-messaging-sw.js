importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCMmUc5V0curZyxonDt5wAHEiW6bgbYvB8",
  authDomain: "eldokanh.firebaseapp.com",
  projectId: "eldokanh",
  storageBucket: "eldokanh.firebasestorage.app",
  messagingSenderId: "546999024923",
  appId: "1:546999024923:web:d3c9c618f2b48e69a1e7be",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const title = payload.notification?.title || "New Admin Alert";
  const body = payload.notification?.body || "You have a new update.";
  const link = payload.fcmOptions?.link || "https://eldokanh.com";

  self.registration
    .showNotification(title, {
      body,
      icon: "/icon-192x192.png",
      data: { link },
    })
    .catch((err) => {
      console.error("[firebase-messaging-sw.js] showNotification failed:", err);
    });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.link || "https://eldokanh.com";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(url) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    }),
  );
});
