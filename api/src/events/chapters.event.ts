import { MongoDatabase } from "../../deps.ts";
import {
  CreateChapter,
  CreateUserNotification,
  DBAnimeFavorite,
} from "../models/index.ts";
import { AnimesRepository } from "../repositories/animes/animes.repository.ts";
import { UserNotificationsRepository } from "../repositories/user-notifications/user-notifications.repository.ts";

export const chaptersEvents: {
  [key: string]: ((payload: unknown) => Promise<void>)[];
} = {};

export const subscribeChapterEvent = (
  event: string,
  obs: (payload: unknown) => Promise<void>
) => {
  if (!chaptersEvents[event]) chaptersEvents[event] = [];
  chaptersEvents[event].push(obs);
};

export const emitChapterEvent = async (event: string, payload: unknown) => {
  if (!chaptersEvents[event]) return;
  for (const obs of chaptersEvents[event]) {
    await obs(payload);
  }
};

export const initChapterEvents = (
  db: MongoDatabase,
  userNotificationsRepo: UserNotificationsRepository,
  animesRepo: AnimesRepository
) => {
  subscribeChapterEvent("create", async (payload: unknown) => {
    if (payload instanceof CreateChapter) {
      const animeId = payload.values.animeId;

      const anime = await animesRepo.findOne(animeId);
      if (!anime) return;

      const favorites = db
        .collection<DBAnimeFavorite>("anime-favorites")
        .find({ animeId });

      for await (const favorite of favorites) {
        const toCreate = new CreateUserNotification({
          title: `Salió un nuevo capítulo de ${anime.values.canonicalTitle}`,
          description: "Qué esperas para ver su nuevo capítulo !",
          imageLink: payload.values.thumbnail,
          link: null,
          userId: favorite.userId,
          viewed: false,
        });
        await userNotificationsRepo.save(toCreate);
      }
    }
  });
};
