import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";
import { tryCatch } from "@/lib/tryCatch";
import { updateCategory } from "@/models/categories";
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
  const oldImageUrl = formData.get("oldImageUrl") as string;
  const isActive = Boolean(formData.get("isActive"));
  const file = formData.get("file") as File | null;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let image = formData.get("image") as string;

  if (file && file.size > 0) {
    const uploadResult = await processAndUploadImage(file, "categories");
    image = uploadResult.secure_url;

    if (oldImageUrl) {
      const public_id = getPublicIdFromCloudinaryUrl(oldImageUrl);
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
  }

  const { data, error } = await tryCatch(() =>
    updateCategory(Number(id), {
      nameAr,
      name,
      descriptionAr,
      description,
      image,
      isActive,
    }),
  );

  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({}, { status: 201 });
}
