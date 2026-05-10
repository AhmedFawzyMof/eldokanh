import { NextResponse } from "next/server";
import { getCategoryById } from "@/models/categories";
import { getProductByCategory } from "@/models/products";
import { getAuthSession } from "@/lib/auth-session";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const subcategory = searchParams.get("subcategory");
    const session = await getAuthSession();
    const params = await ctx.params;

    const category = await getCategoryById(Number(params.id));
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const products = await getProductByCategory(
      Number(params.id),
      Number(page),
      subcategory ? Number(subcategory) : undefined,
      { session },
    );

    return NextResponse.json({
      category,
      products: products.products,
      count: products.count,
    });
  } catch (error) {
    console.error("CATEGORY_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
