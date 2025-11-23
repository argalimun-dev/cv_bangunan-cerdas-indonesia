"use client";
import Link from "next/link";

export default function HomePage() {
  return (
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
        Platform Galeri Pemasaran Digital {" "}
        <span className="text-sky-400 font-medium">
          CV. Bangunan Cerdas Indonesia
        </span>
        . <br />
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

        {/* ✨ Tombol Baru */}
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
