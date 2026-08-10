import { GoogleAuth } from "google-auth-library";
import fs from "fs";
import path from "path";

const FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";

/**
 * Resolves Firebase service-account credentials from, in order:
 *  1. FIREBASE_SERVICE_ACCOUNT      – env var containing the raw JSON
 *  2. FIREBASE_SERVICE_ACCOUNT_PATH – env var pointing to a JSON file
 *  3. GOOGLE_APPLICATION_CREDENTIALS– env var pointing to a JSON file
 *  4. any *.json file in src/config/
 * Throws a clear error if none is found so failures are visible.
 */
export function getFirebaseAuth(): GoogleAuth {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (inline) {
    const parsed = JSON.parse(inline);
    return new GoogleAuth({ credentials: parsed, scopes: [FCM_SCOPE] });
  }

  const explicitPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (explicitPath && fs.existsSync(explicitPath)) {
    return new GoogleAuth({ keyFile: explicitPath, scopes: [FCM_SCOPE] });
  }

  const configDir = path.join(process.cwd(), "src/config");
  if (fs.existsSync(configDir)) {
    const keyFile = fs
      .readdirSync(configDir)
      .find((f) => f.endsWith(".json"));
    if (keyFile) {
      return new GoogleAuth({
        keyFile: path.join(configDir, keyFile),
        scopes: [FCM_SCOPE],
      });
    }
  }

  throw new Error(
    "Firebase service-account key not found. Add your service account JSON to src/config/ (e.g. src/config/service-account-file.json) or set the FIREBASE_SERVICE_ACCOUNT env var.",
  );
}

/**
 * Validates that FCM credentials are configured. Returns error string or null.
 */
export function checkFCMConfig(): string | null {
  try {
    getFirebaseAuth();
    return null;
  } catch (error) {
    return (error as Error).message;
  }
}

// Topic that every website visitor's browser subscribes to.
// Messages broadcast to this topic reach all visitors that opted in.
// No visitor tokens are ever stored in the DB.
export const VISITORS_TOPIC = "visitors";

export async function subscribeTokenToTopic(fid: string, topic: string) {
  try {
    const auth = getFirebaseAuth();
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
    return {
      success: false,
      error: (error as Error).message || "FCM subscribe failed",
    };
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
    const auth = getFirebaseAuth();
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
    return {
      success: false,
      error: (error as Error).message || "FCM send failed",
    };
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
    const auth = getFirebaseAuth();
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
    return {
      success: false,
      error: (error as Error).message || "FCM send failed",
    };
  }
}
