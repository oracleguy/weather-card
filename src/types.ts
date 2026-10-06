export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export type ForecastType = "daily" | "twice_daily";

export interface ForecastSubscriptionEvent {
  type: ForecastType;
  forecast: Array<{
    datetime?: unknown;
    temperature?: unknown;
    templow?: unknown;
    is_daytime?: unknown;
  }> | null;
}

export interface HassConnection {
  subscribeMessage<T>(
    callback: (event: T) => void,
    message: {
      type: "weather/subscribe_forecast";
      forecast_type: ForecastType;
      entity_id: string;
    },
  ): Promise<() => void>;
}

export interface HassLike {
  states: Record<string, HassEntity>;
  language?: string;
  config?: { time_zone?: string };
  connection?: HassConnection;
}

export interface SkyScoopConfig {
  type?: string;
  name?: string;
  temperature_entity?: string;
  weather_entity?: string;
}

export interface CustomCardDescriptor {
  type: string;
  name: string;
  description: string;
  preview: boolean;
}

declare global {
  interface Window {
    customCards?: CustomCardDescriptor[];
  }
}