const messages = {
  en: {
    temperature: "Outdoor temperature",
    cardHeader: "Card header (optional)",
    unavailable: "Unavailable",
    chooseTemperature: "Choose an outdoor weather-station temperature sensor in the card configuration.",
    temperatureEntity: "Outdoor / weather-station temperature sensor",
    humidity: "Humidity",
    dewPoint: "Dew point",
    windSpeed: "Wind speed",
    windGust: "Wind gust",
    windDirection: "Wind direction (from)",
    uvIndex: "UV index",
    illuminance: "Illuminance",
    stationMetrics: "Optional station sensors",
    hourlyForecast: "Hourly forecast",
    hourlyLoading: "Loading hourly forecast",
    layout: "Layout",
    auto: "Automatic",
    compact: "Compact",
    standard: "Standard",
    wide: "Wide",
    precipitationProbability: "Precipitation probability",
    "clear-night": "Clear night", cloudy: "Cloudy", fog: "Fog", hail: "Hail", lightning: "Lightning",
    "lightning-rainy": "Lightning and rain", partlycloudy: "Partly cloudy", pouring: "Heavy rain", rainy: "Rain",
    snowy: "Snow", "snowy-rainy": "Snow and rain", sunny: "Sunny", windy: "Windy",
    "windy-variant": "Windy and cloudy", exceptional: "Exceptional weather",
    N: "N", NNE: "NNE", NE: "NE", ENE: "ENE", E: "E", ESE: "ESE", SE: "SE", SSE: "SSE",
    S: "S", SSW: "SSW", SW: "SW", WSW: "WSW", W: "W", WNW: "WNW", NW: "NW", NNW: "NNW",
    forecastHigh: "Today's forecast high",
    forecastLow: "Tonight's forecast low",
    forecastSummary: "Forecast summary",
    forecastUnavailable: "Forecast unavailable",
    weatherEntity: "Weather entity",
  },
} as const;

type MessageKey = keyof (typeof messages)["en"];

export function translate(language: string | undefined, key: MessageKey): string {
  const locale = language?.toLowerCase().split("-")[0];
  const selected = locale && locale in messages ? locale as keyof typeof messages : "en";
  return messages[selected][key];
}