# SkyScoop User Guide

SkyScoop combines readings from your weather station with forecasts from a Home Assistant weather entity. Station observations remain distinct from forecast data: forecast temperatures never replace the measured outdoor temperature.

The card type is `custom:skyscoop-card`. SkyScoop targets Home Assistant 2026.9.1 and newer.

## Availability and installation

SkyScoop is not yet available as a public HACS release. HACS is the planned distribution channel. A public release must include the compiled `skyscoop-card.js` file as a GitHub release asset; a source-only release or default-branch download is not enough. The current CI workflow does not publish release assets.

When a public release is available, install SkyScoop through HACS and add its JavaScript resource if HACS does not add it automatically. For the `weather-card` repository, the resource URL is `/hacsfiles/weather-card/skyscoop-card.js`, with resource type **JavaScript Module**.

If Home Assistant reports "Failed to load Lovelace resource," inspect the resource request in the browser's Network tab. A 404 usually means the release asset is missing or the resource URL is incorrect. Verify that the installed release contains `skyscoop-card.js`, then redownload it through HACS and hard-refresh the browser. The card cannot appear in the picker until its module loads successfully.

## Quick start

```yaml
type: custom:skyscoop-card
temperature_entity: sensor.outdoor_temperature
weather_entity: weather.home
```

Replace the example entity IDs with your own. `temperature_entity` must be your outdoor weather-station temperature sensor, not an indoor sensor or a weather entity. The card picker leaves this selection empty rather than guessing. Existing configurations continue to work unchanged.

The weather entity supplies forecasts; it does not supply the displayed station temperature. If the temperature sensor is omitted, the card shows a setup prompt.

## Configuration

Optional station mappings and presentation settings:

```yaml
type: custom:skyscoop-card
name: Backyard
temperature_entity: sensor.outdoor_temperature
weather_entity: weather.home
humidity_entity: sensor.outdoor_humidity
dew_point_entity: sensor.outdoor_dew_point
wind_speed_entity: sensor.wind_speed
wind_gust_entity: sensor.wind_gust
wind_direction_entity: sensor.wind_direction
uv_index_entity: sensor.uv_index
illuminance_entity: sensor.solar_illuminance
layout: auto
show_hourly_forecast: true
```

Optional rainfall mappings and controls:

```yaml
type: custom:skyscoop-card
temperature_entity: sensor.outdoor_temperature
weather_entity: weather.home
rain_state_entity: binary_sensor.raining
rainfall_rate_entity: sensor.rain_rate
rainfall_today_entity: sensor.rainfall_today
rainfall_week_entity: sensor.rainfall_this_week
adaptive_metrics: true
show_rainfall_history: true
```

All optional mappings can also be configured or cleared in the visual editor. SkyScoop does not assume Ecowitt entity names.

| Option | Meaning and default |
| --- | --- |
| `name` | Optional card header; omitted or blank hides it. |
| `temperature_entity` | Measured outdoor station temperature; no guessed default. |
| `weather_entity` | Forecast provider; never replaces measured temperature. |
| `humidity_entity` | Relative humidity from 0 to 100. |
| `dew_point_entity` | Measured dew point; negative values are valid. |
| `wind_speed_entity`, `wind_gust_entity` | Nonnegative station wind readings. |
| `wind_direction_entity` | Meteorological direction the wind comes from, in degrees. |
| `uv_index_entity`, `illuminance_entity` | Nonnegative UV index and light readings. |
| `rain_state_entity` | Optional binary rain sensor; valid `on`/`off` takes precedence over rate-based detection. |
| `rainfall_rate_entity` | Nonnegative measured rain rate; also supplies recorder history for the sparkline. |
| `rainfall_today_entity`, `rainfall_week_entity` | Nonnegative totals; each sensor defines its own reset period. |
| `adaptive_metrics` | `true` by default; `false` removes adaptive emphasis without hiding readings or rain status. |
| `show_rainfall_history` | `true` by default when a rate sensor is mapped; `false` hides the plot and stops history requests. |
| `layout` | `auto` by default; accepts `compact`, `standard`, or `wide`. |
| `show_hourly_forecast` | `true` by default; `false` disables the hourly stream. |

Missing, empty, unknown, unavailable, or invalid sensor states display as unavailable. Unconfigured optional sensors are hidden; configured but unavailable sensors retain their labels and do not suppress other readings.

## Responsive layout

The default `layout: auto` responds to the card's allocated width, not the browser viewport:

| Tier | Card width | Metric columns | Future hourly entries |
| --- | --- | --- | --- |
| Compact | Below 360px | 2 | Up to 4 |
| Standard | 360px through 599px | 3 | Up to 8 |
| Wide | 600px and above | 4 | Up to 12 |

The hourly strip scrolls horizontally when needed and can receive keyboard focus. Manual layout settings are available, while metric columns still reduce at narrow widths to prevent overflow. The measured temperature and forecast high/low share a two-column summary at 360px or wider and stack below that. The header appears only when a non-empty `name` is configured. All configured station and rainfall readings remain available in every tier.

## Forecasts

The high/low summary uses daily or twice-daily forecasts, preferring twice-daily when advertised. Actual day/night period timestamps control the switch when available; otherwise, the card switches at 17:00 in Home Assistant's timezone.

Hourly forecasts use the same weather entity through an independent `weather/subscribe_forecast` subscription when hourly support is advertised. Hourly-only providers work even without a daily summary. The strip selects valid entries within the next 24 hours, sorts them by timestamp, removes duplicates, and does not invent missing periods. A provider without hourly support has no hourly section; supported streams show loading or unavailable states when appropriate.

Forecast failures do not hide station readings or interrupt the other forecast stream. Precipitation probability describes forecast likelihood, not observed active rain.

## Rainfall

Map only the readings your station provides. Rate and totals are independent. Daily and weekly totals are read directly from their sensors, not calculated by integrating the rate, so choose sensors with the reset periods you want to display.

A valid rain-state binary sensor is authoritative: `on` means raining and `off` means dry, even if the rate disagrees. If the mapping is missing, unavailable, or invalid, the card falls back to the measured rate: a positive rate means raining, zero means dry, and an invalid rate means unknown. Forecast probability and weather conditions never establish observed rain.

The sparkline uses Home Assistant history/recorder data for `rainfall_rate_entity`. It loads through the authenticated HA history API when the card connects and refreshes every five minutes, independently of forecasts. No separate token is required. Ordinary HA state updates refresh current readings without fetching history each time. Disconnecting, clearing the rate mapping, or disabling history stops polling and ignores pending responses.

The plot covers 24 elapsed hours ending at the last fetch, split into hourly **peak rain-rate** intervals. Values retain rate units such as `mm/h`, not rainfall amounts. Recorder states apply until the next recorded change. Fully known zero intervals draw a dry baseline; missing or invalid states and incompatible historical units create gaps. Partially known hours are omitted rather than guessed. A sensor excluded from recorder may have no usable plot while its current readings still work.

Failed refreshes retain usable previous history, marked stale with its last-loaded time and without extending coverage. An initial failure displays an unavailable-history message.

## Adaptive emphasis

Adaptive emphasis leaves readings in their existing order and never hides them. Observed active rain strengthens the rain status. Heavy rain adds a text cue at a measured rate of at least 7.5 mm/h and requires observed wet status. Wind speed or gust at 8 m/s or higher receives a strong-wind cue. UV index 6 or higher receives a high-UV cue. These are presentation thresholds, not safety alerts, and signals can appear together.

Threshold comparisons recognize wind units `m/s`, `km/h`, `mph`, `kn`, and `knots`, and rain-rate units `mm/h` and `in/h`. The card normalizes recognized units for comparison without converting displayed values. Unknown units disable magnitude-based emphasis, not the reading or positive-rate rain detection. Set `adaptive_metrics: false` to remove emphasis; measured wet/dry/heavy-rain status, totals, history, and forecasts remain available. Heat, humidity, fog, and daylight rules are not implemented.

## Sensor interactions

Tap or click the measured temperature, a station metric, or a rainfall rate/total to open Home Assistant's standard More Info dialog for that entity. Keyboard users can Tab to a reading and activate it with Enter or Space. Configured unavailable readings remain interactive.

Home Assistant controls the dialog and its history; history availability depends on the entity and recorder settings. Forecasts, derived rain status, and the rain-history chart are display-only. The More Info interaction still needs live Home Assistant verification; automated tests cover entity targeting, event propagation, touch and keyboard activation, visible focus, and responsive layout in a mocked frontend.

## Localization and units

Interface and compass labels currently fall back to English. Numbers use `Intl.NumberFormat` with Home Assistant's language. Hourly and history time labels use `Intl.DateTimeFormat` with HA's language and timezone.

Station readings retain each sensor's reported unit; forecast readings retain the weather entity's temperature unit. No display-unit conversions are performed, so station and forecast units may differ. Broader translations and comprehensive unit-preference handling are not implemented.

Wind direction is stored and processed in degrees, normalized modulo 360. North works for both 0 and 360; negative and over-range finite values normalize consistently. Compact layout uses 8 compass points, while standard and wide use 16. The degree value remains available alongside the compass label.

## Development and verification

Requirements: Node.js 22.12 or newer and npm.

```sh
npm install
npm test
npm run typecheck
npm run build
npm run test:browser
```

The build writes `dist/skyscoop-card.js`; do not edit the generated bundle by hand. Unit and DOM tests cover station parsing, compass boundaries, forecast selection and subscription cleanup, rainfall history intervals/gaps/units, bounded history requests, adaptive thresholds, responsive breakpoints, and visual-editor events.

Browser tests use a mocked Home Assistant fixture. They exercise the built bundle at 280, 359, 360, 599, 600, and 900px card allocations and in a mobile viewport, and check locale/time formatting, text overflow, icon assets, SVG geometry, history failures, and stable metric positions. Screenshots under `test-results/` use a mocked card wrapper and icons, not the actual Home Assistant frontend.

On 2026-10-07, a user reported successful loading, station-temperature rendering, and today's forecast high in a live Home Assistant dashboard. The HA version was not confirmed. Newer station metrics, hourly forecasts, responsive layouts, rainfall/history API behavior, adaptive emphasis, and the expanded editor still need live verification on a confirmed 2026.9.1+ installation. Before release, test recorder-enabled and recorder-excluded rate sensors, partial mappings, dry/active/heavy rain, narrow/wide placements, and YAML/editor configuration.