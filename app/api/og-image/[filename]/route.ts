// app/api/og-image/[filename]/route.ts
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;

  if (!filename) {
    return new Response(
      JSON.stringify({ error: "Filename required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const originalUrl = `https://gbflgmylrpjqmpszlvut.supabase.co/storage/v1/object/public/images/${filename}`;

  const width = 1200;
  const height = 630;

  try {
    // fetch image dari Supabase
    const res = await fetch(originalUrl);
    if (!res.ok) throw new Error("Failed to fetch image");

    // langsung pakai URL eksternal di ImageResponse
    return new ImageResponse(
      {
        // type hanya untuk ImageResponse internal, bukan ReactElement
        type: "div",
        props: {
          style: {
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          children: [
            {
              type: "img",
              props: {
                src: originalUrl,
                style: { width: "100%", height: "100%", objectFit: "cover" },
              },
            },
          ],
        },
      } as any, // <--- pakai "as any" supaya TS tidak nge-cek ReactElement
      { width, height }
    );
  } catch (err) {
    return new ImageResponse(
      {
        type: "div",
        props: {
          style: {
            width: `${width}px`,
            height: `${height}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 40,
          },
          children: "Image Not Found",
        },
      } as any,
      { width, height }
    );
  }
}
