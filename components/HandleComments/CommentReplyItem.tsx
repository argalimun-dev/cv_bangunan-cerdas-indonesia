// components/HandleComments/CommentReplyItem.tsx
"use client";

import React from "react";
import { CommentShape } from "@/types/comment";
import { formatDate } from "@/lib/formatDate";

interface Props {
  reply: CommentShape;
  deviceIdentity?: string | null;

  editId?: string | null;
  editText?: string;
  setEditText?: (s: string) => void;

  onStartEdit: (c: CommentShape) => void;
  onUpdate: (id: string, newText: string) => void;
  onDelete: (id: string, isParent?: boolean) => void;

  sending?: boolean;
}

export default function CommentReplyItem({
  reply,
  deviceIdentity,
  editId,
  editText,
  setEditText,
  onStartEdit,
  onUpdate,
  onDelete,
  sending,
}: Props) {
  const isOwner = deviceIdentity === reply.device_identity;
  const isEditing = editId === reply.id;

    return (
    <div className="flex flex-col gap-1">
      {isEditing ? (
        <>
          <textarea
            id={`edit-reply-${reply.id}`}
            name="editReply"
            value={editText || ""}
            onChange={(e) => setEditText?.(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 resize-none"
            rows={2}
          />

          <div className="flex gap-2 justify-end mt-1">
            <button
              onClick={() => onStartEdit(reply)}
              className="px-2 py-1 text-gray-300 rounded border border-gray-600 hover:bg-gray-700"
            >
              Batal
            </button>

            <button
              onClick={() => onUpdate(reply.id, editText || "")}
              className="px-2 py-1 bg-green-600 rounded text-white hover:bg-green-500"
              disabled={sending}
            >
              Simpan
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-200 whitespace-pre-line leading-relaxed">
            {reply.text}
          </p>

          <div className="flex items-center gap-2 flex-wrap text-gray-400">
            <span className="font-semibold text-gray-200">
              {reply.name || "Anonim"}
            </span>

            <span>· {formatDate(reply.created_at)}</span>

            {isOwner && (
              <>
                <button
                  onClick={() => onStartEdit(reply)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(reply.id, false)}
                  className="text-red-400 hover:text-red-300"
                >
                  Hapus
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
