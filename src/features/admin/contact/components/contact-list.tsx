"use client";

import { Mail, Phone, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string | null;
  createdAt: string | null;
}

interface ContactListProps {
  contacts: Contact[];
}

export function ContactList({ contacts }: ContactListProps) {
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "replied":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">تم الرد</Badge>;
      case "read":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">مقروء</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">جديد</Badge>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <Card key={contact.id} className="overflow-hidden border-slate-200">
            <CardHeader className="p-4 bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-slate-500" />
                {contact.subject || "بدون عنوان"}
              </CardTitle>
              {getStatusBadge(contact.status)}
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {contact.name} ({contact.email})
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {contact.phone}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {contact.createdAt ? new Date(contact.createdAt).toLocaleString('ar-EG') : 'غير معروف'}
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl text-slate-800 text-sm leading-relaxed whitespace-pre-wrap border border-slate-100 italic">
                "{contact.message}"
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {contact.status !== "replied" && (
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                    تم الرد
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
          <MessageSquare className="h-16 w-16 stroke-1 px-4" />
          <p className="text-lg">لا توجد طلبات تواصل حالياً</p>
        </div>
      )}
    </div>
  );
}
