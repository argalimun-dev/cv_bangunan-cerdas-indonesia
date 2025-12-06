// app/project/[id]/page.tsx
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabaseServer";
import ProjectDetailPage from "./_ProjectDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ============================
// ✅ SERVER SEO METADATA
// ============================
export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  try {
    const params = await props.params; // ✅ WAJIB await
    const memoryId = params.id;

    if (!memoryId) {
      return {
        title: "Project Tidak Ditemukan | Smart Project Wall",
        description: "Project yang Anda cari tidak tersedia.",
      };
    }

    const { data: mem } = await supabaseServer
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

    const ogImageUrl = mem.og_file_name
      mem.og_file_name && mem.og_file_name.startsWith("http")
        ? mem.og_file_name
        : "/og/default.webp";

    return {
      title: `${mem.title} | Smart Project Wall`,
      description:
        mem.description || "Detail Project CV. Bangunan Cerdas Indonesia",
      openGraph: {
        title: mem.title,
        description: mem.description || "CV. Bangunan Cerdas Indonesia",
        url: `https://bangunancerdas.web.id/project/${mem.id}`,
        siteName: "Smart Project Wall",
        locale: "id_ID",
        type: "article",
        images: [
          {
            url: ogImageUrl,
            width: 600,
            height: 315,
          },
        ],
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

// ============================
// ✅ SERVER PAGE WRAPPER
// ============================
export default async function Page(props: PageProps) {
  const params = await props.params; // ✅ WAJIB await
  return <ProjectDetailPage id={params.id} />;
}
