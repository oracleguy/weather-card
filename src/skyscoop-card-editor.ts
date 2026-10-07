import { LitElement, css, html } from "lit";
import type { HassLike, SkyScoopConfig } from "./types.js";
import { translate } from "./localization.js";
import { stationMetrics, type StationEntityKey } from "./station.js";

export class SkyScoopCardEditor extends LitElement {
  static styles = css`
    :host { display: grid; gap: 12px; }
    details { min-width: 0; }
    summary { cursor: pointer; padding: 8px 0; }
    ha-entity-picker { display: block; margin-bottom: 8px; }
    label { display: flex; align-items: center; gap: 12px; color: var(--primary-text-color); }
    .name-field { display: grid; align-items: start; gap: 4px; }
    .name-field input { box-sizing: border-box; width: 100%; min-width: 0; padding: 8px; border: 1px solid var(--divider-color, #888); border-radius: 4px; color: var(--primary-text-color); background: var(--card-background-color); font: inherit; }
    select { font: inherit; color: var(--primary-text-color); background: var(--card-background-color); padding: 8px; min-width: 0; }
  `;

  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  hass?: HassLike;
  config: SkyScoopConfig = {};

  setConfig(config: SkyScoopConfig): void {
    this.config = { ...config };
  }

  protected updated(): void {
    const select = this.shadowRoot?.querySelector("select");
    if (select) select.value = this.config.layout ?? "auto";
  }

  private onTemperatureChanged(event: Event): void {
    this.updateEntity("temperature_entity", (event as CustomEvent<{ value?: string }>).detail?.value);
  }

  private onWeatherChanged(event: Event): void {
    this.updateEntity("weather_entity", (event as CustomEvent<{ value?: string }>).detail?.value);
  }

  private onNameChanged(event: Event): void {
    const name = (event.currentTarget as HTMLInputElement).value;
    const config = { ...this.config };

    if (name) {
      config.name = name;
    } else {
      delete config.name;
    }

    this.config = config;
    this.emitConfig();
  }

  private updateEntity(key: "temperature_entity" | "weather_entity" | StationEntityKey, value?: string): void {
    const config = { ...this.config };

    if (value) {
      config[key] = value;
    } else {
      delete config[key];
    }

    this.config = config;
    this.emitConfig();
  }

  private emitConfig(): void {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this.config },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <label class="name-field">
        ${translate(this.hass?.language, "cardHeader")}
        <input type="text" .value=${this.config.name ?? ""} @input=${this.onNameChanged}>
      </label>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.temperature_entity ?? ""}
        .label=${translate(this.hass?.language, "temperatureEntity")}
        .includeDomains=${["sensor"]}
        @value-changed=${this.onTemperatureChanged}
      ></ha-entity-picker>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.weather_entity ?? ""}
        .label=${translate(this.hass?.language, "weatherEntity")}
        .includeDomains=${["weather"]}
        @value-changed=${this.onWeatherChanged}
      ></ha-entity-picker>
      <details>
        <summary>${translate(this.hass?.language, "stationMetrics")}</summary>
        ${stationMetrics.map((metric) => html`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config[metric.key] ?? ""}
            .label=${translate(this.hass?.language, metric.label)}
            .includeDomains=${["sensor"]}
            @value-changed=${(event: CustomEvent<{ value?: string }>) => this.updateEntity(metric.key, event.detail?.value)}
          ></ha-entity-picker>
        `)}
      </details>
      <label>
        ${translate(this.hass?.language, "layout")}
        <select @change=${(event: Event) => {
          this.config = { ...this.config, layout: (event.target as HTMLSelectElement).value as SkyScoopConfig["layout"] };
          this.emitConfig();
        }}>
          ${(["auto", "compact", "standard", "wide"] as const).map((layout) => html`
            <option value=${layout} ?selected=${(this.config.layout ?? "auto") === layout}>${translate(this.hass?.language, layout)}</option>
          `)}
        </select>
      </label>
      <label>
        <input type="checkbox" .checked=${this.config.show_hourly_forecast !== false}
          @change=${(event: Event) => {
            this.config = { ...this.config, show_hourly_forecast: (event.target as HTMLInputElement).checked };
            this.emitConfig();
          }}>
        ${translate(this.hass?.language, "hourlyForecast")}
      </label>
    `;
  }
}