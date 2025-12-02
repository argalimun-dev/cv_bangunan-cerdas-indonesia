// app/project/new/_ProjectCreatePage.tsx
"use client";

import { useState, FormEvent, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretCodeModal from "@/components/Modals/SecretCodeModal";

export default function ProjectCreatePage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploader, setUploader] = useState("");

  const [secretCode, setSecretCode] = useState("");
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Auto-grow textarea
  useEffect(() => {
    if (!descRef.current) return;
    const ta = descRef.current;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [description]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let selected = e.target.files?.[0] ?? null;
    if (!selected) return;

    setUploadError(null);
    setIsProcessingImage(true);
    setFile(null);
    setFileName(selected.name);

    try {
      // ✅ HARD LIMIT RAW FILE (ANTI RAM MATI)
      if (selected.size > 12 * 1024 * 1024) {
        throw new Error("File mentah terlalu besar (>12MB)");
      }

      const { processImageFile } = await import("@/services/imageProcessor");
      const processed = await processImageFile(selected);

      setFile(processed);
      setFileName(processed.name);
    } catch (err: any) {
      console.error("UPLOAD IMAGE ERROR:", err);

      // ✅ PESAN ERROR YANG JELAS KE USER
      if (err?.name === "ImageProcessError") {
        setUploadError(err.message);
      } else if (err?.message?.includes("network")) {
        setUploadError("Koneksi internet bermasalah saat upload.");
      } else {
        setUploadError("Terjadi error tak terduga saat memproses gambar.");
      }

      setFile(null);
      setFileName(null);
    } finally {
      setIsProcessingImage(false);
      e.target.value = ""; // ✅ reset input supaya bisa pilih ulang file sama
    }
  };

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

    if (!file) {
      setErrorMsg("File gambar tidak ditemukan!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("uploader", uploader);
      formData.append("secretCode", secretCode);
      formData.append("file", file);

      const res = await fetch("/api/projectServer/create", {
        method: "POST",
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      // ✅ SERVER ERROR (bukan network)
      if (!res.ok) {
        setErrorMsg(data?.error || "Gagal membuat Project (server error)");
        return;
      }

      // ✅ SUKSES
      alert("✅ Berhasil menambahkan Project 🎉");
      setIsSecretModalOpen(false);
      setSecretCode("");
      router.push("/project");
      router.refresh();

    } catch (err: any) {
      // ✅ NETWORK / FETCH ERROR
      console.error("NETWORK / FETCH ERROR:", err);

      if (err?.name === "TypeError") {
        setErrorMsg("Koneksi internet terputus atau server tidak merespons.");
      } else {
        setErrorMsg("Terjadi kesalahan jaringan saat upload.");
      }

    } finally {
      setLoading(false);
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
                  disabled={isProcessingImage}
                  className="w-full text-gray-300 bg-transparent
                  file:bg-white-800 file:border-0
                  file:px-4 file:py-2 file:rounded-md file:cursor-pointer
                  hover:file:bg-gray-700 transition outline-none"
                />

                {/* ✅ STATUS PROCESSING */}
                  {isProcessingImage && (
                    <p className="text-xs text-yellow-400 mt-1 animate-pulse">
                      Memproses gambar...
                    </p>
                  )}

                  {/* ✅ NAMA FILE TERPILIH */}
                  {!isProcessingImage && fileName && (
                    <p className="text-xs text-green-400 mt-1 truncate">
                      ✅ {fileName}
                    </p>
                  )}

                  {/* ✅ ERROR UPLOAD */}
                  {uploadError && (
                    <p className="text-xs text-red-400 mt-1">
                      {uploadError}
                    </p>
                  )}
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
