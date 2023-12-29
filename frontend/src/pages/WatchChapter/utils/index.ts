import { ChapterVideo } from "../models";

export const groupVideos = (videos: ChapterVideo[]) => {
  const grouped = videos.reduce(
    (group: { [provider: string]: ChapterVideo["values"][] }, value) => {
      const data = value.values;

      group[data.provider ?? "unknown"] =
        group[data.provider ?? "unknown"] ?? [];
      group[data.provider ?? "unknown"].push(data);
      return group;
    },
    {} as { [provider: string]: ChapterVideo["values"][] }
  );

  const data = [];
  for (const key in grouped) {
    data.push({ provider: key, players: grouped[key] });
  }
  return data;
};
