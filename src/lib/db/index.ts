import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = import.meta.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Database URL not found");
}

// for migrations
export const migrationClient = postgres(databaseUrl, {
  max: 1,
});
export const migrationDb = drizzle(migrationClient);

// for querying
const queryClient = postgres(databaseUrl);
export const db = drizzle(queryClient);
