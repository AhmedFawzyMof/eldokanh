import { db } from "@/db";
import { contacts } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getAllContacts() {
  return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function getContactsCount() {
  return await db
    .select({
      count: sql<number>`COUNT(${contacts.id})`,
    })
    .from(contacts)
    .get();
}

export async function updateContactStatus(
  id: number,
  status: "pending" | "read" | "replied",
) {
  const contact = await db
    .update(contacts)
    .set({ status })
    .where(eq(contacts.id, id))
    .returning();
  return contact[0];
}

export async function deleteContact(id: number) {
  return await db.delete(contacts).where(eq(contacts.id, id)).returning();
}
