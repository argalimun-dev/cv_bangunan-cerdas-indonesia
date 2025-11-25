// app/api/og-image/[filename]/route.ts
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  if (!filename) {
    return new Response(JSON.stringify({ error: "Filename required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const originalUrl = `https://gbflgmylrpjqmpszlvut.supabase.co/storage/v1/object/public/images/${filename}`;

  // OG super ringan
  const maxWidth = 600; // width kecil supaya WhatsApp friendly
  const ogRatio = 1.91; // rasio OG standard

  try {
    // fetch original image
    const res = await fetch(originalUrl);
    if (!res.ok) throw new Error("Failed to fetch image");

    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const imgBitmap = await createImageBitmap(blob);

    // tentukan ukuran downscale otomatis
    let width = imgBitmap.width;
    let height = imgBitmap.height;

    if (width > maxWidth) {
      width = maxWidth;
      height = Math.round(width / ogRatio);
    } else {
      height = Math.round(width / ogRatio);
    }

    // canvas downscale
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext("2d")!;
    ctx.drawImage(imgBitmap, 0, 0, width, height);

    // convert ke Blob WebP ringan
    const downscaledBlob = await offscreen.convertToBlob({
      type: "image/webp",
      quality: 0.8,
    });

    // convert Blob → base64 string supaya bisa dipakai ImageResponse
    const arrayBuffer2 = await downscaledBlob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer2).toString("base64");
    const dataUrl = `data:image/webp;base64,${base64}`;

    return new ImageResponse(
      {
        type: "img",
        props: {
          src: dataUrl,
          width,
          height,
          style: { width: `${width}px`, height: `${height}px`, objectFit: "cover" },
        },
      } as any,
      { width, height }
    );
  } catch (err) {
    return new ImageResponse(
      {
        type: "div",
        props: {
          style: {
            width: `${maxWidth}px`,
            height: `${Math.round(maxWidth / ogRatio)}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 24,
          },
          children: "Image Not Found",
        },
      } as any,
      { width: maxWidth, height: Math.round(maxWidth / ogRatio) }
    );
  }
}
