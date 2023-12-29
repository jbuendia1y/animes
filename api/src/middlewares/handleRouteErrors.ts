// deno-lint-ignore-file no-explicit-any
import { RouterContext } from "../../deps.ts";

export const handleRouteErrors =
  (handler: (ctx: RouterContext<any, any, any>, err: any) => void) =>
  async (ctx: RouterContext<any, any, any>, next: () => Promise<unknown>) => {
    try {
      await next();
    } catch (err: any) {
      handler(ctx, err);
    }
  };
