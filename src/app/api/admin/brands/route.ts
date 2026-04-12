import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";

import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandsImagesByIds,
} from "@/models/brands";
import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const search = searchParams.get("search");

  const { data: brands, error } = await tryCatch(() =>
    getAllBrands(search, { productCount: true, includeDetails: true }),
  );

  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ brands });
}

import { processAndUploadImage } from "@/lib/image-processor";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const nameAr = formData.get("nameAr") as string;
  const name = formData.get("name") as string;
  const file = formData.get("file") as File | null;

  let imageUrl = "";
  if (file && file.size > 0) {
    const uploadResult = await processAndUploadImage(file, "brands");
    imageUrl = uploadResult.secure_url;
  }

  const { data: brand, error } = await tryCatch(() =>
    createBrand({ nameAr, name, image: imageUrl }),
  );

  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({}, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const idsParam = searchParams.getAll("ids[]");

  if (!idsParam) {
    return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
  }

  const ids = idsParam.map(Number);
  const { data: images, error: imagesError } = await tryCatch(() =>
    getBrandsImagesByIds(ids),
  );

  if (imagesError) {
    console.log(imagesError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const publicIds = images
    ?.map((image: any) => image.image)
    .map(getPublicIdFromCloudinaryUrl)
    .filter(Boolean) as string[];

  await cloudinary.api.delete_resources(publicIds);
  const { data: _, error } = await tryCatch(() => deleteBrand(ids));

  if (error) {
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200 },
  );
}
