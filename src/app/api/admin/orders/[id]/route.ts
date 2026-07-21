import { tryCatch } from "@/lib/tryCatch";
import {
  deleteOrderProducts,
  getOrderById,
  updateOrder,
  updateOrderPartial,
} from "@/models/orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 });
  }

  const { data, error } = await tryCatch(() => getOrderById(orderId));

  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const {
    id: orderId,
    userId,
    status,
    paymentStatus,
    paymentMethod,
    createdAt,
  } = body;
  const orderData = {
    id: orderId,
    userId,
    status,
    paymentStatus,
    paymentMethod,
    createdAt,
  };
  const hasOrderData = Object.values(orderData).some((v) => v !== undefined);

  if (body.items && body.address && body.payment) {
    const orderItems = body.items;

    const addressData = {
      id: body.address.id,
      userId: body.address.userId,
      orderId: body.address.orderId,
      fullName: body.address.fullName,
      phone: body.address.phone,
      street: body.address.street,
      city: body.address.city,
      building: body.address.building,
      floor: body.address.floor,
    };

    const payment = {
      id: body.payment.id,
      orderId: body.payment.orderId,
      amount: body.payment.amount,
      method: body.paymentMethod || body.payment.method,
      status: body.paymentStatus || body.payment.status,
      deliveryCost: body.payment.deliveryCost,
      transactionId: body.payment.transactionId,
      createdAt: body.payment.createdAt,
    };

    const { data: _, error } = await tryCatch(() =>
      updateOrder(Number(id), orderData, orderItems, addressData, payment),
    );

    if (error) {
      return NextResponse.json(
        { message: "something went wrong" },
        { status: 500 },
      );
    }
  } else if (hasOrderData) {
    // Strip undefined values — only update fields that were explicitly sent
    const updateData = Object.fromEntries(
      Object.entries(orderData).filter(([k, v]) => k !== "id" && v !== undefined)
    );

    const { data: _, error } = await tryCatch(() => updateOrderPartial(Number(id), updateData));

    if (error) {
      console.error("Partial update error:", error);
      return NextResponse.json(
        { message: "something went wrong", error: error.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({}, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const queryParams = req.nextUrl.searchParams;
  const orderItemId = queryParams.get("id");

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { data: _, error } = await tryCatch(() =>
    deleteOrderProducts(Number(id), Number(orderItemId)),
  );

  if (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }

  return NextResponse.json({}, { status: 200 });
}
