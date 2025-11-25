// app/memory/[id]/page.tsx
import { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import MemoryDetailPage from "./_MemoryDetailPage";

interface PageProps {
  params: { id: string };
}

// ========================================
// 1️⃣ generateMetadata untuk SEO + OG/Twitter
// ========================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const memoryId = params.id;

  // Fetch memory dari Supabase
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

  return {
    title: `${mem.title} | Smart Project Wall`,
    description: mem.description || "Detail project CV. Bangunan Cerdas Indonesia",
    openGraph: {
      title: mem.title,
      description: mem.description || "CV. Bangunan Cerdas Indonesia",
      url: `https://cv-bangunan-cerdas-indonesia.vercel.app/memory/${mem.id}`,
      images: mem.image_url ? [{ url: mem.image_url, width: 800, height: 600 }] : [],
      siteName: "Smart Project Wall",
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: mem.title,
      description: mem.description || "CV. Bangunan Cerdas Indonesia",
      images: mem.image_url ? [mem.image_url] : [],
      site: "@CVBangunanCerdas",
      creator: "@CVBangunanCerdas",
    },
  };
}

// ========================================
// 2️⃣ Render client component
// ========================================
export default function Page({ params }: PageProps) {
  return <MemoryDetailPage />;
}
