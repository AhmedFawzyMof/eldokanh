import { NextResponse } from "next/server";
import { getProductById } from "@/models/products";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(Number(params.id));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
