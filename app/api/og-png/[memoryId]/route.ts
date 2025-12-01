// app/api/og-png/[memoryId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { memoryId: string } }
) {
  try {
    const { memoryId } = params;

    // ✅ ORIGIN AMAN (GANTI BASE_URL)
    const origin = req.nextUrl.origin;

    // ✅ AMBIL OG WEBP
    const res = await fetch(`${origin}/api/og/${memoryId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch OG WebP" },
        { status: 404 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();

    // ✅ KONVERSI WEBP → PNG
    const pngBuffer = await sharp(Buffer.from(arrayBuffer))
      .png({ quality: 95 })
      .toBuffer();

    // ✅ ✅ FIX UTAMA: Buffer → Uint8Array
    return new NextResponse(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("OG PNG bridge failed:", err);

    return NextResponse.json(
      { error: "OG PNG generation failed" },
      { status: 500 }
    );
  }
}
