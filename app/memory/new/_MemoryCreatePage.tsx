"use client";
import { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!file) return alert("📸 Pilih gambar dulu!");
      if (!title.trim()) return alert("✏️ Isi judul dulu!");
      if (!uploader.trim()) return alert("👤 Isi nama pengunggah dulu!");
      if (!secretCode.trim()) return alert("🔐 Masukkan kode rahasia dulu!");

      setLoading(true);

      // VALIDASI KODE
      const { data: validCode, error: codeError } = await supabase
        .from("access_codes")
        .select("*")
        .ilike("code", secretCode.trim())
        .single();

      if (codeError || !validCode) {
        alert("🚫 Kode rahasia salah!");
        setLoading(false);
        return;
      }

      // SANITASI NAMA FILE
      const sanitized = file.name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "_");
      const fileName = `${Date.now()}-${sanitized}`;

      // UPLOAD
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (uploadError) {
        alert("❌ Gagal upload gambar!");
        console.error(uploadError);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      const imageUrl = data?.publicUrl || "";

      // INSERT
      const { error: insertError } = await supabase.from("memories").insert([
        {
          title,
          description,
          image_url: imageUrl,
          uploader,
        },
      ]);

      if (insertError) {
        alert("❌ Gagal menyimpan ke database!");
        console.error(insertError);
      } else {
        alert("✅ Berhasil menambahkan Project 🎉");
        router.replace("/memory");
        router.refresh();
      }

      setLoading(false);
    },
    [file, title, description, uploader, secretCode, router]
  );

  return (
    <div className="w-full px-4 py-10 min-h-screen overflow-y-auto scrollbar-custom scroll-smooth">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-200 mb-6">
          Tambah Project Baru
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl overflow-hidden"
        >
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
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Deskripsi</label>
            <textarea
              ref={descRef}
              placeholder="Tuliskan cerita singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-gray-900 border border-gray-800 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 outline-none overflow-y-auto scrollbar-custom scroll-smooth"
            />
          </div>

          {/* Gambar */}
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

          {/* Kode */}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium disabled:opacity-70"
          >
            {loading ? "Mengunggah..." : "Simpan Project"}
          </button>
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
