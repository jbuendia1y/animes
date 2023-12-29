import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}
