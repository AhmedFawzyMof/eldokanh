import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { updateUser } from "@/models/users";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();
  const { name, email } = body;

  const { error } = await tryCatch(() =>
    updateUser(id, { name, email })
  );

  if (error) {
    return NextResponse.json({ message: "Failed to update customer" }, { status: 500 });
  }

  return NextResponse.json({ message: "Updated successfully" });
}
