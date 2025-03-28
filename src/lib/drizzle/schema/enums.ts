import COURSES_ARRAY from "@/constants/courses";
import ROLES_ARRAY from "@/constants/roles";
import SUBJECT_CODE_ARRAY from "@/constants/subject";
import { pgEnum } from "drizzle-orm/pg-core";

export const course = pgEnum("course", COURSES_ARRAY);
export const subjectCode = pgEnum("subject_code", SUBJECT_CODE_ARRAY);
export const roles = pgEnum("roles", ROLES_ARRAY);
