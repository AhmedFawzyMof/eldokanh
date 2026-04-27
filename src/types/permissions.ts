export const ADMIN_PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  PRODUCTS_MANAGE: "products:manage",
  CATEGORIES_MANAGE: "categories:manage",
  ORDERS_MANAGE: "orders:manage",
  USERS_MANAGE: "users:manage",
  ADMINS_MANAGE: "admins:manage",
  BRANDS_MANAGE: "brands:manage",
  PROMO_CODES_MANAGE: "promo_codes:manage",
  STOCK_MANAGE: "stock:manage",
  DELIVERY_MANAGE: "delivery:manage",
  OFFERS_MANAGE: "offers:manage",
  CONTACTS_MANAGE: "contacts:manage",
} as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];

export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  [ADMIN_PERMISSIONS.DASHBOARD_VIEW]: "عرض الإحصائيات",
  [ADMIN_PERMISSIONS.PRODUCTS_MANAGE]: "إدارة المنتجات",
  [ADMIN_PERMISSIONS.CATEGORIES_MANAGE]: "إدارة الأقسام",
  [ADMIN_PERMISSIONS.ORDERS_MANAGE]: "إدارة الطلبات",
  [ADMIN_PERMISSIONS.USERS_MANAGE]: "إدارة المستخدمين",
  [ADMIN_PERMISSIONS.ADMINS_MANAGE]: "إدارة المشرفين",
  [ADMIN_PERMISSIONS.BRANDS_MANAGE]: "إدارة البراندات",
  [ADMIN_PERMISSIONS.PROMO_CODES_MANAGE]: "إدارة أكواد الخصم",
  [ADMIN_PERMISSIONS.STOCK_MANAGE]: "إدارة المخزون",
  [ADMIN_PERMISSIONS.DELIVERY_MANAGE]: "إدارة التوصيل",
  [ADMIN_PERMISSIONS.OFFERS_MANAGE]: "إدارة العروض",
  [ADMIN_PERMISSIONS.CONTACTS_MANAGE]: "إدارة الرسائل",
};

export function hasPermission(userPermissions: string | null | undefined, permission: AdminPermission): boolean {
  if (!userPermissions) return false;
  
  const permissionsList = userPermissions.split(",").map(p => p.trim());
  
  if (permissionsList.includes("full")) return true;
  
  return permissionsList.includes(permission);
}
