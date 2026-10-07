import { observedRain } from "./rainfall.js";
import { configuredMetrics, stationReading, type StationEntityKey } from "./station.js";
import type { HassLike, SkyScoopConfig } from "./types.js";

export type MetricEmphasis = Partial<Record<StationEntityKey, "strongWind" | "highUv">>;

const windFactors: Record<string, number> = { "m/s": 1, "km/h": 1 / 3.6, mph: 0.44704, kn: 0.5144444444444445, knots: 0.5144444444444445 };
const rainFactors: Record<string, number> = { "mm/h": 1, "in/h": 25.4 };

function reaches(reading: ReturnType<typeof stationReading>, threshold: number, factors: Record<string, number>): boolean {
  const factor = Object.hasOwn(factors, reading.unit) ? factors[reading.unit] : undefined;
  return factor !== undefined && reading.value !== undefined && reading.value >= threshold / factor;
}

export function metricEmphasis(hass: HassLike | undefined, config: SkyScoopConfig | undefined) {
  const metrics: MetricEmphasis = {};
  const rain = observedRain(hass, config);
  const heavyRain = rain === "wet" && reaches(stationReading(hass, config?.rainfall_rate_entity), 7.5, rainFactors);
  if (config?.adaptive_metrics === false) return { metrics, rain, heavyRain, rainfall: "none" as const };
  const wind = [config?.wind_speed_entity, config?.wind_gust_entity]
    .some((entityId) => reaches(stationReading(hass, entityId), 8, windFactors));
  for (const metric of configuredMetrics(hass, config)) {
    if (metric.value === undefined) continue;
    if (wind && metric.key.startsWith("wind_")) metrics[metric.key] = "strongWind";
    if (metric.key === "uv_index_entity" && metric.value >= 6) metrics[metric.key] = "highUv";
  }
  return { metrics, rain, heavyRain, rainfall: rain === "wet" ? heavyRain ? "heavy" as const : "wet" as const : "none" as const };
}