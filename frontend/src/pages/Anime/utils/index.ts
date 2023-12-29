import { Anime } from "../../../models/anime.model";

export const getStarsMedian = (stars: Anime["stars"]) => {
  const array = [];
  for (const star in stars) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    array.push(...new Array((stars as any)[star]).fill(star));
    array.sort();
  }
  const mid = Math.round(array.length / 2);
  const result = array[mid];
  if (typeof result === "number") return result;

  return parseInt(result);
};
