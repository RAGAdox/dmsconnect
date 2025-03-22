import { featureFlagsArray } from "@/lib/constants/flags";
import * as t from "drizzle-orm/pg-core";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const flags = pgEnum("feature_flag_enum", featureFlagsArray);

export const featureFlags = pgTable("feature_flags", {
  flag: flags().primaryKey().notNull(),
  enabled: t.boolean().notNull().default(false),
}).enableRLS();
