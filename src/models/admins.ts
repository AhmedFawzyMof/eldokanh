import { db } from "@/db";
import { admins, users } from "@/db/schema";
import { and, eq, like, or } from "drizzle-orm";

export async function createAdmin(userId: number, permissions = "full") {
  return await db.insert(admins).values({ userId, permissions }).returning();
}

export async function getAllAdmins(search?: string, permissions?: string) {
  const query = db
    .select({
      id: admins.id,
      userId: admins.userId,
      permissions: admins.permissions,
      name: users.name,
      email: users.email,
    })
    .from(admins)
    .innerJoin(users, eq(admins.userId, users.id));

  const conditions = [];

  if (search) {
    conditions.push(
      or(like(users.name, `%${search}%`), like(users.email, `%${search}%`))
    );
  }

  if (permissions && permissions !== "all") {
    conditions.push(
      or(
        eq(admins.permissions, "full"),
        like(admins.permissions, `%${permissions}%`)
      )
    );
  }

  if (conditions.length > 0) {
    return await query.where(and(...conditions)).all();
  }

  return await query.all();
}

export async function updateAdmin(
  id: number,
  data: Partial<typeof admins.$inferInsert>
) {
  return await db.update(admins).set(data).where(eq(admins.id, id)).returning();
}

export async function deleteAdmin(id: number) {
  return await db.delete(admins).where(eq(admins.id, id));
}
