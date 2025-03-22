import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DRIZZLE_KIT_URL;
if (!connectionString) {
  throw new Error("Missing DATABASE_URL");
}
console.log("Using database connection:", connectionString);

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
