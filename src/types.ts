export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export type ForecastType = "daily" | "twice_daily" | "hourly";

export interface ForecastSubscriptionEvent {
  type: ForecastType;
  forecast: Array<{
    datetime?: unknown;
    temperature?: unknown;
    templow?: unknown;
    is_daytime?: unknown;
    condition?: unknown;
    precipitation_probability?: unknown;
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
  callApi?<T>(method: "GET", path: string): Promise<T>;
}

export interface RainfallHistoryState {
  state?: unknown;
  last_changed?: unknown;
  last_updated?: unknown;
  attributes?: { unit_of_measurement?: unknown };
}

export interface SkyScoopConfig {
  type?: string;
  name?: string;
  temperature_entity?: string;
  weather_entity?: string;
  humidity_entity?: string;
  dew_point_entity?: string;
  wind_speed_entity?: string;
  wind_gust_entity?: string;
  wind_direction_entity?: string;
  uv_index_entity?: string;
  illuminance_entity?: string;
  rain_state_entity?: string;
  rainfall_rate_entity?: string;
  rainfall_today_entity?: string;
  rainfall_week_entity?: string;
  adaptive_metrics?: boolean;
  show_rainfall_history?: boolean;
  layout?: "auto" | "compact" | "standard" | "wide";
  show_hourly_forecast?: boolean;
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