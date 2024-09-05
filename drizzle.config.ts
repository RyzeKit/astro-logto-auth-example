import * as dotenvx from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

dotenvx.config({ path: [".env"] });

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
