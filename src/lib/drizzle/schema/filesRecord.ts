import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { course, subjectCode } from "./enums";
import { Onboarding } from "./onboarding";

/* NEED TO ADD THIS IN THE MIGRATION CI/CD PROCESS */
/*
ALTER TABLE public.file_record 
ADD CONSTRAINT file_storage_constraint 
FOREIGN KEY (file_id) REFERENCES storage.objects(id) 
ON DELETE CASCADE;
*/

export const FileRecord = pgTable("file_record", {
  owner_email: t
    .varchar()
    .notNull()
    .references(() => Onboarding.emailAddress, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  course: course().notNull(),
  subject_code: subjectCode().notNull(),
  file_name: t.varchar().notNull(),
  file_id: t.uuid().primaryKey(),
}).enableRLS();
