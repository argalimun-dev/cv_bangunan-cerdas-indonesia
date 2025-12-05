// app/api/og-home/route.tsx
/** @jsxImportSource react */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface FinalMemory {
  id: string;
  title: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title =
      searchParams.get("title") || "CV. Bangunan Cerdas Indonesia";

    const subtitle =
      searchParams.get("subtitle") ||
      "Smart Project Wall | Galeri Pemasaran Digital Interaktif";

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    let finalMemories: FinalMemory[] = [];

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const res = await fetch(
        `${supabaseUrl}/rest/v1/memories?select=id,title&order=created_at.desc&limit=5`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
          cache: "no-store",
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          finalMemories = data.map((item) => ({
            id: String(item.id),
            title: item.title || "Untitled Project",
          }));
        }
      }
    } catch {
      console.warn("OG Home: Supabase fetch failed, using fallback.");
    }

    if (finalMemories.length === 0) {
      finalMemories = [
        { id: "7271ef9e-1437-4927-b37b-a455ceebc547", title: "Project A" },
        { id: "df16cb91-3215-4ee7-9ee1-0a35c78a7833", title: "Project B" },
        { id: "3f1aa60c-ec37-4689-9043-12b51dea9338", title: "Project C" },
        { id: "13bfaca3-c51a-4d22-94d8-68f3c9fa4442", title: "Project D" },
        { id: "3c101a9a-b52f-46ba-8b77-c352b5881ebf", title: "Project E" },
      ];
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: 800,
            height: 420,
            display: "flex",
            flexDirection: "column",
            fontFamily: "Inter, sans-serif",
            background: "#0f172a",
            color: "white",
            padding: 20,
          }}
        >
          {/* HEADER */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src={`${baseUrl}/icon.png`}
              width={54}
              height={54}
              alt="Icon"
            />
            <h1 style={{ fontSize: 42, fontWeight: 700, margin: 0 }}>
              {title}
            </h1>
          </div>

          {/* SUBTITLE */}
          <p style={{ fontSize: 22, color: "#cbd5e1", marginTop: 6 }}>
            {subtitle}
          </p>

          {/* PROJECT THUMBNAILS */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 14,
            }}
          >
            {finalMemories.map((memory) => (
              <div
                key={memory.id}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "#1e293b",
                  borderRadius: 12,
                  padding: 8,
                }}
              >
                <img
                  src={`${baseUrl}/api/og-png/${memory.id}`}
                  width={133}
                  height={177}
                  style={{ borderRadius: 10, objectFit: "cover" }}
                  alt={memory.title}
                />

                <p
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "center",
                    color: "#f1f5f9",
                  }}
                >
                  {memory.title}
                </p>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 10,
              textAlign: "center",
              color: "#64748b",
              fontSize: 14,
            }}
          >
            © 2025 CV. Bangunan Cerdas Indonesia
          </div>
        </div>
      ),
      { width: 800, height: 420 }
    );
  } catch (err) {
    console.error("OG generation failed:", err);
    return new Response("Failed to generate OG", { status: 500 });
  }
}
