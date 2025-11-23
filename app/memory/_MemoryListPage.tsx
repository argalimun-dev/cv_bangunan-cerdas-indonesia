"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Memory {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  uploader?: string;
}

export default function MemoryListPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (err) {
      console.error("Error fetching memories:", err);
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Memuat Project...
      </div>
    );
  }

  return (
    <main className="min-h-screen text-gray-100 flex flex-col items-center">

      {/* === Header bersih === */}
      <header className="w-full text-center pt-6 pb-6 bg-gray-900/10 backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
          Smart Project Wall
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-1 px-4">
          Dokumentasi Project dalam satu galeri elegan ✨
        </p>
      </header>

      {memories.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 px-4">
          Belum ada Project yang ditambahkan 😢
        </p>
      ) : (
        <section className="w-full px-3 sm:px-6 lg:px-10 pt-6 pb-10">

          <div
            className="
              grid gap-8
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
              
              w-full
            "
          >
            {memories.map((memory) => (
              <Link key={memory.id} href={`/memory/${memory.id}`}>
                <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-transparent border border-gray-700 hover:border-blue-400/70 transition-all duration-300">
                  
                  <img
                    src={memory.image_url}
                    alt={memory.title}
                    className="w-full h-auto aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
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
    </main>
  );
}
