import {
  AnimeFavorite,
  CreateAnimeFavorite,
  UpdateAnime,
  UpdateAnimeFavorite,
} from "../models/index.ts";
import { AnimesRepository } from "../repositories/animes/animes.repository.ts";

export const CreateAnimeFavoriteEvent = "@anime-favorite/create";
export const UpdateAnimeFavoriteEvent = "@anime-favorite/update";
export const DeleteAnimeFavoriteEvent = "@anime-favorite/delete";

type IAnimeFavoriteEvents =
  | typeof CreateAnimeFavoriteEvent
  | typeof UpdateAnimeFavoriteEvent
  | typeof DeleteAnimeFavoriteEvent;

export const animeFavoriteEvents: {
  [key: string]: ((payload: unknown) => Promise<void>)[];
} = {};

export const subscribeAnimeFavoriteEvent = (
  event: IAnimeFavoriteEvents,
  obs: (payload: unknown) => Promise<void>,
) => {
  if (!animeFavoriteEvents[event]) animeFavoriteEvents[event] = [];
  animeFavoriteEvents[event].push(obs);
};

export const emitAnimeFavoriteEvent = async (
  event: IAnimeFavoriteEvents,
  payload: unknown,
) => {
  if (!animeFavoriteEvents[event]) return;
  for (const obs of animeFavoriteEvents[event]) {
    await obs(payload);
  }
};

export const initAnimeFavoriteEvents = (animesRepo: AnimesRepository) => {
  subscribeAnimeFavoriteEvent(
    CreateAnimeFavoriteEvent,
    async (payload: unknown) => {
      if (!(payload instanceof CreateAnimeFavorite)) return;

      if (payload.values.stars > 5) return;
      await animesRepo.update(
        payload.values.animeId,
        new UpdateAnime({
          stars: { type: "increment", star: payload.values.stars },
        }),
      );
      // await db
      //   .collection("animes")
      //   .updateOne(
      //     { _id: ObjectId.createFromHexString(payload.values.animeId) },
      //     { $inc: { [`stars.${payload.values.stars}`]: 1 } }
      //   );
    },
  );

  subscribeAnimeFavoriteEvent(
    UpdateAnimeFavoriteEvent,
    async (payload: unknown) => {
      if (typeof payload !== "object") return;

      const { before, toUpdateData } = payload as {
        before: AnimeFavorite;
        toUpdateData: UpdateAnimeFavorite;
      };

      if (
        !before ||
        !toUpdateData ||
        !(before instanceof AnimeFavorite) ||
        !(toUpdateData instanceof UpdateAnimeFavorite)
      ) {
        return;
      }

      await animesRepo.update(
        before.values.animeId,
        new UpdateAnime({
          stars: { star: before.values.stars, type: "decrement" },
        }),
      );
      await animesRepo.update(
        before.values.animeId,
        new UpdateAnime({
          stars: { star: toUpdateData.values.stars, type: "increment" },
        }),
      );

      // await db.collection("animes").updateOne(
      //   { _id: ObjectId.createFromHexString(before.values.animeId) },
      //   {
      //     $inc: {
      //       [`stars.${before.values.stars}`]: -1,
      //       [`stars.${toUpdateData.values.stars}`]: 1,
      //     },
      //   }
      // );
    },
  );

  subscribeAnimeFavoriteEvent(
    DeleteAnimeFavoriteEvent,
    async (payload: unknown) => {
      if (typeof payload !== "object") return;

      const { before } = payload as { before: AnimeFavorite };

      if (!before || !(before instanceof AnimeFavorite)) return;

      await animesRepo.update(
        before.values.animeId,
        new UpdateAnime({
          stars: { star: before.values.stars, type: "decrement" },
        }),
      );

      // await db
      //   .collection("animes")
      //   .updateOne(
      //     { _id: ObjectId.createFromHexString(before.values.animeId) },
      //     { $inc: { [`stars.${before.values.stars}`]: -1 } }
      //   );
    },
  );
};
