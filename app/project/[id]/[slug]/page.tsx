// app/project/[id]/[slug]/page.tsx
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabaseServer";
import ProjectDetailPage from "../_ProjectDetailPage";
import { slugify } from "@/utils/slugify";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

// ============================
// SEO METADATA (HYBRID)
// ============================
export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  const { id, slug } = await props.params;

  const { data: mem } = await supabaseServer
    .from("memories")
    .select("*")
    .eq("id", id)
    .single();

  if (!mem) {
    return {
      title: "Project Tidak Ditemukan | Smart Project Wall",
      description: "Project tidak tersedia.",
    };
  }

  const correctSlug = slugify(mem.title);

  const ogImageUrl =
    mem.og_file_name && mem.og_file_name.startsWith("http")
      ? mem.og_file_name
      : "https://bangunancerdas.web.id/og/og-home.webp";

  return {
    title: `${mem.title} | Smart Project Wall`,
    description:
      mem.description || "Detail Project CV. Bangunan Cerdas Indonesia",

    alternates: {
      canonical: `https://bangunancerdas.web.id/project/${id}/${correctSlug}`,
    },

    openGraph: {
      title: mem.title,
      description: mem.description || "CV. Bangunan Cerdas Indonesia",
      url: `https://bangunancerdas.web.id/project/${id}/${correctSlug}`,
      siteName: "Smart Project Wall",
      locale: "id_ID",
      type: "article",
      images: [{ url: ogImageUrl, width: 800, height: 420 }],
    },

    twitter: {
      card: "summary_large_image",
      title: mem.title,
      description: mem.description || "CV. Bangunan Cerdas Indonesia",
      images: [ogImageUrl],
    },
  };
}

// ============================
// PAGE
// ============================
export default async function Page(props: PageProps) {
  const { id, slug } = await props.params;

  const { data: mem } = await supabaseServer
    .from("memories")
    .select("title")
    .eq("id", id)
    .single();

  if (!mem) {
    redirect("/project");
  }

  const correctSlug = slugify(mem.title);

  // ✅ Redirect jika slug salah (SEO CLEAN)
  if (slug !== correctSlug) {
    redirect(`/project/${id}/${correctSlug}`);
  }

  return <ProjectDetailPage id={id} />;
}
