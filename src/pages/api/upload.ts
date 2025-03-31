import FEATURE_FLAGS from "@/config/featureFlags";
import STORAGE_CONFIG from "@/config/storageConfig";
import supabaseAdmin from "@/lib/supabase";
import storeFileRecord from "@/services/storeFileRecord";
import hasRequiredRoles from "@/utils/hasReuiredRoles";
import { getAuth } from "@clerk/nextjs/server";
import { $Enums } from "@prisma/client";
import { IncomingForm } from "formidable";
import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return new NextResponse(null, { status: 405 });
  }

  const authObject = getAuth(req);
  const sessionClaims: CustomJwtSessionClaims | null = authObject.userId
    ? authObject.sessionClaims
    : null;

  if (!sessionClaims) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (
    !FEATURE_FLAGS.file_upload.enabled ||
    !sessionClaims.publicMetadata?.onboardingComplete ||
    !hasRequiredRoles(
      FEATURE_FLAGS.file_upload.allowedRoles as unknown as string[],
      sessionClaims.publicMetadata
    )
  ) {
    return res.status(403).json({ message: "Access Denied" });
  }
  const form = new IncomingForm({ multiples: false, uploadDir: "/tmp" });

  const [fields, files] = await form.parse(req);
  const course = fields.course
    ? (fields.course[0] as $Enums.course)
    : undefined;
  const subjectCode = fields.subjectCode
    ? (fields.subjectCode[0] as $Enums.subject_code)
    : undefined;
  const fileKey = Object.keys(files)[0];
  if (
    !course ||
    !subjectCode ||
    !files[fileKey] ||
    !files[fileKey][0] ||
    !files[fileKey][0].originalFilename
  ) {
    return res.status(400).json({ message: "Invalid Form" });
  }

  const file = files[fileKey][0];
  const fileBuffer = readFileSync(file.filepath);
  const fileName = file.originalFilename!;

  const storageResponse = await supabaseAdmin.storage
    .from(STORAGE_CONFIG.BUCKET_ID)
    .upload(`uploads/${course}/${subjectCode}/${fileName}`, fileBuffer, {
      upsert: false,
      contentType: file.mimetype || undefined,
    });

  if (storageResponse.error) {
    console.error("Error uploading file to S3:", storageResponse.error);
    return res.status(500).json({ message: "Unable to upload to S3" });
  }

  try {
    await storeFileRecord({
      course,
      subject_code: subjectCode,
      file_name: fileName,
      file_id: storageResponse.data.id,
      onboarding: {
        connect: {
          emailAddress: sessionClaims.email,
        },
      },
    });
  } catch (error) {
    console.error("Error storing file record in DB:", error);
    await supabaseAdmin.storage
      .from(STORAGE_CONFIG.BUCKET_ID)
      .remove([`uploads/${course}/${subjectCode}/${fileName}`]);
    return res
      .status(500)
      .json({ message: "Unable to update DB, File Deleted" });
  }
  await res.revalidate(FEATURE_FLAGS.file_view.featureUrl);
  return res.json({
    ...storageResponse.data,
    message: "File upload successful",
  });
}
