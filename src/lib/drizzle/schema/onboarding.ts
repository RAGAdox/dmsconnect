import COURSES_ARRAY from "@/lib/constants/courses";
import * as t from "drizzle-orm/pg-core";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
export const course = pgEnum("course", COURSES_ARRAY);

export const Onboarding = pgTable("onboarding", {
  course: course().notNull(),
  reg_number: t.varchar({ length: 10 }),
  user_id: t.varchar().notNull(),
  emailAddress: t.varchar().primaryKey(),
}).enableRLS();
