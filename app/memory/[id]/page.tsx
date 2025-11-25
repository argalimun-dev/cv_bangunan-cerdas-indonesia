// app/memory/[id]/page.tsx
import { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import MemoryDetailPage from "./_MemoryDetailPage";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const memoryId = params.id;

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

  // -----------------------------
  //  Extract filename untuk proxy
  // -----------------------------
  let ogImageProxyUrl: string | undefined = undefined;

  if (mem.image_url) {
    try {
      const urlObj = new URL(mem.image_url);
      const parts = urlObj.pathname.split("/");
      const filename = parts[parts.length - 1];

      // URL baru lewat OG proxy
      ogImageProxyUrl = `https://cv-bangunan-cerdas-indonesia.vercel.app/api/og-image/${filename}`;
    } catch (e) {
      // fallback kalau parsing gagal
      ogImageProxyUrl = mem.image_url;
    }
  }

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
      images: ogImageProxyUrl
        ? [
            {
              url: ogImageProxyUrl,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: mem.title,
      description: mem.description || "CV. Bangunan Cerdas Indonesia",
      images: ogImageProxyUrl ? [ogImageProxyUrl] : [],
      site: "@CVBangunanCerdas",
      creator: "@CVBangunanCerdas",
    },
  };
}

export default function Page({ params }: PageProps) {
  return <MemoryDetailPage />;
}
