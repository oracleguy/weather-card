# SkyScoop

A standalone Home Assistant Lovelace custom card for combining local weather-station observations with forecast data. It takes visual inspiration from Mushroom cards but has no Mushroom dependency.

The Lovelace resource type is `custom:skyscoop-card`. SkyScoop targets Home Assistant 2026.9.1 and newer.

This project is designed for Ecowitt-style weather stations and weather integrations such as NWS, but it should remain usable with any Home Assistant entities that expose compatible values.

## Design goals

- Show the current temperature from the local weather station.
- Show forecast information separately from observed station data.
- Adapt the summary based on the time of day, such as showing today's high before late afternoon and tonight's low afterward.
- Make rainfall a first-class part of the card, especially for wet climates such as the Pacific Northwest.
- Use a 24-hour rainfall sparkline based on hourly rainfall increments.
- Respond to active rain, heavy rain, wind, daylight, and other conditions by prioritizing the most useful metrics.
- Adapt to the width available in the Home Assistant dashboard.
- Support Home Assistant's visual card editor as well as YAML configuration.
- Support Home Assistant language and unit preferences.
- Match the visual language of Mushroom while remaining completely independent of Mushroom.

## Information hierarchy

The card keeps observations separate from forecasts:

1. Current conditions from the weather station: outdoor temperature and optional humidity, dew point, wind speed, gust, direction, UV index, and illuminance.
2. Forecast information from the configured weather entity: dynamic high/low summary and an hourly strip with temperatures, conditions, and precipitation probability when supported.
3. Rainfall context from station sensors, including rainfall totals and a recent-history sparkline. This area is planned.

Pressure and automatic condition-driven prioritization remain planned. Only configured station metrics appear; an unavailable optional sensor does not suppress other readings.

## Responsive behavior

The default `layout: auto` observes the card's allocated width, not the browser viewport:

- **Compact:** below 360px; two metric columns and up to four hourly entries.
- **Standard:** 360px through 599px; three metric columns and up to eight hourly entries.
- **Wide:** 600px and above; four metric columns and up to twelve hourly entries.

The measured temperature, high/low summary, and all configured station metrics remain available in every tier. The hourly strip scrolls horizontally when needed and is keyboard-focusable. Manual `compact`, `standard`, and `wide` overrides are available; metric columns still reduce at narrow widths to avoid overflow. Rainfall is not implemented yet.

The measured outdoor temperature and the forecast high/low share a two-column summary when the card is at least 360px wide. They stack below that width to keep their labels and values readable. The header is hidden unless a non-empty `name` is configured.

## Installation

The initial distribution target is a custom HACS frontend repository. Install SkyScoop through HACS, then add its JavaScript resource if HACS does not add it automatically. For the `weather-card` repository, the resource URL is `/hacsfiles/weather-card/skyscoop-card.js` and its type must be **JavaScript Module**.

HACS installations require a GitHub release with the compiled `skyscoop-card.js` attached as a release asset. Run `npm run build` and upload `dist/skyscoop-card.js` under the asset name `skyscoop-card.js`. The browser bundle is generated from source; do not edit it by hand. The current CI workflow does not publish release assets. A source-only release or default-branch download is not sufficient.

If the console reports "Failed to load Lovelace resource", check the resource request in the browser's Network tab. A 404 indicates a missing file or incorrect URL. Verify that the installed release contains the JavaScript asset, redownload that release through HACS, and hard-refresh the browser. The card cannot appear in the picker until its module loads successfully.

## Development

Requirements: Node.js 22.12 or newer and npm.

```sh
npm install
npm test
npm run typecheck
npm run build
npm run test:browser
```

The build writes the browser bundle to `dist/skyscoop-card.js`. Unit and DOM tests cover station parsing, compass boundaries, forecast selection and subscription cleanup, width breakpoints, and visual-editor events. Browser tests use a mocked Home Assistant fixture to verify the built bundle at 280, 359, 360, 599, 600, and 900px allocations and in a mobile viewport. They also check number/time formatting with a non-English locale, text overflow, and fixture icon assets. Screenshots are generated under `test-results/`; their card wrapper and icons are mocks, not the actual Home Assistant frontend.

On 2026-10-07, the user reported successful loading, station-temperature rendering, and today's forecast high in a live Home Assistant dashboard. The HA version was not confirmed. The new station metrics, hourly strip, responsive layouts, and expanded visual editor still need live HA verification.

For browser-level checks of the built bundle, install Playwright's Chromium browser once and run:

```sh
npx playwright install chromium
npm run test:browser
```

These tests use a local fixture and do not require a Home Assistant instance. They do not replace a live Home Assistant integration check.

## Example configuration

Minimal configuration:

```yaml
type: custom:skyscoop-card
temperature_entity: sensor.outdoor_temperature
weather_entity: weather.home
```

**`temperature_entity` must be your outdoor weather-station temperature sensor**, not an indoor temperature sensor or a weather entity. New starter configurations leave this selection empty rather than guessing which sensor is outdoors. Existing configurations continue to work unchanged.

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

Replace these example entity IDs with your own. All optional mappings can be configured or cleared in the visual editor; SkyScoop does not assume Ecowitt entity names.

| Option | Meaning / default |
| --- | --- |
| `name` | Optional card header; omitted or blank hides the header. |
| `temperature_entity` | Measured outdoor station temperature; no guessed default. |
| `weather_entity` | Forecast provider; never replaces measured temperature. |
| `humidity_entity` | Numeric relative humidity from 0 to 100. |
| `dew_point_entity` | Measured dew point; negative values are valid. |
| `wind_speed_entity`, `wind_gust_entity` | Nonnegative station wind readings. |
| `wind_direction_entity` | Meteorological direction the wind comes **from**, in degrees. |
| `uv_index_entity`, `illuminance_entity` | Nonnegative station UV index and light readings. |
| `layout` | `auto` (default), `compact`, `standard`, or `wide`. |
| `show_hourly_forecast` | `true` by default; set `false` to disable the hourly stream. |

If the outdoor sensor is omitted, the card displays a setup prompt. Missing, empty, unknown, unavailable, or invalid sensor states display an unavailable reading. Unconfigured optional sensors are hidden; configured unavailable ones retain their labels.

### Forecast behavior

The high/low summary uses daily or twice-daily forecasts, preferring twice-daily when advertised. Actual day/night period timestamps control the transition when available; otherwise it switches at 17:00 in Home Assistant's timezone. Hourly forecasts use the **same** weather entity with an independent `weather/subscribe_forecast` subscription when hourly support is advertised. Hourly-only providers work even without a daily summary.

The hourly strip selects the next valid entries within 24 hours, sorts them by timestamp, removes duplicates, and does not invent missing periods. Times use HA's timezone. A provider without hourly support has no hourly section; supported streams show loading or unavailable states when appropriate. Forecast failure never hides station readings or interrupts the other forecast stream. Precipitation probability describes forecast likelihood, not observed active rain.

## Localization

Interface and compass labels currently fall back to English. Numbers use `Intl.NumberFormat` with Home Assistant's language, and hourly time labels use `Intl.DateTimeFormat` with HA's language and timezone. Station readings retain each sensor's reported unit; forecast readings retain the weather entity's temperature unit. No unit conversions are performed, so station and forecast units can differ. Broader translations and comprehensive unit-preference handling remain planned.

Wind direction remains numeric degrees, normalized modulo 360. North works for both 0 and 360; negative and over-range finite values normalize consistently. Compact uses 8 compass points and standard/wide use 16. Labels are centralized for future translation, and the displayed degree value remains available alongside the compass label.

## Roadmap

- [x] Create the initial TypeScript/Lit and HACS scaffold
- [x] Implement the basic card lifecycle, temperature display, starter config, and visual editor
- [x] Add forecast high/low summary with timestamp-based selection and a 17:00 local-time fallback
- [x] Add forecast subscription, weather entity picker, and automated tests
- [x] Receive live HA smoke-test confirmation for loading, temperature, and today's high
- [x] Add optional weather-station current conditions
- [x] Add hourly forecast rendering
- [x] Add responsive compact, standard, and wide layouts
- [ ] Verify the new metrics, hourly forecast, layouts, and editor in live HA
- [ ] Add rainfall totals and a 24-hour sparkline
- [ ] Add adaptive metric prioritization
- [x] Add compass-direction conversion
- [ ] Add localization and unit-aware formatting
- [ ] Add tests, documentation, screenshots, and release packaging

## Status

Early implementation. The card includes measured outdoor temperature, optional station metrics, a separate forecast high/low summary, an independent hourly forecast, automatic width-aware layouts, and a visual editor. Unit, DOM, and browser tests cover the new milestone. Rainfall, adaptive prioritization, pressure, comprehensive translations, and unit conversion remain planned. The previous temperature/high slice has a user-reported live smoke test; the new milestone is not yet live-verified.

### Current decisions

- Project name: SkyScoop; Lovelace type: `custom:skyscoop-card`.
- Minimum target: Home Assistant 2026.9.1.
- Initial distribution: custom HACS repository.
- Implementation: standalone Lit web component; no Mushroom imports or runtime dependency.
- Observations come only from user-mapped station sensors; forecast data comes separately from the configured weather entity. Starter configuration does not guess an outdoor temperature sensor.
- The card subscribes to Home Assistant forecast data using `weather/subscribe_forecast`, preferring twice-daily data when advertised and otherwise using daily data. For timestamped day/night periods, the nighttime period timestamp controls the switch. For daily data without a usable day/night boundary, the fallback is 17:00 in Home Assistant local time.
- Missing, unsupported, or unavailable forecast data does not replace or hide the station temperature.
- The hourly stream uses the same weather entity and remains independent of the summary stream. Both clean up on disconnect and ignore stale subscription callbacks.
- Automatic layout uses actual allocated width with 360px and 600px boundaries. All configured station readings remain accessible in each tier.
- Automated DOM and browser tests use mocks. A user confirmed loading, measured temperature, and today's high in live HA; exact-version compatibility and new-feature live behavior remain unverified.
