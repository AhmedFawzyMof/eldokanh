import { GoogleAuth } from "google-auth-library";
import path from "path";

const keyFilePath = path.join(
  process.cwd(),
  "src/config/eldokanh-firebase-adminsdk-fbsvc-c50f7769b9.json",
);

const auth = new GoogleAuth({
  keyFile: keyFilePath,
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
});

export async function sendFCMMessage(
  targetFid: string,
  title: string,
  body: string,
  link?: string
) {
  try {
    const projectId = "eldokanh";
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    const fcmPayload = {
      message: {
        token: targetFid,
        notification: {
          title,
          body,
        },
        webpush: {
          fcmOptions: {
            link: link || "https://eldokanh.firebaseapp.com/dashboard",
          },
        },
      },
    };

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fcmPayload),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      console.error("FCM HTTP v1 Error Response:", result);
      return {
        success: false,
        error: result.error?.message || "FCM send failed",
      };
    }
    
    console.log(`FCM Message sent successfully to ${targetFid.substring(0, 10)}... Message ID: ${result.name}`);
    return { success: true, messageId: result.name };
  } catch (error) {
    console.error("FCM Send Exception:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
