import { createContext } from "react";
import { User } from "../../models/user.model";

export interface AuthCtxValue {
  user: User | typeof UserLoading | typeof UserNotLogged;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserLoading = undefined;
export const UserNotLogged = null;

export const AuthCtxDefault: AuthCtxValue = {
  user: UserLoading,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

export const AuthContext = createContext(AuthCtxDefault);
