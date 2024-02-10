import "npm:reflect-metadata";
import { container } from "tsyringe";
import { MongoClient } from "mongodb";
import * as path from "$std/path/mod.ts";
import { walk } from "$std/fs/walk.ts";
import { Application } from "$oak/mod.ts";
import { oakCors } from "cors";

import { config, DENO_ENV } from "./src/config/index.ts";
import { API_PREFIX_V1 } from "./src/constants.ts";
import { initAnimeFavoriteEvents } from "./src/events/anime-favorite.event.ts";
import { initChapterEvents } from "./src/events/chapters.event.ts";
import { requestLoggerMiddleware } from "./src/middlewares/index.ts";

import { DI_TOKEN } from "./src/di.ts";

const client = new MongoClient();
const mongoDatabase = await client.connect(config.MONGO_URI);
container.registerInstance(DI_TOKEN.DATABASE, mongoDatabase);

const repositories = walk("./src/repositories", {
  maxDepth: 2,
  includeFiles: true,
  includeDirs: false,
  exts: ["ts"],
  match: [new RegExp(/mongo/gi)],
});
for await (const entry of repositories) {
  const nameSplited = entry.path.split("/");
  const dirName = nameSplited.at(-2);
  const filename = entry.name;

  const mPath = `./src/repositories/${dirName}/${filename}`;
  const m = await import(mPath);
  if (!m.DI_REPO) {
    console.log(mPath + " doesn't have DI_REPO");
    continue;
  }

  const { TOKEN, VALUE } = m.DI_REPO;
  if (!TOKEN || !VALUE) {
    console.log(mPath + " DI_REPO missing TOKEN or VALUE property");
    continue;
  }
  container.register(TOKEN, { useClass: VALUE });
}

const controllers = await import("./src/controllers/index.ts");

const keys = Object.keys(controllers) as (keyof typeof controllers)[];
for (const key of keys) {
  container.register(controllers[key].name, {
    // deno-lint-ignore no-explicit-any
    useClass: controllers[key] as any,
  });
}

const app = new Application();

// Middlewares
app.use(oakCors());
app.use(requestLoggerMiddleware());

// Routes
const routesPath = await Deno.realPath("./src/routes");
for await (const dir of Deno.readDir(routesPath)) {
  if (!dir.isFile) continue;
  const m = await import(`./src/routes/${dir.name}`);
  const router = m.router;

  app.use(router.routes());
  app.use(router.allowedMethods());
}

// Production middlewares
if (DENO_ENV === "production") {
  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname.startsWith(API_PREFIX_V1)) {
      await next();
      return;
    }

    try {
      await ctx.send({
        root: path.join(Deno.cwd(), "..", "frontend", "dist"),
        index: "index.html",
      });
      await next();
      return;
    } catch {
      await ctx.send({
        root: path.join(Deno.cwd(), "..", "frontend", "dist"),
        path: "/index.html",
        index: "index.html",
      });
      await next();
      return;
    }
  });
}

console.log("------------------------------");
initAnimeFavoriteEvents(container.resolve(DI_TOKEN.DATABASE));
initChapterEvents(
  container.resolve(DI_TOKEN.DATABASE),
  container.resolve(DI_TOKEN.USER_NOTIFICATIONS_REPO),
  container.resolve(DI_TOKEN.ANIMES_REPO),
);
console.log("--- APP EVENTS STARTED ---");
console.log("------------------------------");

app.addEventListener("listen", (listener) => {
  console.log("------------------------------");
  console.info(`APP Listen in http://localhost:${listener.port}/`);
  console.log("------------------------------");
});

export default app;
