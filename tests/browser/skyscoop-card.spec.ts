import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { mdiWaterPercent, mdiThermometer, mdiThermometerChevronUp, mdiThermometerChevronDown, mdiThermometerWater, mdiWeatherWindy, mdiCompassOutline, mdiWeatherSunnyAlert, mdiBrightness6, mdiWeatherCloudy, mdiWeatherRainy, mdiWeatherSunny, mdiWater } from "@mdi/js";

const fixtureIcons = {
  "mdi:water-percent": mdiWaterPercent, "mdi:thermometer": mdiThermometer,
  "mdi:thermometer-chevron-up": mdiThermometerChevronUp,
  "mdi:thermometer-chevron-down": mdiThermometerChevronDown,
  "mdi:thermometer-water": mdiThermometerWater,
  "mdi:weather-windy": mdiWeatherWindy, "mdi:compass-outline": mdiCompassOutline,
  "mdi:weather-sunny-alert": mdiWeatherSunnyAlert, "mdi:brightness-6": mdiBrightness6,
  "mdi:weather-cloudy": mdiWeatherCloudy, "mdi:weather-rainy": mdiWeatherRainy, "mdi:water": mdiWater,
  "mdi:weather-sunny": mdiWeatherSunny,
};

async function mountCompleteCard(page: Page, width: number, language = "en-US") {
  await page.clock.install({ time: new Date("2026-10-07T12:00:00Z") });
  await page.evaluate(async ({ width, language }) => {
    const card = document.createElement("skyscoop-card") as any;
    card.style.width = `${width}px`;
    card.setConfig({
      temperature_entity: "sensor.outdoor", weather_entity: "weather.home",
      humidity_entity: "sensor.humidity", dew_point_entity: "sensor.dew",
      wind_speed_entity: "sensor.wind", wind_gust_entity: "sensor.gust",
      wind_direction_entity: "sensor.direction", uv_index_entity: "sensor.uv", illuminance_entity: "sensor.lux",
    });
    card.hass = {
      language, config: { time_zone: "America/Los_Angeles" },
      states: {
        "sensor.outdoor": { state: "18.5", attributes: { unit_of_measurement: "°C" } },
        "sensor.humidity": { state: "76", attributes: { unit_of_measurement: "%" } },
        "sensor.dew": { state: "12.5", attributes: { unit_of_measurement: "°C" } },
        "sensor.wind": { state: "3.5", attributes: { unit_of_measurement: "m/s" } },
        "sensor.gust": { state: "7", attributes: { unit_of_measurement: "m/s" } },
        "sensor.direction": { state: "360", attributes: { unit_of_measurement: "°" } },
        "sensor.uv": { state: "0", attributes: {} },
        "sensor.lux": { state: "12400", attributes: { unit_of_measurement: "lx" } },
        "weather.home": { state: "sunny", attributes: { supported_features: 3, temperature_unit: "°F" } },
      },
      connection: {
        subscribeMessage: async (callback: (event: any) => void, message: any) => {
          callback({ type: message.forecast_type, forecast: message.forecast_type === "daily"
            ? [{ datetime: "2026-10-07T12:00:00Z", temperature: 66, templow: 48 }]
            : Array.from({ length: 12 }, (_, index) => ({
                datetime: new Date(Date.parse("2026-10-07T13:00:00Z") + index * 3_600_000).toISOString(),
                temperature: 55 + index, condition: index % 2 ? "rainy" : "cloudy", precipitation_probability: index * 5,
              })) });
          return () => undefined;
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    await card.updateComplete;
  }, { width, language });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript((icons) => { (window as any).skyscoopTestIcons = icons; }, fixtureIcons);
  await page.goto("/browser-test.html");
  await page.waitForFunction(() => Boolean(customElements.get("skyscoop-card")));
});

test("loads the built bundle and renders a station temperature", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const card = document.createElement("skyscoop-card") as any;
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

    return {
      temperature: card.shadowRoot.querySelector(".temperature")?.textContent.trim(),
      unit: card.shadowRoot.querySelector(".unit")?.textContent.trim(),
      header: card.shadowRoot.querySelector("ha-card")?.shadowRoot.querySelector("h2")?.textContent.trim(),
      registered: window.customCards?.some((item) => item.type === "skyscoop-card"),
    };
  });

  expect(result.temperature).toBe("18.5");
  expect(result.unit).toBe("°C");
  expect(result.header).toBe("");
  expect(result.registered).toBe(true);
});

test("the built bundle subscribes to and renders a separate forecast summary", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    let receiveForecast: ((event: any) => void) | undefined;
    let subscription: any;
    const card = document.createElement("skyscoop-card") as any;
    card.setConfig({
      name: "Backyard",
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
        subscribeMessage: async (callback: (event: any) => void, message: any) => {
          receiveForecast = callback;
          subscription = message;
          return () => undefined;
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    receiveForecast?.({
      type: "daily",
      forecast: [{ datetime: `${date}T00:00:00Z`, temperature: 27, templow: 13 }],
    });
    await card.updateComplete;

    return {
      temperature: card.shadowRoot.querySelector(".temperature")?.textContent.trim(),
      forecast: card.shadowRoot.querySelector(".forecast-value")?.textContent.trim(),
      header: card.shadowRoot.querySelector("ha-card")?.shadowRoot.querySelector("h2")?.textContent.trim(),
      subscription,
    };
  });

  expect(result.temperature).toBe("18.5");
  expect(result.forecast).toMatch(/27|13/);
  expect(result.header).toBe("Backyard");
  expect(result.subscription).toEqual({
    type: "weather/subscribe_forecast",
    forecast_type: "daily",
    entity_id: "weather.home",
  });
});

test("the built editor dispatches updated configuration", async ({ page }) => {
  const changedConfig = await page.evaluate(async () => {
    const editor = document.createElement("skyscoop-card-editor") as any;
    editor.setConfig({
      type: "custom:skyscoop-card",
      temperature_entity: "sensor.outdoor_temperature",
    });
    document.body.append(editor);
    await editor.updateComplete;

    let config: unknown;
    editor.addEventListener("config-changed", (event: CustomEvent) => {
      config = event.detail.config;
    });
    editor.shadowRoot.querySelector("ha-entity-picker")?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: "sensor.backyard_temperature" },
        bubbles: true,
        composed: true,
      }),
    );

    return config;
  });

  expect(changedConfig).toEqual({
    type: "custom:skyscoop-card",
    temperature_entity: "sensor.backyard_temperature",
  });
});

test("responds to allocated width with full station metrics and independent forecasts", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await mountCompleteCard(page, 280);
  const card = page.locator("skyscoop-card");
  for (const [width, layout, count] of [
    [280, "compact", 4], [359, "compact", 4], [360, "standard", 8],
    [599, "standard", 8], [600, "wide", 12], [900, "wide", 12],
  ] as const) {
    await card.evaluate((element, width) => { element.style.width = `${width}px`; }, width);
    await expect(card.locator("ha-card")).toHaveAttribute("data-layout", layout);
    await expect(card.locator(".hourly-period")).toHaveCount(count);
    await expect(card.locator(".metric")).toHaveCount(7);
    await expect(card.locator(".temperature")).toHaveText("18.5");
    await expect(card.locator(".forecast-value")).toHaveText("66");
    const fits = await card.evaluate((element) => {
      const root = element.shadowRoot!;
      return [...root.querySelectorAll<HTMLElement>(".content, .metric, .temperature, .label, .hourly-period")]
        .every((item) => item.scrollWidth <= item.clientWidth + 1);
    });
    expect(fits).toBe(true);
    const summaryColumns = await card.locator(".temperature-row").evaluate((element) =>
      getComputedStyle(element).gridTemplateColumns.split(" ").length);
    expect(summaryColumns).toBe(width < 360 ? 1 : 2);
    const iconsRender = await card.evaluate((element) => [...element.shadowRoot!.querySelectorAll("ha-icon")]
      .every((icon) => Boolean(icon.shadowRoot?.querySelector("path")?.getAttribute("d"))));
    expect(iconsRender).toBe(true);
    if (width === 280 || width === 900) {
      expect(await card.locator(".hourly-strip").evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    await card.screenshot({ path: testInfo.outputPath(`card-${width}.png`) });
  }
});

test("fits mobile, formats locale values, and preserves partial unavailable configuration", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await mountCompleteCard(page, 280, "de-DE");
  const card = page.locator("skyscoop-card");
  await expect(card.locator(".temperature")).toHaveText("18,5");
  await expect(card.locator("ha-card")).toHaveAttribute("data-layout", "compact");
  await expect(card.locator(".hourly-period time").first()).toHaveText("6:00");
  await expect(card.locator("[data-metric=wind_direction_entity] .metric-value")).toHaveText("N (0°)");
  await expect(card.locator(".hourly-period > ha-icon").first()).toHaveAttribute("aria-label", "Cloudy");
  await card.screenshot({ path: testInfo.outputPath("card-mobile-de.png") });
  await card.evaluate(async (element: any) => {
    element.setConfig({ temperature_entity: "sensor.outdoor", wind_gust_entity: "sensor.missing", layout: "wide" });
    element.hass = { ...element.hass, states: { "sensor.outdoor": { state: "unavailable", attributes: {} } } };
    await element.updateComplete;
  });
  await expect(card.locator(".metric")).toHaveCount(1);
  await expect(card.locator(".temperature")).toHaveText("Unavailable");
  await expect(card.locator(".metric-value")).toHaveText("Unavailable");
  await expect(card.locator(".hourly")).toHaveCount(0);
  expect(await card.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await card.screenshot({ path: testInfo.outputPath("card-partial-mobile.png") });
});

test("built editor keeps configured layout and exposes optional controls", async ({ page }) => {
  await page.evaluate(async () => {
    const editor = document.createElement("skyscoop-card-editor") as any;
    editor.style.width = "280px";
    editor.setConfig({ temperature_entity: "sensor.outdoor", layout: "wide", show_hourly_forecast: false });
    document.body.append(editor);
    await editor.updateComplete;
  });
  const editor = page.locator("skyscoop-card-editor");
  const nameInput = editor.locator(".name-field input");
  await expect(nameInput).toHaveValue("");
  await expect(editor.locator("select")).toHaveValue("wide");
  await expect(editor.locator("input[type=checkbox]")).not.toBeChecked();
  await expect(editor.locator("ha-entity-picker")).toHaveCount(9);
  await nameInput.fill("Backyard");
  await editor.locator("select").selectOption("compact");
  await editor.locator("input[type=checkbox]").check();
  const config = await editor.evaluate((element: any) => element.config);
  expect(config).toEqual({ temperature_entity: "sensor.outdoor", layout: "compact", show_hourly_forecast: true, name: "Backyard" });
});