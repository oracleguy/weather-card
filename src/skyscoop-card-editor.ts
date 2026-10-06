import { LitElement, html } from "lit";
import type { HassLike, SkyScoopConfig } from "./types.js";
import { translate } from "./localization.js";

export class SkyScoopCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  hass?: HassLike;
  config: SkyScoopConfig = {};

  setConfig(config: SkyScoopConfig): void {
    this.config = { ...config };
  }

  private onTemperatureChanged(event: Event): void {
    this.updateEntity("temperature_entity", (event as CustomEvent<{ value?: string }>).detail?.value);
  }

  private onWeatherChanged(event: Event): void {
    this.updateEntity("weather_entity", (event as CustomEvent<{ value?: string }>).detail?.value);
  }

  private updateEntity(key: "temperature_entity" | "weather_entity", value?: string): void {
    const config = { ...this.config };

    if (value) {
      config[key] = value;
    } else {
      delete config[key];
    }

    this.config = config;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.temperature_entity ?? ""}
        .label=${translate(this.hass?.language, "temperatureEntity")}
        @value-changed=${this.onTemperatureChanged}
      ></ha-entity-picker>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.weather_entity ?? ""}
        .label=${translate(this.hass?.language, "weatherEntity")}
        .includeDomains=${["weather"]}
        @value-changed=${this.onWeatherChanged}
      ></ha-entity-picker>
    `;
  }
}