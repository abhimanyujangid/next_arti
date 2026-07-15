// Shared catalog utility types and mappers used across catalog API modules

export type CatalogProductCard = {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  price_original: number;
  price_discounted: number | null;
  region: string | null;
  material: string | null;
  is_available: boolean;
  stock: number;
  category_slug: string | null;
  category_name: string | null;
  image_url: string | null;
};

export type CatalogProductImage = {
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type CatalogProductDetail = CatalogProductCard & {
  long_desc: string | null;
  story: string | null;
  dimensions: string | null;
  sku: string | null;
  weight_grams: number | null;
  images: CatalogProductImage[];
};

export type CatalogReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author_name: string;
  created_at: string;
  user_id: string;
};

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
  userId: string;
  user: { name: string };
};

export function mapReview(row: ReviewRow): CatalogReview {
  return {
    id: row.id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    author_name: row.user.name,
    created_at: row.createdAt.toISOString(),
    user_id: row.userId,
  };
}

type ProductCardRow = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string | null;
  priceOriginal: number;
  priceDiscounted: number | null;
  region: string | null;
  material: string | null;
  isAvailable: boolean;
  stock: number;
  category: { slug: string; name: string } | null;
  images: { url: string; alt?: string | null; sortOrder?: number }[];
};

type ProductDetailRow = ProductCardRow & {
  longDesc: string | null;
  story: string | null;
  dimensions: string | null;
  sku: string | null;
  weightGrams: number | null;
  images: { url: string; alt: string | null; sortOrder: number }[];
};

export function mapCard(row: ProductCardRow): CatalogProductCard {
  const sorted = [...row.images].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    short_desc: row.shortDesc,
    price_original: row.priceOriginal,
    price_discounted: row.priceDiscounted,
    region: row.region,
    material: row.material,
    is_available: row.isAvailable,
    stock: row.stock,
    category_slug: row.category?.slug ?? null,
    category_name: row.category?.name ?? null,
    image_url: sorted[0]?.url ?? null,
  };
}

export function mapCards(rows: ProductCardRow[]): CatalogProductCard[] {
  return rows.map(mapCard);
}

export function mapProductDetail(row: ProductDetailRow): CatalogProductDetail {
  const images = [...row.images]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => ({
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
    }));

  return {
    ...mapCard(row),
    long_desc: row.longDesc,
    story: row.story,
    dimensions: row.dimensions,
    sku: row.sku,
    weight_grams: row.weightGrams,
    images,
  };
}
