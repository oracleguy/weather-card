import { LitElement, css, html } from "lit";
import type { PropertyValues } from "lit";
import { selectForecastSummary, selectHourlyForecast } from "./forecast.js";
import { translate } from "./localization.js";
import { configuredMetrics, stationReading } from "./station.js";
import { renderStationMetrics } from "./station-metrics.js";
import type { ForecastType, HassLike, SkyScoopConfig } from "./types.js";
import { ForecastStream } from "./forecast-stream.js";
import { hourlyCounts, metricColumns, selectLayout, type Layout } from "./responsive.js";
import { renderHourlyForecast } from "./hourly-forecast.js";

export const CARD_TAG = "skyscoop-card";

export class SkyScoopCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    widthLayout: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
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

    .temperature-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
      min-width: 0;
    }

    .temperature-row.has-temperature.has-forecast {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .reading { min-width: 0; }

    .summary-label {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 30px;
    }

    .summary-icon {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      flex: 0 0 28px;
      border-radius: 50%;
      color: var(--skyscoop-accent);
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    }

    .summary-icon ha-icon { --mdc-icon-size: 18px; }

    .forecast-summary {
      min-width: 0;
      border-inline-start: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      padding-inline-start: 16px;
    }

    .value-line {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      column-gap: 8px;
    }

    .label {
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .temperature {
      color: var(--skyscoop-accent);
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
      overflow-wrap: anywhere;
    }

    .message {
      grid-column: 1 / -1;
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .unit {
      color: var(--skyscoop-muted);
      font-size: 0.9375rem;
    }

    .forecast-value {
      color: var(--primary-text-color, #202927);
      font-size: 1.75rem;
      font-weight: 500;
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }

    .station-metrics {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(var(--metric-columns, 2), minmax(0, 1fr));
      gap: 16px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      padding-top: 12px;
    }

    .metric { min-width: 0; overflow-wrap: anywhere; }
    .metric-value { font-variant-numeric: tabular-nums; margin-top: 4px; }
    .metric ha-icon { --mdc-icon-size: 18px; margin-right: 4px; color: var(--skyscoop-muted); }
    .hourly { grid-column: 1 / -1; min-width: 0; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); padding-top: 12px; }
    .hourly-strip { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(56px, 1fr); overflow-x: auto; gap: 8px; padding-top: 12px; }
    .hourly-period { display: grid; grid-template-rows: 24px 28px minmax(24px, auto) 24px; align-items: center; justify-items: center; font-size: 0.8125rem; overflow-wrap: anywhere; text-align: center; }
    .hourly-period time { grid-row: 1; }
    .hourly-period > ha-icon { grid-row: 2; --mdc-icon-size: 24px; color: var(--skyscoop-muted); }
    .hourly-temperature { grid-row: 3; font-weight: 500; font-variant-numeric: tabular-nums; }
    .hourly-probability { grid-row: 4; color: var(--skyscoop-muted); }
    .hourly-probability ha-icon { --mdc-icon-size: 14px; }
    .label { overflow-wrap: anywhere; }
    @container (max-width: 359px) { .station-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @container (max-width: 359px) { .temperature-row.has-temperature.has-forecast { grid-template-columns: minmax(0, 1fr); } .forecast-summary { border-inline-start: 0; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); padding: 12px 0 0; } }
    @container (max-width: 220px) { .station-metrics { grid-template-columns: minmax(0, 1fr); } .content { gap: 10px; padding: 12px; } .temperature-row { gap: 12px; } }
  `;

  hass?: HassLike;
  config?: SkyScoopConfig;
  private summaryStream = new ForecastStream(() => this.requestUpdate());
  private hourlyStream = new ForecastStream(() => this.requestUpdate());
  private widthLayout: Layout = "standard";
  private resizeObserver?: ResizeObserver;
  private summaryTimer?: ReturnType<typeof setInterval>;

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width;
        if (width && width > 0) this.widthLayout = selectLayout(width);
      });
      this.resizeObserver.observe(this);
    }
    if (this.hasUpdated) {
      void this.syncForecastSubscription();
      this.syncSummaryTimer();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearSummaryTimer();
    this.summaryStream.stop();
    this.hourlyStream.stop();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
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

    if (config.layout !== undefined && !["auto", "compact", "standard", "wide"].includes(config.layout)) {
      throw new Error("SkyScoop layout must be auto, compact, standard, or wide.");
    }
    if (config.show_hourly_forecast !== undefined && typeof config.show_hourly_forecast !== "boolean") {
      throw new Error("SkyScoop show_hourly_forecast must be a boolean.");
    }

    this.config = { ...config };
  }

  getCardSize(): number {
    const layout = this.activeLayout;
    return 2 + Math.ceil(configuredMetrics(this.hass, this.config).length / metricColumns[layout])
      + (this.config?.weather_entity ? 1 : 0) + (this.hourlyEnabled ? 3 : 0);
  }

  private get activeLayout(): Layout {
    return this.config?.layout && this.config.layout !== "auto" ? this.config.layout : this.widthLayout;
  }

  private get hourlyEnabled(): boolean {
    const entityId = this.config?.weather_entity;
    const features = Number(entityId ? this.hass?.states[entityId]?.attributes.supported_features : 0);
    return this.config?.show_hourly_forecast !== false && Number.isFinite(features) && (features & 2) !== 0;
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
    const available = this.isConnected && entity && entity.state !== "unknown" && entity.state !== "unavailable";
    await Promise.all([
      this.summaryStream.sync(available ? connection : undefined, entityId, this.getForecastType()),
      this.hourlyStream.sync(available ? connection : undefined, entityId, this.hourlyEnabled ? "hourly" : undefined),
    ]);
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

  static getStubConfig(_hass?: HassLike): SkyScoopConfig {
    return {
      type: `custom:${CARD_TAG}`,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("skyscoop-card-editor");
  }

  render() {
    const language = this.hass?.language;
    const entityId = this.config?.temperature_entity;
    const reading = stationReading(this.hass, entityId);
    const numericValue = reading.value;
    const available = numericValue !== undefined;
    const unit = reading.unit;
    const weatherEntityId = this.config?.weather_entity;
    const weatherEntity = weatherEntityId ? this.hass?.states[weatherEntityId] : undefined;
    const timeZone = this.hass?.config?.time_zone
      ?? Intl.DateTimeFormat().resolvedOptions().timeZone
      ?? "UTC";
    const now = new Date();
    const forecastSummary = selectForecastSummary(this.summaryStream.forecast, now, timeZone);
    const layout = this.activeLayout;
    const metrics = configuredMetrics(this.hass, this.config);
    const hourly = selectHourlyForecast(this.hourlyStream.forecast, now, hourlyCounts[layout]);
    const forecastUnit = typeof weatherEntity?.attributes.temperature_unit === "string"
      ? weatherEntity.attributes.temperature_unit
      : "";
    const forecastIcon = forecastSummary?.kind === "low"
      ? "mdi:thermometer-chevron-down"
      : forecastSummary ? "mdi:thermometer-chevron-up" : "mdi:thermometer";
    const header = this.config?.name?.trim() || undefined;

    return html`
      <ha-card .header=${header} data-layout=${layout} style=${`--metric-columns: ${metricColumns[layout]}`}>
        <div class="content">
          <div class="temperature-row ${entityId ? "has-temperature" : ""} ${weatherEntityId ? "has-forecast" : ""}">
            ${entityId
              ? html`
                  <div class="reading">
                    <div class="label summary-label">
                      <span class="summary-icon"><ha-icon icon="mdi:thermometer" aria-hidden="true"></ha-icon></span>
                      <span>${translate(language, "temperature")}</span>
                    </div>
                    <div class="value-line">
                      <div class="temperature" aria-label=${translate(language, "temperature")}>
                        ${available
                          ? new Intl.NumberFormat(language || "en", { maximumFractionDigits: 1 }).format(numericValue!)
                          : translate(language, "unavailable")}
                      </div>
                      ${unit ? html`<div class="unit">${unit}</div>` : ""}
                    </div>
                  </div>
                `
              : html`<div class="message">${translate(language, "chooseTemperature")}</div>`}
            ${weatherEntityId
              ? html`
                  <div class="reading forecast-summary">
                    <div class="label summary-label">
                      <span class="summary-icon"><ha-icon icon=${forecastIcon} aria-hidden="true"></ha-icon></span>
                      <span>
                        ${translate(language, forecastSummary
                          ? forecastSummary.kind === "low" ? "forecastLow" : "forecastHigh"
                          : "forecastSummary")}
                      </span>
                    </div>
                    <div class="value-line">
                      <div class="forecast-value">
                        ${forecastSummary
                          ? new Intl.NumberFormat(language || "en", { maximumFractionDigits: 1 })
                            .format(forecastSummary.temperature)
                          : translate(language, "forecastUnavailable")}
                      </div>
                      ${forecastSummary && forecastUnit ? html`<div class="unit">${forecastUnit}</div>` : ""}
                    </div>
                  </div>
                `
              : ""}
          </div>
          ${renderStationMetrics(metrics, language, layout)}
          ${weatherEntityId && this.hourlyEnabled ? html`
            <section class="hourly" aria-label=${translate(language, "hourlyForecast")}>
              <div class="label">${translate(language, "hourlyForecast")}</div>
              ${hourly.length ? renderHourlyForecast(hourly, language, timeZone, forecastUnit)
                : html`<div class="message" role="status">${translate(language, this.hourlyStream.status === "loading" ? "hourlyLoading" : "forecastUnavailable")}</div>`}
            </section>
          ` : ""}
        </div>
      </ha-card>
    `;
  }
}