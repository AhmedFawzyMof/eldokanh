export type PromoCode = {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
};
