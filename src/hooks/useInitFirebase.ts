"use client";
import { useEffect } from "react";
import { getFCMToken } from "@/fcm/messaging";

export function useNotificationManager() {
  useEffect(() => {
    async function initNotifications() {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        await getFCMToken(async (token) => {
          await fetch("/api/admin/save-admin-fid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fid: token }),
          });
        });
      }
    }

    initNotifications();
  }, []);
}
