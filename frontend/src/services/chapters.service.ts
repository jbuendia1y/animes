import axios from "axios";
import {
  Chapter,
  ChapterEndpoint,
  CreateChapter,
  UpdateChapter,
} from "../models/chapter.model";
import { createChapterAddapted, createPaginateAddapted } from "../addapters";
import { stringify } from "qs";
import { Paginate, PaginateEndpoint } from "../models/paginate.model";
import { AuthService } from "./auth.service";
import { ANIME_API_URL } from "../constants";

interface ChaptersFilter {
  animeId?: string;
  number?: number;
  limit?: number;
  offset?: number;
  sort?: { createdAt?: number };
}

export class ChaptersService {
  private authService = new AuthService();
  private baseUrl = ANIME_API_URL + "/chapters";

  async find(filter: ChaptersFilter): Promise<Paginate<Chapter[]>> {
    const query = stringify(filter);
    const res = await axios.get<PaginateEndpoint<ChapterEndpoint[]>>(
      this.baseUrl + "?" + query
    );

    const data = createPaginateAddapted({
      ...res.data,
      data: res.data.data.map((v) => createChapterAddapted(v)),
    });

    return data;
  }

  async findOne(id: string): Promise<Chapter> {
    const res = await axios.get<ChapterEndpoint>(this.baseUrl + "/" + id);
    return createChapterAddapted(res.data);
  }

  async create(data: CreateChapter): Promise<void> {
    await axios.post(this.baseUrl, data.values, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async update(id: string, data: UpdateChapter): Promise<void> {
    await axios.patch(this.baseUrl + "/" + id, data.values, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async delete(id: string): Promise<void> {
    await axios.delete(this.baseUrl + "/" + id, {
      headers: { Authorization: this.authService.authHeader },
    });
  }
}
