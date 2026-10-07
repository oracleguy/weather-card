import { html } from "lit";
import { compassPoint, normalizeDegrees } from "./compass.js";
import { translate } from "./localization.js";
import type { Layout } from "./responsive.js";
import type { configuredMetrics } from "./station.js";
import type { MetricEmphasis } from "./metric-priority.js";

export function renderStationMetrics(metrics: ReturnType<typeof configuredMetrics>, language: string | undefined, layout: Layout, emphasis: MetricEmphasis = {}) {
  if (!metrics.length) return "";
  const number = new Intl.NumberFormat(language || "en", { maximumFractionDigits: 1 });
  return html`
    <section class="station-metrics" aria-label=${translate(language, "stationMetrics")}>
      ${metrics.map((metric) => {
        const point = metric.key === "wind_direction_entity" && metric.value !== undefined
          ? compassPoint(metric.value, layout === "compact" ? 8 : 16) : undefined;
        const value = metric.value === undefined ? translate(language, "unavailable")
          : point ? `${translate(language, point)} (${number.format(normalizeDegrees(metric.value)!)}°)`
            : `${number.format(metric.value)} ${metric.unit}`;
        const reason = emphasis[metric.key];
        const adaptive = metric.key.startsWith("wind_") || metric.key === "uv_index_entity";
        return html`
          <div class="metric" data-metric=${metric.key} data-emphasis=${reason ?? "none"}>
            <div class="label"><ha-icon .icon=${metric.icon} aria-hidden="true"></ha-icon>${translate(language, metric.label)}</div>
            <div class="metric-value">${value}</div>
            ${adaptive ? html`<div class="metric-reason">${reason ? translate(language, reason) : ""}</div>` : ""}
          </div>
        `;
      })}
    </section>
  `;
}