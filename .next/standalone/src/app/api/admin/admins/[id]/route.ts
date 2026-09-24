import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { updateAdmin } from "@/models/admins";
import { updateUser } from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;
  const body = await req.json();
  const { name, email, permissions, userId } = body;

  // Restriction: Only Super Admin (full) can grant "full" permissions
  if (permissions === "full" && session?.user?.permissions !== "full") {
    return NextResponse.json(
      { message: "Only Super Admin can grant full access" },
      { status: 403 },
    );
  }

  // Update user info
  const { error: userError } = await tryCatch(() =>
    updateUser(userId, { name, email }),
  );

  if (userError) {
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 },
    );
  }

  // Update admin info (permissions)
  const { error: adminError } = await tryCatch(() =>
    updateAdmin(Number(id), { permissions }),
  );

  if (adminError) {
    return NextResponse.json(
      { message: "Failed to update admin" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Updated successfully" });
}
