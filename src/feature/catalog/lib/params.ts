import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const SHOP_SORT_VALUES = [
  "newest",
  "price-asc",
  "price-desc",
  "title",
] as const;

export const shopSearchParams = {
  category: parseAsString.withDefault(""),
  q: parseAsString.withDefault(""),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  sort: parseAsStringLiteral(SHOP_SORT_VALUES).withDefault("newest"),
  page: parseAsInteger.withDefault(1),
  availableOnly: parseAsBoolean.withDefault(false),
};

export const shopSearchParamsCache =
  createSearchParamsCache(shopSearchParams);
