import ProductView from "@/features/products/components/productPage";
import { Metadata } from "next";
import { getProductById } from "@/models/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  props: ProductPageProps,
): Promise<Metadata> {
  const { id } = await props.params;
  const product = (await getProductById(Number(id)))?.product;

  if (!product) {
    return { title: "المنتج غير موجود" };
  }

  return {
    title: `${product.nameAr} | El Dokanh`,
    description:
      product.descriptionAr || `اشتري ${product.nameAr} بأفضل سعر في مصر.`,
    openGraph: {
      title: product.nameAr,
      description: product.descriptionAr!,
      images: [product.imageUrl || ""],
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const { id } = await props.params;

  const product = (await getProductById(Number(id)))?.product;
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductView product={product} />
      </Suspense>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-8 bg-gray-200 w-1/3 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
    </div>
  );
}
