// components/Modals/DeleteModal.tsx
"use client";

import React from "react";
import SecretCodeModal from "@/components/Modals/SecretCodeModal";

interface Props {
  isOpen: boolean;
  secretCode: string;
  setSecretCode: (v: string) => void;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  isOpen,
  secretCode,
  setSecretCode,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) return null;

  return (
    <SecretCodeModal
      isOpen={isOpen}
      title="Hapus Project?"
      description="Masukkan kode rahasia untuk menghapus Project ini."
      secretCode={secretCode}
      setSecretCode={setSecretCode}
      loading={loading}
      onCancel={onCancel}
      onConfirm={onConfirm}
      confirmLabel="Hapus"
      confirmColor="red"
    />
  );
}
