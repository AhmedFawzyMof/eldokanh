export type Offer = {
  id: number;
  imageUrl: string;
  productId: number | null;
  categoryId: number | null;
  brandId: number | null;
  oldImageUrl?: string;
};

