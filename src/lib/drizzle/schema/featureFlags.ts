import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const featureFlags = pgTable("feature_flags", {
  flag: t.text().primaryKey().notNull(),
  enabled: t.boolean().notNull().default(false),
}).enableRLS();
