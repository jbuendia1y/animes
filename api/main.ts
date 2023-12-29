import app from "./app.ts";
import { config } from "./src/config/index.ts";

if (import.meta.main) {
  await app.listen({ port: config.PORT ? parseInt(config.PORT) : 3000 });
}
