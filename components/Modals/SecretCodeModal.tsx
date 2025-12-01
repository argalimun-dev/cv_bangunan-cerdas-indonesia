// components/Modals/SecretCodeModal.tsx
"use client";

import React from "react";

export interface SecretCodeModalProps {
  isOpen: boolean;
  title: string;
  description: string;

  secretCode: string;
  setSecretCode: (v: string) => void;

  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;

  // ✅ VERSI LAMA (tetap didukung)
  confirmLabel?: string;
  confirmColor?: "red" | "blue" | "green";

  // ✅ VERSI BARU (yang kamu pakai sekarang)
  confirmText?: string;
  loadingText?: string;
  errorMessage?: string;
  confirmVariant?: "primary" | "danger" | "success";
}

export default function SecretCodeModal({
  isOpen,
  title,
  description,
  secretCode,
  setSecretCode,
  loading,
  onCancel,
  onConfirm,

  // ✅ Lama
  confirmLabel,
  confirmColor,

  // ✅ Baru
  confirmText,
  loadingText,
  errorMessage,
  confirmVariant,
}: SecretCodeModalProps) {
  if (!isOpen) return null;

  // ------------------------------------
  // ✅ NORMALISASI AGAR SEMUA KOMPATIBEL
  // ------------------------------------
  const finalConfirmText =
    confirmText || confirmLabel || "Konfirmasi";

  const finalLoadingText =
    loadingText || "Memproses...";

  const finalVariant =
    confirmVariant ||
    (confirmColor === "red"
      ? "danger"
      : confirmColor === "green"
      ? "success"
      : "primary");

  const confirmButtonClass =
    finalVariant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : finalVariant === "success"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={() => !loading && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-[90%] max-w-md shadow-lg animate-zoomIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          {description}
        </p>

        <input
          id="secret-code"
          name="secretCode"
          type="password"
          placeholder="Kode rahasia"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          disabled={loading}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white mb-3 disabled:opacity-50"
        />

        {errorMessage && (
          <p className="text-sm text-red-400 mb-3">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-1 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`text-white px-3 py-1 rounded disabled:opacity-50 ${confirmButtonClass}`}
          >
            {loading ? finalLoadingText : finalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
