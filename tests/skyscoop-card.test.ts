import { afterEach, describe, expect, it } from "vitest";
import "../src/index.js";
import { CARD_TAG, SkyScoopCard } from "../src/skyscoop-card.js";
import { SkyScoopCardEditor } from "../src/skyscoop-card-editor.js";
import type { ForecastSubscriptionEvent, HassLike } from "../src/types.js";

afterEach(() => {
  document.body.replaceChildren();
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

    expect(card.shadowRoot?.querySelector(".temperature")?.textContent).toContain("18.5");
    expect(card.shadowRoot?.querySelector(".unit")?.textContent).toBe("°C");
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

    expect(card.shadowRoot?.querySelector(".message")?.textContent).toContain("Choose a temperature entity");
  });

  it("suggests a temperature sensor in starter configuration", () => {
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
      temperature_entity: "sensor.room_temperature",
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