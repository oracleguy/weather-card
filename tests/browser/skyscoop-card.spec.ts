import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
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
      registered: window.customCards?.some((item) => item.type === "skyscoop-card"),
    };
  });

  expect(result.temperature).toBe("18.5");
  expect(result.unit).toBe("°C");
  expect(result.registered).toBe(true);
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