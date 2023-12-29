import axios from "axios";
import { User, UserEndpoint } from "../models/user.model";
import { createUserAddapted } from "../addapters";
import { ANIME_API_URL } from "../constants";

export interface ILogin {
  token_type: string;
  access_token: string;
  payload: { user: User };
}

const createLoginAddapter = (ed: ILoginEndpoint): ILogin => {
  return {
    access_token: ed.access_token,
    payload: { user: createUserAddapted(ed.user) },
    token_type: ed.token_type,
  };
};

export interface ILoginEndpoint {
  token_type: string;
  access_token: string;
  user: UserEndpoint;
}

export const getAuthToken = () => {
  return localStorage.getItem("TOKEN");
};

export class AuthService {
  private baseURL = ANIME_API_URL + "/auth";

  get authHeader() {
    return `Bearer ${this.token}`;
  }

  get token() {
    return getAuthToken();
  }

  set token(value: string | null) {
    if (!value) localStorage.removeItem("TOKEN");
    else localStorage.setItem("TOKEN", value);
  }

  public async getProfile(): Promise<User> {
    const res = await axios.get<UserEndpoint>(this.baseURL + "/profile", {
      headers: { Authorization: this.authHeader },
    });
    const data = createUserAddapted(res.data);
    return data;
  }
  public async deleteAccount() {
    console.log("HELLO DELETE ACCOUNT");
  }

  public async login(username: string, password: string): Promise<ILogin> {
    const res = await axios.post<ILoginEndpoint>(this.baseURL + "/login", {
      username,
      password,
    });
    const data = createLoginAddapter(res.data);
    this.token = data.access_token;
    return data;
  }
  public async register(username: string, password: string) {
    const res = await axios.post(this.baseURL + "/register", {
      username,
      password,
    });
    return res;
  }

  public async logout() {
    this.token = null;
  }
}
