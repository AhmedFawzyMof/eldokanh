import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";
import { tryCatch } from "@/lib/tryCatch";
import { updateBrand } from "@/models/brands";
import { NextRequest, NextResponse } from "next/server";

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
  const isActive = formData.get("isActive") === "true";
  const oldImageUrl = formData.get("oldImageUrl") as string;
  const file = formData.get("file") as File | null;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let imageUrl = formData.get("imageUrl") as string;

  if (file && file.size > 0) {
    // If a new file is uploaded, process it
    const uploadResult = await processAndUploadImage(file, "brands");
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
    updateBrand(Number(id), { nameAr, name, description, descriptionAr, isActive, image: imageUrl }),
  );


  if (error) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  return NextResponse.json({}, { status: 201 });
}
