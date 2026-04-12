import {
  Package,
  ShoppingCart,
  Users,
  LayoutDashboard,
  Menu,
  Building,
  Contact,
  GalleryHorizontal,
  LayoutList,
  CreditCard,
  Motorbike,
} from "lucide-react";

export const adminPages = [
  {
    title: "لوحة المعلومات",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: false,
  },
  {
    title: "المنتجات",
    href: "/admin/products",
    icon: ShoppingCart,
    badge: false,
  },
  {
    title: "الطلبات",
    href: "/admin/orders",
    icon: Package,
    badge: true,
  },
  {
    title: "إنشاء طلب",
    href: "/admin/orders/create",
    icon: Menu,
    badge: false,
  },
  {
    title: "الشركات",
    href: "/admin/brands",
    icon: Building,
    badge: false,
  },
  {
    title: "الاقسام",
    href: "/admin/categories",
    icon: LayoutList,
    badge: false,
  },
  {
    title: "الاقسام الفرعية",
    href: "/admin/subcategories",
    icon: LayoutList,
    badge: false,
  },
  {
    title: "مجلة العرض",
    href: "/admin/magazine",
    icon: GalleryHorizontal,
    badge: false,
  },
  // {
  //   title: "طلبات التواصل",
  //   href: "/admin/contact",
  //   icon: Contact,
  //   badge: true,
  // },
  {
    title: "المدن للتوصيل",
    href: "/admin/delivery",
    icon: Motorbike,
    badge: false,
  },
  {
    title: "الكوبونات",
    href: "/admin/coupons",
    icon: CreditCard,
    badge: false,
  },
  // {
  //   title: "العملاء",
  //   href: "/admin/customers",
  //   icon: Users,
  //   badge: false,
  // },
];
