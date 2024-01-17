// deno-lint-ignore-file no-explicit-any
import { Context, State, StdLogMod } from "../../deps.ts";

export const requestLoggerMiddleware = () => {
  return (async (
    ctx: Context<State, Record<string, any>>,
    next: () => Promise<void>,
  ) => {
    const start = performance.now();
    await next();
    const end = performance.now();
    StdLogMod.info({
      method: ctx.request.method.toString(),
      url: ctx.request.url.toString(),
      time: `${end - start} ms`,
    });
  }) as any;
};
