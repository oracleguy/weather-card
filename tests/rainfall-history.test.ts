import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RainfallHistory } from "../src/rainfall-history.js";
import type { HassLike } from "../src/types.js";

describe("rainfall history lifecycle", () => {
  let history: RainfallHistory;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-07T12:00:00Z"));
    history = new RainfallHistory(vi.fn());
  });
  afterEach(() => { history.stop(); vi.useRealTimers(); });

  it("scopes and encodes a single request and refreshes at most every five minutes", async () => {
    const callApi = vi.fn().mockResolvedValue([[]]);
    const hass = { states: {}, callApi };
    history.sync(hass, "sensor.rain_rate");
    await vi.advanceTimersByTimeAsync(0);
    expect(history.status).toBe("empty");
    const [method, path] = callApi.mock.calls[0];
    const url = new URL(path, "http://ha/api/");
    expect(method).toBe("GET");
    expect(decodeURIComponent(url.pathname)).toBe("/api/history/period/2026-10-06T12:00:00.000Z");
    expect(url.searchParams.get("filter_entity_id")).toBe("sensor.rain_rate");
    expect(url.searchParams.get("end_time")).toBe("2026-10-07T12:00:00.000Z");
    expect(url.searchParams.has("no_attributes")).toBe(false);
    for (let index = 0; index < 100; index += 1) history.sync({ ...hass }, "sensor.rain_rate");
    await vi.advanceTimersByTimeAsync(299_999);
    expect(callApi).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(callApi).toHaveBeenCalledTimes(2);
  });

  it("coalesces pending requests and ignores completions after source changes or stop", async () => {
    let resolveOld!: (value: unknown) => void;
    const callApi = vi.fn().mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }))
      .mockResolvedValueOnce([[{ state: "2" }]]);
    const hass = { states: {}, callApi };
    history.sync(hass, "sensor.old");
    await vi.advanceTimersByTimeAsync(600_000);
    expect(callApi).toHaveBeenCalledTimes(1);
    history.sync(hass, "sensor.new");
    await vi.advanceTimersByTimeAsync(0);
    resolveOld([[{ state: "999" }]]);
    await vi.advanceTimersByTimeAsync(0);
    expect(history.records).toEqual([{ state: "2" }]);
    history.stop();
    await vi.advanceTimersByTimeAsync(600_000);
    expect(callApi).toHaveBeenCalledTimes(2);
    expect(history.status).toBe("idle");
  });

  it("retains last successful data on failure and retries on the bounded cadence", async () => {
    const callApi = vi.fn().mockResolvedValueOnce([[{ state: "0" }]])
      .mockRejectedValueOnce(new Error("recorder unavailable")).mockResolvedValueOnce([]);
    history.sync({ states: {}, callApi }, "sensor.rate");
    await vi.advanceTimersByTimeAsync(0);
    const fetchedAt = history.fetchedAt;
    await vi.advanceTimersByTimeAsync(300_000);
    expect(history.status).toBe("error");
    expect(history.records).toEqual([{ state: "0" }]);
    expect(history.fetchedAt).toBe(fetchedAt);
    await vi.advanceTimersByTimeAsync(300_000);
    expect(history.status).toBe("empty");
    expect(history.records).toEqual([]);
  });

  it("fails locally without an API and refetches when the API context changes", async () => {
    history.sync({ states: {} }, "sensor.rate");
    await vi.advanceTimersByTimeAsync(0);
    expect(history.status).toBe("error");
    const callApi = vi.fn().mockResolvedValue([[]]);
    const hass: HassLike = { states: {}, callApi };
    history.sync(hass, "sensor.rate");
    await vi.advanceTimersByTimeAsync(0);
    expect(callApi).toHaveBeenCalledTimes(1);
    history.sync();
    expect(history.status).toBe("idle");
    history.sync(hass, "sensor.rate");
    await vi.advanceTimersByTimeAsync(0);
    expect(callApi).toHaveBeenCalledTimes(2);
  });

  it("rejects malformed responses without losing unrelated card state", async () => {
    const callApi = vi.fn().mockResolvedValue({ unexpected: true });
    history.sync({ states: {}, callApi }, "sensor.rate");
    await vi.advanceTimersByTimeAsync(0);
    expect(history.status).toBe("error");
    expect(history.records).toEqual([]);
  });
});