"use client";
import { useEffect } from "react";
import { getFCMToken, setupForegroundMessageListener } from "@/fcm/messaging";
import { toast } from "sonner";

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

        // Setup listener for foreground notifications
        setupForegroundMessageListener((payload) => {
          const title = payload.notification?.title || "تنبيه جديد";
          const body = payload.notification?.body || "لديك إشعار جديد.";
          toast.success(`${title}\n${body}`);

          // Also trigger the native notification for the browser, 
          // some browsers show this even when the tab is focused if configured properly
          if (Notification.permission === 'granted') {
             new Notification(title, {
               body,
               icon: "/icon-192x192.png",
             });
          }
        });
      }
    }

    initNotifications();
  }, []);
}
