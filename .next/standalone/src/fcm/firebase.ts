import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCMmUc5V0curZyxonDt5wAHEiW6bgbYvB8",
  authDomain: "eldokanh.firebaseapp.com",
  projectId: "eldokanh",
  storageBucket: "eldokanh.firebasestorage.app",
  messagingSenderId: "546999024923",
  appId: "1:546999024923:web:d3c9c618f2b48e69a1e7be",
  measurementId: "G-87V1EL3CQH",
};

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export async function getMessagingInstance() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!(await isSupported())) {
    return null;
  }

  return getMessaging(app);
}
