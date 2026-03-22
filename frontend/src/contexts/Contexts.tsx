import { PropsWithChildren } from "react";
import { MaterialTheme } from "./MaterialTheme";
import { AuthProvider } from "./auth";

export function Contexts({ children }: PropsWithChildren) {
  return (
    <MaterialTheme>
      <AuthProvider>{children}</AuthProvider>
    </MaterialTheme>
  );
}
