"use client";

import React, { useRef, useEffect } from "react";

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
  onSave: () => void;
  loading: boolean;
}

export default function EditModal({
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
  onSave,
  loading,
}: Props) {
  const descRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea
  useEffect(() => {
    if (!descRef.current) return;
    const ta = descRef.current;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [description]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => !loading && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="
          relative w-full max-w-3xl
          h-full md:h-auto md:max-h-[90vh]  /* ✅ lebih tinggi modal */
          bg-gray-900 rounded-lg border border-gray-700 shadow-xl flex flex-col overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h3 className="text-white text-lg font-semibold">Edit Project</h3>
          <div className="w-6" /> {/* agar header balance */}
        </div>

        {/* Body scrollable */}
        <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-custom scroll-smooth">
          {/* Judul */}
          <label className="block text-sm text-gray-300">Judul</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white disabled:opacity-50"
          />

          {/* Deskripsi */}
          <label className="block text-sm text-gray-300">Deskripsi</label>
          <textarea
            ref={descRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white resize-none min-h-[150px] md:min-h-[200px]"
          />

          {/* Pengunggah */}
          <label className="block text-sm text-gray-300">Pengunggah</label>
          <input
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
            disabled={loading}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white disabled:opacity-50"
          />
        </div>

        {/* Footer + File input */}
        <div className="p-4 border-t border-gray-800 bg-gray-900 flex flex-col md:flex-row md:justify-between gap-3">
          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full md:w-auto text-sm"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-3 py-1 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              onClick={onSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
