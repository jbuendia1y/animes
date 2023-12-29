import { MongoDatabase, ObjectId } from "../../deps.ts";
import {
  AnimeFavorite,
  CreateAnimeFavorite,
  UpdateAnimeFavorite,
} from "../models/index.ts";

export const animeFavoriteEvents: {
  [key: string]: ((payload: unknown) => Promise<void>)[];
} = {};

export const subscribeAnimeFavoriteEvent = (
  event: string,
  obs: (payload: unknown) => Promise<void>
) => {
  if (!animeFavoriteEvents[event]) animeFavoriteEvents[event] = [];
  animeFavoriteEvents[event].push(obs);
};

export const emitAnimeFavoriteEvent = async (
  event: string,
  payload: unknown
) => {
  if (!animeFavoriteEvents[event]) return;
  for (const obs of animeFavoriteEvents[event]) {
    await obs(payload);
  }
};

export const initAnimeFavoriteEvents = (db: MongoDatabase) => {
  subscribeAnimeFavoriteEvent("create", async (payload: unknown) => {
    if (payload instanceof CreateAnimeFavorite) {
      if (payload.values.stars > 5) return;
      await db
        .collection("animes")
        .updateOne(
          { _id: ObjectId.createFromHexString(payload.values.animeId) },
          { $inc: { [`stars.${payload.values.stars}`]: 1 } }
        );
    }
  });

  subscribeAnimeFavoriteEvent("update", async (payload: unknown) => {
    if (typeof payload !== "object") return;

    const { before, toUpdateData } = payload as {
      before: AnimeFavorite;
      toUpdateData: UpdateAnimeFavorite;
    };

    if (!before || !toUpdateData) return;

    await db.collection("animes").updateOne(
      { _id: ObjectId.createFromHexString(before.values.animeId) },
      {
        $inc: {
          [`stars.${before.values.stars}`]: -1,
          [`stars.${toUpdateData.values.stars}`]: 1,
        },
      }
    );
  });

  subscribeAnimeFavoriteEvent("delete", async (payload: unknown) => {
    if (typeof payload !== "object") return;

    const { before } = payload as { before: AnimeFavorite };

    if (!before) return;

    await db
      .collection("animes")
      .updateOne(
        { _id: ObjectId.createFromHexString(before.values.animeId) },
        { $inc: { [`stars.${before.values.stars}`]: -1 } }
      );
  });
};
