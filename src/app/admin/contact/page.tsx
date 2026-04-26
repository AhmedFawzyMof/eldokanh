import { ContactList } from "@/features/admin/contact/components/contact-list";
import { getAllContacts } from "@/models/contacts";

export default async function ContactPage() {
  const contacts = await getAllContacts();

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900">
            طلبات التواصل ({contacts.length})
          </h1>
        </div>
      </div>

      <ContactList contacts={contacts as any} />
    </div>
  );
}
