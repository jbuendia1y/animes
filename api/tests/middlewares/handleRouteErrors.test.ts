import { handleRouteErrors } from "../../src/middlewares/handleRouteErrors.ts";
import { assertSpyCalls, spy, testing } from "../../test.deps.ts";

Deno.test({
  name: "Handle route errors middleware",
  async fn() {
    const ctx = testing.createMockContext();
    const next = () => Promise.reject();
    const handlerSpy = spy();

    const middleware = handleRouteErrors(handlerSpy);
    await middleware(ctx, next);

    assertSpyCalls(handlerSpy, 1);
  },
});
