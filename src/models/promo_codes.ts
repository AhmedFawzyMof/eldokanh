import { db } from "@/db";
import { promoCodes, promoCodeUsages } from "@/db/schema";
import { and, eq, inArray, sql, desc, like } from "drizzle-orm";

export async function createPromoCode(data: typeof promoCodes.$inferInsert) {
  return await db.insert(promoCodes).values(data).returning();
}

export async function getAllPromoCodes(search: string | null, page: number) {
  const limit = 20;
  const offset = (page - 1) * limit || 0;
  const conditions: any[] = [];

  if (search) {
    conditions.push(like(promoCodes.code, `%${search}%`));
  }

  const promoCode = await db
    .select({
      id: promoCodes.id,
      code: promoCodes.code,
      discountType: promoCodes.discountType,
      discountValue: promoCodes.discountValue,
      maxUses: promoCodes.maxUses,
      expiresAt: promoCodes.expiresAt,
      isActive: promoCodes.isActive,
      createdAt: promoCodes.createdAt,
      usageCount: sql<number>`COUNT(${promoCodeUsages.id})`,
    })
    .from(promoCodes)
    .leftJoin(
      promoCodeUsages,
      sql`${promoCodeUsages.promoCodeId} = ${promoCodes.id}`,
    )
    .groupBy(promoCodes.id)
    .orderBy(desc(promoCodes.createdAt))
    .limit(limit)
    .offset(offset)
    .all();

  const promoCount = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(promoCodes)
    .where(and(...conditions))
    .get();

  return { promoCodes: promoCode, count: promoCount?.count };
}

export async function updatePromoCode(
  id: number,
  data: Partial<typeof promoCodes.$inferInsert>,
) {
  return await db
    .update(promoCodes)
    .set(data)
    .where(eq(promoCodes.id, id))
    .returning();
}

export async function deletePromoCodes(ids: number[]) {
  return await db
    .delete(promoCodes)
    .where(inArray(promoCodes.id, ids))
    .returning();
}

export async function createPromoCodeUsage(
  data: typeof promoCodeUsages.$inferInsert,
) {
  return await db.insert(promoCodeUsages).values(data).returning();
}

export async function getPromoCodeUsageCount(promoCodeId: number) {
  const result = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(promoCodeUsages)
    .where(eq(promoCodeUsages.promoCodeId, promoCodeId))
    .get();

  return result?.count ?? 0;
}

export async function hasUserUsedPromoCode(
  promoCodeId: number,
  userId: number,
) {
  const usage = await db
    .select({ id: promoCodeUsages.id })
    .from(promoCodeUsages)
    .where(
      and(
        eq(promoCodeUsages.promoCodeId, promoCodeId),
        eq(promoCodeUsages.userId, userId),
      ),
    )
    .get();
  return !!usage;
}

export async function validatePromoCode(code: string, userId: number) {
  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(and(eq(promoCodes.code, code), eq(promoCodes.isActive, true)));

  if (!promo) return { valid: false, message: "كود الخصم غير صحيح" };

  // Check expiration
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { valid: false, message: "كود الخصم منتهي الصلاحية" };
  }

  // Check usage limit
  if (promo.maxUses) {
    const usageCount = await getPromoCodeUsageCount(promo.id);
    if (usageCount >= promo.maxUses) {
      return { valid: false, message: "تم الوصول للحد الأقصى لاستخدام الكود" };
    }
  }

  // Check if user already used it
  const alreadyUsed = await hasUserUsedPromoCode(promo.id, userId);
  if (alreadyUsed) {
    return { valid: false, message: "لقد استخدمت هذا الكود من قبل" };
  }

  return { valid: true, promo };
}
