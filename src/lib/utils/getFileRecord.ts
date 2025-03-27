import { sql } from "drizzle-orm";
import getDrizzleClient from "../drizzle";

export default async function getFileRecord() {
  const drizzle = getDrizzleClient();
  const fileRetrivalQuery = drizzle.execute(sql`
WITH AGG_FILE_RECORD_BY_FILENAME AS (
    SELECT
        fr.course AS course,
        fr.subject_code AS subject_code,
        jsonb_agg(
            jsonb_build_object('fileName', fr.file_name, 'email', fr.owner_email)
        ) AS file_object
    FROM file_record fr
    GROUP BY fr.course, fr.subject_code
),
AGG_SUBJECTS AS (
    SELECT
        course,
        jsonb_object_agg(subject_code, file_object) AS subject_object
    FROM AGG_FILE_RECORD_BY_FILENAME
    GROUP BY course
)
SELECT jsonb_object_agg(course, subject_object) as files
FROM AGG_SUBJECTS;
    `);
  const data = await fileRetrivalQuery;

  if (data && data.length === 1) {
    const { files } = data[0];
    return files as unknown as IFRecords;
  }
  return undefined;
}
