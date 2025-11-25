// app/memory/[id]/page.tsx
import { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import MemoryDetailPage from "./_MemoryDetailPage";

interface PageProps {
  params?: Promise<{ id?: string }>; // ⚠ params sekarang Promise
}

export async function generateMetadata(pageProps: PageProps): Promise<Metadata> {
  try {
    // ⚠ Unwrap params sebelum akses id
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

    // -----------------------------
    // Extract filename untuk OG proxy
    // -----------------------------
    let ogImageProxyUrl: string | undefined;
    if (mem.image_url) {
      try {
        const urlObj = new URL(mem.image_url);
        const parts = urlObj.pathname.split("/");
        const filename = parts[parts.length - 1];
        ogImageProxyUrl = `https://cv-bangunan-cerdas-indonesia.vercel.app/api/og-image/${filename}`;
      } catch {
        ogImageProxyUrl = mem.image_url; // fallback kalau parsing gagal
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
  } catch (err) {
    console.error("Failed to generate metadata", err);
    return {
      title: "Project Tidak Ditemukan | Smart Project Wall",
      description: "Project yang Anda cari tidak tersedia.",
    };
  }
}

export default function Page({ params }: PageProps) {
  return <MemoryDetailPage />;
}
