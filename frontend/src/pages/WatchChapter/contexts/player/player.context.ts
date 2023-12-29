import { createContext } from "react";
import { ChapterVideo } from "../../models";
import { groupVideos } from "../../utils";
import { Chapter } from "../../../../models/chapter.model";

export interface PlayerCtxValue {
  chapter: Chapter | null;
  player: ChapterVideo["values"] | null;
  videos: ReturnType<typeof groupVideos> | null;
  loading: boolean;
  selectPlayer: (value: ChapterVideo["values"]) => void;
}

export const DefaultPlayerCtxValue: PlayerCtxValue = {
  chapter: null,
  player: null,
  videos: null,
  loading: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  selectPlayer: () => {},
};

export const PlayerContext = createContext<PlayerCtxValue>(
  DefaultPlayerCtxValue
);
