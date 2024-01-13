import { requestLoggerMiddleware } from "../../src/middlewares/logger.middleware.ts";
import { assertSpyCalls, spy, testing } from "../../test.deps.ts";

Deno.test({
  name: "Logger middleware",
  async fn() {
    const ctx = testing.createMockContext();
    const spyNext = spy(() => Promise.resolve());
    await requestLoggerMiddleware()(ctx, spyNext);
    assertSpyCalls(spyNext, 1);
  },
});
