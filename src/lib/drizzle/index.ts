import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase | undefined = undefined;
export default function getDrizzleClient() {
  if (db) {
    return db;
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL");
  }
  const client = postgres(connectionString, { prepare: false });
  db = drizzle(client);
  return db;
}
