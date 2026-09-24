import { NextResponse } from "next/server";
import { getAllBrands } from "@/models/brands";

export async function GET() {
  try {
    const brands = await getAllBrands(null, {
      onlyActive: true,
      includeDetails: true,
      productCountActive: true,
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
