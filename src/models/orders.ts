import { db } from "@/db";
import {
  orders,
  orderItems,
  users,
  addresses,
  payments,
  products,
  promoCodeUsages,
  promoCodes,
} from "@/db/schema";
import { and, count, eq, inArray, not, sql, desc, or, like, between } from "drizzle-orm";

export async function createOrder(
  data: typeof orders.$inferInsert,
  items: (typeof orderItems.$inferInsert)[],
) {
  const order = await db
    .insert(orders)
    .values(data)
    .returning({ id: orders.id, paymentMethod: orders.paymentMethod })
    .get();
  const orderId = order?.id;

  if (items && items.length > 0) {
    await db.insert(orderItems).values(items.map((i) => ({ ...i, orderId })));
  }

  return order;
}

export async function getAllOrders(page: number, search: string | null, startDate?: string, endDate?: string) {
  const limit = 20;
  const offset = (page - 1) * limit || 0;
  
  const searchFilter = search ? or(eq(orders.id, Number(search) || 0), like(users.name, `%${search}%`)) : undefined;
  const dateFilter = startDate && endDate ? between(orders.createdAt, `${startDate} 00:00:00`, `${endDate} 23:59:59`) : undefined;
  
  const whereClause = searchFilter && dateFilter 
    ? and(searchFilter, dateFilter)
    : searchFilter || dateFilter;

  const ordersData = await db
    .select({
      id: orders.id,
      user: users.name,
      totalAmount: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .where(whereClause)
    .groupBy(orders.id)
    .orderBy(desc(orders.id))
    .limit(limit)
    .offset(offset)
    .all();

  const total = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${orders.id})`,
    })
    .from(orders)
    .where(whereClause)
    .get();

  return { orders: ordersData, count: total?.count || 0 };
}

export async function getActiveOrdersCount() {
  return await db
    .select({
      count: sql<number>`COUNT(${orders.id})`,
    })
    .from(orders)
    .where(not(eq(orders.status, "delivered")))
    .get();
}

export async function getUserOrders(userId: number, page: number = 1) {
  const limit = 10;
  const offset = (page - 1) * limit;

  const totalCountResult = await db
    .select({ value: count(orders.id) })
    .from(orders)
    .where(eq(orders.userId, userId));

  const totalOrders = totalCountResult[0]?.value || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const ordersData = await db
    .select({
      id: orders.id,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      totalAmount: sql<number>`SUM(${orderItems.price} * ${orderItems.quantity})`,
      address: sql`JSON_OBJECT(
        'fullName', ${addresses.fullName},
        'phone', ${addresses.phone},
        'city', ${addresses.city}
      )`,
      items: sql`JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', ${orderItems.id},
          'nameAr', ${products.nameAr},
          'quantity', ${orderItems.quantity},
          'price', ${orderItems.price}
        )
      )`,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .leftJoin(addresses, eq(orders.id, addresses.orderId))
    .where(eq(orders.userId, userId))
    .groupBy(orders.id)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  const parsedOrders = ordersData.map((order) => ({
    ...order,
    address: JSON.parse(order.address as string),
    items: JSON.parse(order.items as string),
  }));

  return { orders: parsedOrders, totalOrders, totalPages };
}

export async function getOrdersCount() {
  return await db
    .select({
      count: sql<number>`COUNT(${orders.id})`,
    })
    .from(orders)
    .where(not(eq(orders.status, "delivered")))
    .get();
}

export async function getOrderById(id: number) {
  const [order, items, address, payment, promo] = await Promise.all([
    db.select().from(orders).where(eq(orders.id, id)).get(),
    db
      .select({
        id: orderItems.id,
        nameAr: products.nameAr,
        type: products.type,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        buyingPrice: orderItems.buyingPrice,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id))
      .all(),
    db.select().from(addresses).where(eq(addresses.orderId, id)).get(),
    db.select().from(payments).where(eq(payments.orderId, id)).get(),
    db
      .select({
        code: promoCodes.code,
        discountType: promoCodes.discountType,
        discountValue: promoCodes.discountValue,
      })
      .from(promoCodeUsages)
      .innerJoin(promoCodes, eq(promoCodeUsages.promoCodeId, promoCodes.id))
      .where(eq(promoCodeUsages.orderId, id))
      .get(),
  ]);

  if (!order) return null;

  return {
    ...order,
    items,
    address: address || {
      fullName: "",
      phone: "",
      city: "",
      street: "",
      building: "",
      floor: "",
    },
    payment: payment || {
      amount: 0,
      method: order.paymentMethod || "cash",
      deliveryCost: 0,
      status: order.paymentStatus || "pending",
    },
    promo,
  };
}
export async function updateOrder(
  id: number,
  data: Partial<typeof orders.$inferInsert>,
  items: (typeof orderItems.$inferInsert)[],
  address: Partial<typeof addresses.$inferInsert>,
  payment: Partial<typeof payments.$inferInsert>,
) {
  return await db.transaction(async (tx) => {
    await tx.update(addresses).set(address).where(eq(addresses.orderId, id));

    await tx.update(payments).set(payment).where(eq(payments.orderId, id));

    await tx.delete(orderItems).where(eq(orderItems.orderId, id));

    if (items.length > 0) {
      const itemsToInsert = items.map((item) => ({
        ...item,
        orderId: id,
      }));
      await tx.insert(orderItems).values(itemsToInsert);
    }

    await tx.update(orders).set(data).where(eq(orders.id, id));
  });
}

export async function deleteOrder(ids: number[]) {
  await db.delete(orderItems).where(inArray(orderItems.orderId, ids));
  await db.delete(addresses).where(inArray(addresses.orderId, ids));
  await db.delete(payments).where(inArray(payments.orderId, ids));
  await db.delete(promoCodeUsages).where(inArray(promoCodeUsages.orderId, ids));
  return await db.delete(orders).where(inArray(orders.id, ids));
}

export async function deleteOrderProducts(id: number, orderItemId: number) {
  return await db
    .delete(orderItems)
    .where(and(eq(orderItems.id, orderItemId), eq(orderItems.orderId, id)));
}

export async function createUserOrder(data: any) {
  try {
    return await db.transaction(async (tx) => {
      console.log("DB Transaction - Creating Order...");
      const [newOrder] = await tx
        .insert(orders)
        .values({
          userId: data.order.userId,
          status: data.order.status,
          paymentStatus: data.order.paymentStatus,
          paymentMethod: data.order.paymentMethod,
        })
        .returning();

      if (!newOrder) {
        throw new Error("Failed to insert order - no record returned");
      }

      const orderId = newOrder.id;
      console.log("DB Transaction - Order Created with ID:", orderId);

      const itemsToInsert = await Promise.all(
        data.items.map(async (item: any) => {
          const product = await tx
            .select({
              buyingPrice: products.buyingPrice,
              price: products.price,
            })
            .from(products)
            .where(eq(products.id, Number(item.productId)))
            .get();

          if (!product) {
            throw new Error(
              `Product ${item.productId} not found during transaction`,
            );
          }

          return {
            orderId: orderId,
            productId: Number(item.productId),
            quantity: item.quantity,
            price: product.price,
            buyingPrice: product.buyingPrice || 0,
          };
        }),
      );

      console.log(
        "DB Transaction - Inserting Order Items:",
        itemsToInsert.length,
      );
      await tx.insert(orderItems).values(itemsToInsert);

      console.log("DB Transaction - Inserting Address...");
      await tx.insert(addresses).values({
        orderId: orderId,
        userId: data.order.userId,
        fullName: data.address.fullName,
        phone: data.address.phone,
        city: data.address.city,
        street: data.address.street,
        building: data.address.building,
        floor: data.address.floor,
      });

      console.log("DB Transaction - Inserting Payment...");
      await tx.insert(payments).values({
        orderId: orderId,
        amount: data.payment.amount,
        method: data.payment.method,
        deliveryCost: data.payment.deliveryCost,
        status: "pending",
      });

      if (data.promoCodeId) {
        console.log("DB Transaction - Applying Promo Code:", data.promoCodeId);
        const [promo] = await tx
          .select()
          .from(promoCodes)
          .where(eq(promoCodes.code, data.promoCodeId));
        if (promo) {
          await tx.insert(promoCodeUsages).values({
            promoCodeId: promo.id,
            userId: data.order.userId,
            orderId: orderId,
          });
        } else {
          console.warn(
            "DB Transaction - Promo code not found in DB:",
            data.promoCodeId,
          );
        }
      }

      return { success: true, orderId };
    });
  } catch (error: any) {
    console.error("DB Transaction - Error:", error);
    throw error;
  }
}

export async function updatePaymentStatus(
  orderId: number,
  status: string,
  transactionId?: string,
) {
  return await db.transaction(async (tx) => {
    await tx
      .update(payments)
      .set({ status: status, transactionId: transactionId })
      .where(eq(payments.orderId, orderId));

    if (status === "paid") {
      await tx
        .update(orders)
        .set({ paymentStatus: "paid" })
        .where(eq(orders.id, orderId));
    }
  });
}
