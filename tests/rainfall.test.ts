import { describe, expect, it } from "vitest";
import { configuredRainfall, HOUR, observedRain, prepareRainfallHistory } from "../src/rainfall.js";
import type { RainfallHistoryState } from "../src/types.js";

const end = Date.parse("2026-11-01T12:00:00Z");
const start = end - 24 * HOUR;
const record = (time: number, state: string, unit = "mm/h"): RainfallHistoryState => ({
  last_changed: new Date(time).toISOString(), state, attributes: { unit_of_measurement: unit },
});

describe("rainfall observations", () => {
  it("keeps configured readings, units and zero while rejecting negative and unavailable values", () => {
    const readings = configuredRainfall({ states: {
      "sensor.rate": { state: "0", attributes: { unit_of_measurement: "in/h" } },
      "sensor.today": { state: "-1", attributes: {} },
    } }, { rainfall_rate_entity: "sensor.rate", rainfall_today_entity: "sensor.today", rainfall_week_entity: "sensor.missing" });
    expect(readings.map((reading) => reading.value)).toEqual([0, undefined, undefined]);
    expect(readings[0].unit).toBe("in/h");
    expect(configuredRainfall(undefined, {})).toEqual([]);
  });

  it("uses on/off authoritatively, falling back to measured rate only", () => {
    const config = { rain_state_entity: "binary_sensor.rain", rainfall_rate_entity: "sensor.rate" };
    const hass = { states: {
      "binary_sensor.rain": { state: "off", attributes: {} },
      "sensor.rate": { state: "5", attributes: {} },
    } };
    expect(observedRain(hass, config)).toBe("dry");
    hass.states["binary_sensor.rain"].state = "on";
    hass.states["sensor.rate"].state = "0";
    expect(observedRain(hass, config)).toBe("wet");
    hass.states["binary_sensor.rain"].state = "unavailable";
    expect(observedRain(hass, config)).toBe("dry");
    hass.states["sensor.rate"].state = "0.1";
    expect(observedRain(hass, config)).toBe("wet");
    hass.states["sensor.rate"].state = "-1";
    expect(observedRain(hass, config)).toBe("unknown");
    expect(observedRain({ states: { "weather.home": { state: "pouring", attributes: {} } } }, {})).toBe("unknown");
  });
});

describe("hourly peak rain-rate history", () => {
  it("distinguishes an unchanged dry day from no history across a DST boundary", () => {
    const dry = prepareRainfallHistory([record(start - HOUR, "0")], end, "mm/h");
    expect(dry).toHaveLength(24);
    expect(dry.map((bucket) => bucket.peak)).toEqual(Array(24).fill(0));
    expect(dry[23].start - dry[0].start).toBe(23 * HOUR);
    expect(prepareRainfallHistory([], end, "mm/h").every((bucket) => bucket.peak === undefined)).toBe(true);
  });

  it("sorts, clips, collapses duplicates and retains short intensity peaks", () => {
    const records = [record(start + HOUR / 2, "8"), record(start - HOUR, "1"),
      record(start + HOUR / 2, "10"), record(start + HOUR, "0"), record(end + HOUR, "999")];
    const peaks = prepareRainfallHistory(records, end, "mm/h").map((bucket) => bucket.peak);
    expect(peaks).toEqual([10, ...Array(23).fill(0)]);
  });

  it("does not backfill the start, bridge unavailable intervals or extend stale coverage", () => {
    const records = [record(start + HOUR / 2, "3"), record(start + HOUR, "unknown"), record(start + 2 * HOUR, "0")];
    const peaks = prepareRainfallHistory(records, end, "mm/h", end - HOUR).map((bucket) => bucket.peak);
    expect(peaks.slice(0, 3)).toEqual([undefined, undefined, 0]);
    expect(peaks[23]).toBeUndefined();
  });

  it("leaves gaps for invalid readings, timestamps and incompatible or missing units", () => {
    for (const state of ["unavailable", "", "-1", "NaN", "Infinity"]) {
      expect(prepareRainfallHistory([record(start, state)], end, "mm/h")[0].peak).toBeUndefined();
    }
    const records = [record(start, "1"), record(start + HOUR, "1", "in/h"),
      { ...record(start + 2 * HOUR, "1"), attributes: {} }, record(start + 3 * HOUR, "2"),
      { state: "999", last_changed: "invalid" }];
    expect(prepareRainfallHistory(records, end, "mm/h").slice(0, 4).map((bucket) => bucket.peak))
      .toEqual([1, undefined, undefined, 2]);
    expect(prepareRainfallHistory([record(start, "1")], end, "")[0].peak).toBeUndefined();
  });
});