"use client";
import Link from "next/link";
import Head from "next/head"; // import Head untuk SEO

export default function HomePage() {
  return (
    <>
      {/* ======================
            SEO TAGS
         ====================== */}
      <Head>
        <title>Smart Project Wall | CV. Bangunan Cerdas Indonesia</title>
        <meta
          name="description"
          content="Platform Galeri Pemasaran Digital. Simpan, kelola, dan tampilkan setiap Project dengan tampilan modern."
        />

        {/* Open Graph / Social Preview */}
        <meta property="og:title" content="Smart Project Wall | CV. Bangunan Cerdas Indonesia" />
        <meta
          property="og:description"
          content="Platform Galeri Pemasaran Digital. Simpan, kelola, dan tampilkan setiap Project dengan tampilan modern."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://namadomainmu.com" />
        <meta property="og:image" content="/images/og-home.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Smart Project Wall | CV. Bangunan Cerdas Indonesia" />
        <meta
          name="twitter:description"
          content="Platform Galeri Pemasaran Digital. Simpan, kelola, dan tampilkan setiap Project dengan tampilan modern."
        />
        <meta name="twitter:image" content="/images/og-home.png" />
      </Head>

      {/* ======================
            PAGE CONTENT
         ====================== */}
      <main
        className="
          flex flex-col items-center justify-center 
          min-h-[80vh] w-full 
          px-6 text-center 
          animate-fadeIn
        "
      >
        {/* 🌟 HEADLINE */}
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

        {/* ✨ Subheadline */}
        <p
          className="
            text-gray-400 text-base sm:text-lg 
            max-w-2xl mt-6 mb-10 leading-relaxed
          "
        >
          Platform Galeri Pemasaran Digital Interaktif <br />
          <span className="text-sky-400 font-medium">
            CV. Bangunan Cerdas Indonesia
          </span>
          <br />
          Simpan, kelola dan tampilkan setiap Project dengan tampilan modern ✨
        </p>

        {/* 🚀 CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/memory"
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
    </>
  );
}
