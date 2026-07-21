import { NextResponse } from "next/server";
import {
  createUserOrder,
  updatePaymentStatus,
  getUserOrders,
} from "@/models/orders";
import { getAuthSession } from "@/lib/auth-session";
import { db } from "@/db";
import { products, admins } from "@/db/schema";
import { inArray, isNotNull } from "drizzle-orm";
import { sendFCMMessage } from "@/lib/fcm";
import { validatePromoCode } from "@/models/promo_codes";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;

    const data = await getUserOrders(Number(session.user.id), page);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Order Fetch Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    console.log("Order POST - Session:", session);

    if (!session || !session.user) {
      console.warn("Order POST - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Order POST - Body:", body);
    const { address, paymentMethod, items, promoCodeId, deliveryCost } = body;

    if (!items || items.length === 0) {
      console.warn("Order POST - Empty items list");
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // 1. Calculate Total on Backend
    const productIds = items.map((item: any) => Number(item.productId));
    const dbProducts = await db
      .select({
        id: products.id,
        price: products.price,
        nameAr: products.nameAr,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    console.log("Order POST - DB Products:", dbProducts);

    let subtotal = 0;
    const itemsWithCurrentPrices = items.map((item: any) => {
      const product = dbProducts.find((p) => p.id === Number(item.productId));
      if (!product) {
        console.error(`Order POST - Product ${item.productId} not found`);
        throw new Error(`Product ${item.productId} not found`);
      }

      // Use rounded price for calculations to match what's sent to Fawaterk
      const roundedPrice = Number(Number(product.price).toFixed(2));
      const itemTotal = roundedPrice * Number(item.quantity);
      subtotal += itemTotal;

      return {
        ...item,
        productId: Number(item.productId),
        price: roundedPrice,
        nameAr: product.nameAr,
      };
    });

    console.log("Order POST - Calculated Subtotal:", subtotal);

    // 2. Validate Promo Code
    let discount = 0;
    let deliveryDiscount = 0;
    let promoInfo: { type: "pcg" | "literal"; value: number } | null = null;
    if (promoCodeId) {
      const promoResult = await validatePromoCode(
        promoCodeId,
        parseInt(session.user.id),
      );
      console.log("Order POST - Promo Result:", promoResult);
      if (promoResult.valid && promoResult.promo) {
        const promo = promoResult.promo;
        const appliesTo = (promo as any).appliesTo ?? "subtotal";

        if (appliesTo === "delivery") {
          // Apply discount to delivery cost
          const rawDelivery = deliveryCost || 0;
          if (promo.discountType === "percentage") {
            deliveryDiscount = (rawDelivery * promo.discountValue) / 100;
          } else {
            deliveryDiscount = Math.min(promo.discountValue, rawDelivery);
          }
          promoInfo = { type: promo.discountType === "percentage" ? "pcg" : "literal", value: promo.discountValue };
        } else {
          // Apply discount to subtotal
          if (promo.discountType === "percentage") {
            discount = (subtotal * promo.discountValue) / 100;
            promoInfo = { type: "pcg", value: promo.discountValue };
          } else {
            discount = promo.discountValue;
            promoInfo = { type: "literal", value: promo.discountValue };
          }
        }
      } else {
        console.warn("Order POST - Invalid Promo Code:", promoResult.message);
        return NextResponse.json(
          { error: promoResult.message },
          { status: 400 },
        );
      }
    }

    const finalTotal = Number(
      (subtotal - discount + (deliveryCost || 0) - deliveryDiscount).toFixed(2),
    );
    console.log("Order POST - Final Totals:", {
      subtotal,
      discount,
      deliveryCost,
      deliveryDiscount,
      finalTotal,
    });

    const orderPayload = {
      order: {
        userId: parseInt(session.user.id),
        paymentMethod: paymentMethod,
        status: "pending",
        paymentStatus: "unpaid",
      },
      items: itemsWithCurrentPrices,
      address: {
        ...address,
        userId: parseInt(session.user.id),
      },
      payment: {
        amount: finalTotal,
        method: paymentMethod,
        deliveryCost: deliveryCost,
      },
      promoCodeId: promoCodeId,
    };

    console.log("Order POST - Creating Order in DB...");
    const result = await createUserOrder(orderPayload);
    console.log("Order POST - DB Result:", result);

    if (result.success) {
      try {
        console.log("Order POST - Checking for admins with FCM tokens...");
        const adminUsers = await db
          .select({ fid: admins.fid })
          .from(admins)
          .where(isNotNull(admins.fid));

        console.log(`Order POST - Found ${adminUsers.length} admins with tokens.`);

        for (const admin of adminUsers) {
          if (admin.fid) {
            await sendFCMMessage(
              admin.fid,
              "طلب جديد",
              `تم استلام طلب جديد برقم ${result.orderId}`,
              "https://eldokanh.firebaseapp.com/dashboard/orders"
            );
          }
        }
      } catch (notificationError) {
        console.error("Order POST - Failed to send notifications:", notificationError);
      }
    }

    // TODO: Fawaterk payment gateway is temporarily disabled.
    // Re-enable by restoring the invoice creation block here.

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Order POST - Order Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}
