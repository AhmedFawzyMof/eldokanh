import { NextResponse } from "next/server";
import { getLatestProducts } from "@/models/products";
import { getAllCategories } from "@/models/categories";
import { getAllBrands } from "@/models/brands";
import { getAllOffers } from "@/models/offers";
import { getAuthSession } from "@/lib/auth-session";
import { tryCatch } from "@/lib/tryCatch";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    const [latestProducts, categories, brands, offers] = await Promise.all([
      getLatestProducts({ session }),
      getAllCategories(null, {
        image: true,
        onlyActive: true,
        productCountActive: true,
      }),
      getAllBrands(null, {
        onlyActive: true,
        includeDetails: true,
        productCountActive: true,
      }),
      getAllOffers(),
    ]);

    return NextResponse.json({
      latestProducts,
      categories,
      brands,
      offers,
    });
  } catch (error) {
    console.error("HOME_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
