import { NextResponse } from "next/server";
import { createUserOrder, updatePaymentStatus } from "@/models/orders";
import { getAuthSession } from "@/lib/auth-session";
import { createFawaterkInvoice } from "@/lib/fawaterk";
import { db } from "@/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { validatePromoCode } from "@/models/promo_codes";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { address, paymentMethod, items, promoCodeId, deliveryCost } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // 1. Calculate Total on Backend
    const productIds = items.map((item: any) => item.productId);
    const dbProducts = await db
      .select({ id: products.id, price: products.price, nameAr: products.nameAr })
      .from(products)
      .where(inArray(products.id, productIds));

    let subtotal = 0;
    const itemsWithCurrentPrices = items.map((item: any) => {
      const product = dbProducts.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      subtotal += product.price * item.quantity;
      return {
        ...item,
        price: product.price,
        nameAr: product.nameAr,
      };
    });

    // 2. Validate Promo Code
    let discount = 0;
    if (promoCodeId) {
      const promoResult = await validatePromoCode(
        promoCodeId,
        parseInt(session.user.id),
      );
      if (promoResult.valid && promoResult.promo) {
        const promo = promoResult.promo;
        if (promo.discountType === "percentage") {
          discount = (subtotal * promo.discountValue) / 100;
        } else {
          discount = promo.discountValue;
        }
      } else {
        return NextResponse.json(
          { error: promoResult.message },
          { status: 400 },
        );
      }
    }

    const finalTotal = subtotal - discount + (deliveryCost || 0);

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

    const result = await createUserOrder(orderPayload);

    if (paymentMethod !== "cash" && result.success) {
      const nameParts = address.fullName.split(" ");
      const firstName = nameParts[0] || "Customer";
      const lastName = nameParts.slice(1).join(" ") || "User";

      const fawaterkData = {
        cartTotal: finalTotal.toString(),
        currency: "EGP",
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: session.user.email || "",
          phone: address.phone,
        },
        cartItems: itemsWithCurrentPrices.map((item: any) => ({
          name: item.nameAr || "Product",
          price: item.price,
          quantity: item.quantity,
        })),
        return_url: `${process.env.NEXTAUTH_URL}/order-history`,
        callback_url: `${process.env.NEXTAUTH_URL}/api/webhooks/fawaterk?orderId=${result.orderId}`,
      };

      try {
        const fawaterkResponse = await createFawaterkInvoice(fawaterkData);
        if (fawaterkResponse.status === "success") {
          return NextResponse.json(
            {
              ...result,
              paymentUrl: fawaterkResponse.data.url,
            },
            { status: 201 },
          );
        } else {
          throw new Error("Fawaterk responded with failure status");
        }
      } catch (fawaterkError) {
        console.error("Fawaterk Invoice Creation Failed:", fawaterkError);
        
        // Update payment status to failed in our DB
        await updatePaymentStatus(result.orderId, "failed");

        return NextResponse.json(
          {
            ...result,
            error: "فشل إنشاء رابط الدفع، يرجى المحاولة لاحقاً من تاريخ الطلبات.",
          },
          { status: 201 },
        );
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}
