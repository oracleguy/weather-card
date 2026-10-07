import { finiteValue } from "./station.js";

export interface ForecastPeriod {
  datetime?: unknown;
  temperature?: unknown;
  templow?: unknown;
  is_daytime?: unknown;
  condition?: unknown;
  precipitation_probability?: unknown;
}

export interface HourlyPeriod {
  timestamp: number;
  temperature: number;
  condition?: string;
  probability?: number;
}

export function selectHourlyForecast(
  forecast: readonly ForecastPeriod[] | null | undefined,
  now: Date,
  limit: number,
): HourlyPeriod[] {
  const start = now.getTime();
  if (!Number.isFinite(start) || limit <= 0) return [];
  const periods = new Map<number, HourlyPeriod>();
  for (const period of forecast ?? []) {
    if (!period || typeof period.datetime !== "string") continue;
    const timestamp = Date.parse(period.datetime);
    const temperature = finiteValue(period.temperature);
    if (!Number.isFinite(timestamp) || timestamp < start || timestamp >= start + 86_400_000 || temperature === undefined) continue;
    const probability = finiteValue(period.precipitation_probability);
    if (!periods.has(timestamp)) periods.set(timestamp, {
      timestamp,
      temperature,
      condition: typeof period.condition === "string" ? period.condition : undefined,
      probability: probability !== undefined && probability >= 0 && probability <= 100 ? probability : undefined,
    });
  }
  return [...periods.values()].sort((first, second) => first.timestamp - second.timestamp).slice(0, limit);
}

export interface ForecastSummary {
  kind: "high" | "low";
  temperature: number;
}

function localDateKey(date: Date, timeZone: string): string | undefined {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  } catch {
    return undefined;
  }
}

function localHour(date: Date, timeZone: string): number | undefined {
  try {
    const hour = new Intl.DateTimeFormat("en", {
      timeZone,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(date);
    const value = Number(hour);
    return Number.isInteger(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function finiteNumber(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") {
    return undefined;
  }
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function selectForecastSummary(
  forecast: readonly ForecastPeriod[] | null | undefined,
  now: Date,
  timeZone = "UTC",
): ForecastSummary | undefined {
  if (!forecast?.length || !Number.isFinite(now.getTime())) {
    return undefined;
  }

  const today = localDateKey(now, timeZone);
  if (!today) {
    return undefined;
  }
  const todayPeriods = forecast.flatMap((period) => {
    if (typeof period.datetime !== "string") {
      return [];
    }
    const timestamp = new Date(period.datetime);
    if (!Number.isFinite(timestamp.getTime()) || localDateKey(timestamp, timeZone) !== today) {
      return [];
    }
    return [{ period, timestamp }];
  });
  if (!todayPeriods.length) {
    return undefined;
  }

  const daytime = todayPeriods.find(({ period }) => period.is_daytime === true);
  const nighttime = todayPeriods.find(({ period }) => period.is_daytime === false);
  const nightBoundary = nighttime?.timestamp;
  const isEvening = nightBoundary
    ? now.getTime() >= nightBoundary.getTime()
    : (localHour(now, timeZone) ?? 0) >= 17;

  if (isEvening) {
    const temperature = finiteNumber(nighttime?.period.temperature)
      ?? finiteNumber(daytime?.period.templow)
      ?? finiteNumber(todayPeriods[0].period.templow)
      ?? finiteNumber(nighttime?.period.templow);
    return temperature === undefined ? undefined : { kind: "low", temperature };
  }

  const temperature = finiteNumber(daytime?.period.temperature)
    ?? finiteNumber(todayPeriods[0].period.temperature);
  return temperature === undefined ? undefined : { kind: "high", temperature };
}