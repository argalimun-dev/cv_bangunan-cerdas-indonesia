"use client";

import { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MemoryCreatePage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploader, setUploader] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);

  const descRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (!descRef.current) return;
    const ta = descRef.current;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [description]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0] || null;

      if (selected) {
        if (selected.size > 10 * 1024 * 1024) {
          alert("⚠️ Ukuran file terlalu besar! Maksimal 10MB.");
          return;
        }

        if (!selected.type.startsWith("image/")) {
          alert("❌ File harus berupa gambar!");
          return;
        }
      }

      setFile(selected);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!file) return alert("📸 Pilih gambar dulu!");
      if (!title.trim()) return alert("✏️ Isi judul dulu!");
      if (!uploader.trim()) return alert("👤 Isi nama pengunggah dulu!");
      if (!secretCode.trim()) return alert("🔐 Masukkan kode rahasia dulu!");

      setLoading(true);

      try {
        // Convert file → base64
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        const fileBase64 = btoa(binary);

        const res = await fetch("/api/memory/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            uploader,
            secretCode,
            fileBase64,
            fileName: file.name,
            fileType: file.type,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Gagal membuat memory");
        }

        alert("✅ Berhasil menambahkan Project 🎉");
        router.replace("/memory");
        router.refresh();
      } catch (err: any) {
        console.error("CREATE ERROR:", err);
        alert(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    },
    [file, title, description, uploader, secretCode, router]
  );

  return (
    <div className="w-full px-4 py-10 min-h-screen flex justify-center bg-gray-900/20 scrollbar-custom scroll-smooth">
      <div className="max-w-3xl w-full flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">
          Tambah Project Baru
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 gap-4 border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl overflow-hidden"
        >
          {/* Body scrollable */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-custom">
            {/* Judul */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Judul Project</label>
              <input
                type="text"
                placeholder="Contoh: Kesetrum"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-1 flex-1 min-h-[300px]">
              <label className="text-sm text-gray-400">Deskripsi</label>
              <textarea
                ref={descRef}
                placeholder="Tuliskan cerita singkat..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}  // default lebih tinggi
                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none overflow-y-auto scrollbar-custom"
              />
            </div>
          </div>

          {/* Footer: file + uploader + kode + submit */}
          <div className="flex flex-col gap-4">
            {/* File */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Unggah Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-gray-300 file:bg-gray-800 file:border-0 
                  file:px-4 file:py-2 file:rounded-lg file:cursor-pointer
                  hover:file:bg-gray-700 transition"
              />
            </div>

            {/* Uploader */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Nama Pengunggah</label>
              <input
                type="text"
                placeholder="Anda ingin disebut apa"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Secret Code */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Kode Rahasia</label>
              <input
                type="password"
                placeholder="Masukkan kode..."
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium disabled:opacity-70"
            >
              {loading ? "Mengunggah..." : "Simpan Project"}
            </button>
          </div>
        </form>

        <button
          onClick={() => router.push("/memory")}
          className="mt-6 text-sm text-gray-400 hover:text-gray-200 underline"
        >
          ← Kembali ke Smart Project Wall
        </button>
      </div>
    </div>
  );
}
