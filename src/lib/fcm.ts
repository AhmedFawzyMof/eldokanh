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

// Topic that every website visitor's browser subscribes to.
// Messages broadcast to this topic reach all visitors that opted in.
// No visitor tokens are ever stored in the DB.
export const VISITORS_TOPIC = "visitors";

export async function subscribeTokenToTopic(fid: string, topic: string) {
  try {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    const response = await fetch(
      "https://iid.googleapis.com/iid/v1:batchAdd",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: `/topics/${topic}`,
          registration_tokens: [fid],
        }),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      console.error("FCM Subscribe Error Response:", result);
      const firstError = result.results?.[0]?.error;
      return {
        success: false,
        error: firstError || result.error?.message || "FCM subscribe failed",
      };
    }

    const firstResult = result.results?.[0];
    if (firstResult?.error) {
      console.error("FCM Subscribe Token Error:", firstResult.error);
      return { success: false, error: firstResult.error };
    }

    console.log(`FCM Token subscribed to topic "${topic}".`);
    return { success: true };
  } catch (error) {
    console.error("FCM Subscribe Exception:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

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

export async function sendFCMToTopic(
  topic: string,
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
        topic,
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
      console.error("FCM HTTP v1 Topic Error Response:", result);
      return {
        success: false,
        error: result.error?.message || "FCM send failed",
      };
    }

    console.log(`FCM Topic message sent to "${topic}". Message ID: ${result.name}`);
    return { success: true, messageId: result.name };
  } catch (error) {
    console.error("FCM Topic Send Exception:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
