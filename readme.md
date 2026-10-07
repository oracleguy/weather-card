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

## Planned information hierarchy

The planned card will use three main areas:

1. Current conditions from the weather station. The current implementation displays its configured temperature; other station metrics are planned.
2. Forecast information from the configured weather entity. The current implementation displays a dynamic high/low summary; hourly forecast and precipitation probability are planned.
3. Rainfall context from station sensors, including rainfall totals and a recent-history sparkline. This area is planned.

Additional Ecowitt values may include humidity, dew point, pressure, wind direction and speed, wind gusts, UV index, solar lux, and other available measurements. The card should prioritize these adaptively instead of displaying every value at once.

## Responsive behavior

The default layout will be automatic:

- **Compact:** current conditions, essential metrics, a short forecast, and compact rainfall totals.
- **Standard:** current conditions, hourly forecast, rainfall totals, and the 24-hour sparkline.
- **Wide:** expanded current conditions, a longer forecast strip, full rainfall history, and additional station details.

Manual layout and density overrides may be provided for users who want fixed behavior.

## Installation

The initial distribution target is a custom HACS frontend repository. Install SkyScoop through HACS, then add its JavaScript resource if HACS does not add it automatically. For the `weather-card` repository, the resource URL is `/hacsfiles/weather-card/skyscoop-card.js` and its type must be **JavaScript Module**.

HACS installations require a GitHub release with the compiled `skyscoop-card.js` attached as a release asset. Run `npm run build` and upload `dist/skyscoop-card.js` under the asset name `skyscoop-card.js`. The build directory is not committed, and the current CI workflow does not publish release assets. A source-only release or default-branch download is not sufficient.

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

The build writes the browser bundle to `dist/skyscoop-card.js`. Unit and DOM tests use a mocked Home Assistant object. Browser tests verify registration, station temperature, forecast subscription/rendering, and visual-editor events using a local fixture. The card has not been validated in a live Home Assistant dashboard.

For browser-level checks of the built bundle, install Playwright's Chromium browser once and run:

```sh
npx playwright install chromium
npm run test:browser
```

These tests use a local fixture and do not require a Home Assistant instance. They do not replace a live Home Assistant integration check.

## Example configuration

The card displays the configured station temperature and, when configured, a forecast high/low summary from a weather entity that advertises daily or twice-daily forecast support.

```yaml
type: custom:skyscoop-card
temperature_entity: sensor.outdoor_temperature
weather_entity: weather.home
```

`temperature_entity` should refer to a temperature sensor. `weather_entity` should refer to a weather entity with supported forecast data. If the station sensor is omitted or unavailable, the card displays a setup or unavailable state; if forecast data is missing, unsupported, or unavailable, it displays an unavailable forecast summary without suppressing the station reading. Entity IDs are user-configured; SkyScoop does not assume Ecowitt-specific names.

## Localization

The current interface strings are English-only. Numeric values are formatted with `Intl.NumberFormat` using Home Assistant's language, and forecast units use the weather entity's temperature unit. Broader translation support and comprehensive Home Assistant unit-preference handling remain planned.

Wind direction is not implemented yet. When added, it should be stored as degrees and converted at display time, with locale-appropriate direction labels.

## Roadmap

- [x] Create the initial TypeScript/Lit and HACS scaffold
- [x] Implement the basic card lifecycle, temperature display, starter config, and visual editor
- [x] Add forecast high/low summary with timestamp-based selection and a 17:00 local-time fallback
- [x] Add forecast subscription, weather entity picker, and automated tests
- [ ] Verify the card in a live Home Assistant dashboard
- [ ] Add weather-station current conditions
- [ ] Add hourly forecast rendering
- [ ] Add responsive compact, standard, and wide layouts
- [ ] Add rainfall totals and a 24-hour sparkline
- [ ] Add adaptive metric prioritization
- [ ] Add compass-direction conversion
- [ ] Add localization and unit-aware formatting
- [ ] Add tests, documentation, screenshots, and release packaging

## Status

Early implementation. The current slice is a buildable standalone Lit card with a station-temperature display, a separate forecast high/low summary, starter configuration, a visual editor for both entities, and unit, DOM, and browser tests. The layout is fixed and the UI strings are English-only. Rainfall, hourly forecasts, responsive tiers, expanded metrics, and broader localization remain planned. No live Home Assistant dashboard has been used for validation.

### Current decisions

- Project name: SkyScoop; Lovelace type: `custom:skyscoop-card`.
- Minimum target: Home Assistant 2026.9.1.
- Initial distribution: custom HACS repository.
- Implementation: standalone Lit web component; no Mushroom imports or runtime dependency.
- Observations come from the configured station temperature entity; forecast data comes separately from the configured weather entity.
- The card subscribes to Home Assistant forecast data using `weather/subscribe_forecast`, preferring twice-daily data when advertised and otherwise using daily data. For timestamped day/night periods, the nighttime period timestamp controls the switch. For daily data without a usable day/night boundary, the fallback is 17:00 in Home Assistant local time.
- Missing, unsupported, or unavailable forecast data does not replace or hide the station temperature.
- Automated DOM and browser tests cover mocked forecast behavior. Compatibility with a live Home Assistant 2026.9.1 dashboard remains unverified.
