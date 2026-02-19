import { MetadataRoute } from "next";
import { getProducts } from "@/models/products";
import { getAllCategories } from "@/models/categories";
import { getAllBrands } from "@/models/brands";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://eldokanh.com";

  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getAllCategories(null),
    getAllBrands(null),
  ]);

  const productEntries = products.map((p) => ({
    url: `${baseUrl}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((c) => ({
    url: `${baseUrl}/category/${c.id}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const brandEntries = brands.map((b) => ({
    url: `${baseUrl}/brand/${b.id}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    ...productEntries,
    ...categoryEntries,
    ...brandEntries,
  ];
}
