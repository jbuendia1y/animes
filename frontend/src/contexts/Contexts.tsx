import { MaterialTheme } from "./MaterialTheme";
import { AuthProvider } from "./auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Contexts({ children }: { children: any }) {
  return (
    <MaterialTheme>
      <AuthProvider>{children}</AuthProvider>
    </MaterialTheme>
  );
}
