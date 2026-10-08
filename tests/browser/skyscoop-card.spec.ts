import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { mdiWaterPercent, mdiThermometer, mdiThermometerChevronUp, mdiThermometerChevronDown, mdiThermometerWater, mdiWeatherWindy, mdiCompassOutline, mdiWeatherSunnyAlert, mdiBrightness6, mdiWeatherCloudy, mdiWeatherRainy, mdiWeatherSunny, mdiWater, mdiWeatherPouring, mdiCalendarWeek } from "@mdi/js";

const fixtureIcons = {
  "mdi:water-percent": mdiWaterPercent, "mdi:thermometer": mdiThermometer,
  "mdi:thermometer-chevron-up": mdiThermometerChevronUp,
  "mdi:thermometer-chevron-down": mdiThermometerChevronDown,
  "mdi:thermometer-water": mdiThermometerWater,
  "mdi:weather-windy": mdiWeatherWindy, "mdi:compass-outline": mdiCompassOutline,
  "mdi:weather-sunny-alert": mdiWeatherSunnyAlert, "mdi:brightness-6": mdiBrightness6,
  "mdi:weather-cloudy": mdiWeatherCloudy, "mdi:weather-rainy": mdiWeatherRainy, "mdi:water": mdiWater,
  "mdi:weather-sunny": mdiWeatherSunny,
  "mdi:weather-pouring": mdiWeatherPouring, "mdi:calendar-week": mdiCalendarWeek,
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
      rain_state_entity: "binary_sensor.rain", rainfall_rate_entity: "sensor.rate",
      rainfall_today_entity: "sensor.today", rainfall_week_entity: "sensor.week",
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
        "binary_sensor.rain": { state: "off", attributes: {} },
        "sensor.rate": { state: "0", attributes: { unit_of_measurement: "mm/h" } },
        "sensor.today": { state: "12.5", attributes: { unit_of_measurement: "mm" } },
        "sensor.week": { state: "unavailable", attributes: { unit_of_measurement: "mm" } },
        "weather.home": { state: "sunny", attributes: { supported_features: 3, temperature_unit: "°F" } },
      },
      callApi: async (_method: string, path: string) => {
        (window as any).skyscoopHistoryCalls = ((window as any).skyscoopHistoryCalls ?? 0) + 1;
        (window as any).skyscoopHistoryPath = path;
        if ((window as any).skyscoopHistoryError) throw new Error("Recorder unavailable");
        return [(window as any).skyscoopRainHistory ?? [{
          state: "0", last_changed: "2026-10-06T12:00:00Z", attributes: { unit_of_measurement: "mm/h" },
        }]];
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

test("sensor readings expose native More Info with mouse, keyboard and visible focus", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1100, height: 1500 });
  await mountCompleteCard(page, 280);
  await page.evaluate(() => {
    (window as any).skyscoopMoreInfoEvents = [];
    document.addEventListener("hass-more-info", (event) => {
      const moreInfo = event as CustomEvent;
      (window as any).skyscoopMoreInfoEvents.push({
        entityId: moreInfo.detail.entityId, bubbles: moreInfo.bubbles, composed: moreInfo.composed,
      });
    });
  });
  const card = page.locator("skyscoop-card");
  const buttons = card.locator("button.sensor-reading");
  const entityIds = ["sensor.outdoor", "sensor.humidity", "sensor.dew", "sensor.wind", "sensor.gust",
    "sensor.direction", "sensor.uv", "sensor.lux", "sensor.rate", "sensor.today", "sensor.week"];
  await expect(buttons).toHaveCount(entityIds.length);
  const expected: { entityId: string; bubbles: boolean; composed: boolean }[] = [];
  const events = () => page.evaluate(() => (window as any).skyscoopMoreInfoEvents);
  for (const width of [280, 600, 900]) {
    await card.evaluate((element, width) => { element.style.width = `${width}px`; }, width);
    await expect(card.locator("ha-card")).toHaveAttribute("data-layout", width < 360 ? "compact" : "wide");
    for (const [index, entityId] of entityIds.entries()) {
      const button = buttons.nth(index);
      await button.click();
      expected.push({ entityId, bubbles: true, composed: true });
      expect(await events()).toEqual(expected);
      await button.focus();
      await expect(button).toBeFocused();
      await button.press("Enter");
      expected.push({ entityId, bubbles: true, composed: true });
      expect(await events()).toEqual(expected);
      await button.press("Space");
      expected.push({ entityId, bubbles: true, composed: true });
      expect(await events()).toEqual(expected);
    }
    await buttons.first().focus();
    await page.keyboard.press("Tab");
    await expect(buttons.nth(1)).toBeFocused();
    expect(await buttons.nth(1).evaluate((element) => {
      const style = getComputedStyle(element);
      return element.matches(":focus-visible") && style.outlineStyle === "solid" && style.outlineWidth === "2px";
    })).toBe(true);
    await card.screenshot({ path: testInfo.outputPath(`sensor-focus-${width}.png`) });
    await card.locator(".forecast-summary").click();
    await card.locator(".hourly-period").first().click();
    await card.locator(".rainfall-status").click();
    await card.locator(".rainfall-plot").click();
    expect(await events()).toEqual(expected);
  }
});

test.describe("touch sensor readings", () => {
  test.use({ hasTouch: true, viewport: { width: 320, height: 1500 } });

  test("taps open native More Info, including unavailable rainfall readings", async ({ page }) => {
    await mountCompleteCard(page, 280);
    await page.evaluate(() => {
      (window as any).skyscoopMoreInfoEntities = [];
      document.addEventListener("hass-more-info", (event) => {
        (window as any).skyscoopMoreInfoEntities.push((event as CustomEvent).detail.entityId);
      });
    });
    const card = page.locator("skyscoop-card");
    await card.locator(".reading.sensor-reading").tap();
    await card.locator("[data-metric=humidity_entity]").tap();
    await card.locator("[data-rainfall=rainfall_week_entity]").tap();
    expect(await page.evaluate(() => (window as any).skyscoopMoreInfoEntities))
      .toEqual(["sensor.outdoor", "sensor.humidity", "sensor.week"]);
  });
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
    await expect(card.locator(".rainfall-metric")).toHaveCount(3);
    await expect(card.locator(".rainfall-plot path")).toHaveAttribute("d", /M0,74\.00 H10/);
    expect(await card.evaluate((element) => {
      const hourly = element.shadowRoot!.querySelector(".hourly")!;
      const rainfall = element.shadowRoot!.querySelector(".rainfall")!;
      return Boolean(hourly.compareDocumentPosition(rainfall) & Node.DOCUMENT_POSITION_FOLLOWING);
    })).toBe(true);
    await expect(card.locator(".temperature")).toHaveText("18.5");
    await expect(card.locator(".forecast-value")).toHaveText("66");
    const metricTypography = await card.evaluate((element) => ({
      value: getComputedStyle(element.shadowRoot!.querySelector(".metric-value")!).fontSize,
      stationLabel: getComputedStyle(element.shadowRoot!.querySelector(".metric .label")!).fontSize,
      rainfallLabel: getComputedStyle(element.shadowRoot!.querySelector(".rainfall-metric .label")!).fontSize,
      contentPadding: getComputedStyle(element.shadowRoot!.querySelector(".content")!).padding,
      contentGap: getComputedStyle(element.shadowRoot!.querySelector(".content")!).rowGap,
      sectionPadding: getComputedStyle(element.shadowRoot!.querySelector(".hourly")!).paddingTop,
    }));
    expect(metricTypography).toEqual({
      value: "16px", stationLabel: "14px", rainfallLabel: "14px",
      contentPadding: width >= 600 ? "14px" : "16px",
      contentGap: width >= 600 ? "12px" : "16px",
      sectionPadding: width >= 600 ? "12px" : "16px",
    });
    const fits = await card.evaluate((element) => {
      const root = element.shadowRoot!;
      return [...root.querySelectorAll<HTMLElement>(".content, .metric, .temperature, .label, .hourly-period, .rainfall, .rainfall-metric, .rainfall-caption, .rainfall-status")]
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
  await card.evaluate(async (element: any) => {
    element.setConfig({ ...element.config, show_hourly_forecast: false });
    await element.updateComplete;
  });
  await expect(card.locator(".hourly")).toHaveCount(0);
  await expect(card.locator(".rainfall")).toHaveCount(1);
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
  await expect(editor.locator("input[type=checkbox]").first()).not.toBeChecked();
  await expect(editor.locator("[data-option=adaptive_metrics]")).toBeChecked();
  await expect(editor.locator("[data-option=show_rainfall_history]")).toBeChecked();
  await expect(editor.locator("ha-entity-picker")).toHaveCount(13);
  await nameInput.fill("Backyard");
  await editor.locator("select").selectOption("compact");
  await editor.locator("input[type=checkbox]").first().check();
  const config = await editor.evaluate((element: any) => element.config);
  expect(config).toEqual({ temperature_entity: "sensor.outdoor", layout: "compact", show_hourly_forecast: true, name: "Backyard" });
  await editor.locator("[data-option=adaptive_metrics]").uncheck();
  await editor.locator("[data-option=show_rainfall_history]").uncheck();
  await editor.locator("[data-entity-key=rainfall_rate_entity]").evaluate((picker) => {
    picker.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "sensor.rain_rate" } }));
  });
  expect(await editor.evaluate((element: any) => element.config)).toEqual({ ...config,
    adaptive_metrics: false, show_rainfall_history: false, rainfall_rate_entity: "sensor.rain_rate" });
});

test("rainfall and adaptive emphasis keep fixed positions at each width", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1100, height: 1500 });
  await mountCompleteCard(page, 280);
  const card = page.locator("skyscoop-card");
  await expect(card.locator(".rainfall-status")).toHaveText("Dry");
  await expect(card.locator(".rainfall-caption")).toContainText("Peak rate: 0 mm/h");
  for (const width of [280, 359, 360, 599, 600, 900]) {
    await card.evaluate(async (element: any, width) => {
      element.style.width = `${width}px`;
      element.hass = { ...element.hass, states: { ...element.hass.states,
        "binary_sensor.rain": { state: "off", attributes: {} },
        "sensor.rate": { state: "0", attributes: { unit_of_measurement: "mm/h" } },
        "sensor.wind": { state: "3.5", attributes: { unit_of_measurement: "m/s" } },
        "sensor.uv": { state: "0", attributes: {} },
      } };
      await element.updateComplete;
    }, width);
    await expect(card.locator("ha-card")).toHaveAttribute("data-layout", width < 360 ? "compact" : width < 600 ? "standard" : "wide");
    const positions = () => card.evaluate((element) => [...element.shadowRoot!.querySelectorAll(".metric, .rainfall-metric, .rainfall-plot")]
      .map((item) => { const rect = item.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; }));
    const before = await positions();
    await card.evaluate(async (element: any) => {
      element.hass = { ...element.hass, states: { ...element.hass.states,
        "binary_sensor.rain": { state: "on", attributes: {} },
        "sensor.rate": { state: "8", attributes: { unit_of_measurement: "mm/h" } },
        "sensor.wind": { state: "8", attributes: { unit_of_measurement: "m/s" } },
        "sensor.uv": { state: "6", attributes: {} },
      } };
      await element.updateComplete;
    });
    await expect(card.locator(".rainfall")).toHaveAttribute("data-emphasis", "heavy");
    await expect(card.locator(".rainfall-status")).toHaveText("Heavy rain");
    await expect(card.locator("[data-metric=wind_speed_entity] .metric-reason")).toHaveText("Strong wind");
    await expect(card.locator("[data-metric=uv_index_entity] .metric-reason")).toHaveText("High UV");
    expect(await positions()).toEqual(before);
    expect(await card.evaluate((element) => [...element.shadowRoot!.querySelectorAll<HTMLElement>(".rainfall, .rainfall-metric, .rainfall-caption, .metric-reason")]
      .every((item) => item.scrollWidth <= item.clientWidth + 1))).toBe(true);
    if (width === 280 || width === 900) await card.screenshot({ path: testInfo.outputPath(`rainfall-active-${width}.png`) });
  }
  expect(await page.evaluate(() => (window as any).skyscoopHistoryCalls)).toBe(1);
});

test("mobile rain history renders gaps, locale labels and independent error states", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 1500 });
  await page.addInitScript(() => {
    (window as any).skyscoopRainHistory = [
      { state: "0", last_changed: "2026-10-06T12:00:00Z", attributes: { unit_of_measurement: "mm/h" } },
      { state: "8", last_changed: "2026-10-06T14:00:00Z", attributes: { unit_of_measurement: "mm/h" } },
      { state: "unavailable", last_changed: "2026-10-06T16:00:00Z", attributes: { unit_of_measurement: "mm/h" } },
      { state: "3.5", last_changed: "2026-10-06T18:00:00Z", attributes: { unit_of_measurement: "mm/h" } },
    ];
  });
  await page.reload();
  await page.waitForFunction(() => Boolean(customElements.get("skyscoop-card")));
  await mountCompleteCard(page, 280, "de-DE");
  const card = page.locator("skyscoop-card");
  await expect(card.locator("[data-rainfall=rainfall_today_entity] .metric-value")).toHaveText("12,5 mm");
  await expect(card.locator(".rainfall-plot")).toHaveAttribute("aria-label", /Peak rate: 8 mm\/h/);
  const geometry = await card.locator(".rainfall-plot path").evaluate((element) => {
    const path = element as SVGPathElement;
    const box = path.getBBox();
    return { moves: path.getAttribute("d")!.match(/M/g)?.length, length: path.getTotalLength(), width: box.width, height: box.height };
  });
  expect(geometry.moves).toBe(2);
  expect(geometry.length).toBeGreaterThan(100);
  expect(geometry.width).toBe(240);
  expect(geometry.height).toBeGreaterThan(0);
  const query = await page.evaluate(() => new URL((window as any).skyscoopHistoryPath, "http://ha/api/").searchParams.get("filter_entity_id"));
  expect(query).toBe("sensor.rate");
  await card.screenshot({ path: testInfo.outputPath("rainfall-mobile-gaps-de.png") });
  await page.evaluate(() => { (window as any).skyscoopHistoryError = true; });
  await page.clock.fastForward(300_000);
  await expect(card.locator(".rainfall-history-status")).toContainText("History stale");
  await expect(card.locator(".temperature")).toHaveText("18,5");
  await expect(card.locator(".forecast-value")).toHaveText("66");
  await expect(card.locator(".hourly-period")).toHaveCount(4);
  await card.evaluate(async (element: any) => {
    element.setConfig({ ...element.config, rainfall_rate_entity: "sensor.missing" });
    await element.updateComplete;
  });
  await expect(card.locator(".rainfall-placeholder")).toHaveText("Rain history unavailable");
  await expect(card.locator("[data-rainfall=rainfall_today_entity] .metric-value")).toHaveText("12,5 mm");
  await card.screenshot({ path: testInfo.outputPath("rainfall-mobile-error-de.png") });
});