import { NextResponse } from "next/server";
import { updatePaymentStatus } from "@/models/orders";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      console.error("Fawaterk Webhook: Order ID missing in query params");
      return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
    }

    let body: any;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    }

    console.log("Fawaterk Webhook Received for Order:", orderId, body);

    const { invoice_status, invoice_id } = body;

    if (invoice_status === "paid") {
      await updatePaymentStatus(
        parseInt(orderId),
        "paid",
        invoice_id?.toString(),
      );
      console.log(`Order ${orderId} marked as paid via Fawaterk.`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({
      message: `Status is ${invoice_status}, no action taken.`,
    });
  } catch (error: any) {
    console.error("Fawaterk Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
