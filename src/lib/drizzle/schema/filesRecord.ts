import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { course, subjectCode } from "./enums";
import { Onboarding } from "./onboarding";

export const FileRecord = pgTable("file_record", {
  owner_email: t
    .varchar()
    .notNull()
    .references(() => Onboarding.emailAddress),
  course: course().notNull(),
  subject_code: subjectCode().notNull(),
  file_name: t.varchar().notNull(),
  created_at: t
    .timestamp({ withTimezone: true })
    .default(sql`NOW()`)
    .notNull(),
}).enableRLS();
