import { db } from "@/db";
import { orders, orderItems, users, products, payments } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export async function getDashboardData() {
  const totals = await db
    .select({
      totalRevenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      totalRevenueLastMonth: sql<number>`
        SUM(CASE 
          WHEN strftime('%Y-%m', ${orders.createdAt}) = strftime('%Y-%m', 'now', '-1 month') 
          THEN ${orderItems.price} * ${orderItems.quantity} 
        END)
      `,
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
      totalOrders: sql<number>`COUNT(${orders.id})`,
    })
    .from(orderItems)
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .get();

  const total = totals;

  const [latestOrders, topProducts] = await Promise.all([
    db
      .select({
        orderId: orders.id,
        user: users.name,
        totalAmount: payments.amount,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(payments, eq(orders.id, payments.orderId))
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5)
      .all(),

    db
      .select({
        productId: products.id,
        name: products.name,
        nameAr: products.nameAr,
        soldQuantity: sql<number>`SUM(${orderItems.quantity})`,
        revenue: sql<number>`SUM(${orderItems.price})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(sql`${orders.createdAt} >= date('now','-120 day')`)
      .groupBy(products.id)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(5)
      .all(),
  ]);

  return {
    order: {
      totalRevenue: {
        total_revenue: total?.totalRevenue || 0,
        total_revenue_lastmonth: total?.totalRevenueLastMonth || 0,
      },
      numberOfOrders: {
        total_orders: totals?.totalOrders || 0,
        total_orders_lastmonth: total?.totalOrdersLastMonth || 0,
      },
    },
    activeCustomers: {
      total_user: total?.activeUsers || 0,
      total_users_lastmonth: total?.activeUsersLastMonth || 0,
    },
    latestOrders,
    topProducts,
    monthlyRevenue: await db
      .select({
        month: sql<string>`strftime('%Y-%m', ${orders.createdAt})`,
        revenue: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(sql`${orders.createdAt} >= date('now', '-6 month')`)
      .groupBy(sql`strftime('%Y-%m', ${orders.createdAt})`)
      .orderBy(sql`strftime('%Y-%m', ${orders.createdAt})`)
      .all(),
  };
}
