"use client";

import React, { useRef, useEffect, useState } from "react";
import SecretCodeModal from "@/components/modals/SecretCodeModal"; // ✅ import final modal

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
  onSave: (secretCode: string) => void; // sekarang menerima secretCode
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
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-grow textarea
  useEffect(() => {
    if (!descRef.current) return;
    const ta = descRef.current;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [description]);

  if (!isOpen) return null;

  // Trigger SecretCodeModal sebelum save
  const handleSaveClick = () => {
    setSecretCode(""); // reset setiap kali modal dibuka
    setErrorMsg("");
    setIsSecretModalOpen(true);
  };

  const handleConfirmSecret = async () => {
    if (!secretCode.trim()) {
      setErrorMsg("Masukkan kode rahasia");
      return;
    }

    try {
      await onSave(secretCode); // panggil parent dengan secretCode
      setIsSecretModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Kode rahasia salah");
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={() => !loading && onCancel()}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="
            relative w-full max-w-3xl
            h-full md:h-auto md:max-h-[90vh]
            bg-gray-900 rounded-lg border border-gray-700 shadow-xl flex flex-col overflow-hidden
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="text-white text-lg font-semibold">Edit Project</h3>
            <div className="w-6" /> {/* balance header */}
          </div>

          {/* Body scrollable */}
          <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-custom scroll-smooth">
            <label className="block text-sm text-gray-300">Judul</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white disabled:opacity-50"
            />

            <label className="block text-sm text-gray-300">Deskripsi</label>
            <textarea
              ref={descRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white resize-none min-h-[150px] md:min-h-[200px]"
            />

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
                onClick={handleSaveClick}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SecretCodeModal */}
      <SecretCodeModal
        isOpen={isSecretModalOpen}
        title="Masukkan Kode Rahasia"
        description="Masukkan kode rahasia untuk menyimpan perubahan."
        confirmText="Simpan"
        loadingText="Menyimpan..."
        secretCode={secretCode}
        setSecretCode={setSecretCode}
        loading={loading}
        errorMessage={errorMsg}
        confirmVariant="primary"
        onCancel={() => setIsSecretModalOpen(false)}
        onConfirm={handleConfirmSecret}
      />
    </>
  );
}
