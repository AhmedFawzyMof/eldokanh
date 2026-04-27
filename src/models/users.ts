import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { and, asc, desc, eq, like, notInArray, or, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  provider?: string;
  providerId?: string;
}) {
  const userData = { ...data };
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  return await db.insert(users).values(userData).returning().get();
}

export async function getUserById(id: number) {
  return await db.select().from(users).where(eq(users.id, id)).get();
}

export async function getAllUsers() {
  return await db.select().from(users).all();
}

export async function getCustomers(search?: string, sort?: string) {
  const adminUserIds = await db
    .select({ userId: admins.userId })
    .from(admins)
    .all();
  const adminIds = adminUserIds.map((a) => a.userId);

  const query = db.select().from(users);

  const conditions = [];

  if (adminIds.length > 0) {
    conditions.push(notInArray(users.id, adminIds));
  }

  if (search) {
    conditions.push(
      or(like(users.name, `%${search}%`), like(users.email, `%${search}%`)),
    );
  }

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  if (sort === "oldest") {
    query.orderBy(asc(users.createdAt));
  } else {
    query.orderBy(desc(users.createdAt));
  }

  return await query.all();
}

export async function updateUser(
  id: number,
  data: Partial<typeof users.$inferInsert>,
) {
  const updateData = { ...data };
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id))
    .returning();
}

export async function deleteUser(id: number) {
  return await db.delete(users).where(eq(users.id, id));
}
