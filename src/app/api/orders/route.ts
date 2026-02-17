import { NextResponse } from "next/server";
import { createUserOrder } from "@/models/orders";
import { getAuthSession } from "@/lib/auth-session";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      address,
      paymentMethod,
      items,
      promoCodeId,
      totalAmount,
      deliveryCost,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const orderPayload = {
      order: {
        userId: parseInt(session.user.id),
        paymentMethod: paymentMethod,
        status: "pending",
        paymentStatus: paymentMethod === "cash" ? "unpaid" : "paid",
      },
      items: items,
      address: {
        ...address,
        userId: parseInt(session.user.id),
      },
      payment: {
        amount: totalAmount,
        method: paymentMethod,
        deliveryCost: deliveryCost,
      },
      promoCodeId: promoCodeId,
    };

    const result = await createUserOrder(orderPayload);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}
