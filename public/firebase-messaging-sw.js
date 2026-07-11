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

  const notificationTitle = payload.notification.title || "New Admin Alert";
  const notificationOptions = {
    body: payload.notification.body || "You have a new update.",
    icon: "/icon-192x192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
