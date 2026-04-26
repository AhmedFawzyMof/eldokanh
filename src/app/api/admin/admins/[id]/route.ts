import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { updateAdmin } from "@/models/admins";
import { updateUser } from "@/models/users";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();
  const { name, email, permissions, userId } = body;

  // Update user info
  const { error: userError } = await tryCatch(() =>
    updateUser(userId, { name, email })
  );

  if (userError) {
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }

  // Update admin info (permissions)
  const { error: adminError } = await tryCatch(() =>
    updateAdmin(id, { permissions })
  );

  if (adminError) {
    return NextResponse.json({ message: "Failed to update admin" }, { status: 500 });
  }

  return NextResponse.json({ message: "Updated successfully" });
}
