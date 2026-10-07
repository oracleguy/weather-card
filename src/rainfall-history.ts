import { HOUR } from "./rainfall.js";
import type { HassLike, RainfallHistoryState } from "./types.js";

export class RainfallHistory {
  records: readonly RainfallHistoryState[] = [];
  status: "idle" | "loading" | "ready" | "empty" | "error" = "idle";
  fetchedAt?: number;
  private hass?: HassLike;
  private entityId?: string;
  private generation = 0;
  private pending = false;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly changed: () => void) {}

  stop(): void {
    this.generation += 1;
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    this.hass = undefined;
    this.entityId = undefined;
    this.pending = false;
    this.records = [];
    this.fetchedAt = undefined;
    this.status = "idle";
  }

  sync(hass?: HassLike, entityId?: string): void {
    if (!hass || !entityId) {
      if (this.entityId) {
        this.stop();
        this.changed();
      }
      return;
    }
    if (entityId === this.entityId && hass.connection === this.hass?.connection && hass.callApi === this.hass?.callApi) {
      this.hass = hass;
      return;
    }
    this.stop();
    this.hass = hass;
    this.entityId = entityId;
    this.timer = setInterval(() => void this.fetch(), 300_000);
    void this.fetch();
  }

  private async fetch(): Promise<void> {
    if (this.pending || !this.hass || !this.entityId) return;
    const generation = this.generation;
    const end = Date.now();
    this.pending = true;
    if (this.fetchedAt === undefined) this.status = "loading";
    this.changed();
    try {
      if (!this.hass.callApi) throw new Error("History API unavailable");
      const query = new URLSearchParams({ filter_entity_id: this.entityId, end_time: new Date(end).toISOString() });
      const path = `history/period/${encodeURIComponent(new Date(end - 24 * HOUR).toISOString())}?${query}`;
      const response = await this.hass.callApi<unknown>("GET", path);
      if (generation !== this.generation) return;
      if (!Array.isArray(response) || (response.length && !Array.isArray(response[0]))) {
        throw new Error("Invalid history response");
      }
      const records: unknown[] = response[0] ?? [];
      this.records = records.filter((record): record is RainfallHistoryState =>
        record !== null && typeof record === "object" && !Array.isArray(record));
      this.fetchedAt = end;
      this.status = this.records.length ? "ready" : "empty";
    } catch {
      if (generation !== this.generation) return;
      this.status = "error";
    } finally {
      if (generation === this.generation) {
        this.pending = false;
        this.changed();
      }
    }
  }
}