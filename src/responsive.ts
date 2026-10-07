import type { SkyScoopConfig } from "./types.js";

export type Layout = "compact" | "standard" | "wide";
export const hourlyCounts: Record<Layout, number> = { compact: 4, standard: 8, wide: 12 };
export const metricColumns: Record<Layout, number> = { compact: 2, standard: 3, wide: 4 };

export function selectLayout(width: number, override: SkyScoopConfig["layout"] = "auto"): Layout {
  if (override !== "auto") return override;
  if (!Number.isFinite(width) || width <= 0) return "standard";
  return width < 360 ? "compact" : width < 600 ? "standard" : "wide";
}