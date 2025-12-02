// components/EditItem.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { FormWrapper } from "@/components/FormWrapper";
import FormField from "@/components/FormField";
import { Button } from "@/components/Button";
import { processImageFile } from "@/services/imageProcessor";

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

    // ✅ SIZE CHECK AWAL
    if (selected.size > 10 * 1024 * 1024) {
      alert("⚠️ Ukuran file terlalu besar! Maksimal 10MB.");
      return;
    }

    setIsConverting(true);

    try {
      const processedFile = await processImageFile(selected);

      if (!processedFile.type.startsWith("image/")) {
        alert("❌ File harus berupa gambar.");
        return;
      }

      setFile(processedFile);
    } catch (err) {
      console.error("Image process failed:", err);
      alert("❌ Gagal memproses gambar.");
    } finally {
      setIsConverting(false);
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
