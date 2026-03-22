import { PropsWithChildren, useEffect, useState } from "react";
import {
  DefaultPlayerCtxValue,
  PlayerContext,
  PlayerCtxValue,
} from "./player.context";
import { ChapterVideo } from "../../models";
import { groupVideos } from "../../utils";
import { ChaptersService } from "../../../../services/chapters.service";
import { ChapterVideoService } from "../../services";

export function PlayerProvider({
  chapterId,
  children,
}: PropsWithChildren<{
  chapterId?: string;
}>) {
  const [data, setData] = useState<PlayerCtxValue>(DefaultPlayerCtxValue);

  useEffect(() => {
    if (!chapterId) return;
    let subscribe = true;

    const chapterService = new ChaptersService();
    chapterService.findOne(chapterId).then((value) => {
      if (subscribe) setData((v) => ({ ...v, chapter: value }));
    });

    const chapterVideoService = new ChapterVideoService();
    chapterVideoService.find({ chapterId }).then((value) => {
      if (subscribe) {
        const groupedVideos = groupVideos(value);
        setData((v) => ({
          ...v,
          videos: groupedVideos,
          loading: false,
        }));
      }
    });

    return () => {
      subscribe = false;
    };
  }, [chapterId]);

  const selectPlayer = (value: ChapterVideo["values"]) => {
    setData((v) => ({
      ...v,
      player: value,
    }));
  };

  return (
    <PlayerContext.Provider
      value={{
        ...data,
        selectPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
