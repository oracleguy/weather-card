# Mushroom Weather Station Card

A responsive Home Assistant Lovelace custom card for combining local weather-station observations with forecast data in a calm, Mushroom-inspired design.

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

During development, install the repository as a custom HACS frontend repository. Once the card is stable, it may be submitted for inclusion in the default HACS frontend collection.

The release process will publish the compiled frontend asset used by Home Assistant.

## Example configuration

The exact schema is not finalized. The intended configuration is similar to:

```yaml
type: custom:mushroom-weather-station-card
weather_entity: weather.home
temperature_entity: sensor.ecowitt_temperature
rain_state_entity: sensor.ecowitt_rain_state
rain_rate_entity: sensor.ecowitt_rain_rate
rain_today_entity: sensor.ecowitt_rain_today
rain_week_entity: sensor.ecowitt_rain_week
wind_direction_entity: sensor.ecowitt_wind_direction
wind_speed_entity: sensor.ecowitt_wind_speed
layout: auto
```

Entity names and optional fields will be finalized during implementation. The card should not assume Ecowitt-specific entity IDs.

## Localization

All user-facing strings should be translatable. This includes labels, forecast summaries, rainfall states, accessibility text, and compass directions.

Wind direction is stored as degrees and converted at display time. The card should support both 8-point and 16-point compass modes and use locale-appropriate direction labels rather than hardcoded English abbreviations.

## Roadmap

- [ ] Create the Lit and HACS project scaffold
- [ ] Render a basic card successfully in Home Assistant
- [ ] Add the visual editor and starter configuration
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

Early design and planning. The repository structure and public configuration schema may change before the first release.
