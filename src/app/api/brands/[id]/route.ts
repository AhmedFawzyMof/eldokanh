import { NextResponse } from "next/server";
import { getBrandById } from "@/models/brands";
import { getProductByBrand } from "@/models/products";
import { getAuthSession } from "@/lib/auth-session";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const session = await getAuthSession();
    const params = await ctx.params;

    const brand = await getBrandById(Number(params.id));
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const products = await getProductByBrand(Number(params.id), Number(page), {
      session,
    });

    return NextResponse.json({
      brand,
      products: products.products,
      count: products.count,
    });
  } catch (error) {
    console.error("BRAND_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
