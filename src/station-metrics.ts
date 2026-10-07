import { html } from "lit";
import { compassPoint, normalizeDegrees } from "./compass.js";
import { translate } from "./localization.js";
import type { Layout } from "./responsive.js";
import type { configuredMetrics } from "./station.js";

export function renderStationMetrics(metrics: ReturnType<typeof configuredMetrics>, language: string | undefined, layout: Layout) {
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
        return html`
          <div class="metric" data-metric=${metric.key}>
            <div class="label"><ha-icon .icon=${metric.icon} aria-hidden="true"></ha-icon>${translate(language, metric.label)}</div>
            <div class="metric-value">${value}</div>
          </div>
        `;
      })}
    </section>
  `;
}