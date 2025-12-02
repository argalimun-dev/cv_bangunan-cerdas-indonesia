// app/project/new/_ProjectCreatePage.tsx
"use client";

import { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretCodeModal from "@/components/Modals/SecretCodeModal";

export default function ProjectCreatePage() {
  const router = useRouter();

  const [isConverting, setIsConverting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploader, setUploader] = useState("");

  const [secretCode, setSecretCode] = useState("");
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const descRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (!descRef.current) return;
    const ta = descRef.current;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [description]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      let selected = e.target.files?.[0] || null;
      if (!selected) return;

      // ✅ SIZE CHECK
      if (selected.size > 10 * 1024 * 1024) {
        alert("⚠️ Ukuran file terlalu besar! Maksimal 10MB.");
        return;
      }

      const isHeic =
        selected.type === "image/heic" ||
        selected.type === "image/heif" ||
        selected.name.toLowerCase().endsWith(".heic");

      // ✅ JIKA HEIC → CONVERT KE JPEG DI BROWSER
      if (isHeic) {
        setIsConverting(true);
        try {
          // 🔹 DYNAMIC IMPORT HANYA DI CLIENT
          const heic2any = (await import("heic2any")).default;

          const convertedBlob = (await heic2any({
            blob: selected,
            toType: "image/jpeg",
            quality: 0.95,
          })) as Blob;

          const jpegFile = new File(
            [convertedBlob],
            selected.name.replace(/\.heic/i, ".jpg"),
            { type: "image/jpeg" }
          );

          selected = jpegFile;
        } catch (err) {
          console.error("HEIC convert failed:", err);
          alert("❌ Gagal mengonversi foto HEIC.");
          return;
        } finally {
          // ✅ finally harus ada di dalam try-catch
          setIsConverting(false);
        }
      }

      // ✅ VALIDASI AKHIR (SETELAH KONVERSI)
      if (!selected.type.startsWith("image/")) {
        alert("❌ File harus berupa gambar (JPG, PNG, HEIC).");
        return;
      }

      setFile(selected);
    },
    []
  );

    // -------------------------------
    // VALIDASI AWAL → BUKA MODAL
    // -------------------------------
    const handlePreSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) return alert("📸 Pilih gambar dulu!");
        if (!title.trim()) return alert("✏️ Isi judul dulu!");
        if (!uploader.trim()) return alert("👤 Isi nama pengunggah dulu!");

        setIsSecretModalOpen(true);
      },
      [file, title, uploader]
    );

  // -------------------------------
  // SUBMIT SEBENARNYA (SETELAH SECRET CODE)
  // -------------------------------
  const handleConfirmSecret = useCallback(async () => {
    if (!secretCode.trim()) {
      setErrorMsg("Kode rahasia wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      if (!file) throw new Error("File hilang");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("uploader", uploader);
      formData.append("secretCode", secretCode);
      formData.append("file", file); // ✅ FILE ASLI, BUKAN BASE64

      const res = await fetch("/api/projectServer/create", {
        method: "POST",
        body: formData, // ✅ multipart/form-data otomatis
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setErrorMsg(data?.error || "Gagal membuat Project");
        return; // ⬅️ hentikan eksekusi tanpa throw
      }

      // ✅ SUKSES → baru tutup modal
      alert("✅ Berhasil menambahkan Project 🎉");
      setIsSecretModalOpen(false);
      setSecretCode("");
      router.push("/project");
      router.refresh();
    } catch (err: any) {
      console.error("NETWORK ERROR:", err);
      setErrorMsg("Terjadi kesalahan jaringan");

      // ✅ Modal tetap terbuka agar user bisa retry
    } finally {
      setLoading(false); // ✅ loading selalu dimatikan
    }
  }, [file, title, description, uploader, secretCode, router]);

  return (
    <div className="w-full px-4 py-6 min-h-screen flex justify-center bg-gray-900/20 scrollbar-custom scroll-smooth">
      <div className="max-w-3xl w-full flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-200">
          Tambah Project Baru
        </h1>

        <form
          onSubmit={handlePreSubmit}
          className="flex flex-col flex-1 gap-2 border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-4 rounded-xl overflow-hidden"
        >
          {/* Body scrollable */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-custom">
            {/* Judul */}
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-sm text-gray-400">
                Judul Project
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Contoh: 'Kesetrum'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:ring-inset outline-none"
              />
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-1 flex-1 min-h-[300px]">
              <label htmlFor="description" className="text-sm text-gray-400">
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                ref={descRef}
                placeholder="Tuliskan cerita tentang 'Kesetrum'..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:ring-inset outline-none overflow-y-auto scrollbar-custom"
              />
            </div>

            {/* File */}
            <div className="flex flex-col gap-1">
              <label htmlFor="file" className="text-sm text-gray-400">
                Unggah Gambar
              </label>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3
              focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset
              focus-within:border-blue-500">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*,.heif,.HEIC"
                  onChange={handleFileChange}
                  className="w-full text-gray-300 bg-transparent
                  file:bg-white-800 file:border-0
                  file:px-4 file:py-2 file:rounded-md file:cursor-pointer
                  hover:file:bg-gray-700 transition outline-none"
                />
              </div>
            </div>

            {/* Uploader */}
            <div className="flex flex-col gap-1">
              <label htmlFor="uploader" className="text-sm text-gray-400">
                Nama Pengunggah
              </label>
              <input
                id="uploader"
                name="uploader"
                type="text"
                placeholder="Anda ingin disebut apa"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:ring-inset outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isConverting} // ⬅️ tambahkan isConverting
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-medium
              border border-blue-600
              focus:border-blue-300 focus:outline-none
              focus:shadow-[inset_0_0_0_1px_rgb(147,197,253)]
              disabled:opacity-70"
            >
              Simpan Project
            </button>
          </div>
        </form>

        <button
          onClick={() => router.push("/project")}
          className="mt-6 text-sm text-gray-400 hover:text-gray-200 underline"
        >
          ← Kembali ke Smart Project Wall
        </button>
      </div>

      {/* ✅ SecretCodeModal */}
      <SecretCodeModal
        isOpen={isSecretModalOpen}
        title="Masukkan Kode Rahasia"
        description="Kode rahasia diperlukan untuk membuat Project."
        confirmText="Simpan"
        loadingText="Menyimpan..."
        secretCode={secretCode}
        setSecretCode={setSecretCode}
        loading={loading}
        errorMessage={errorMsg}
        confirmVariant="primary"
        onCancel={() => {
          setIsSecretModalOpen(false);
          setSecretCode("");
          setErrorMsg("");
        }}
        onConfirm={handleConfirmSecret}
      />
    </div>
  );
}
