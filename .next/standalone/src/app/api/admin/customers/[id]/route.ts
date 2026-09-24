import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { updateUser } from "@/models/users";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await req.json();
  const { name, email } = body;

  const { error } = await tryCatch(() =>
    updateUser(Number(id), { name, email }),
  );

  if (error) {
    return NextResponse.json(
      { message: "Failed to update customer" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Updated successfully" });
}
