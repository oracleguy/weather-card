import { LitElement, css, html } from "lit";
import { translate } from "./localization.js";
import type { HassLike, SkyScoopConfig } from "./types.js";

export const CARD_TAG = "skyscoop-card";

export class SkyScoopCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      --skyscoop-accent: var(--primary-color, #347f78);
      --skyscoop-muted: var(--secondary-text-color, #64716f);
    }

    ha-card {
      min-height: 112px;
      color: var(--primary-text-color, #202927);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .content {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .label {
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .temperature {
      margin-top: 4px;
      color: var(--skyscoop-accent);
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }

    .message {
      grid-column: 1 / -1;
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .unit {
      align-self: center;
      color: var(--skyscoop-muted);
      font-size: 1rem;
    }
  `;

  hass?: HassLike;
  config?: SkyScoopConfig;

  setConfig(config: SkyScoopConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("SkyScoop requires an object configuration.");
    }

    this.config = { ...config };
  }

  getCardSize(): number {
    return 2;
  }

  static getStubConfig(hass?: HassLike): SkyScoopConfig {
    const temperatureEntity = Object.entries(hass?.states ?? {}).find(
      ([entityId, entity]) => entityId.startsWith("sensor.") && entity.attributes.device_class === "temperature",
    )?.[0];

    return {
      type: `custom:${CARD_TAG}`,
      ...(temperatureEntity ? { temperature_entity: temperatureEntity } : {}),
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("skyscoop-card-editor");
  }

  render() {
    const language = this.hass?.language;
    const entityId = this.config?.temperature_entity;
    const entity = entityId ? this.hass?.states[entityId] : undefined;
    const rawValue = entity?.state;
    const numericValue = rawValue === undefined ? Number.NaN : Number(rawValue);
    const available = Number.isFinite(numericValue) && rawValue !== "unknown" && rawValue !== "unavailable";
    const unit = typeof entity?.attributes.unit_of_measurement === "string"
      ? entity.attributes.unit_of_measurement
      : "";
    const header = this.config?.name || "SkyScoop";

    return html`
      <ha-card .header=${header}>
        <div class="content">
          ${entityId
            ? html`
                <div>
                  <div class="label">${translate(language, "temperature")}</div>
                  <div class="temperature" aria-label=${translate(language, "temperature")}>
                    ${available
                      ? new Intl.NumberFormat(language || "en", { maximumFractionDigits: 1 }).format(numericValue)
                      : translate(language, "unavailable")}
                  </div>
                </div>
                ${unit ? html`<div class="unit">${unit}</div>` : ""}
              `
            : html`<div class="message">${translate(language, "chooseTemperature")}</div>`}
        </div>
      </ha-card>
    `;
  }
}