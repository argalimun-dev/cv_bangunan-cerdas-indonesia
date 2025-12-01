// app/project/_ProjectListPage.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Memory {
  id: number;
  title: string;
  image_url: string;
  uploader?: string;
}

export default function ProjectListPage({
  memories: initialMemories,
}: {
  memories: Memory[];
}) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Patch loading super smooth
    const timeout = setTimeout(() => {
      setMemories(initialMemories);
      setLoading(false);
    }, 200); // delay minimal agar efek loading terlihat

    return () => clearTimeout(timeout);
  }, [initialMemories]);
  
  return (
    // ✅ BUKAN <main> → supaya tidak nested dengan <main> di layout.tsx
    <div className="w-full flex flex-col text-gray-100">
      
      {/* ✅ HEADER STICKY — TIDAK IKUT SCROLL */}
      <header className="shrink-0 w-full text-center pt-[28px] pb-6 sm:pt-10 sm:pb-8 md:pt-12 md:pb-8 lg:pt-12 lg:pb-8 bg-gray-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white tracking-tight">
          Smart Project Wall
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-1 px-4">
          Dokumentasi Project dalam satu galeri elegan ✨
        </p>
      </header>

      {/* ✅ BODY — TANPA SCROLLBAR INTERNAL */}
      <div className="w-full">
        {/* ✅ LOADING PATCH OPTIMAL */}
        {loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 text-center px-4 animate-pulse space-y-2">
            {/* Spinner bulat mini */}
            <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Memuat Projects...</span>
          </div>
        )}
        
        {!loading && memories.length === 0 && (
          <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-center px-4">
            Belum ada Project 😢
          </div>
        )}

        {!loading && memories.length > 0 && (
          <section className="w-full px-3 sm:px-6 lg:px-10 pt-6 pb-10">
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full">
              {memories.map((memory) => (
                <Link key={memory.id} href={`/project/${memory.id}`}>
                  <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-transparent border border-gray-700 hover:border-blue-400/70 transition-all duration-300">
                    <img
                      src={memory.image_url}
                      alt={memory.title}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                      <p className="font-semibold text-lg drop-shadow-lg">
                        {memory.title}
                      </p>
                      <p className="text-xs text-gray-300 italic mt-1">
                        oleh {memory.uploader || "Anonim"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
