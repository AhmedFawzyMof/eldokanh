import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "@/fcm/firebase";

const VAPID_PUBLIC_KEY =
  "BOtZw0iQuGdvm3V6msLqr3kENkQutVlJMVIFofW_zp5muS1BPLqO35zEUSo81osXFizkkui0mvjRRPu7Dr4zcT8";

/**
 * Gets the FCM registration token and invokes the callback with it.
 *
 * IMPORTANT: onRegistered() returns an Installation ID (FID) — a device
 * identifier that cannot be used as a push message target.
 * getToken() returns the actual FCM registration token that must be stored
 * and used in message.token when calling the FCM HTTP v1 send API.
 */
export async function getFCMToken(
  onToken: (token: string) => void,
): Promise<void> {
  const messaging = await getMessagingInstance();
  if (!messaging) {
    console.warn("FCM: messaging not supported in this environment.");
    return;
  }

  try {
    const token = await getToken(messaging, { vapidKey: VAPID_PUBLIC_KEY });
    if (token) {
      console.log("FCM: registration token obtained.");
      onToken(token);
    } else {
      console.warn("FCM: no token received — notification permission may be denied.");
    }
  } catch (err) {
    console.error("FCM: error obtaining registration token:", err);
  }
}
