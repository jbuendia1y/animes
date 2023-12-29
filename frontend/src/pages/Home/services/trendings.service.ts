import axios, { AxiosHeaders } from "axios";
import { Trending, TrendingEndpoint } from "../models/trending.model";
import { createTrendingAddapter } from "../addapters";

export class TrendingsService {
  async find(): Promise<Trending[]> {
    const headers = new AxiosHeaders();
    headers.set("Cache-Control", "max-age=216000");
    headers.set("Age", "3600");

    const res = await axios.get<{ data: TrendingEndpoint[] }>(
      "https://kitsu.io/api/edge/trending/anime",
      {
        headers,
      }
    );

    const data = res.data.data.map((v) => createTrendingAddapter(v));
    return data;
  }
}
