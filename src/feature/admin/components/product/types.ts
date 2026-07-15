export type ProductListRow = {
  id: string;
  slug: string;
  title: string;
  stock: number;
  priceOriginal: number;
  priceDiscounted: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  category: { id: string; name: string; slug: string } | null;
  images: { url: string }[];
  _count: { reviews: number };
};

export type ProductFormRow = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string | null;
  longDesc: string | null;
  story: string | null;
  categoryId: string | null;
  region: string | null;
  material: string | null;
  dimensions: string | null;
  weightGrams: number | null;
  sku: string | null;
  stock: number;
  priceOriginal: number;
  priceDiscounted: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  images: { url: string; alt: string | null; sortOrder: number }[];
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type ProductDetailInfo = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string | null;
  longDesc: string | null;
  story: string | null;
  region: string | null;
  material: string | null;
  dimensions: string | null;
  weightGrams: number | null;
  sku: string | null;
  stock: number;
  priceOriginal: number;
  priceDiscounted: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  category: { id: string; name: string; slug: string } | null;
  images: ProductImage[];
};

export type ProductReviewStats = {
  count: number;
  average: number;
  pendingCount: number;
};

export type ProductReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isApproved: boolean;
  createdAt: Date | string;
  user: { id: string; name: string; email: string };
};
