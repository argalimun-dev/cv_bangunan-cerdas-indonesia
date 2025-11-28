"use client";

import Link from "next/link";

interface Memory {
  id: number;
  title: string;
  image_url: string;
  uploader?: string;
}

export default function MemoryListPage({
  memories,
}: {
  memories: Memory[];
}) {
  return (
    <main className="h-screen w-full flex flex-col overflow-hidden text-gray-100">
      {/* HEADER */}
      <header className="shrink-0 w-full text-center pt-6 pb-6 bg-gray-900/10 backdrop-blur-md border-b border-white/5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
          Smart Project Wall
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-1 px-4">
          Dokumentasi Project dalam satu galeri elegan ✨
        </p>
      </header>

      {/* BODY */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-custom">
        {memories.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-500 text-center px-4">
            Belum ada Project 😢
          </div>
        )}

        {memories.length > 0 && (
          <section className="w-full px-3 sm:px-6 lg:px-10 pt-6 pb-10">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full">
              {memories.map((memory) => (
                <Link key={memory.id} href={`/memory/${memory.id}`}>
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
    </main>
  );
}
