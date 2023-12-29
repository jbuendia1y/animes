/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../hooks";

export function SideRoleProtected({
  role,
  children,
}: {
  role?: "isAdmin";
  children: any;
}) {
  const { user } = useAuth();
  if (!user) return;

  if (role) {
    if (user.values.isAdmin) return children;
    return;
  }

  return children;
}
