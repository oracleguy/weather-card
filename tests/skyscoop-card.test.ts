import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index.js";
import { CARD_TAG, SkyScoopCard } from "../src/skyscoop-card.js";
import { SkyScoopCardEditor } from "../src/skyscoop-card-editor.js";
import type { ForecastSubscriptionEvent, HassLike, SkyScoopConfig } from "../src/types.js";

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("SkyScoop card", () => {
  it("registers the Lovelace card and editor", () => {
    expect(customElements.get(CARD_TAG)).toBe(SkyScoopCard);
    expect(customElements.get("skyscoop-card-editor")).toBe(SkyScoopCardEditor);
    expect(window.customCards?.some((card) => card.type === CARD_TAG)).toBe(true);
  });

  it("renders the configured station temperature and unit", async () => {
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({ temperature_entity: "sensor.outdoor_temperature" });
    card.hass = {
      language: "en-US",
      states: {
        "sensor.outdoor_temperature": {
          state: "18.5",
          attributes: { unit_of_measurement: "°C", device_class: "temperature" },
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;

    expect((card.shadowRoot?.querySelector("ha-card") as (HTMLElement & { header?: string }) | null)?.header).toBeUndefined();
    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("18.5");
    expect(card.shadowRoot?.querySelector(".unit")?.textContent).toBe("°C");
  });

  it("uses a trimmed configured name as the card header", async () => {
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({ name: " \t " });
    card.hass = { states: {} };
    document.body.append(card);
    await card.updateComplete;

    expect((card.shadowRoot?.querySelector("ha-card") as (HTMLElement & { header?: string }) | null)?.header).toBeUndefined();
    card.setConfig({ name: "  Backyard  " });
    await card.updateComplete;
    expect((card.shadowRoot?.querySelector("ha-card") as (HTMLElement & { header?: string }) | null)?.header).toBe("Backyard");
  });

  it("subscribes to forecast data and keeps it separate from station temperature", async () => {
    const now = new Date();
    const localDate = now.toISOString().slice(0, 10);
    let receiveForecast: (event: ForecastSubscriptionEvent) => void = () => undefined;
    let subscriptionMessage: unknown;
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({
      temperature_entity: "sensor.outdoor_temperature",
      weather_entity: "weather.home",
    });
    card.hass = {
      language: "en-US",
      config: { time_zone: "UTC" },
      states: {
        "sensor.outdoor_temperature": {
          state: "18.5",
          attributes: { unit_of_measurement: "°C" },
        },
        "weather.home": {
          state: "sunny",
          attributes: { supported_features: 1, temperature_unit: "°F" },
        },
      },
      connection: {
        subscribeMessage: async <T,>(callback: (event: T) => void, message: unknown) => {
          receiveForecast = callback as (event: ForecastSubscriptionEvent) => void;
          subscriptionMessage = message;
          return () => undefined;
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;

    expect(subscriptionMessage).toEqual({
      type: "weather/subscribe_forecast",
      forecast_type: "daily",
      entity_id: "weather.home",
    });

    receiveForecast({
      type: "daily",
      forecast: [{ datetime: `${localDate}T00:00:00Z`, temperature: 27, templow: 13 }],
    });
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("18.5");
    expect(card.shadowRoot?.querySelector(".forecast-value")?.textContent).toMatch(/27|13/);
    expect(card.shadowRoot?.querySelector(".temperature-row")?.classList.contains("has-forecast")).toBe(true);
    expect(card.shadowRoot?.querySelector(".current-condition-icon ha-icon")?.getAttribute("icon")).toBe("mdi:weather-sunny");
    expect(card.shadowRoot?.querySelector("ha-card")?.getAttribute("data-weather-tone")).toBe("warm");
    expect(card.shadowRoot?.querySelector(".forecast-summary .unit")?.textContent).toBe("°F");
  });

  it("shows an unavailable value when the entity is missing or invalid", async () => {
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({ temperature_entity: "sensor.missing_temperature" });
    card.hass = { states: {} };
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("Unavailable");
  });

  it("offers a setup prompt for starter config without a temperature entity", async () => {
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({});
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".message")?.textContent).toContain("outdoor weather-station temperature sensor");
  });

  it("does not guess whether a temperature sensor is outdoors", () => {
    const hass: HassLike = {
      states: {
        "sensor.room_temperature": {
          state: "20",
          attributes: { device_class: "temperature" },
        },
        "sensor.humidity": {
          state: "55",
          attributes: { device_class: "humidity" },
        },
      },
    };

    expect(SkyScoopCard.getStubConfig(hass)).toEqual({
      type: "custom:skyscoop-card",
    });
  });

  it("dispatches the updated configuration from the visual editor", async () => {
    const editor = document.createElement("skyscoop-card-editor") as SkyScoopCardEditor;
    editor.setConfig({ type: "custom:skyscoop-card" });
    document.body.append(editor);
    await editor.updateComplete;
    const picker = editor.shadowRoot?.querySelector("ha-entity-picker");
    let changedConfig: unknown;
    editor.addEventListener("config-changed", (event) => {
      changedConfig = (event as CustomEvent).detail.config;
    });

    picker?.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: "sensor.outdoor_temperature" },
      bubbles: true,
      composed: true,
    }));

    expect(changedConfig).toEqual({
      type: "custom:skyscoop-card",
      temperature_entity: "sensor.outdoor_temperature",
    });
  });

  it("edits and clears the optional card header", async () => {
    const editor = document.createElement("skyscoop-card-editor") as SkyScoopCardEditor;
    editor.setConfig({ type: "custom:skyscoop-card" });
    document.body.append(editor);
    await editor.updateComplete;
    const input = editor.shadowRoot?.querySelector<HTMLInputElement>(".name-field input");
    let changedConfig: unknown;
    editor.addEventListener("config-changed", (event) => {
      changedConfig = (event as CustomEvent).detail.config;
    });

    input!.value = "Backyard";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    expect(changedConfig).toEqual({ type: "custom:skyscoop-card", name: "Backyard" });

    input!.value = "";
    input!.dispatchEvent(new Event("input", { bubbles: true }));
    expect(changedConfig).toEqual({ type: "custom:skyscoop-card" });
  });

  it("edits the weather entity without dropping the temperature entity", async () => {
    const editor = document.createElement("skyscoop-card-editor") as SkyScoopCardEditor;
    editor.setConfig({
      type: "custom:skyscoop-card",
      temperature_entity: "sensor.outdoor_temperature",
    });
    document.body.append(editor);
    await editor.updateComplete;
    const picker = editor.shadowRoot?.querySelectorAll("ha-entity-picker")[1];
    let changedConfig: unknown;
    editor.addEventListener("config-changed", (event) => {
      changedConfig = (event as CustomEvent).detail.config;
    });

    picker?.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: "weather.home" },
      bubbles: true,
      composed: true,
    }));

    expect(changedConfig).toEqual({
      type: "custom:skyscoop-card",
      temperature_entity: "sensor.outdoor_temperature",
      weather_entity: "weather.home",
    });
  });
});

describe("station metrics, hourly forecasts and layouts", () => {
  async function forecastCard(features = 3) {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-07T12:00:00Z"));
    const callbacks = new Map<string, (event: ForecastSubscriptionEvent) => void>();
    const unsubscribe = vi.fn();
    const subscribeMessage = vi.fn(async <T,>(callback: (event: T) => void, message: { forecast_type: string }) => {
      callbacks.set(message.forecast_type, callback as (event: ForecastSubscriptionEvent) => void);
      return unsubscribe;
    });
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({ temperature_entity: "sensor.outdoor", weather_entity: "weather.home" });
    card.hass = {
      language: "en-US", config: { time_zone: "UTC" },
      states: {
        "sensor.outdoor": { state: "-2.5", attributes: { unit_of_measurement: "°C" } },
        "weather.home": { state: "sunny", attributes: { supported_features: features, temperature_unit: "°F" } },
      },
      connection: { subscribeMessage },
    };
    document.body.append(card);
    await card.updateComplete;
    await card.updateComplete;
    return { card, callbacks, unsubscribe, subscribeMessage };
  }

  it("renders hourly-only integrations without replacing station readings", async () => {
    const { card, callbacks, subscribeMessage } = await forecastCard(2);
    expect(subscribeMessage).toHaveBeenCalledOnce();
    expect(card.shadowRoot?.querySelector(".hourly")?.textContent).toContain("Loading hourly");
    callbacks.get("hourly")?.({ type: "hourly", forecast: [
      { datetime: "2026-10-07T13:00:00Z", temperature: 0, condition: "sunny", precipitation_probability: 0 },
    ] });
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("-2.5");
    expect(card.shadowRoot?.querySelector(".hourly-temperature")?.textContent).toContain("0 °F");
    expect(card.shadowRoot?.querySelector(".hourly-probability")?.getAttribute("aria-label")).toContain("0%");
    expect(card.shadowRoot?.querySelector(".hourly-period > ha-icon")?.getAttribute("aria-label")).toBe("Sunny");
    expect(card.shadowRoot?.querySelector(".forecast-value")?.textContent).toContain("Forecast unavailable");
  });

  it("preserves daily data when hourly is disabled and cleans up on detach/reconnect", async () => {
    const { card, callbacks, unsubscribe, subscribeMessage } = await forecastCard();
    callbacks.get("daily")?.({ type: "daily", forecast: [{ datetime: "2026-10-07T00:00:00Z", temperature: 25, templow: 5 }] });
    card.setConfig({ ...card.config, show_hourly_forecast: false });
    await card.updateComplete;
    callbacks.get("hourly")?.({ type: "hourly", forecast: [{ datetime: "2026-10-07T13:00:00Z", temperature: 99 }] });
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".hourly")).toBeNull();
    expect(card.shadowRoot?.querySelector(".forecast-value")?.textContent).toContain("25");
    expect(unsubscribe).toHaveBeenCalledOnce();
    card.remove();
    expect(unsubscribe).toHaveBeenCalledTimes(2);
    document.body.append(card);
    await card.updateComplete;
    expect(subscribeMessage).toHaveBeenCalledTimes(3);
  });

  it("updates all configured metrics from hass and retains source units and unavailable states", async () => {
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({ temperature_entity: "sensor.outdoor", humidity_entity: "sensor.humidity", dew_point_entity: "sensor.dew",
      wind_speed_entity: "sensor.wind", wind_gust_entity: "sensor.gust", wind_direction_entity: "sensor.direction",
      uv_index_entity: "sensor.uv", illuminance_entity: "sensor.lux", layout: "compact" });
    card.hass = { language: "de-DE", states: {
      "sensor.outdoor": { state: "", attributes: {} },
      "sensor.humidity": { state: "0", attributes: { unit_of_measurement: "%" } },
      "sensor.dew": { state: "-4.5", attributes: { unit_of_measurement: "°C" } },
      "sensor.wind": { state: "3.5", attributes: { unit_of_measurement: "m/s" } },
      "sensor.direction": { state: "-337.5", attributes: { unit_of_measurement: "°" } },
      "sensor.uv": { state: "0", attributes: {} },
      "sensor.lux": { state: "1000", attributes: { unit_of_measurement: "lx" } },
    } };
    document.body.append(card);
    await card.updateComplete;
    const metric = (key: string) => card.shadowRoot?.querySelector(`[data-metric="${key}"] .metric-value`)?.textContent;
    expect(card.shadowRoot?.querySelectorAll(".metric")).toHaveLength(7);
    expect(metric("humidity_entity")).toContain("0 %");
    expect(metric("dew_point_entity")).toContain("-4,5 °C");
    expect(metric("wind_speed_entity")).toContain("3,5 m/s");
    expect(metric("wind_direction_entity")).toContain("NE (22,5°)");
    expect(metric("wind_gust_entity")).toContain("Unavailable");
    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("Unavailable");
    card.hass = { ...card.hass, states: { ...card.hass.states, "sensor.wind": { state: "0", attributes: { unit_of_measurement: "m/s" } } } };
    await card.updateComplete;
    expect(metric("wind_speed_entity")).toContain("0 m/s");
    expect(card.getCardSize()).toBeGreaterThan(2);
  });

  it("observes actual width, ignores zero widths, and disconnects the observer", async () => {
    let resize!: ResizeObserverCallback;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal("ResizeObserver", class {
      constructor(callback: ResizeObserverCallback) { resize = callback; }
      observe = observe;
      disconnect = disconnect;
    });
    const { card, callbacks } = await forecastCard(2);
    const entries = Array.from({ length: 12 }, (_, index) => ({ datetime: new Date(Date.parse("2026-10-07T13:00:00Z") + index * 3_600_000).toISOString(), temperature: index }));
    callbacks.get("hourly")?.({ type: "hourly", forecast: entries });
    const emitWidth = (width: number) => resize([{ contentRect: { width } } as ResizeObserverEntry], {} as ResizeObserver);
    expect(observe).toHaveBeenCalledWith(card);
    for (const [width, layout] of [[359, "compact"], [360, "standard"], [600, "wide"], [0, "wide"]] as const) {
      emitWidth(width);
      await card.updateComplete;
      expect(card.shadowRoot?.querySelector("ha-card")?.getAttribute("data-layout")).toBe(layout);
      expect(card.shadowRoot?.querySelectorAll(".hourly-period")).toHaveLength(layout === "compact" ? 4 : layout === "standard" ? 8 : 12);
    }
    card.remove();
    expect(disconnect).toHaveBeenCalledOnce();
    document.body.append(card);
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it("refreshes the high/low and hourly horizon with the minute timer", async () => {
    const { card, callbacks } = await forecastCard();
    callbacks.get("daily")?.({ type: "daily", forecast: [{ datetime: "2026-10-07T00:00:00Z", temperature: 25, templow: 5 }] });
    callbacks.get("hourly")?.({ type: "hourly", forecast: [{ datetime: "2026-10-07T13:00:00Z", temperature: 12 }] });
    await card.updateComplete;
    expect(card.shadowRoot?.querySelectorAll(".hourly-period")).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(5 * 3_600_000);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelectorAll(".hourly-period")).toHaveLength(0);
    expect(card.shadowRoot?.querySelector(".forecast-value")?.textContent).toContain("5");
    expect(card.shadowRoot?.querySelector(".forecast-summary .label")?.textContent).toContain("Tonight");
  });

  it("edits every optional mapping, layout, and hourly visibility without mutating input", async () => {
    const editor = document.createElement("skyscoop-card-editor") as SkyScoopCardEditor;
    const original = { temperature_entity: "sensor.outdoor", weather_entity: "weather.home", name: "Garden", layout: "wide" as const };
    editor.setConfig(original);
    document.body.append(editor);
    await editor.updateComplete;
    const changes: unknown[] = [];
    editor.addEventListener("config-changed", (event) => changes.push((event as CustomEvent).detail.config));
    expect((editor.shadowRoot?.querySelector("ha-entity-picker") as HTMLElement & { label: string }).label).toContain("Outdoor");
    const keys = ["humidity_entity", "dew_point_entity", "wind_speed_entity", "wind_gust_entity", "wind_direction_entity", "uv_index_entity", "illuminance_entity"] as const;
    for (const [index, key] of keys.entries()) {
      const picker = editor.shadowRoot?.querySelectorAll("details ha-entity-picker")[index];
      picker?.dispatchEvent(new CustomEvent("value-changed", { detail: { value: `sensor.${key}` } }));
      expect(editor.config[key]).toBe(`sensor.${key}`);
      picker?.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "" } }));
      expect(editor.config[key]).toBeUndefined();
    }
    const select = editor.shadowRoot?.querySelector("select") as HTMLSelectElement;
    expect(select.value).toBe("wide");
    select.value = "compact";
    select.dispatchEvent(new Event("change"));
    const checkbox = editor.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change"));
    expect(editor.config).toEqual({ ...original, layout: "compact", show_hourly_forecast: false });
    expect(original.layout).toBe("wide");
    expect(changes).toHaveLength(16);
  });

  it("rejects invalid layout and hourly options", () => {
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    expect(() => card.setConfig({ layout: "other" as any })).toThrow("layout");
    expect(() => card.setConfig({ show_hourly_forecast: "false" as any })).toThrow("boolean");
  });
});

describe("rainfall and adaptive presentation", () => {
  it("edits and clears rainfall mappings and toggles without mutating or dropping existing options", async () => {
    const editor = document.createElement("skyscoop-card-editor") as SkyScoopCardEditor;
    const original = { temperature_entity: "sensor.outdoor", weather_entity: "weather.home", name: "Backyard", layout: "wide" as const };
    editor.setConfig(original);
    document.body.append(editor);
    await editor.updateComplete;
    const events: CustomEvent[] = [];
    editor.addEventListener("config-changed", (event) => events.push(event as CustomEvent));
    for (const key of ["rain_state_entity", "rainfall_rate_entity", "rainfall_today_entity", "rainfall_week_entity"] as const) {
      const picker = editor.shadowRoot?.querySelector(`[data-entity-key="${key}"]`) as HTMLElement & { includeDomains: string[] };
      const domain = key === "rain_state_entity" ? "binary_sensor" : "sensor";
      expect(picker.includeDomains).toEqual([domain]);
      picker.dispatchEvent(new CustomEvent("value-changed", { detail: { value: `${domain}.${key}` } }));
      expect(editor.config[key]).toBe(`${domain}.${key}`);
      picker.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "" } }));
      expect(editor.config[key]).toBeUndefined();
    }
    for (const key of ["adaptive_metrics", "show_rainfall_history"] as const) {
      const input = editor.shadowRoot?.querySelector(`[data-option="${key}"]`) as HTMLInputElement;
      expect(input.checked).toBe(true);
      input.checked = false;
      input.dispatchEvent(new Event("change"));
      expect(editor.config[key]).toBe(false);
    }
    expect(editor.config).toEqual({ ...original, adaptive_metrics: false, show_rainfall_history: false });
    expect(original).not.toHaveProperty("adaptive_metrics");
    expect(events).toHaveLength(10);
    expect(events.every((event) => event.bubbles && event.composed)).toBe(true);
  });

  async function rainfallCard(config: SkyScoopConfig = {}) {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-07T12:00:00Z"));
    const callApi = vi.fn().mockResolvedValue([[{
      state: "0", last_changed: "2026-10-06T12:00:00Z", attributes: { unit_of_measurement: "mm/h" },
    }, { state: "8", last_changed: "2026-10-07T11:00:00Z", attributes: { unit_of_measurement: "mm/h" } }]]);
    const card = document.createElement(CARD_TAG) as SkyScoopCard;
    card.setConfig({ temperature_entity: "sensor.outdoor", rainfall_rate_entity: "sensor.rate",
      rainfall_today_entity: "sensor.today", rainfall_week_entity: "sensor.week", ...config });
    card.hass = { language: "de-DE", config: { time_zone: "UTC" }, callApi, states: {
      "sensor.outdoor": { state: "18", attributes: { unit_of_measurement: "°C" } },
      "sensor.rate": { state: "8", attributes: { unit_of_measurement: "mm/h" } },
      "sensor.today": { state: "12.5", attributes: { unit_of_measurement: "mm" } },
      "sensor.week": { state: "unavailable", attributes: { unit_of_measurement: "mm" } },
      "sensor.wind": { state: "8", attributes: { unit_of_measurement: "m/s" } },
      "sensor.uv": { state: "6", attributes: {} },
    } };
    document.body.append(card);
    await card.updateComplete;
    await card.updateComplete;
    return { card, callApi };
  }

  it("renders source totals, unavailable readings and a labeled hourly-peak plot", async () => {
    const { card, callApi } = await rainfallCard();
    expect(callApi).toHaveBeenCalledOnce();
    expect(card.shadowRoot?.querySelector('[data-rainfall="rainfall_today_entity"]')?.textContent).toContain("12,5 mm");
    expect(card.shadowRoot?.querySelector('[data-rainfall="rainfall_week_entity"]')?.textContent).toContain("Unavailable");
    expect(card.shadowRoot?.querySelector(".rainfall")?.getAttribute("data-emphasis")).toBe("heavy");
    expect(card.shadowRoot?.querySelector(".rainfall-status")?.textContent).toContain("Heavy rain");
    expect(card.shadowRoot?.querySelector(".rainfall-plot")?.getAttribute("aria-label")).toContain("Peak rate: 8 mm/h");
    expect(card.shadowRoot?.querySelector(".rainfall-plot path")?.getAttribute("d")).toContain("H240");
    expect(card.getCardSize()).toBeGreaterThan(5);
  });

  it("keeps metric order and rain data when adaptation or history is disabled", async () => {
    const { card, callApi } = await rainfallCard({ wind_speed_entity: "sensor.wind", uv_index_entity: "sensor.uv", humidity_entity: "sensor.missing" });
    const keys = () => [...card.shadowRoot!.querySelectorAll("[data-metric]")].map((metric) => metric.getAttribute("data-metric"));
    const before = keys();
    expect(card.shadowRoot?.querySelector('[data-metric="wind_speed_entity"] .metric-reason')?.textContent).toBe("Strong wind");
    expect(card.shadowRoot?.querySelector('[data-metric="uv_index_entity"] .metric-reason')?.textContent).toBe("High UV");
    const size = card.getCardSize();
    card.setConfig({ ...card.config, adaptive_metrics: false, show_rainfall_history: false });
    await card.updateComplete;
    await card.updateComplete;
    expect(keys()).toEqual(before);
    expect(card.shadowRoot?.querySelector(".metric-reason")?.textContent).toBe("");
    expect(card.shadowRoot?.querySelector(".rainfall")?.getAttribute("data-emphasis")).toBe("none");
    expect(card.shadowRoot?.querySelector(".rainfall-status")?.textContent).toContain("Heavy rain");
    expect(card.shadowRoot?.querySelector(".rainfall-history")).toBeNull();
    expect(card.shadowRoot?.querySelectorAll(".rainfall-metric")).toHaveLength(3);
    expect(card.getCardSize()).toBe(size - 3);
    await vi.advanceTimersByTimeAsync(600_000);
    expect(callApi).toHaveBeenCalledOnce();
  });

  it("isolates history errors and marks previously fetched history stale", async () => {
    const { card, callApi } = await rainfallCard();
    callApi.mockRejectedValue(new Error("recorder offline"));
    await vi.advanceTimersByTimeAsync(300_000);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".rainfall-history-status")?.textContent).toContain("History stale");
    expect(card.shadowRoot?.querySelector(".rainfall-plot")).not.toBeNull();
    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("18");
    card.setConfig({ ...card.config, rainfall_rate_entity: "sensor.other" });
    await card.updateComplete;
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".rainfall-placeholder")?.textContent).toContain("Rain history unavailable");
    expect(card.shadowRoot?.querySelector('[data-rainfall="rainfall_today_entity"]')?.textContent).toContain("12,5");
  });

  it("distinguishes loading, empty, dry and missing-API history without suppressing measurements", async () => {
    const { card, callApi } = await rainfallCard();
    callApi.mockImplementation(() => new Promise(() => undefined));
    card.setConfig({ ...card.config, rainfall_rate_entity: "sensor.pending" });
    await card.updateComplete;
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".rainfall-placeholder")?.textContent).toContain("Loading rain history");
    callApi.mockResolvedValue([]);
    card.setConfig({ ...card.config, rainfall_rate_entity: "sensor.empty" });
    await card.updateComplete;
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".rainfall-placeholder")?.textContent).toContain("No usable rain history");
    callApi.mockResolvedValue([[{ state: "0", last_changed: "2026-10-06T12:00:00Z", attributes: { unit_of_measurement: "mm/h" } }]]);
    card.setConfig({ ...card.config, rainfall_rate_entity: "sensor.rate" });
    await card.updateComplete;
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".rainfall-plot path")?.getAttribute("d")).toContain("M0,74.00 H10");
    expect(card.shadowRoot?.querySelector(".rainfall-caption")?.textContent).toContain("Peak rate: 0 mm/h");
    card.hass = { ...card.hass!, callApi: undefined };
    await card.updateComplete;
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".rainfall-placeholder")?.textContent).toContain("Rain history unavailable");
    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("18");
  });

  it("does not fetch on unrelated hass updates and cleans up through disconnect/reconnect", async () => {
    const { card, callApi } = await rainfallCard();
    card.hass = { ...card.hass!, states: { ...card.hass!.states } };
    await card.updateComplete;
    expect(callApi).toHaveBeenCalledOnce();
    card.remove();
    await vi.advanceTimersByTimeAsync(600_000);
    expect(callApi).toHaveBeenCalledOnce();
    document.body.append(card);
    await card.updateComplete;
    await card.updateComplete;
    expect(callApi).toHaveBeenCalledTimes(2);
  });

  it("supports state-only, totals-only and unmapped configurations without requesting history", async () => {
    const { card, callApi } = await rainfallCard({ rainfall_rate_entity: undefined, rainfall_today_entity: undefined,
      rainfall_week_entity: undefined, rain_state_entity: "binary_sensor.missing" });
    expect(callApi).not.toHaveBeenCalled();
    expect(card.shadowRoot?.querySelector(".rainfall-status")?.textContent).toContain("Rain status unavailable");
    expect(card.shadowRoot?.querySelectorAll(".rainfall-metric")).toHaveLength(0);
    card.setConfig({ rainfall_today_entity: "sensor.today" });
    await card.updateComplete;
    expect(card.shadowRoot?.querySelectorAll(".rainfall-metric")).toHaveLength(1);
    card.setConfig({});
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".rainfall")).toBeNull();
    expect(callApi).not.toHaveBeenCalled();
    for (const key of ["adaptive_metrics", "show_rainfall_history"] as const) {
      expect(() => card.setConfig({ [key]: "false" })).toThrow("boolean");
    }
  });
});