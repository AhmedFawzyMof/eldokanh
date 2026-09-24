import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-session";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getFavoriteProducts } from "@/models/products";

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await getFavoriteProducts(session);
    return NextResponse.json(data);
  } catch (error) {
    console.error("FAVORITE_GET_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}


export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const userId = Number(session.user.id);

    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.productId, productId)),
      )
      .get();

    if (existingFavorite) {
      await db
        .delete(favorites)
        .where(
          and(eq(favorites.userId, userId), eq(favorites.productId, productId)),
        );

      return NextResponse.json({
        status: "removed",
      });
    }

    await db.insert(favorites).values({
      userId,
      productId,
    });

    return NextResponse.json({
      status: "added",
    });
  } catch (error) {
    console.error("FAVORITE_API_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
