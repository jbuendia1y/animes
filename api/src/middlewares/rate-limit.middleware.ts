// deno-lint-ignore-file
import { Status } from "https://deno.land/std@0.140.0/http/http_status.ts";
import { RouterContext } from "../../deps.ts";

import type { RateLimitConfig } from "../libs/rate-limit/interfaces.ts";
import { MemoryRateLimiStore } from "../libs/rate-limit/stores/memory.store.ts";

export const rateLimitMiddleware = (config: RateLimitConfig) => {
  const store = config.store ?? new MemoryRateLimiStore();

  return async (
    ctx: RouterContext<any, any, any>,
    next: () => Promise<unknown>,
  ) => {
    const ip = ctx.request.ip;
    const rateLimit = await store.get(ip);

    if ((rateLimit?.requests ?? 0) === config.limit) {
      const breakTime = new Date().getTime() - rateLimit!.timestamp.getTime();
      if (breakTime < config.breakTime) {
        ctx.response.status = Status.TooManyRequests;
        ctx.response.body = {
          message: "Too many requests, please try again later.",
        };

        return;
      }

      await store.set(ip, { requests: 1, timestamp: new Date() });
      await next();
      return;
    }

    if (rateLimit) {
      rateLimit.requests = rateLimit.requests + 1;
      rateLimit.timestamp = new Date();
    }

    await store.set(ip, rateLimit ?? { requests: 1, timestamp: new Date() });
    await next();
  };
};
