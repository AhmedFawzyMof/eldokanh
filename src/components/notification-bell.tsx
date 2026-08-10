"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getFCMToken, setupForegroundMessageListener } from "@/fcm/messaging";

export function NotificationBell() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setEnabled(Notification.permission === "granted");
    }

    // Re-subscribe on every load with the latest token (tokens rotate).
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      subscribeToVisitors();
    }
    setupForegroundMessageListener((payload) => {
      const title = payload.notification?.title || "إشعار جديد";
      const body = payload.notification?.body || "لديك إشعار جديد.";
      toast.success(title, { description: body });

      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/icon-192x192.png" });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscribeToVisitors = async (): Promise<boolean> => {
    const token = await new Promise<string | null>((resolve) => {
      getFCMToken((t) => resolve(t));
    });
    if (!token) return false;

    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        setEnabled(true);
        return true;
      }
      const data = await res.json().catch(() => ({}));
      console.error("Notification subscribe error:", data.error);
      return false;
    } catch (err) {
      console.error("Notification subscribe error:", err);
      return false;
    }
  };

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (typeof Notification === "undefined") {
        toast.error("الإشعارات غير مدعومة على هذا المتصفح");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("تم رفض إذن الإشعارات");
        return;
      }

      const ok = await subscribeToVisitors();
      if (ok) {
        toast.success("تم تفعيل الإشعارات بنجاح");
      } else {
        toast.error("تعذر تفعيل الإشعارات حالياً، حاول مرة أخرى");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={handleClick}
      disabled={busy || enabled}
      title={enabled ? "الإشعارات مفعّلة" : "تفعيل الإشعارات"}
      aria-label={enabled ? "الإشعارات مفعّلة" : "تفعيل الإشعارات"}
    >
      {enabled ? (
        <BellRing className="h-5 w-5 text-primary" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
    </Button>
  );
}