import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { getCustomers, createUser, deleteUser } from "@/models/users";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const sort = searchParams.get("sort") || undefined;

  const { data: customers, error } = await tryCatch(() =>
    getCustomers(search, sort)
  );

  if (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json({ customers });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password } = body;

  const { data: user, error } = await tryCatch(() =>
    createUser({ name, email, password })
  );

  if (error) {
    return NextResponse.json({ message: "Failed to create customer" }, { status: 500 });
  }

  return NextResponse.json({ user }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  const { error } = await tryCatch(() => deleteUser(Number(id)));

  if (error) {
    return NextResponse.json({ message: "Failed to delete customer" }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
