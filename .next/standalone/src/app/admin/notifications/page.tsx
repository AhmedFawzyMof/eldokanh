import { SendNotification } from "@/features/admin/notifications/components/send-notification-form";
import { checkFCMConfig } from "@/lib/fcm";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const configError = checkFCMConfig();

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm">
        <h1 className="text-xl font-black text-slate-900">إشعارات الزوار</h1>
        <p className="text-sm text-muted-foreground mt-1">
          أرسل إشعاراً لجميع زوار الموقع الذين فعّلوا الإشعارات — بدون حفظ أي
          بيانات في قاعدة البيانات. إشعارات الطلبات تصل للمشرفين فقط.
        </p>
      </div>

      <div className="p-4">
        {configError ? (
          <div className="max-w-2xl mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">إعدادات الإشعارات غير مكتملة</p>
              <p dir="ltr" className="break-all">{configError}</p>
              <p className="mt-2 text-red-600/80">
                أضف ملف مفتاح الحساب من Firebase console إلى src/config/ أو
                اضبط FIREBASE_SERVICE_ACCOUNT في متغيرات البيئة ثم أعد المحاولة.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mb-4 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            إعدادات Firebase جاهزة — يمكنك إرسال الإشعارات.
          </div>
        )}

        <SendNotification configError={configError ? true : false} />
      </div>
    </div>
  );
}