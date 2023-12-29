/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AuthContext, AuthCtxValue, UserNotLogged } from "./context";
import { AuthService, getAuthToken } from "../../services/auth.service";

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<AuthCtxValue["user"]>(
    getAuthToken() ? undefined : null
  );

  useEffect(() => {
    if (!getAuthToken()) return;

    let subscribe = true;
    const service = new AuthService();
    service.getProfile().then((v) => {
      if (subscribe) setUser(v);
    });
    return () => {
      subscribe = false;
    };
  }, []);

  const login = async (username: string, password: string) => {
    const service = new AuthService();
    const data = await service.login(username, password);
    setUser(data.payload.user);
  };

  const logout = async () => {
    const service = new AuthService();
    await service.logout();
    setUser(UserNotLogged);
  };

  const value: AuthCtxValue = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
