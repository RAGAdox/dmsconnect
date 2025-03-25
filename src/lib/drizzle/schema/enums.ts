import COURSES_ARRAY from "@/lib/constants/courses";
import SUBJECT_CODE_ARRAY from "@/lib/constants/subject";
import { pgEnum } from "drizzle-orm/pg-core";

export const course = pgEnum("course", COURSES_ARRAY);
export const subjectCode = pgEnum("subject_code", SUBJECT_CODE_ARRAY);
