const messages = {
  en: {
    temperature: "Temperature",
    unavailable: "Unavailable",
    chooseTemperature: "Choose a temperature entity in the card configuration.",
    temperatureEntity: "Temperature entity",
  },
} as const;

type MessageKey = keyof (typeof messages)["en"];

export function translate(language: string | undefined, key: MessageKey): string {
  const locale = language?.toLowerCase().split("-")[0];
  const selected = locale && locale in messages ? locale as keyof typeof messages : "en";
  return messages[selected][key];
}