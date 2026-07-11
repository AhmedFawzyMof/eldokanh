import { getMessaging, onRegistered, register } from "firebase/messaging";
import { getMessagingInstance } from "@/fcm/firebase";

const VAPID_PUBLIC_KEY =
  "BOtZw0iQuGdvm3V6msLqr3kENkQutVlJMVIFofW_zp5muS1BPLqO35zEUSo81osXFizkkui0mvjRRPu7Dr4zcT8";

export async function setupFCMListener(
  sendRegistrationToServer: (registrationId: string) => void,
) {
  const messaging = await getMessagingInstance();
  if (!messaging) return;
  onRegistered(messaging, (installationId) => {
    console.log("Registered installation ID:", installationId);
    sendRegistrationToServer(installationId);
  });
}
export async function triggerFCMRegistration() {
  const messaging = await getMessagingInstance();
  if (!messaging) return;
  try {
    await register(messaging, { vapidKey: VAPID_PUBLIC_KEY });
    console.log("FCM Registration setup initiated successfully.");
  } catch (err) {
    console.error("An error occurred while registering", err);
  }
}
