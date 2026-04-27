import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { getAllAdmins, createAdmin, deleteAdmin } from "@/models/admins";
import { createUser } from "@/models/users";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const permissions = searchParams.get("permissions") || undefined;

  const { data: admins, error } = await tryCatch(() =>
    getAllAdmins(search, permissions),
  );

  if (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ admins });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { name, email, password, permissions } = body;

  // Restriction: Only Super Admin (full) can grant "full" permissions
  if (permissions === "full" && session?.user?.permissions !== "full") {
    return NextResponse.json(
      { message: "Only Super Admin can grant full access" },
      { status: 403 },
    );
  }

  // First create the user
  const { data: user, error: userError } = await tryCatch(() =>
    createUser({ name, email, password }),
  );

  if (!user || userError) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 },
    );
  }

  const { data: admin, error: adminError } = await tryCatch(() =>
    createAdmin(user.id, permissions),
  );

  if (adminError) {
    return NextResponse.json(
      { message: "Failed to create admin" },
      { status: 500 },
    );
  }

  return NextResponse.json({ admin }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "No ID provided" }, { status: 400 });
  }

  const { error } = await tryCatch(() => deleteAdmin(Number(id)));

  if (error) {
    return NextResponse.json(
      { message: "Failed to delete admin" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
