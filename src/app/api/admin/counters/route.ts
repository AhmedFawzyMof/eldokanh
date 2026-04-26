import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { getActiveOrdersCount } from "@/models/orders";
import { getContactsCount } from "@/models/contacts";

export async function GET(req: NextRequest) {
  const { data: ordersCount, error: ordersCountError } = await tryCatch(() =>
    getActiveOrdersCount(),
  );

  if (ordersCountError) {
    return NextResponse.json(
      { message: "Failed to get orders count" },
      { status: 500 },
    );
  }
  const { data: contactsCount, error: contactsCountError } = await tryCatch(
    () => getContactsCount(),
  );

  if (contactsCountError) {
    return NextResponse.json(
      { message: "Failed to get contacts count" },
      { status: 500 },
    );
  }
  return NextResponse.json({
    orders: ordersCount?.count,
    contacts: contactsCount?.count,
  });
}
