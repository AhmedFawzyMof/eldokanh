export type PromoCode = {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
  /** "subtotal" = applies to cart total; "delivery" = applies to delivery cost */
  appliesTo: 'subtotal' | 'delivery';
  createdAt: string;
};
