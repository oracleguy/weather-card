import type { ForecastPeriod } from "./forecast.js";
import type { ForecastSubscriptionEvent, ForecastType, HassConnection } from "./types.js";

export class ForecastStream {
  forecast?: readonly ForecastPeriod[];
  status: "idle" | "loading" | "ready" | "error" = "idle";
  private key?: string;
  private connection?: HassConnection;
  private unsubscribe?: () => void;
  private generation = 0;

  constructor(private readonly changed: () => void) {}

  stop(): void {
    this.generation += 1;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.key = undefined;
    this.connection = undefined;
    this.forecast = undefined;
    this.status = "idle";
  }

  async sync(connection?: HassConnection, entityId?: string, type?: ForecastType): Promise<void> {
    if (!connection || !entityId || !type) {
      if (this.key || this.status !== "idle") {
        this.stop();
        this.changed();
      }
      return;
    }
    const key = `${entityId}:${type}`;
    if (key === this.key && connection === this.connection) return;
    this.stop();
    const generation = this.generation;
    this.key = key;
    this.connection = connection;
    this.status = "loading";
    this.changed();
    try {
      const unsubscribe = await connection.subscribeMessage<ForecastSubscriptionEvent>((event) => {
        if (generation !== this.generation) return;
        this.forecast = Array.isArray(event.forecast) ? event.forecast : undefined;
        this.status = "ready";
        this.changed();
      }, { type: "weather/subscribe_forecast", entity_id: entityId, forecast_type: type });
      if (generation !== this.generation) unsubscribe();
      else this.unsubscribe = unsubscribe;
    } catch {
      if (generation !== this.generation) return;
      this.key = undefined;
      this.connection = undefined;
      this.forecast = undefined;
      this.status = "error";
      this.changed();
    }
  }
}