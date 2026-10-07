import { html } from "lit";
import { translate } from "./localization.js";
import { configuredRainfall, HOUR, prepareRainfallHistory } from "./rainfall.js";
import type { metricEmphasis } from "./metric-priority.js";
import type { RainfallHistory } from "./rainfall-history.js";
import type { HassLike, SkyScoopConfig } from "./types.js";
import { stationReading } from "./station.js";

export function renderRainfallSection(
  hass: HassLike | undefined,
  config: SkyScoopConfig | undefined,
  history: RainfallHistory,
  emphasis: ReturnType<typeof metricEmphasis>,
  timeZone: string,
) {
  const metrics = configuredRainfall(hass, config);
  if (!metrics.length && !config?.rain_state_entity) return "";
  const language = hass?.language;
  const number = new Intl.NumberFormat(language || "en", { maximumFractionDigits: 2 });
  const time = new Intl.DateTimeFormat(language || "en", { timeZone, month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
  const unit = stationReading(hass, config?.rainfall_rate_entity).unit;
  const stale = history.status === "error" && history.fetchedAt !== undefined;
  const end = stale ? Date.now() : history.fetchedAt ?? Date.now();
  const buckets = prepareRainfallHistory(history.records, end, unit, history.fetchedAt ?? end);
  const peaks = buckets.flatMap((bucket) => bucket.peak === undefined ? [] : [bucket.peak]);
  const peak = peaks.length ? Math.max(...peaks) : undefined;
  const scale = Math.max(peak ?? 0, 1);
  const path = buckets.map((bucket, index) => {
    if (bucket.peak === undefined) return "";
    const height = (74 - bucket.peak / scale * 64).toFixed(2);
    return `${index && buckets[index - 1].peak !== undefined ? "L" : "M"}${index * 10},${height} H${(index + 1) * 10}`;
  }).join(" ");
  const peakLabel = peak === undefined ? "" : `${translate(language, "peakRate")}: ${number.format(peak)} ${unit}`;
  const range = `${time.format(end - 24 * HOUR)} - ${time.format(end)}`;
  const status = emphasis.heavyRain ? "heavyRain" : emphasis.rain;
  const historyMessage = history.status === "loading" || history.status === "idle" ? "rainfallHistoryLoading"
    : history.status === "error" ? "rainfallHistoryError" : "rainfallHistoryEmpty";

  return html`
    <section class="rainfall" data-emphasis=${emphasis.rainfall} aria-label=${translate(language, "rainfall")}>
      <div class="rainfall-heading">
        <div class="label">${translate(language, "rainfall")}</div>
        <div class="rainfall-status"><ha-icon icon="mdi:weather-pouring" aria-hidden="true"></ha-icon>${translate(language, status)}</div>
      </div>
      ${metrics.length ? html`
        <div class="rainfall-metrics">
          ${metrics.map((metric) => html`
            <div class="rainfall-metric" data-rainfall=${metric.key}>
              <div class="label"><ha-icon .icon=${metric.icon} aria-hidden="true"></ha-icon>${translate(language, metric.label)}</div>
              <div class="metric-value">${metric.value === undefined ? translate(language, "unavailable") : `${number.format(metric.value)} ${metric.unit}`}</div>
            </div>
          `)}
        </div>
      ` : ""}
      ${config?.rainfall_rate_entity && config.show_rainfall_history !== false ? html`
        <div class="rainfall-history">
          <div class="label">${translate(language, "rainfallHistory")}</div>
          ${peak !== undefined ? html`
            <svg class="rainfall-plot" viewBox="0 0 240 80" preserveAspectRatio="none" role="img"
              aria-label=${`${translate(language, "rainfallHistory")}. ${range}. ${peakLabel}`}>
              <path d=${path} fill="none" vector-effect="non-scaling-stroke"></path>
            </svg>
          ` : html`<div class="rainfall-placeholder" role="status">${translate(language, historyMessage)}</div>`}
          <div class="rainfall-caption"><span>${peakLabel}</span><span>${range}</span></div>
          <div class="rainfall-history-status" role="status">${stale ? `${translate(language, "rainfallHistoryStale")} ${time.format(history.fetchedAt!)}` : ""}</div>
        </div>
      ` : ""}
    </section>
  `;
}