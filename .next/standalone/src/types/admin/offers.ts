export type Offer = {
  id: number;
  image: string;
  productId: number | null;
  categoryId: number | null;
  brandId: number | null;
  oldImageUrl?: string;
};
