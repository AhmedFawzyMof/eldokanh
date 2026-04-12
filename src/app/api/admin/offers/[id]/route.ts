import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import { updateOffer } from "@/models/offers";
import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";

import { processAndUploadImage } from "@/lib/image-processor";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const formData = await req.formData();
  
  const productId = formData.get("productId") ? Number(formData.get("productId")) : null;
  const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
  const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : null;
  const oldImageUrl = formData.get("oldImageUrl") as string;
  const file = formData.get("file") as File | null;

  if (isNaN(Number(id)))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  let image = formData.get("image") as string || "";

  if (file && file.size > 0) {
    // If a new file is uploaded, process it
    const uploadResult = await processAndUploadImage(file, "offers");
    image = uploadResult.secure_url;

    // Delete old image if it exists and a new one was uploaded
    if (oldImageUrl) {
      const public_id = getPublicIdFromCloudinaryUrl(oldImageUrl);
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
  }

  const { data: _, error } = await tryCatch(() =>
    updateOffer(Number(id), { productId, categoryId, brandId, image }),
  );

  if (error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
    
  return NextResponse.json(
    { message: "Updated successfully" },
    { status: 200 },
  );
}
