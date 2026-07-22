import { db } from "@/db";
import {
  orderItems,
  orders,
  payments,
  product_brands,
  products,
  products_category,
  promoCodes,
  promoCodeUsages,
} from "@/db/schema";
import { sql, eq, between, and, inArray } from "drizzle-orm";

export async function getStatData(from: string, to: string, date?: string) {
  const filterdate = (date: string) => {
    if (date === "week") {
      return "-1 week";
    }

    if (date === "2weeks") {
      return "-2 week";
    }

    if (date === "month") {
      return "-1 month";
    }

    return "-1 week";
  };

  const conditions: any[] = [];

  if (date) {
    conditions.push(
      sql`${orders.createdAt} >= date('now', ${filterdate(date)})`,
    );
  } else {
    // Extend `to` to end-of-day so datetime rows on that date are included
    conditions.push(
      sql`${orders.createdAt} >= ${from} AND ${orders.createdAt} <= ${to + " 23:59:59"}`,
    );
  }

  const stats = await db
    .select({
      totalRevenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      totalRevenueLastMonth: sql<number>`
        SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN ${orderItems.price} * ${orderItems.quantity} 
        END)
      `,
      totalOrders: sql<number>`COUNT(${orders.id})`,
      totalOrdersLastMonth: sql<number>`
        COUNT(CASE WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') THEN 1 END)
      `,
      activeUsers: sql<number>`COUNT(DISTINCT ${orders.userId})`,
      activeUsersLastMonth: sql<number>`
        COUNT(DISTINCT CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN ${orders.userId} 
        END)
      `,
      totalProfet: sql<number>`SUM((${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}))`,
      totalProfetLastMonth: sql<number>`SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN (${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}) 
        END)`,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(...conditions))
    .get();

  const revenue = await db
    .select({
      month: sql<string>`strftime('%Y-%m', ${orders.createdAt})`,
      revenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(...conditions))
    .groupBy(sql`strftime('%Y-%m', ${orders.createdAt})`)
    .orderBy(sql`strftime('%Y-%m', ${orders.createdAt})`)
    .all();

  const lastMonth = sql`strftime('%Y-%m', 'now', '-1 month')`;

  const promoOrders = await db
    .select({
      orderId: promoCodeUsages.orderId,
      discountType: promoCodes.discountType,
      discountValue: promoCodes.discountValue,
      appliesTo: promoCodes.appliesTo,
      createdAt: orders.createdAt,
    })
    .from(promoCodeUsages)
    .innerJoin(promoCodes, eq(promoCodeUsages.promoCodeId, promoCodes.id))
    .innerJoin(orders, eq(promoCodeUsages.orderId, orders.id))
    .where(and(...conditions))
    .all();

  let totalPromoDiscount = 0;
  let totalPromoDiscountLastMonth = 0;

  if (promoOrders.length > 0) {
    const promoOrderIds = promoOrders
      .map((po) => po.orderId)
      .filter((id): id is number => id !== null);

    const subtotals = await db
      .select({
        orderId: orderItems.orderId,
        subtotal: sql<number>`COALESCE(SUM(${orderItems.price} * ${orderItems.quantity}), 0)`,
      })
      .from(orderItems)
      .where(inArray(orderItems.orderId, promoOrderIds))
      .groupBy(orderItems.orderId)
      .all();

    const deliveries = await db
      .select({
        orderId: payments.orderId,
        deliveryCost: payments.deliveryCost,
      })
      .from(payments)
      .where(inArray(payments.orderId, promoOrderIds))
      .all();

    const isLastMonth = (createdAt: string | null) =>
      createdAt?.startsWith(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1,
        )
          .toISOString()
          .slice(0, 7),
      ) ?? false;

    for (const po of promoOrders) {
      const subtotal = Number(
        subtotals.find((s) => s.orderId === po.orderId)?.subtotal || 0,
      );
      const deliveryCost = Number(
        deliveries.find((d) => d.orderId === po.orderId)?.deliveryCost || 0,
      );

      let discount = 0;
      if (po.discountType === "fixed") {
        discount = po.discountValue;
      } else if (po.discountType === "percentage") {
        const base =
          po.appliesTo === "delivery" ? deliveryCost : subtotal;
        discount = (base * po.discountValue) / 100;
      }

      totalPromoDiscount += discount;
      if (isLastMonth(po.createdAt)) {
        totalPromoDiscountLastMonth += discount;
      }
    }
  }

  return {
    stats: {
      ...stats,
      totalPromoDiscount,
      totalPromoDiscountLastMonth,
    },
    revenue,
  };
}

export async function getCategoriesReports(
  from: string,
  to: string,
  category?: number,
) {
  const conditions: any[] = [between(orders.createdAt, from, to)];
  if (category) {
    conditions.push(eq(products.categoryId, category));
  }

  const stats = await db
    .select({
      totalRevenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      totalRevenueLastMonth: sql<number>`
        SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN ${orderItems.price} * ${orderItems.quantity} 
        END)
      `,
      totalOrders: sql<number>`COUNT(${orders.id})`,
      totalOrdersLastMonth: sql<number>`
        COUNT(CASE WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') THEN 1 END)
      `,
      totalProfet: sql<number>`SUM((${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}))`,
      totalProfetLastMonth: sql<number>`SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN (${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}) 
        END)`,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(and(...conditions))
    .get();

  const categories = await db
    .select({
      id: products_category.id,
      name: products_category.nameAr,
      revenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      profit: sql<number>`SUM((${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}))`,
      orders: sql<number>`COUNT(${orders.id})`,
      quantity: sql<number>`SUM(${orderItems.quantity})`,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(products_category, eq(products.categoryId, products_category.id))
    .where(and(...conditions))
    .groupBy(products_category.id)
    .all();

  return { stats, categories };
}

export async function getBrandsReports(
  from: string,
  to: string,
  brand?: number,
) {
  const conditions: any[] = [between(orders.createdAt, from, to)];
  if (brand) {
    conditions.push(eq(products.brandId, brand));
  }

  const stats = await db
    .select({
      totalRevenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      totalRevenueLastMonth: sql<number>`
        SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN ${orderItems.price} * ${orderItems.quantity} 
        END)
      `,
      totalOrders: sql<number>`COUNT(${orders.id})`,
      totalOrdersLastMonth: sql<number>`
        COUNT(CASE WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') THEN 1 END)
      `,
      totalProfet: sql<number>`SUM((${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}))`,
      totalProfetLastMonth: sql<number>`SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN (${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}) 
        END)`,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(and(...conditions))
    .get();

  const brands = await db
    .select({
      id: product_brands.id,
      name: product_brands.nameAr,
      revenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      profit: sql<number>`SUM((${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}))`,
      orders: sql<number>`COUNT(${orders.id})`,
      quantity: sql<number>`SUM(${orderItems.quantity})`,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(product_brands, eq(products.brandId, product_brands.id))
    .where(and(...conditions))
    .groupBy(product_brands.id)
    .all();

  return { stats, brands };
}

export async function getAllProductsReports({
  from,
  to,
  category,
  brand,
  page = 1,
  limit = 20,
}: {
  from: string;
  to: string;
  category?: number;
  brand?: number;
  page?: number;
  limit?: number;
}) {
  const conditions: any[] = [between(orders.createdAt, from, to)];
  if (category) {
    conditions.push(eq(products.categoryId, category));
  }
  if (brand) {
    conditions.push(eq(products.brandId, brand));
  }

  const offset = (page - 1) * limit;

  const productsData = await db
    .select({
      id: products.id,
      name: products.nameAr,
      categoryName: products_category.nameAr,
      brandName: product_brands.nameAr,
      revenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      profit: sql<number>`SUM((${orderItems.price} * ${orderItems.quantity}) - (COALESCE(${orderItems.buyingPrice}, 0) * ${orderItems.quantity}))`,
      orders: sql<number>`COUNT(${orders.id})`,
      quantity: sql<number>`SUM(${orderItems.quantity})`,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(products_category, eq(products.categoryId, products_category.id))
    .leftJoin(product_brands, eq(products.brandId, product_brands.id))
    .where(and(...conditions))
    .groupBy(products.id)
    .orderBy(sql`SUM(${orderItems.price} * ${orderItems.quantity}) DESC`)
    .limit(limit)
    .offset(offset)
    .all();

  const totalCountResult = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${products.id})` })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(and(...conditions))
    .get();

  return {
    products: productsData,
    totalPages: Math.ceil((totalCountResult?.count || 0) / limit),
    totalCount: totalCountResult?.count || 0,
  };
}

