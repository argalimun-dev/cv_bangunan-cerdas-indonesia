import sharp from "sharp";
import { supabase } from "@/lib/supabaseClient";

export async function generateOgImageToSupabase(
  inputBuffer: Buffer,
  memoryId: string
) {
  const ogBuffer = await sharp(inputBuffer)
    .resize({ width: 600 })
    .webp({ quality: 80 })
    .toBuffer();

  const ogPath = `og/${memoryId}.webp`;

  const { error } = await supabase.storage
    .from("images")
    .upload(ogPath, ogBuffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(ogPath);

  return data.publicUrl; // ✅ INI YANG NANTI MASUK ke og_file_name
}
