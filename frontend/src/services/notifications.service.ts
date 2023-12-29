import axios from "axios";
import { AuthService } from "./auth.service";
import { Paginate, PaginateEndpoint } from "../models/paginate.model";
import {
  UserNotification,
  UserNotificationEndpoint,
} from "../models/notification.model";
import {
  createNotificationAddapted,
  createPaginateAddapted,
} from "../addapters";
import QueryString from "qs";
import { ANIME_API_URL } from "../constants";

export interface UserNotificationFilter {
  viewed?: boolean;
}

export class NotificationsService {
  private authService = new AuthService();
  private baseUrl = ANIME_API_URL + "/users/notifications";

  async find(
    filter: UserNotificationFilter = {}
  ): Promise<Paginate<UserNotification[]>> {
    const query = QueryString.stringify(filter);
    const res = await axios.get<PaginateEndpoint<UserNotificationEndpoint[]>>(
      this.baseUrl + "?" + query,
      {
        headers: { Authorization: this.authService.authHeader },
      }
    );
    const data = createPaginateAddapted({
      ...res.data,
      data: res.data.data.map((v) => createNotificationAddapted(v)),
    });
    return data;
  }

  async update(id: string, data: { viewed: boolean }) {
    await axios.patch(this.baseUrl + "/" + id, data, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async delete(id: string): Promise<void> {
    await axios.delete(this.baseUrl + "/" + id, {
      headers: { Authorization: this.authService.authHeader },
    });
  }
}
