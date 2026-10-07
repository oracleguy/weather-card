import { describe, expect, it } from "vitest";
import { selectHourlyForecast } from "../src/forecast.js";
import { selectLayout } from "../src/responsive.js";

describe("hourly forecast", () => {
  const now = new Date("2026-10-07T12:00:00Z");
  it("sorts, deduplicates, and limits valid future periods within 24 hours", () => {
    const forecast = [
      { datetime: "2026-10-07T14:00:00Z", temperature: 12, precipitation_probability: 0 },
      { datetime: "2026-10-07T13:00:00Z", temperature: 0, precipitation_probability: 110 },
      { datetime: "2026-10-07T13:00:00Z", temperature: 999 },
      { datetime: "2026-10-07T11:00:00Z", temperature: 10 },
      { datetime: "2026-10-08T12:00:00Z", temperature: 10 },
      { datetime: "bad", temperature: 10 },
      { datetime: "2026-10-07T15:00:00Z", temperature: "" },
    ];
    const result = selectHourlyForecast(forecast, now, 12);
    expect(result.map((period) => period.temperature)).toEqual([0, 12]);
    expect(result.map((period) => period.probability)).toEqual([undefined, 0]);
    expect(selectHourlyForecast(forecast, now, 1)).toHaveLength(1);
    expect(selectHourlyForecast(undefined, now, 12)).toEqual([]);
    expect(selectHourlyForecast(forecast, new Date("bad"), 12)).toEqual([]);
  });
});

describe("allocated-width layout", () => {
  it("selects exact boundaries and defaults to standard before measurement", () => {
    expect([280, 359, 360, 599, 600, 900].map((width) => selectLayout(width))).toEqual([
      "compact", "compact", "standard", "standard", "wide", "wide",
    ]);
    expect(selectLayout(0)).toBe("standard");
    expect(selectLayout(NaN)).toBe("standard");
    expect(selectLayout(280, "wide")).toBe("wide");
  });
});