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

    // ✅ AMAN DI DEV & PRODUKSI
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    // ================================
    // 3️⃣ AMBIL MEMORY ASLI DARI SUPABASE
    // ================================
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

    // ================================
    // 4️⃣ FALLBACK
    // ================================
    if (finalMemories.length === 0) {
      finalMemories = [
        { id: "7271ef9e-1437-4927-b37b-a455ceebc547", title: "Project A" },
        { id: "df16cb91-3215-4ee7-9ee1-0a35c78a7833", title: "Project B" },
        { id: "3f1aa60c-ec37-4689-9043-12b51dea9338", title: "Project C" },
        { id: "13bfaca3-c51a-4d22-94d8-68f3c9fa4442", title: "Project D" },
        { id: "3c101a9a-b52f-46ba-8b77-c352b5881ebf", title: "Project E" },
      ];
    }

    // ================================
    // 5️⃣ RENDER OG IMAGE
    // ================================
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            fontFamily: "Inter, sans-serif",
            background: "#0f172a",
            color: "white",
            padding: 30,
          }}
        >
          {/* HEADER */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={`${baseUrl}/icon.png`} // ✅ PNG
              width={80}
              height={80}
              alt="Icon"
            />
            <h1 style={{ fontSize: 64, fontWeight: 700, margin: 0 }}>
              {title}
            </h1>
          </div>

          {/* SUBTITLE */}
          <p style={{ fontSize: 32, color: "#cbd5e1", marginTop: 10 }}>
            {subtitle}
          </p>

          {/* PROJECT THUMBNAILS */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 20,
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
                  borderRadius: 16,
                  padding: 12,
                }}
              >
                {/* ✅ WAJIB PAKAI OG-PNG */}
                <img
                  src={`${baseUrl}/api/og-png/${memory.id}`}
                  width={200}
                  height={266}
                  style={{ borderRadius: 12, objectFit: "cover" }}
                  alt={memory.title}
                />

                <p
                  style={{
                    marginTop: 8,
                    fontSize: 20,
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
              marginTop: "auto",   // ✅ ini kunci utamanya
              paddingTop: 16,      // optional, beri jarak dari konten
              textAlign: "center",
              color: "#64748b",
              fontSize: 20,
            }}
          >
            © 2025 CV. Bangunan Cerdas Indonesia
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (err) {
    console.error("OG generation failed:", err);
    return new Response("Failed to generate OG", { status: 500 });
  }
}
