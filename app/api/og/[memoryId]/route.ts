// app/api/og/[memoryId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // Node runtime wajib untuk fs & sharp

export async function GET(
  req: NextRequest,
  { params }: { params: { memoryId: string } }
) {
  const { memoryId } = params;

  let finalBuffer: Buffer | null = null;

  // ===============================
  // 1️⃣ Ambil image asli dari Supabase
  // ===============================
  try {
    const { data, error } = await supabase
      .from("memories")
      .select("image_url")
      .eq("id", memoryId)
      .single();

    if (!error && data?.image_url) {
      const res = await fetch(data.image_url);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();

        // ===============================
        // 2️⃣ Resize & convert ke OG (dynamic)
        // ===============================
        finalBuffer = await sharp(Buffer.from(arrayBuffer))
          .resize({ width: 600 })
          .webp({ quality: 80 })
          .toBuffer();
      } else {
        console.warn("Dynamic OG fetch failed:", res.status, res.statusText);
      }
    }
  } catch (err) {
    console.warn("Dynamic OG processing failed:", err);
  }

  // ===============================
  // 3️⃣ Fallback ke static OG di /public/og
  // ===============================
  if (!finalBuffer) {
    const staticPath = path.join(process.cwd(), "public", "og", `${memoryId}.webp`);
    if (fs.existsSync(staticPath)) {
      finalBuffer = fs.readFileSync(staticPath);
    }
  }

  // ===============================
  // 4️⃣ Fallback ke default OG
  // ===============================
  if (!finalBuffer) {
    const defaultPath = path.join(process.cwd(), "public", "og", "default.webp");
    if (fs.existsSync(defaultPath)) {
      finalBuffer = fs.readFileSync(defaultPath);
    } else {
      // Safety: kalau default OG tidak ada
      return NextResponse.json({ error: "No OG available" }, { status: 404 });
    }
  }

  // ===============================
  // 5️⃣ Return image dengan cache
  // ===============================
  return new NextResponse(new Uint8Array(finalBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable", // cache 1 tahun
    },
  });
}
