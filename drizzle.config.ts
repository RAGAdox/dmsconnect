import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}
export default defineConfig({
  dbCredentials: {
    url: connectionString,
  },
  dialect: "postgresql",
  schema: "./src/lib/drizzle/schema",
  breakpoints: true,
  strict: true,
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
});
