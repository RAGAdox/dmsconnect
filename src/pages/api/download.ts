import STORAGE_CONFIG from "@/lib/config/storageConfig";
import COURSES_ARRAY from "@/lib/constants/courses";
import SUBJECT_CODE_ARRAY from "@/lib/constants/subject";
import supabaseAdmin from "@/lib/supabase";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const authObject = getAuth(req);
  const sessionClaims: CustomJwtSessionClaims | null = authObject.userId
    ? authObject.sessionClaims
    : null;

  if (!sessionClaims) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const basePath = "/uploads";
  const { query } = req;

  const course = typeof query.course === "string" ? query.course : undefined;
  const subject = typeof query.subject === "string" ? query.subject : undefined;
  const fileName =
    typeof query.fileName === "string" ? query.fileName : undefined;

  if (
    !fileName ||
    !course ||
    !subject ||
    !COURSES_ARRAY.includes(course as (typeof COURSES_ARRAY)[number]) ||
    !SUBJECT_CODE_ARRAY.includes(subject as (typeof SUBJECT_CODE_ARRAY)[number])
  ) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_CONFIG.BUCKET_ID)
    .download(`${basePath}/${course}/${subject}/${fileName}`);
  if (error) {
    return res.status(500).json({ error: "Unable to get file" });
  }
  if (data) {
    res
      .setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=60")
      .setHeader("Content-Type", "application/octet-stream")
      .setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const buffer = Buffer.from(await data.arrayBuffer());
    const stream = Readable.from(buffer);
    stream.pipe(res);
  }
}
