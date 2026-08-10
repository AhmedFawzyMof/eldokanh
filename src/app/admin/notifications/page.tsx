import { SendNotification } from "@/features/admin/notifications/components/send-notification-form";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm">
        <h1 className="text-xl font-black text-slate-900">إشعارات الزوار</h1>
        <p className="text-sm text-muted-foreground mt-1">
          أرسل إشعاراً لجميع زوار الموقع الذين فعّلوا الإشعارات — بدون حفظ أي
          بيانات في قاعدة البيانات.
        </p>
      </div>

      <div className="p-4">
        <SendNotification />
      </div>
    </div>
  );
}