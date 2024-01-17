export interface RateLimit {
  requests: number;
  timestamp: Date;
}

export interface RateLimitStore {
  has(ip: string): Promise<boolean>;
  get(ip: string): Promise<RateLimit | null>;
  set(ip: string, data: RateLimit): Promise<RateLimit>;
}

export interface RateLimitConfig {
  /**
   * Break time in miliseconds
   */
  breakTime: number;
  /**
   * Requests limit per IP
   */
  limit: number;

  /**
   * Store to save ips and check their timestamps
   * @default MemoryRateLimiStore
   */
  store?: RateLimitStore;
}
