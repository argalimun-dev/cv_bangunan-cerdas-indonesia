// app/api/og-image/[filename]/route.ts
import { ImageResponse } from "next/og";
import React from "react";

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

  const imageUrl =
    "https://gbflgmylrpjqmpszlvut.supabase.co/storage/v1/object/public/images/" +
    filename;

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000",
        },
      },
      // Background image
      React.createElement("img", {
        src: imageUrl,
        alt: "OG Background",
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(2px) brightness(0.6)",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        },
      }),
      // Text overlay
      React.createElement(
        "div",
        {
          style: {
            position: "relative",
            zIndex: 1,
            color: "#fff",
            fontSize: 60,
            fontWeight: 700,
            textAlign: "center",
            padding: "0 100px",
          },
        },
        "Awesome OG Image"
      )
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
