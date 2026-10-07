import { describe, expect, it, vi } from "vitest";
import { ForecastStream } from "../src/forecast-stream.js";
import type { ForecastSubscriptionEvent, HassConnection } from "../src/types.js";

describe("forecast stream lifecycle", () => {
  it("unsubscribes late resolutions and ignores stale callbacks", async () => {
    let receive!: (event: ForecastSubscriptionEvent) => void;
    let resolve!: (unsubscribe: () => void) => void;
    const unsubscribe = vi.fn();
    const changed = vi.fn();
    const connection: HassConnection = {
      subscribeMessage: <T,>(callback: (event: T) => void) => {
        receive = callback as typeof receive;
        return new Promise((done) => { resolve = done; });
      },
    };
    const stream = new ForecastStream(changed);
    const pending = stream.sync(connection, "weather.home", "hourly");
    expect(stream.status).toBe("loading");
    stream.stop();
    receive({ type: "hourly", forecast: [{ temperature: 25 }] });
    resolve(unsubscribe);
    await pending;
    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(stream.forecast).toBeUndefined();
    expect(stream.status).toBe("idle");
  });

  it("does not resubscribe on state updates but switches entity and connection", async () => {
    const unsubscribe = vi.fn();
    const subscribeMessage = vi.fn(async () => unsubscribe);
    const connection: HassConnection = { subscribeMessage };
    const stream = new ForecastStream(vi.fn());
    await stream.sync(connection, "weather.home", "hourly");
    await stream.sync(connection, "weather.home", "hourly");
    expect(subscribeMessage).toHaveBeenCalledOnce();
    await stream.sync(connection, "weather.away", "hourly");
    expect(unsubscribe).toHaveBeenCalledOnce();
    await stream.sync({ subscribeMessage }, "weather.away", "hourly");
    expect(subscribeMessage).toHaveBeenCalledTimes(3);
    await stream.sync(undefined);
    expect(unsubscribe).toHaveBeenCalledTimes(3);
  });

  it("isolates rejected subscriptions from another stream", async () => {
    const changed = vi.fn();
    const summary = new ForecastStream(changed);
    const hourly = new ForecastStream(changed);
    const connection: HassConnection = {
      subscribeMessage: async <T,>(callback: (event: T) => void, message: { forecast_type: string }) => {
        if (message.forecast_type === "daily") throw new Error("not available");
        callback({ type: "hourly", forecast: [{ temperature: 0 }] } as T);
        return () => undefined;
      },
    };
    await Promise.all([summary.sync(connection, "weather.home", "daily"), hourly.sync(connection, "weather.home", "hourly")]);
    expect(summary.status).toBe("error");
    expect(hourly.status).toBe("ready");
    expect(hourly.forecast?.[0].temperature).toBe(0);
  });
});