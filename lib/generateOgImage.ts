// lib/generateOgImage.ts
import sharp from "sharp";
import { supabaseServer } from "@/lib/supabaseServer";

export async function generateOgImageToSupabase(
  inputBuffer: Buffer,
  memoryId: string
) {
  const ogBuffer = await sharp(inputBuffer)
    .resize({ width: 600 })
    .webp({ quality: 80 })
    .toBuffer();

  const ogPath = `og/${memoryId}.webp`;

  const { error } = await supabaseServer.storage
    .from("images")
    .upload(ogPath, ogBuffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabaseServer.storage
    .from("images")
    .getPublicUrl(ogPath);

  return data.publicUrl;
}
