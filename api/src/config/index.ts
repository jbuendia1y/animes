import { loadEnvs } from "../../deps.ts";

const env = await loadEnvs();
const encoder = new TextEncoder();

// HS512 (HMAC SHA-512)
export const JWT_ALG = "HS512";
export const JWT_KEY = await crypto.subtle.importKey(
  "raw",
  encoder.encode(Deno.env.get("JWT_SECRET") ?? env["JWT_SECRET"]),
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

export const NODE_ENV = Deno.env.get("NODE_ENV");

const MONGO_URI = Deno.env.get("MONGO_URI") ?? env["MONGO_URI"];
export const config = {
  MONGO_URI:
    NODE_ENV == "test"
      ? (MONGO_URI.endsWith("/") ? MONGO_URI : MONGO_URI + "/") + "app_testing"
      : MONGO_URI,
  PORT: Deno.env.get("PORT") ?? env["PORT"],
};
