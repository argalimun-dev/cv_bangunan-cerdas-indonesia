// app/project/page.tsx
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabaseServer";
import ProjectListPage from "./_ProjectListPage";

export const revalidate = 10; // ISR 10 detik

export async function generateMetadata(): Promise<Metadata> {
  const { data, error } = await supabaseServer
    .from("memories")
    .select("og_file_name")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const ogImage =
    data?.og_file_name && data.og_file_name.startsWith("http")
      ? data.og_file_name
      : "/images/og-memorylist.png";

  return {
    title: "Smart Project Wall | CV. Bangunan Cerdas Indonesia",
    description:
      "Dokumentasi Project Bangunan Cerdas Indonesia dalam satu galeri elegan. Jelajahi semua Project dengan tampilan modern.",

    openGraph: {
      title: "Smart Project Wall | CV. Bangunan Cerdas Indonesia",
      description:
        "Dokumentasi Project Bangunan Cerdas Indonesia dalam satu galeri elegan. Jelajahi semua Project dengan tampilan modern.",
      type: "website",
      url: "https://bangunancerdas.web.id/project",
      images: [
        {
          url: ogImage,
          width: 800,
          height: 420,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Smart Project Wall | CV. Bangunan Cerdas Indonesia",
      description:
        "Dokumentasi Project Bangunan Cerdas Indonesia dalam satu galeri elegan. Jelajahi semua Project dengan tampilan modern.",
      images: [ogImage],
    },
  };
}

export default async function Page() {
  const { data: memories } = await supabaseServer
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProjectListPage memories={memories || []} />;
}
