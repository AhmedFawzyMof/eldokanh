"use client";
import { useEffect } from "react";
import { setupFCMListener, triggerFCMRegistration } from "@/fcm/messaging";
export function useNotificationManager() {
  useEffect(() => {
    async function initNotifications() {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setupFCMListener(async (installationId) => {
          await fetch("/api/admin/save-admin-fid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fid: installationId }),
          });
        });

        await triggerFCMRegistration();
      }
    }

    initNotifications();
  }, []);
}
