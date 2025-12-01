// components/HandleComments/CommentFormMain.tsx
"use client";

import React, { useEffect, useRef } from "react";

interface Props {
  defaultName?: string;

  text: string;
  setText: (v: string) => void;

  name: string;
  setName: (v: string) => void;

  onSubmit: () => void;
  onCancel: () => void;

  sending?: boolean;
  open: boolean;
}

export default function CommentFormMain({
  defaultName,
  text,
  setText,
  name,
  setName,
  onSubmit,
  onCancel,
  sending = false,
  open,
}: Props) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  return (
    <>
      <h3 className="text-lg font-semibold text-white mb-3">
        Tulis Komentar
      </h3>

      <label htmlFor="comment-text" className="text-sm text-gray-300 block mb-1">
        Komentar
      </label>
      <textarea
        ref={inputRef}
        id="comment-text"
        name="comment"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white resize-none 
                   focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder="Tulis komentar..."
      />

      <label
        htmlFor="comment-name"
        className="text-sm text-gray-300 block mt-3 mb-1"
      >
        Nama (opsional)
      </label>
      <input
        id="comment-name"
        name="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white 
                   focus:outline-none focus:ring-2 focus:ring-sky-400"
        placeholder={defaultName || "Anonim"}
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-3 py-1 rounded-md border border-gray-600 text-gray-300 hover:bg-white/5"
        >
          Batal
        </button>

        <button
          onClick={onSubmit}
          disabled={sending}
          className="px-3 py-1 rounded-md bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-60"
        >
          {sending ? "Mengirim..." : "Kirim"}
        </button>
      </div>
    </>
  );
}
