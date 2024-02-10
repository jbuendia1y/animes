// deno-lint-ignore-file no-explicit-any
import { Context, State } from "$oak/mod.ts";
import * as log from "$std/log/mod.ts";
import { DENO_ENV } from "../config/index.ts";
import { isErrorStatus, STATUS_TEXT } from "$oak/mod.ts";

const infoFileHandler = new log.handlers.FileHandler("INFO", {
  formatter: log.formatters.jsonFormatter,
  filename: Deno.cwd() + "/log.txt",
  mode: "a",
});

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: false,
    }),
    file: infoFileHandler,
  },
  loggers: {
    "middleware-log-debug": {
      level: "DEBUG",
      handlers: ["console"],
    },
    "middleware-log-info": {
      level: "INFO",
      handlers: ["file"],
    },
  },
});

export const requestLoggerMiddleware = () => {
  return (async (
    ctx: Context<State, Record<string, any>>,
    next: () => Promise<void>,
  ) => {
    const start = performance.now();
    await next();
    const end = performance.now();
    const msg = {
      method: ctx.request.method.toString(),
      status: ctx.response.status,
      statusText: STATUS_TEXT.get(ctx.response.status),
      url: ctx.request.url.toString(),
      time: `${end - start} ms`,
    };

    if (DENO_ENV !== "production") {
      if (isErrorStatus(msg.status)) {
        log.getLogger("middleware-log-debug").error(msg);
      } else {
        log.getLogger("middleware-log-debug").debug(msg);
      }
    } else {
      infoFileHandler.flush();
      if (isErrorStatus(msg.status)) {
        log.getLogger("middleware-log-info").error(msg);
      } else {
        log.getLogger("middleware-log-info").info(msg);
      }
    }
  }) as any;
};
