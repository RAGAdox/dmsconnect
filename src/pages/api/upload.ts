import supabaseAdmin from "@/lib/supabase";
import { IncomingForm } from "formidable";
import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Disable Next.js default bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("is this wiorking");
  if (req.method !== "POST") {
    console.log("Is it grtting rejected");
    return new NextResponse(null, { status: 405 });
  }

  const form = new IncomingForm({ multiples: false, uploadDir: "/tmp" });

  const files = (await form.parse(req))[1];
  const fileKey = Object.keys(files)[0];
  if (files[fileKey]) {
    const file = files[fileKey][0];
    const fileBuffer = readFileSync(file.filepath);
    const fileName = file.originalFilename;
    const { data, error } = await supabaseAdmin.storage
      .from("dms-connect-dev")
      .upload(`uploads/${fileName}`, fileBuffer, { upsert: true });
    if (error) {
      return res.status(500).json({ error: "Unable to upload to S3" });
    }
    return res.json(data);
  } else {
    return res.status(500);
  }
}
