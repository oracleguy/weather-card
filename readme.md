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

The card will use three main areas:

1. Current conditions from the weather station: temperature, condition, feels-like temperature, and selected station metrics.
2. Near-term forecast from the configured weather entity: hourly forecast, precipitation probability, and a dynamic high/low summary.
3. Rainfall context from station sensors: current rain rate, rainfall today, rainfall this week, and a recent-history sparkline.

Additional Ecowitt values may include humidity, dew point, pressure, wind direction and speed, wind gusts, UV index, solar lux, and other available measurements. The card should prioritize these adaptively instead of displaying every value at once.

## Responsive behavior

The default layout will be automatic:

- **Compact:** current conditions, essential metrics, a short forecast, and compact rainfall totals.
- **Standard:** current conditions, hourly forecast, rainfall totals, and the 24-hour sparkline.
- **Wide:** expanded current conditions, a longer forecast strip, full rainfall history, and additional station details.

Manual layout and density overrides may be provided for users who want fixed behavior.

## Installation

The initial distribution target is a custom HACS frontend repository. Install SkyScoop through HACS, then add its JavaScript resource if HACS does not add it automatically. The compiled `skyscoop-card.js` asset is built from the TypeScript source; releases will publish that asset.

## Development

Requirements: Node.js 22.12 or newer and npm.

```sh
npm install
npm test
npm run typecheck
npm run build
```

The build writes the browser bundle to `dist/skyscoop-card.js`. The project currently uses a DOM test environment with a mocked Home Assistant object; it has not yet been validated in a live Home Assistant dashboard.

## Example configuration

The first implementation displays the configured station temperature. The weather entity and other station measurements are reserved for later increments.

```yaml
type: custom:skyscoop-card
temperature_entity: sensor.outdoor_temperature
weather_entity: weather.home
```

`temperature_entity` should refer to a temperature sensor. If it is omitted or unavailable, the card displays a setup or unavailable state instead of failing. Entity IDs are user-configured; SkyScoop does not assume Ecowitt-specific names.

## Localization

All user-facing strings should be translatable. This includes labels, forecast summaries, rainfall states, accessibility text, and compass directions.

Wind direction is stored as degrees and converted at display time. The card should support both 8-point and 16-point compass modes and use locale-appropriate direction labels rather than hardcoded English abbreviations.

## Roadmap

- [x] Create the initial TypeScript/Lit and HACS scaffold
- [x] Implement the basic card lifecycle, temperature display, starter config, and entity picker editor
- [ ] Verify the card in a live Home Assistant dashboard
- [ ] Add weather-station current conditions
- [ ] Add forecast rendering
- [ ] Add responsive compact, standard, and wide layouts
- [ ] Add dynamic time-of-day high/low behavior
- [ ] Add rainfall totals and a 24-hour sparkline
- [ ] Add adaptive metric prioritization
- [ ] Add compass-direction conversion
- [ ] Add localization and unit-aware formatting
- [ ] Add tests, documentation, screenshots, and release packaging

## Status

Early implementation. The current slice is a buildable standalone card with a station-temperature display, starter configuration, a basic visual editor, and DOM tests. Forecast selection and the rainfall, responsive, localization, and expanded metric features remain planned.

### Current decisions

- Project name: SkyScoop; Lovelace type: `custom:skyscoop-card`.
- Minimum target: Home Assistant 2026.9.1.
- Initial distribution: custom HACS repository.
- Implementation: standalone Lit web component; no Mushroom imports or runtime dependency.
- Observations come from user-mapped station entities; forecast data will come from the configured weather entity.
- For high/low selection, use forecast period timestamps when available. If they are unavailable, use 17:00 in Home Assistant local time as the evening switch; this fallback will not be configurable in the first release.
- Automated DOM tests are available. Live Home Assistant validation is pending.
