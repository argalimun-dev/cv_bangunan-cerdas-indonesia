// app/_HomePage.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Project Wall | CV. Bangunan Cerdas Indonesia",
  description:
    "Platform Galeri Pemasaran Digital. Simpan, kelola, dan tampilkan setiap Project dengan tampilan modern.",

  keywords: [
    "CV Bangunan Cerdas Indonesia",
    "Smart Project Wall",
    "Galeri Project",
    "Manajemen Project",
    "Dokumentasi Proyek",
  ],

  openGraph: {
    title: "Smart Project Wall | CV. Bangunan Cerdas Indonesia",
    description:
      "Platform Galeri Pemasaran Digital. Simpan, kelola, dan tampilkan setiap Project dengan tampilan modern.",
    url: "/",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-home`,
        width: 1200,
        height: 630,
        alt: "Smart Project Wall - CV. Bangunan Cerdas Indonesia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Smart Project Wall | CV. Bangunan Cerdas Indonesia",
    description:
      "Platform Galeri Pemasaran Digital. Simpan, kelola, dan tampilkan setiap Project dengan tampilan modern.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/api/og-home`],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main
      className="
        flex flex-col items-center justify-center
        min-h-[80dvh] w-full
        px-6 text-center
        animate-fadeIn
      "
    >
      <h1
        className="
          text-4xl sm:text-6xl md:text-7xl 
          font-semibold tracking-tight 
          bg-gradient-to-r from-sky-400 to-blue-500 
          bg-clip-text text-transparent 
          drop-shadow-xl select-none
          max-w-3xl leading-[1.15]
        "
      >
        Selamat Datang di Smart Project Wall
      </h1>

      <p
        className="
          text-gray-400 text-base sm:text-lg 
          max-w-2xl mt-6 mb-6 leading-relaxed
        "
      >
        Platform Galeri Pemasaran Digital Interaktif <br />
        <span className="text-sky-400 font-medium">
          CV. Bangunan Cerdas Indonesia
        </span>
        <br />
        Simpan, kelola dan tampilkan setiap Project dengan tampilan modern ✨
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/project"
          className="
            px-8 py-3 
            rounded-xl text-lg font-medium 
            bg-sky-600 hover:bg-sky-500 
            transition-all duration-200 
            shadow-lg hover:shadow-sky-600/30 
            transform hover:scale-[1.04] active:scale-[0.98]
          "
        >
          🚀 Smart Project Wall
        </Link>

        <Link
          href="/about"
          className="
            px-8 py-3 
            rounded-xl text-lg font-medium 
            bg-green-600 hover:bg-green-500 
            transition-all duration-200 
            shadow-lg hover:shadow-green-600/30 
            transform hover:scale-[1.04] active:scale-[0.98]
          "
        >
          📞 Bebaslah Bertanya
        </Link>
      </div>
    </main>
  );
}
