import { parseAsInteger, parseAsStringLiteral } from "nuqs/server";

export const ORDERS_RANGE_VALUES = ["7d", "30d", "90d", "all"] as const;
export type OrdersRange = (typeof ORDERS_RANGE_VALUES)[number];

export const ORDERS_STATUS_VALUES = [
  "all",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;
export type OrdersStatusFilter = (typeof ORDERS_STATUS_VALUES)[number];

export const ORDERS_SORT_BY_VALUES = [
  "createdAt",
  "orderNumber",
  "total",
] as const;
export type OrdersSortBy = (typeof ORDERS_SORT_BY_VALUES)[number];

export const ORDERS_SORT_DIR_VALUES = ["asc", "desc"] as const;
export type OrdersSortDir = (typeof ORDERS_SORT_DIR_VALUES)[number];

export const ordersSearchParams = {
  range: parseAsStringLiteral(ORDERS_RANGE_VALUES).withDefault("all"),
  status: parseAsStringLiteral(ORDERS_STATUS_VALUES).withDefault("all"),
  sortBy: parseAsStringLiteral(ORDERS_SORT_BY_VALUES).withDefault("createdAt"),
  sortDir: parseAsStringLiteral(ORDERS_SORT_DIR_VALUES).withDefault("desc"),
  page: parseAsInteger.withDefault(1),
};

export const ORDERS_PAGE_SIZE = 20;

export function rangeToCreatedAtGte(range: OrdersRange): Date | undefined {
  if (range === "all") return undefined;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return cutoff;
}
