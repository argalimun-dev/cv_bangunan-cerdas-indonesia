// components/Modals/CommentModal.tsx
"use client";

import React from "react";
import CommentFormMain from "../HandleComments/CommentFormMain";

interface Props {
  open: boolean;
  onClose: () => void;

  defaultName?: string;

  text: string;
  setText: (v: string) => void;

  name: string;
  setName: (v: string) => void;

  onSubmit: () => void;
  sending?: boolean;
}

export default function CommentModal({
  open,
  onClose,
  defaultName,
  text,
  setText,
  name,
  setName,
  onSubmit,
  sending = false,
}: Props) {
  if (!open) return null;

  const handleClose = () => {
    setText("");
    setName("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-gray-900 rounded-xl border border-gray-700 p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <CommentFormMain
          open={open}
          defaultName={defaultName}
          text={text}
          setText={setText}
          name={name}
          setName={setName}
          onSubmit={onSubmit}
          onCancel={handleClose}
          sending={sending}
        />
      </div>
    </div>
  );
}
