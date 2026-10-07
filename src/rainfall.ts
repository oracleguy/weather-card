import { finiteValue, stationReading } from "./station.js";
import type { HassLike, RainfallHistoryState, SkyScoopConfig } from "./types.js";

export const rainfallMetrics = [
  { key: "rainfall_rate_entity", label: "rainfallRate", icon: "mdi:weather-pouring" },
  { key: "rainfall_today_entity", label: "rainfallToday", icon: "mdi:water" },
  { key: "rainfall_week_entity", label: "rainfallWeek", icon: "mdi:calendar-week" },
] as const;

export type RainfallEntityKey = typeof rainfallMetrics[number]["key"] | "rain_state_entity";
export type RainState = "wet" | "dry" | "unknown";
export const HOUR = 3_600_000;

export function configuredRainfall(hass: HassLike | undefined, config: SkyScoopConfig | undefined) {
  return rainfallMetrics.flatMap((metric) => {
    if (!config?.[metric.key]) return [];
    const reading = stationReading(hass, config[metric.key]);
    return [{ ...metric, ...reading, value: reading.value !== undefined && reading.value >= 0 ? reading.value : undefined }];
  });
}

export function observedRain(hass: HassLike | undefined, config: SkyScoopConfig | undefined): RainState {
  const state = config?.rain_state_entity ? hass?.states[config.rain_state_entity]?.state : undefined;
  if (state === "on") return "wet";
  if (state === "off") return "dry";
  const rate = stationReading(hass, config?.rainfall_rate_entity).value;
  return rate !== undefined && rate >= 0 ? rate > 0 ? "wet" : "dry" : "unknown";
}

export interface RainfallBucket {
  start: number;
  peak?: number;
}

export function prepareRainfallHistory(
  records: readonly RainfallHistoryState[],
  end: number,
  unit: string,
  coverageEnd = end,
): RainfallBucket[] {
  const start = end - 24 * HOUR;
  const buckets = Array.from({ length: 24 }, (_, index) => ({ start: start + index * HOUR, coverage: 0, peak: 0 }));
  const byTime = new Map<number, RainfallHistoryState>();
  for (const record of records) {
    const timestamp = record.last_updated ?? record.last_changed;
    const time = typeof timestamp === "string" ? Date.parse(timestamp) : NaN;
    if (Number.isFinite(time) && time < Math.min(end, coverageEnd)) byTime.set(time, record);
  }
  const entries = [...byTime.entries()].sort(([first], [second]) => first - second);
  for (let index = 0; index < entries.length; index += 1) {
    const [time, record] = entries[index];
    const value = finiteValue(record.state);
    if (value === undefined || value < 0 || !unit || record.attributes?.unit_of_measurement !== unit) continue;
    const intervalStart = Math.max(time, start);
    const intervalEnd = Math.min(entries[index + 1]?.[0] ?? coverageEnd, end, coverageEnd);
    for (const bucket of buckets) {
      const duration = Math.min(intervalEnd, bucket.start + HOUR) - Math.max(intervalStart, bucket.start);
      if (duration > 0) {
        bucket.coverage += duration;
        bucket.peak = Math.max(bucket.peak, value);
      }
    }
  }
  return buckets.map((bucket) => ({ start: bucket.start, peak: bucket.coverage === HOUR ? bucket.peak : undefined }));
}