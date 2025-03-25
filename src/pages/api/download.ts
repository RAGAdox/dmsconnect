import STORAGE_CONFIG from "@/lib/config/storageConfig";
import supabaseAdmin from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fileName = "T.pdf";
  const pathName = "/uploads/";

  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_CONFIG.BUCKET_ID)
    .download(`${pathName}${fileName}`);
  if (error) {
    return res.status(500).json({ error: "Unable to get file" });
  }
  if (data) {
    console.log(data.type);
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res
      .setHeader("Content-Type", data.type)
      .setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
      .send(buffer);
  }
}
