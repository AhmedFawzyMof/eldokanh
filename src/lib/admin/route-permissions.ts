import { ADMIN_PERMISSIONS } from "@/types/permissions";

export const ROUTE_PERMISSIONS: Record<string, string> = {
  "/admin/dashboard": ADMIN_PERMISSIONS.DASHBOARD_VIEW,
  "/admin/products": ADMIN_PERMISSIONS.PRODUCTS_MANAGE,
  "/admin/orders": ADMIN_PERMISSIONS.ORDERS_MANAGE,
  "/admin/brands": ADMIN_PERMISSIONS.BRANDS_MANAGE,
  "/admin/categories": ADMIN_PERMISSIONS.CATEGORIES_MANAGE,
  "/admin/subcategories": ADMIN_PERMISSIONS.CATEGORIES_MANAGE,
  "/admin/magazine": ADMIN_PERMISSIONS.OFFERS_MANAGE,
  "/admin/contact": ADMIN_PERMISSIONS.CONTACTS_MANAGE,
  "/admin/delivery": ADMIN_PERMISSIONS.DELIVERY_MANAGE,
  "/admin/coupons": ADMIN_PERMISSIONS.PROMO_CODES_MANAGE,
  "/admin/customers": ADMIN_PERMISSIONS.USERS_MANAGE,
  "/admin/admins": ADMIN_PERMISSIONS.ADMINS_MANAGE,
};
