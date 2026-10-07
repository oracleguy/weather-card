import { describe, expect, it } from "vitest";
import { metricEmphasis } from "../src/metric-priority.js";
import type { HassLike, SkyScoopConfig } from "../src/types.js";

const config: SkyScoopConfig = {
  wind_speed_entity: "sensor.wind", wind_gust_entity: "sensor.gust", wind_direction_entity: "sensor.direction",
  uv_index_entity: "sensor.uv", rainfall_rate_entity: "sensor.rate", rain_state_entity: "binary_sensor.rain",
};
function observations(wind = "8", unit = "m/s"): HassLike {
  return { states: {
    "sensor.wind": { state: wind, attributes: { unit_of_measurement: unit } },
    "sensor.gust": { state: "unavailable", attributes: { unit_of_measurement: "mph" } },
    "sensor.direction": { state: "90", attributes: {} },
    "sensor.uv": { state: "6", attributes: {} },
    "sensor.rate": { state: "7.5", attributes: { unit_of_measurement: "mm/h" } },
    "binary_sensor.rain": { state: "on", attributes: {} },
  } };
}

describe("measured-condition emphasis", () => {
  it("supports simultaneous wind, UV and heavy-rain signals without promoting unavailable metrics", () => {
    expect(metricEmphasis(observations(), config)).toEqual({
      metrics: { wind_speed_entity: "strongWind", wind_direction_entity: "strongWind", uv_index_entity: "highUv" },
      rain: "wet", heavyRain: true, rainfall: "heavy",
    });
  });

  it("handles exact boundaries and equivalent wind units", () => {
    for (const [unit, threshold] of [["m/s", 8], ["km/h", 28.8], ["mph", 8 / 0.44704], ["kn", 8 / 0.5144444444444445], ["knots", 8 / 0.5144444444444445]] as const) {
      expect(metricEmphasis(observations(String(threshold), unit), config).metrics.wind_speed_entity).toBe("strongWind");
      expect(metricEmphasis(observations(String(threshold - 0.001), unit), config).metrics.wind_speed_entity).toBeUndefined();
    }
    const hass = observations("7.99");
    hass.states["sensor.uv"].state = "5.99";
    hass.states["sensor.rate"].state = "7.49";
    expect(metricEmphasis(hass, config)).toEqual({ metrics: {}, rain: "wet", heavyRain: false, rainfall: "wet" });
  });

  it("allows gust to trigger wind emphasis and compares imperial rainfall without changing readings", () => {
    const hass = observations("0");
    hass.states["sensor.gust"].state = "20";
    hass.states["sensor.rate"] = { state: String(7.5 / 25.4), attributes: { unit_of_measurement: "in/h" } };
    expect(metricEmphasis(hass, config).metrics.wind_gust_entity).toBe("strongWind");
    expect(metricEmphasis(hass, config).heavyRain).toBe(true);
    expect(hass.states["sensor.rate"].attributes.unit_of_measurement).toBe("in/h");
  });

  it("skips unknown units and readings but respects binary rain-state conflicts", () => {
    const hass = observations("1000", "unknown");
    hass.states["sensor.rate"].attributes.unit_of_measurement = "unknown";
    expect(metricEmphasis(hass, config).metrics.wind_speed_entity).toBeUndefined();
    expect(metricEmphasis(hass, config).heavyRain).toBe(false);
    expect(metricEmphasis(hass, config).rain).toBe("wet");
    hass.states["binary_sensor.rain"].state = "off";
    hass.states["sensor.rate"].attributes.unit_of_measurement = "mm/h";
    expect(metricEmphasis(hass, config).rainfall).toBe("none");
    expect(metricEmphasis(undefined, config).metrics).toEqual({});
  });

  it("disables emphasis without hiding measured rain or heavy-rain status", () => {
    expect(metricEmphasis(observations(), { ...config, adaptive_metrics: false }))
      .toEqual({ metrics: {}, rain: "wet", heavyRain: true, rainfall: "none" });
  });
});