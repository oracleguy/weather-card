import { describe, expect, it } from "vitest";
import { selectForecastSummary } from "../src/forecast.js";

describe("selectForecastSummary", () => {
  it("uses the actual nighttime period boundary when available", () => {
    const forecast = [
      { datetime: "2026-10-06T06:00:00-07:00", temperature: 21, is_daytime: true },
      { datetime: "2026-10-06T18:30:00-07:00", temperature: 11, is_daytime: false },
    ];

    expect(selectForecastSummary(forecast, new Date("2026-10-07T01:29:00Z"), "America/Los_Angeles"))
      .toEqual({ kind: "high", temperature: 21 });
    expect(selectForecastSummary(forecast, new Date("2026-10-07T01:30:00Z"), "America/Los_Angeles"))
      .toEqual({ kind: "low", temperature: 11 });
  });

  it("uses 17:00 in the configured timezone when period boundaries are absent", () => {
    const forecast = [{ datetime: "2026-10-06T00:00:00-07:00", temperature: 22, templow: 9 }];
    const kiritimatiForecast = [{ datetime: "2026-10-07T00:00:00+14:00", temperature: 22, templow: 9 }];

    expect(selectForecastSummary(kiritimatiForecast, new Date("2026-10-07T04:00:00Z"), "Pacific/Kiritimati"))
      .toEqual({ kind: "low", temperature: 9 });
    expect(selectForecastSummary(forecast, new Date("2026-10-06T23:59:00Z"), "America/Los_Angeles"))
      .toEqual({ kind: "high", temperature: 22 });
    expect(selectForecastSummary(forecast, new Date("2026-10-07T00:00:00Z"), "America/Los_Angeles"))
      .toEqual({ kind: "low", temperature: 9 });
  });

  it("does not select malformed, missing, or non-numeric forecast data", () => {
    expect(selectForecastSummary(null, new Date("2026-10-06T12:00:00Z"))).toBeUndefined();
    expect(selectForecastSummary([{ datetime: "not-a-date", temperature: 20 }], new Date("2026-10-06T12:00:00Z")))
      .toBeUndefined();
    expect(selectForecastSummary([{ datetime: "2026-10-06T00:00:00Z", temperature: "unknown" }], new Date("2026-10-06T12:00:00Z")))
      .toBeUndefined();
  });
});