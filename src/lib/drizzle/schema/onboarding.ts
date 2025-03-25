import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { course } from "./enums";

export const Onboarding = pgTable(
  "onboarding",
  {
    emailAddress: t.varchar().primaryKey(),
    course: course().notNull(),
    reg_number: t.varchar({ length: 10 }),
    user_id: t.varchar().notNull(),
    startYear: t.smallint().notNull(),
    endYear: t.smallint().notNull(),
  },
  (table) => [
    t.check(
      "start_end_check",
      sql`${table.startYear}<${table.endYear} AND ${table.startYear}<=EXTRACT(YEAR FROM CURRENT_DATE)`
    ),
  ]
).enableRLS();
