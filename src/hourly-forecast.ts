import { html } from "lit";
import type { HourlyPeriod } from "./forecast.js";
import { translate } from "./localization.js";

const conditionIcons = {
  "clear-night": "mdi:weather-night", cloudy: "mdi:weather-cloudy", fog: "mdi:weather-fog",
  hail: "mdi:weather-hail", lightning: "mdi:weather-lightning", "lightning-rainy": "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy", pouring: "mdi:weather-pouring", rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy", "snowy-rainy": "mdi:weather-snowy-rainy", sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy", "windy-variant": "mdi:weather-windy-variant", exceptional: "mdi:alert-circle-outline",
} as const;

export function renderHourlyForecast(periods: readonly HourlyPeriod[], language: string | undefined, timeZone: string, unit: string) {
  let time: Intl.DateTimeFormat;
  try {
    time = new Intl.DateTimeFormat(language || "en", { timeZone, hour: "numeric", minute: "2-digit" });
  } catch {
    time = new Intl.DateTimeFormat("en", { timeZone: "UTC", hour: "numeric", minute: "2-digit" });
  }
  const number = new Intl.NumberFormat(language || "en", { maximumFractionDigits: 1 });
  return html`
    <div class="hourly-strip" role="list" tabindex="0" aria-label=${translate(language, "hourlyForecast")}>
      ${periods.map((period) => html`
        <div class="hourly-period" role="listitem">
          <time datetime=${new Date(period.timestamp).toISOString()}>${time.format(period.timestamp)}</time>
          ${period.condition && Object.hasOwn(conditionIcons, period.condition)
            ? html`<ha-icon .icon=${conditionIcons[period.condition as keyof typeof conditionIcons]} role="img" aria-label=${translate(language, period.condition as keyof typeof conditionIcons)}></ha-icon>`
            : ""}
          <div class="hourly-temperature">${number.format(period.temperature)} ${unit}</div>
          ${period.probability !== undefined ? html`
            <div class="hourly-probability" aria-label=${`${translate(language, "precipitationProbability")}: ${number.format(period.probability)}%`}>
              <ha-icon icon="mdi:water" aria-hidden="true"></ha-icon>${number.format(period.probability)}%
            </div>` : ""}
        </div>
      `)}
    </div>
  `;
}