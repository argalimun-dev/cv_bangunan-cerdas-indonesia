// components/Modals/EditModal.tsx
"use client";

import { useState } from "react";
import EditItem from "../EditItem";
import SecretCodeModal from "@/components/Modals/SecretCodeModal";

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
  onSave: (secretCode: string) => Promise<void>;
  loading: boolean;
}

export default function EditModal(props: Props) {
  const [isSecretOpen, setIsSecretOpen] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRequestSave = () => {
    setSecretCode("");
    setErrorMsg("");
    setIsSecretOpen(true);
  };

  const handleConfirmSecret = async () => {
    if (!secretCode.trim()) {
      setErrorMsg("Masukkan kode rahasia");
      return;
    }

    try {
      await props.onSave(secretCode);
      setIsSecretOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Kode rahasia salah");
    }
  };

  return (
    <>
      <EditItem
        {...props}
        onRequestSave={handleRequestSave}
      />

      <SecretCodeModal
        isOpen={isSecretOpen}
        title="Masukkan Kode Rahasia"
        description="Masukkan kode rahasia untuk menyimpan perubahan."
        confirmText="Simpan"
        loadingText="Menyimpan..."
        secretCode={secretCode}
        setSecretCode={setSecretCode}
        loading={props.loading}
        errorMessage={errorMsg}
        confirmVariant="primary"
        onCancel={() => setIsSecretOpen(false)}
        onConfirm={handleConfirmSecret}
      />
    </>
  );
}
