import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { selectForecastSummary, type ForecastPeriod } from "./forecast.js";
import { translate } from "./localization.js";
import type { ForecastSubscriptionEvent, ForecastType, HassLike, SkyScoopConfig } from "./types.js";

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

    .forecast-summary {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }

    .forecast-value {
      margin-top: 4px;
      font-size: 1.125rem;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
  `;

  hass?: HassLike;
  config?: SkyScoopConfig;
  private forecast?: readonly ForecastPeriod[];
  private forecastSubscriptionKey?: string;
  private forecastConnection?: HassLike["connection"];
  private forecastUnsubscribe?: () => void;
  private forecastGeneration = 0;
  private summaryTimer?: ReturnType<typeof setInterval>;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) {
      void this.syncForecastSubscription();
      this.syncSummaryTimer();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearSummaryTimer();
    this.stopForecastSubscription();
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (changedProperties.has("hass") || changedProperties.has("config")) {
      void this.syncForecastSubscription();
      this.syncSummaryTimer();
    }
  }

  setConfig(config: SkyScoopConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("SkyScoop requires an object configuration.");
    }

    this.config = { ...config };
  }

  getCardSize(): number {
    return 2;
  }

  private getForecastType(): ForecastType | undefined {
    const weatherEntity = this.config?.weather_entity
      ? this.hass?.states[this.config.weather_entity]
      : undefined;
    const features = Number(weatherEntity?.attributes.supported_features);
    if (!Number.isFinite(features)) {
      return undefined;
    }
    if ((features & 4) !== 0) {
      return "twice_daily";
    }
    if ((features & 1) !== 0) {
      return "daily";
    }
    return undefined;
  }

  private async syncForecastSubscription(): Promise<void> {
    const entityId = this.config?.weather_entity;
    const entity = entityId ? this.hass?.states[entityId] : undefined;
    const connection = this.hass?.connection;
    const forecastType = this.getForecastType();
    if (
      !entityId || !entity || entity.state === "unavailable" || entity.state === "unknown" ||
      !connection || !forecastType
    ) {
      this.stopForecastSubscription();
      return;
    }

    const key = `${entityId}:${forecastType}`;
    if (this.forecastSubscriptionKey === key && this.forecastConnection === connection) {
      return;
    }

    this.stopForecastSubscription();
    const generation = this.forecastGeneration;
    this.forecastSubscriptionKey = key;
    this.forecastConnection = connection;
    this.forecast = undefined;
    this.requestUpdate();

    try {
      const unsubscribe = await connection.subscribeMessage<ForecastSubscriptionEvent>(
        (event) => {
          if (generation !== this.forecastGeneration) {
            return;
          }
          this.forecast = event.forecast ?? undefined;
          this.requestUpdate();
        },
        { type: "weather/subscribe_forecast", forecast_type: forecastType, entity_id: entityId },
      );
      if (generation !== this.forecastGeneration) {
        unsubscribe();
      } else {
        this.forecastUnsubscribe = unsubscribe;
      }
    } catch {
      if (generation === this.forecastGeneration) {
        this.forecast = undefined;
        this.forecastSubscriptionKey = undefined;
        this.forecastConnection = undefined;
        this.requestUpdate();
      }
    }
  }

  private stopForecastSubscription(): void {
    if (!this.forecastSubscriptionKey && !this.forecastUnsubscribe) {
      return;
    }
    this.forecastGeneration += 1;
    this.forecastUnsubscribe?.();
    this.forecastUnsubscribe = undefined;
    this.forecastSubscriptionKey = undefined;
    this.forecastConnection = undefined;
    this.forecast = undefined;
  }

  private syncSummaryTimer(): void {
    if (this.isConnected && this.config?.weather_entity && !this.summaryTimer) {
      this.summaryTimer = setInterval(() => this.requestUpdate(), 60_000);
    } else if ((!this.isConnected || !this.config?.weather_entity) && this.summaryTimer) {
      this.clearSummaryTimer();
    }
  }

  private clearSummaryTimer(): void {
    if (this.summaryTimer) {
      clearInterval(this.summaryTimer);
      this.summaryTimer = undefined;
    }
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
    const weatherEntityId = this.config?.weather_entity;
    const weatherEntity = weatherEntityId ? this.hass?.states[weatherEntityId] : undefined;
    const timeZone = this.hass?.config?.time_zone
      ?? Intl.DateTimeFormat().resolvedOptions().timeZone
      ?? "UTC";
    const forecastSummary = selectForecastSummary(this.forecast, new Date(), timeZone);
    const forecastUnit = typeof weatherEntity?.attributes.temperature_unit === "string"
      ? weatherEntity.attributes.temperature_unit
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
          ${weatherEntityId
            ? html`
                <div class="forecast-summary">
                  <div>
                    <div class="label">
                      ${translate(language, forecastSummary
                        ? forecastSummary.kind === "low" ? "forecastLow" : "forecastHigh"
                        : "forecastSummary")}
                    </div>
                    <div class="forecast-value">
                      ${forecastSummary
                        ? new Intl.NumberFormat(language || "en", { maximumFractionDigits: 1 })
                          .format(forecastSummary.temperature)
                        : translate(language, "forecastUnavailable")}
                    </div>
                  </div>
                  ${forecastSummary && forecastUnit ? html`<div class="unit">${forecastUnit}</div>` : ""}
                </div>
              `
            : ""}
        </div>
      </ha-card>
    `;
  }
}