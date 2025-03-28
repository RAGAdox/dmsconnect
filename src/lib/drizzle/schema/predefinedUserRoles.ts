import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { roles } from "./enums";

export const predefinedUserRoles = pgTable("predefined_user_roles", {
  id: t.uuid().primaryKey().defaultRandom(),
  email: t.text().notNull(),
  roles: roles().array().notNull(),
}).enableRLS();
