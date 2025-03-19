import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "server-only";

let db: PostgresJsDatabase | undefined = undefined;
export default function getDrizzleClient() {
  if (db) {
    return db;
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL");
  }
  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(connectionString, { prepare: false });
  db = drizzle(client);
  return db;
}
