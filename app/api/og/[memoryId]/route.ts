// app/api/og/[memoryId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // wajib untuk sharp + fs

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ memoryId: string }> } // ✅ FIX TYPE
) {
  const { memoryId } = await params; // ✅ WAJIB await

  let finalBuffer: Buffer | null = null;

  // =======================================================
  // 1️⃣ Ambil image_url & og_file_name dari DATABASE (SERVER)
  // =======================================================
  try {
    const { data, error } = await supabaseServer
      .from("memories")
      .select("image_url, og_file_name")
      .eq("id", memoryId)
      .single();

    // =======================================================
    // 2️⃣ DYNAMIC OG (resize dari IMAGE ASLI)
    // =======================================================
    if (!error && data?.image_url) {
      try {
        const res = await fetch(data.image_url);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();

          finalBuffer = await sharp(Buffer.from(arrayBuffer))
            .resize({
              width: 800,          // ✅ DITURUNKAN DARI 1200
              withoutEnlargement: true, // ✅ Cegah upscaling
            })
            .webp({
              quality: 92,         // ✅ NAIK DARI 82
              effort: 4,           // ✅ Kompres lebih efisien
            })
            .toBuffer();
        }
      } catch (err) {
        console.warn("Dynamic OG resize failed:", err);
      }
    }

    // =======================================================
    // 3️⃣ FALLBACK → STATIC OG DARI SUPABASE (BY URL DB)
    // =======================================================
    if (!finalBuffer && data?.og_file_name?.startsWith("http")) {
      try {
        const res = await fetch(data.og_file_name);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          finalBuffer = Buffer.from(arrayBuffer);
        }
      } catch (err) {
        console.warn("Static OG fetch failed:", err);
      }
    }
  } catch (err) {
    console.warn("OG DB query failed:", err);
  }

  // =======================================================
  // 4️⃣ FALLBACK TERAKHIR → DEFAULT LOCAL OG
  // =======================================================
  if (!finalBuffer) {
    const defaultPath = path.join(
      process.cwd(),
      "public",
      "og",
      "default.webp"
    );

    if (fs.existsSync(defaultPath)) {
      finalBuffer = fs.readFileSync(defaultPath);
    } else {
      return NextResponse.json(
        { error: "No OG available" },
        { status: 404 }
      );
    }
  }

  // =======================================================
  // 5️⃣ RETURN IMAGE + CACHE AGRESIF
  // =======================================================
  return new NextResponse(new Uint8Array(finalBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/webp", // ✅ tetap webp sesuai desain kamu
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
