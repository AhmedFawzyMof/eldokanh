import type React from "react";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
