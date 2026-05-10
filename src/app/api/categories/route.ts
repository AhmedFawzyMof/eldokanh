import { NextResponse } from "next/server";
import { getAllCategories } from "@/models/categories";

export async function GET() {
  try {
    const categories = await getAllCategories(null, {
      image: true,
      onlyActive: true,
      productCountActive: true,
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
