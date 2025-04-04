import { defineConfig } from "drizzle-kit";

import "dotenv/config";

export default defineConfig({
  out: "src/db/drizzle",
  schema: "src/db/schema",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
  },
});
