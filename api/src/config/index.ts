import { loadEnvs } from "../../deps.ts";

export const DENO_ENV = Deno.env.get("DENO_ENV");

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

const MONGO_URI = Deno.env.get("MONGO_URI") ?? env["MONGO_URI"];
export const config = {
  MONGO_URI:
    DENO_ENV == "test"
      ? (MONGO_URI.endsWith("/") ? MONGO_URI : MONGO_URI + "/") + "app_testing"
      : MONGO_URI,
  PORT: Deno.env.get("PORT") ?? env["PORT"],
};
