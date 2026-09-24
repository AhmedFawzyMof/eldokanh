import type React from "react";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="flex flex-col lg:flex-row min-h-screen bg-slate-50/50">
      <AdminSidebar />
      <main className="flex-1 lg:mr-72 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
