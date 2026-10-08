# SkyScoop

Weather-station observations and local forecasts, together in one Home Assistant card.

SkyScoop is a standalone Lovelace card for Ecowitt-style stations and compatible Home Assistant entities. It keeps measured conditions separate from forecast data, and takes visual inspiration from Mushroom without depending on it.

The Lovelace card type is `custom:skyscoop-card`. SkyScoop targets Home Assistant 2026.9.1 and newer.

## At a glance

- Show measured outdoor conditions alongside a separate forecast summary and hourly forecast.
- Add only the station readings you have, including humidity, wind, UV, light, and rainfall.
- See a 24-hour rain-rate history when recorder data is available.
- Let the layout adapt to the card's actual dashboard width.
- Configure the card in YAML or Home Assistant's visual editor.

## Design goals

- Show the current temperature from the local weather station.
- Show forecast information separately from observed station data.
- Adapt the summary based on the time of day, such as showing today's high before late afternoon and tonight's low afterward.
- Make rainfall a first-class part of the card, especially for wet climates such as the Pacific Northwest.
- Use a 24-hour rainfall sparkline based on hourly peak rain rates.
- Respond to active rain, heavy rain, wind, daylight, and other conditions by prioritizing the most useful metrics.
- Adapt to the width available in the Home Assistant dashboard.

## Availability

SkyScoop is not yet available as a public HACS release. HACS is the planned distribution channel. You can manually add the repository in HACS to install this.

## Quick start

Install via HACS and then add the card to a dashboard and map your own outdoor station sensor and weather entity:

```yaml
type: custom:skyscoop-card
temperature_entity: sensor.outdoor_temperature
weather_entity: weather.home
```

`temperature_entity` must be an outdoor weather-station sensor. SkyScoop deliberately does not guess which of your temperature sensors is outdoors. See the [user guide](docs/USER_GUIDE.md) for installation details, optional sensors, and card behavior.

## Development

Requirements: Node.js 22.12 or newer and npm.

```sh
npm install
npm test
npm run typecheck
npm run build
npm run test:browser
```

The browser tests use a local Home Assistant mock fixture; they do not replace live Home Assistant testing. A live smoke test has confirmed loading, station temperature, and today's forecast high, but the exact HA version and newer features have not been verified in a live installation.

For detailed configuration, limitations, and troubleshooting, start with the [SkyScoop user guide](docs/USER_GUIDE.md).

