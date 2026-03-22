import { PropsWithChildren } from "react";
import { useAuth } from "../hooks";

export function SideRoleProtected({
  role,
  children,
}: PropsWithChildren<{
  role?: "isAdmin";
}>) {
  const { user } = useAuth();
  if (!user) return;

  if (role) {
    if (user.values.isAdmin) return children;
    return;
  }

  return children;
}
