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

  // URL original di Supabase
  const imageUrl = `https://gbflgmylrpjqmpszlvut.supabase.co/storage/v1/object/public/images/${filename}`;

  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch original image from Supabase" },
        { status: 500 }
      );
    }

    // Ambil binary data
    const arrayBuffer = await res.arrayBuffer();

    // Deteksi MIME type
    const contentType =
      res.headers.get("content-type") || "image/jpeg";

    // Return langsung sebagai binary tanpa redirect
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
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
