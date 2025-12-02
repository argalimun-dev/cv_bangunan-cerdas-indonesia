// components/EditItem.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { FormWrapper } from "@/components/FormWrapper";
import FormField from "@/components/FormField";
import { Button } from "@/components/Button";

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  uploader: string;
  file: File | null;

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setUploader: (v: string) => void;
  setFile: (f: File | null) => void;

  onCancel: () => void;
  onRequestSave: () => void;
  loading: boolean;
}

export default function EditItem({
  isOpen,
  title,
  description,
  uploader,
  file,
  setTitle,
  setDescription,
  setUploader,
  setFile,
  onCancel,
  onRequestSave,
  loading,
}: Props) {
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    if (!descRef.current) return;
    const ta = descRef.current;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [description]);

  if (!isOpen) return null;

  // 2️⃣ Buat handler file change async
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let selected = e.target.files?.[0] ?? null;
    if (!selected) return;

    setUploadError(null);
    setIsProcessingImage(true);

    try {
      // ✅ HARD LIMIT RAW FILE (ANTI RAM MATI)
      if (selected.size > 12 * 1024 * 1024) {
        throw new Error("File mentah terlalu besar (>12MB)");
      }

      const { processImageFile } = await import("@/services/imageProcessor");
      const processed = await processImageFile(selected);

      setFile(processed);
      console.log("FINAL FILE READY:", processed.name, processed.size);
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
    } finally {
      setIsProcessingImage(false);
      e.target.value = ""; // ✅ reset input supaya bisa pilih ulang file sama
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => !loading && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <FormWrapper onSubmit={onRequestSave} className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Edit Project</h3>
            <div className="w-6" />
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col gap-2 overflow-hidden min-h-0">

            <FormField label="Judul" id="edit-title">
              <input
                id="edit-title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="form-input form-focus"
              />
            </FormField>

            <FormField label="Deskripsi" id="edit-description" className="flex flex-col flex-1 min-h-0">
              <textarea
                id="edit-description"
                name="description"
                ref={descRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={4}
                className="
                  form-input form-focus resize-none
                  flex-1 min-h-[160px]
                  overflow-y-auto scrollbar-custom
                "
              />
            </FormField>

            <FormField label="Pengunggah" id="edit-uploader">
              <input
                id="edit-uploader"
                name="uploader"
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                disabled={loading}
                className="form-input form-focus"
              />
            </FormField>

            <FormField label="Unggah Gambar" id="edit-file">
              <div className="form-file-wrapper">
                <input
                  id="edit-file"
                  name="file"
                  type="file"
                  accept="image/*,.heif,.HEIC"
                  disabled={loading || isConverting} // ✅ disable saat converting
                  onChange={handleFileChange}        // ✅ pakai handler baru
                  className="w-full text-sm bg-transparent file:border-0 file:px-1 file:py-1 file:rounded-md file:cursor-pointer"
                />
                {isProcessingImage && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Memproses gambar...
                  </p>
                )}
                {file && !isProcessingImage && (
                  <p className="text-xs text-emerald-400 mt-1 break-all">
                    ✅ File siap: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}

                {uploadError && (
                  <p className="text-xs text-red-400 mt-1">
                    {uploadError}
                  </p>
                )}
              </div>
            </FormField>
          </div>

          {/* Footer */}
          <div className="pt-2 mt-1 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-10 py-2 rounded border border-white/20 text-white/70 hover:bg-white/10 disabled:opacity-50"
            >
              Batal
            </button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
}
