import { parseAsStringLiteral } from "nuqs/server";

export const ANALYTICS_RANGE_VALUES = ["7d", "30d", "90d", "all"] as const;

export type AnalyticsRange = (typeof ANALYTICS_RANGE_VALUES)[number];

export const analyticsSearchParams = {
  range: parseAsStringLiteral(ANALYTICS_RANGE_VALUES).withDefault("30d"),
};
