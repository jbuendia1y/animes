import axios from "axios";
import { AuthService } from "./auth.service";
import { Paginate, PaginateEndpoint } from "../models/paginate.model";
import {
  UserChapterHistory,
  UserChapterHistoryEndpoint,
} from "../models/user-chapter-history";
import {
  createPaginateAddapted,
  createUserChapterHistoryAddapted,
} from "../addapters";
import { ANIME_API_URL } from "../constants";
import { stringify } from "qs";

interface UserChapterHistoryFilter {
  limit?: number;
  offset?: number;
}

export class UserChapterHistoryService {
  private authService = new AuthService();
  private baseUrl = ANIME_API_URL + "/animes/history";

  async find(
    filter: UserChapterHistoryFilter = {}
  ): Promise<Paginate<UserChapterHistory[]>> {
    const query = stringify(filter);
    const res = await axios.get<PaginateEndpoint<UserChapterHistoryEndpoint[]>>(
      this.baseUrl + "?" + query,
      {
        headers: { Authorization: this.authService.authHeader },
      }
    );

    const paginate = createPaginateAddapted({
      ...res.data,
      data: res.data.data.map((v) => createUserChapterHistoryAddapted(v)),
    });

    return paginate;
  }

  async create(data: { chapterId: string }) {
    await axios.post(this.baseUrl, data, {
      headers: { Authorization: this.authService.authHeader },
    });
  }
}
