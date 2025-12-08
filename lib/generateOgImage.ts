// lib/generateOgImage.ts
import sharp from "sharp";
import { supabaseServer } from "@/lib/supabaseServer";

export async function generateOgImageToSupabase(
  inputBuffer: Buffer,
  memoryId: string
) {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Buffer gambar kosong");
  }

  const ogBuffer = await sharp(inputBuffer)
    .rotate() // ✅ perbaiki orientasi dari EXIF
    .resize({
      width: 800,
      withoutEnlargement: true, // ✅ jangan upsize gambar kecil
    })
    .webp({ quality: 92 })
    .toBuffer();

  const ogPath = `og/${memoryId}.webp`;

  const { error } = await supabaseServer.storage
    .from("images")
    .upload(ogPath, ogBuffer, {
      contentType: "image/webp",
      upsert: true,
      cacheControl: "3600", // ✅ aman untuk CDN
    });

  if (error) throw error;

  const { data } = supabaseServer.storage
    .from("images")
    .getPublicUrl(ogPath);

  // ✅ cache busting OG (ANTI CACHE SOSMED)
  return `${data.publicUrl}?v=${Date.now()}`;
}
