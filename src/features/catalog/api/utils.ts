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

export function mapCards(rows: any[]): CatalogProductCard[] {
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    short_desc: r.shortDesc,
    price_original: r.priceOriginal,
    price_discounted: r.priceDiscounted,
    region: r.region,
    material: r.material,
    is_available: r.isAvailable,
    stock: r.stock,
    category_slug: r.category?.slug ?? null,
    category_name: r.category?.name ?? null,
    image_url: r.images?.[0]?.url ?? null,
  }));
}
