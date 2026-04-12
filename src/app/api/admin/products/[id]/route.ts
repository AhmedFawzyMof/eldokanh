import { tryCatch } from "@/lib/tryCatch";
import { updateProduct } from "@/models/products";
import { NextRequest, NextResponse } from "next/server";
import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";

import { processAndUploadImage } from "@/lib/image-processor";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const formData = await req.formData();
  
  const nameAr = formData.get("nameAr") as string;
  const name = formData.get("name") as string;
  const descriptionAr = formData.get("descriptionAr") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const discountPrice = formData.has("discountPrice") ? Number(formData.get("discountPrice")) : null;
  const categoryId = Number(formData.get("categoryId"));
  const subcategoryId = formData.has("subcategoryId") ? Number(formData.get("subcategoryId")) : null;
  const brandId = formData.has("brandId") ? Number(formData.get("brandId")) : null;
  const stockQuantity = Number(formData.get("stockQuantity") || 0);
  const type = formData.get("type") as string || "unit";
  const isActive = formData.get("isActive") === "true";
  const oldImageUrl = formData.get("oldImageUrl") as string;
  const file = formData.get("file") as File | null;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let imageUrl = formData.get("imageUrl") as string;

  if (file && file.size > 0) {
    // If a new file is uploaded, process it
    const uploadResult = await processAndUploadImage(file, "products");
    imageUrl = uploadResult.secure_url;

    // Delete old image if it exists and a new one was uploaded
    if (oldImageUrl) {
      const public_id = getPublicIdFromCloudinaryUrl(oldImageUrl);
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
  }

  const { data, error } = await tryCatch(() => 
    updateProduct(Number(id), {
      nameAr,
      name,
      descriptionAr,
      description,
      price,
      discountPrice,
      categoryId,
      subcategoryId,
      brandId,
      stockQuantity,
      type,
      isActive,
      imageUrl,
    } as any)
  );

  if (error) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({}, { status: 201 });
}

