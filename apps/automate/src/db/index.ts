import { drizzle } from "drizzle-orm/postgres-js";
import { createDrizzleForServiceRole } from "@tdata/shared/db";
import { decodeJWT } from "@/utils";

const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_DB_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase Envs");
}

export const db = drizzle({ connection: SUPABASE_DB_URL, casing: "snake_case" /* logger: true */ });

export async function createDrizzleSupabaseClient() {
  return createDrizzleForServiceRole(decodeJWT(SUPABASE_SERVICE_ROLE_KEY!), { client: db });
}
