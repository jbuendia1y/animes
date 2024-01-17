import type { RateLimit, RateLimitStore } from "../interfaces.ts";

export class MemoryRateLimiStore implements RateLimitStore {
  private data: Map<string, RateLimit>;

  constructor() {
    this.data = new Map();
  }

  get(ip: string): Promise<RateLimit | null> {
    const rateLimit = this.data.get(ip);
    return Promise.resolve(rateLimit ? rateLimit : null);
  }

  set(ip: string, data: RateLimit): Promise<RateLimit> {
    this.data.set(ip, data);
    return Promise.resolve(data);
  }

  has(ip: string): Promise<boolean> {
    return Promise.resolve(this.data.has(ip));
  }
}
