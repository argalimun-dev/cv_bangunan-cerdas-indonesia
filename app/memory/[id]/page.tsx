// app/memory/[id]/page.tsx
import { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import MemoryDetailPage from "./_MemoryDetailPage";

// ⚠ params sekarang bisa Promise
interface PageParams {
  params?: Promise<{ id?: string }>;
}

export async function generateMetadata(pageProps: PageParams): Promise<Metadata> {
  try {
    const params = pageProps.params ? await pageProps.params : undefined;
    const memoryId = params?.id;

    if (!memoryId) {
      return {
        title: "Project Tidak Ditemukan | Smart Project Wall",
        description: "Project yang Anda cari tidak tersedia.",
      };
    }

    const { data: mem } = await supabase
      .from("memories")
      .select("*")
      .eq("id", memoryId)
      .single();

    if (!mem) {
      return {
        title: "Project Tidak Ditemukan | Smart Project Wall",
        description: "Project yang Anda cari tidak tersedia.",
      };
    }

    // Gunakan OG image yang sudah di-generate, fallback ke default
    const ogImageUrl = mem.og_file_name || "/og/default.webp";

    return {
      title: `${mem.title} | Smart Project Wall`,
      description: mem.description || "Detail project CV. Bangunan Cerdas Indonesia",
      openGraph: {
        title: mem.title,
        description: mem.description || "CV. Bangunan Cerdas Indonesia",
        url: `https://cv-bangunan-cerdas-indonesia.vercel.app/memory/${mem.id}`,
        siteName: "Smart Project Wall",
        locale: "id_ID",
        type: "website",
        images: [{ url: ogImageUrl, width: 600, height: 315 }],
      },
      twitter: {
        card: "summary_large_image",
        title: mem.title,
        description: mem.description || "CV. Bangunan Cerdas Indonesia",
        images: [ogImageUrl],
        site: "@CVBangunanCerdas",
        creator: "@CVBangunanCerdas",
      },
    };
  } catch (err) {
    console.error("Failed to generate metadata", err);
    return {
      title: "Project Tidak Ditemukan | Smart Project Wall",
      description: "Project yang Anda cari tidak tersedia.",
    };
  }
}

export default function Page() {
  return <MemoryDetailPage />;
}
