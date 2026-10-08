import type { HassLike, SkyScoopConfig } from "./types.js";

export const stationMetrics = [
  { key: "humidity_entity", label: "humidity", icon: "mdi:water-percent", minimum: 0, maximum: 100 },
  { key: "dew_point_entity", label: "dewPoint", icon: "mdi:thermometer-water", minimum: -Infinity, maximum: Infinity },
  { key: "wind_speed_entity", label: "windSpeed", icon: "mdi:weather-windy", minimum: 0, maximum: Infinity },
  { key: "wind_gust_entity", label: "windGust", icon: "mdi:weather-windy", minimum: 0, maximum: Infinity },
  { key: "wind_direction_entity", label: "windDirection", icon: "mdi:compass-outline", minimum: -Infinity, maximum: Infinity },
  { key: "uv_index_entity", label: "uvIndex", icon: "mdi:weather-sunny-alert", minimum: 0, maximum: Infinity },
  { key: "illuminance_entity", label: "illuminance", icon: "mdi:brightness-6", minimum: 0, maximum: Infinity },
] as const;

export type StationEntityKey = typeof stationMetrics[number]["key"];

export function finiteValue(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  if (typeof value === "string" && !value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function stationReading(hass: HassLike | undefined, entityId: string | undefined) {
  const entity = entityId ? hass?.states[entityId] : undefined;
  return {
    value: finiteValue(entity?.state),
    unit: typeof entity?.attributes.unit_of_measurement === "string" ? entity.attributes.unit_of_measurement : "",
  };
}

export function configuredMetrics(hass: HassLike | undefined, config: SkyScoopConfig | undefined) {
  return stationMetrics.flatMap((metric) => {
    const entityId = config?.[metric.key];
    if (!entityId) return [];
    const reading = stationReading(hass, entityId);
    const value = reading.value !== undefined && reading.value >= metric.minimum && reading.value <= metric.maximum
      ? reading.value : undefined;
    return [{ ...metric, ...reading, value, entityId }];
  });
}