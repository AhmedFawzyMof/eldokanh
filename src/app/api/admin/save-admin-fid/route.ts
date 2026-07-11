import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { updateAdminByUserId } from "@/models/admins";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { fid } = body;

  if (!fid) {
    return NextResponse.json(
      { message: "FID is required" },
      { status: 400 },
    );
  }

  const { data, error } = await tryCatch(() =>
    updateAdminByUserId(Number(session.user.id), { fid }),
  );

  if (error) {
    return NextResponse.json(
      { message: "Failed to save FID" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data });
}
