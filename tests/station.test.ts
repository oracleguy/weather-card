import { describe, expect, it } from "vitest";
import { configuredMetrics, finiteValue } from "../src/station.js";
import { compassPoint, normalizeDegrees } from "../src/compass.js";

describe("station readings", () => {
  it("rejects invalid states without losing zero or negative temperatures", () => {
    for (const value of [undefined, null, "", " ", "unknown", "unavailable", "NaN", Infinity]) {
      expect(finiteValue(value)).toBeUndefined();
    }
    expect(finiteValue("0")).toBe(0);
    expect(finiteValue("-12.5")).toBe(-12.5);
  });

  it("only returns configured metrics and isolates unavailable readings", () => {
    const metrics = configuredMetrics({ states: {
      "sensor.humidity": { state: "101", attributes: {} },
      "sensor.dew": { state: "-5", attributes: { unit_of_measurement: "°C" } },
    } }, { humidity_entity: "sensor.humidity", dew_point_entity: "sensor.dew", wind_gust_entity: "sensor.missing" });
    expect(metrics).toHaveLength(3);
    expect(metrics.map((metric) => metric.value)).toEqual([undefined, -5, undefined]);
    expect(metrics.map((metric) => metric.entityId)).toEqual(["sensor.humidity", "sensor.dew", "sensor.missing"]);
    expect(metrics[1].unit).toBe("°C");
  });
});

describe("compass conversion", () => {
  it("normalizes north, negative and over-range degrees", () => {
    for (const value of [0, 360, 720, -360]) expect(compassPoint(value)).toBe("N");
    expect(normalizeDegrees(-90)).toBe(270);
    expect(compassPoint(-90)).toBe("W");
    expect(compassPoint(Infinity)).toBeUndefined();
  });

  it("rounds at 8 and 16 sector boundaries", () => {
    expect(compassPoint(22.49, 8)).toBe("N");
    expect(compassPoint(22.5, 8)).toBe("NE");
    expect(compassPoint(11.24, 16)).toBe("N");
    expect(compassPoint(11.25, 16)).toBe("NNE");
    expect(compassPoint(348.75, 16)).toBe("N");
  });
});