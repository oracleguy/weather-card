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
    const value = (event as CustomEvent<{ value?: string }>).detail?.value;
    const config = { ...this.config };

    if (value) {
      config.temperature_entity = value;
    } else {
      delete config.temperature_entity;
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
    `;
  }
}