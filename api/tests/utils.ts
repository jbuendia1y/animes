// deno-lint-ignore-file no-explicit-any
import type { Body } from "https://deno.land/x/oak@v10.6.0/body.ts";
import type { RouterContext } from "https://deno.land/x/oak@v10.6.0/mod.ts";

export const mockRequestBody = <R extends string>(
  ctx: RouterContext<R, any, any>,
  body: Body,
) => {
  return {
    ...ctx,
    request: {
      ...ctx.request,
      hasBody: true,
      body: (..._args) => body,
    },
  } as RouterContext<R, any, any>;
};
