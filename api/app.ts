import "npm:reflect-metadata";
import { container } from "npm:tsyringe";

import { Application, joinPath, MongoClient, oakCors } from "./deps.ts";
import { config, DENO_ENV } from "./src/config/index.ts";
import { API_PREFIX_V1 } from "./src/constants.ts";
import { initAnimeFavoriteEvents } from "./src/events/anime-favorite.event.ts";
import { initChapterEvents } from "./src/events/chapters.event.ts";
import { requestLoggerMiddleware } from "./src/middlewares/index.ts";
import { MongoAnimeFavoritesRepository } from "./src/repositories/anime-favorites/mongo-anime-favorites.repository.ts";
import { MongoAnimesRepository } from "./src/repositories/animes/mongo-animes.repository.ts";
import { MongoChapterVideosRepository } from "./src/repositories/chapter-videos/mongo-chapter-videos.repository.ts";
import { MongoChaptersRepository } from "./src/repositories/chapters/mongo-chapters.repository.ts";
import { MongoTagsRepository } from "./src/repositories/tags/mongo-tags.repository.ts";
import { MongoUserAnimesRepository } from "./src/repositories/user-anime/mongo-user-anime.repository.ts";
import { MongoUserChapterHistoryRepository } from "./src/repositories/user-chapter-history/mongo-user-chapter-history.repository.ts";
import { MongoUserNotificationsRepository } from "./src/repositories/user-notifications/mongo-user-notifications.repository.ts";
import { MongoUsersRepository } from "./src/repositories/users/mongo-users.repository.ts";
import { AnimeFavoritesRepository } from "./src/repositories/anime-favorites/anime-favorites.repository.ts";
import { AnimesRepository } from "./src/repositories/animes/animes.repository.ts";
import { UsersRepository } from "./src/repositories/users/users.repository.ts";
import { UserAnimesRepository } from "./src/repositories/user-anime/user-anime.repository.ts";
import { UserNotificationsRepository } from "./src/repositories/user-notifications/user-notifications.repository.ts";
import { UserChapterHistoryRepository } from "./src/repositories/user-chapter-history/user-chapter-history.repository.ts";
import { ChapterVideosRepository } from "./src/repositories/chapter-videos/chapter-videos.repository.ts";
import { ChaptersRepository } from "./src/repositories/chapters/chapters.repository.ts";
import { TagsRepository } from "./src/repositories/tags/tags.repository.ts";
import { DI_TOKEN } from "./src/di.ts";

const client = new MongoClient();
const mongoDatabase = await client.connect(config.MONGO_URI);
container.registerInstance(DI_TOKEN.DATABASE, mongoDatabase);

container.register<AnimeFavoritesRepository>(DI_TOKEN.ANIMES_FAVORITES_REPO, {
  useClass: MongoAnimeFavoritesRepository,
});
container.register<AnimesRepository>(DI_TOKEN.ANIMES_REPO, {
  useClass: MongoAnimesRepository,
});
container.register<UsersRepository>(DI_TOKEN.USERS_REPO, {
  useClass: MongoUsersRepository,
});
container.register<UserAnimesRepository>(DI_TOKEN.USER_ANIMES_REPO, {
  useClass: MongoUserAnimesRepository,
});
container.register<UserNotificationsRepository>(
  DI_TOKEN.USER_NOTIFICATIONS_REPO,
  {
    useClass: MongoUserNotificationsRepository,
  },
);
container.register<UserChapterHistoryRepository>(
  DI_TOKEN.USER_CHAPTER_HISTORY_REPO,
  {
    useClass: MongoUserChapterHistoryRepository,
  },
);
container.register<ChapterVideosRepository>(DI_TOKEN.CHAPTER_VIDEOS_REPO, {
  useClass: MongoChapterVideosRepository,
});
container.register<ChaptersRepository>(DI_TOKEN.CHAPTERS_REPO, {
  useClass: MongoChaptersRepository,
});
container.register<TagsRepository>(DI_TOKEN.TAGS_REPO, {
  useClass: MongoTagsRepository,
});

const controllers = await import("./src/controllers/index.ts");
container.register(controllers.AnimeFavoritesController.name, {
  useClass: controllers.AnimeFavoritesController,
});
container.register(controllers.AnimesContoller.name, {
  useClass: controllers.AnimesContoller,
});
container.register(controllers.AuthController.name, {
  useClass: controllers.AuthController,
});
container.register(controllers.ChapterVideosController.name, {
  useClass: controllers.ChapterVideosController,
});
container.register(controllers.ChaptersController.name, {
  useClass: controllers.ChaptersController,
});
container.register(controllers.TagsController.name, {
  useClass: controllers.TagsController,
});
container.register(controllers.UserAnimesController.name, {
  useClass: controllers.UserAnimesController,
});
container.register(controllers.UserChapterHistoryController.name, {
  useClass: controllers.UserChapterHistoryController,
});
container.register(controllers.UserNotificationsController.name, {
  useClass: controllers.UserNotificationsController,
});

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
        root: joinPath(Deno.cwd(), "..", "frontend", "dist"),
        index: "index.html",
      });
      await next();
      return;
    } catch {
      await ctx.send({
        root: joinPath(Deno.cwd(), "..", "frontend", "dist"),
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
