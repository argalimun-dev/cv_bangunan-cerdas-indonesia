import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { filename: string } }
) {
  const { filename } = context.params;

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 }
    );
  }

  const imageUrl = `https://gbflgmylrpjqmpszlvut.supabase.co/storage/v1/object/public/images/${filename}`;

  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch original image from Supabase" },
        { status: 500 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline", // 🟢 WAJIB UNTUK OG SCRAPER
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(err) },
      { status: 500 }
    );
  }
}
