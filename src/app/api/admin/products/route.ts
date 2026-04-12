import { NextRequest, NextResponse } from "next/server";
import { tryCatch } from "@/lib/tryCatch";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsImagesByIds,
} from "@/models/products";
import { getAllCategories } from "@/models/categories";
import { getAllBrands } from "@/models/brands";
import cloudinary, { getPublicIdFromCloudinaryUrl } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const search = searchParams.get("search");
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const page = searchParams.get("page");

  const { data: products, error: productsError } = await tryCatch(() =>
    getAllProducts(Number(page), search, Number(categoryId), Number(brandId)),
  );

  if (productsError) {
    console.log(productsError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const { data: categories, error: categoriesError } = await tryCatch(() =>
    getAllCategories(null, {
      image: false,
      description: false,
      productCount: false,
    }),
  );

  if (categoriesError) {
    console.log(categoriesError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const { data: brands, error: brandsError } = await tryCatch(() =>
    getAllBrands(null, { onlyActive: false, includeDetails: false }),
  );

  if (brandsError) {
    console.log(brandsError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ products, categories, brands });
}

import { processAndUploadImage } from "@/lib/image-processor";

export async function POST(req: NextRequest) {
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
  const file = formData.get("file") as File | null;

  let imageUrl = "";
  if (file && file.size > 0) {
    const uploadResult = await processAndUploadImage(file, "products");
    imageUrl = uploadResult.secure_url;
  }

  const { data: _, error } = await tryCatch(() =>
    createProduct({
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
    } as any),
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

  console.log(idsParam);
  if (!idsParam) {
    return NextResponse.json({ message: "No IDs provided" }, { status: 400 });
  }

  const ids = idsParam.map(Number);
  const { data: images, error: imagesError } = await tryCatch(() =>
    getProductsImagesByIds(ids),
  );

  if (imagesError) {
    console.log(imagesError);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }

  const publicIds = images
    ?.map((image: any) => image.imageUrl)
    .map(getPublicIdFromCloudinaryUrl)
    .filter((image) => image !== "")
    .filter(Boolean) as string[];

  if (publicIds.length > 0) {
    await cloudinary.api.delete_resources(publicIds);
  }
  const { data: _, error } = await tryCatch(() => deleteProduct(ids));

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
