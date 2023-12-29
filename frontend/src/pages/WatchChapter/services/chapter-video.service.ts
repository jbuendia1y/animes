import axios from "axios";
import { stringify } from "qs";
import { createChapterVideoAddapted } from "../addapters";
import {
  ChapterVideo,
  ChapterVideoEndpoint,
  CreateChapterVideo,
  UpdateChapterVideo,
} from "../models";
import { AuthService } from "../../../services/auth.service";

export class ChapterVideoService {
  private baseUrl = "http://localhost:3000/api/v1/chapters/videos";
  private authService = new AuthService();

  async find({ chapterId }: { chapterId?: string } = {}) {
    const query = stringify({ chapterId });
    const res = await axios.get<ChapterVideoEndpoint[]>(
      this.baseUrl + "?" + query
    );

    const data = res.data.map((v) => createChapterVideoAddapted(v));
    return data;
  }

  async findOne(id: string): Promise<ChapterVideo> {
    const res = await axios.get(this.baseUrl + "/" + id, {
      headers: { Authorization: this.authService.authHeader },
    });

    const data = createChapterVideoAddapted(res.data);
    return data;
  }

  async update(id: string, data: UpdateChapterVideo) {
    await axios.patch(this.baseUrl + "/" + id, data.values, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async save(data: CreateChapterVideo) {
    await axios.post(this.baseUrl, data.values, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async delete(id: string) {
    await axios.delete(this.baseUrl + "/" + id, {
      headers: { Authorization: this.authService.authHeader },
    });
  }
}
