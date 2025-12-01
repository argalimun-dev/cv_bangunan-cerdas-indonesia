// components/HandleComments/CommentMainItem.tsx
"use client";

import React from "react";
import { CommentShape } from "@/types/comment";
import CommentReplyItem from "./CommentReplyItem";
import { formatDate } from "@/lib/formatDate";

interface Props {
  comment: CommentShape;
  replies?: CommentShape[];
  deviceIdentity?: string | null;

  onStartReply: (commentId: string) => void;
  onCancelReply: () => void;
  onSendReply: (parentCommentId: string, text: string, name?: string) => void;

  onStartEdit: (c: CommentShape) => void;
  onUpdate: (id: string, newText: string) => void;
  onDelete: (id: string, isParent?: boolean) => void;

  editId?: string | null;
  editText?: string;
  setEditText?: (s: string) => void;

  replyToId?: string | null;
  replyText?: string;
  setReplyText?: (s: string) => void;

  replyName?: string;
  setReplyName?: (s: string) => void;

  sending?: boolean;
}

export default function CommentMainItem({
  comment,
  replies = [],
  deviceIdentity,
  onStartReply,
  onCancelReply,
  onSendReply,
  onStartEdit,
  onUpdate,
  onDelete,
  editId,
  editText,
  setEditText,
  replyToId,
  replyText,
  setReplyText,
  replyName,
  setReplyName,
  sending,
}: Props) {
  const isOwner = deviceIdentity === comment.device_identity;
  const isEditing = editId === comment.id;
  const isReplying = replyToId === comment.id;

  return (
    <div className="space-y-2 text-sm">
      {/* ================= MAIN COMMENT ================= */}
      <div className="flex flex-col gap-1">
        {isEditing ? (
          <>
            <textarea
              id={`edit-comment-${comment.id}`}
              name="editComment"
              value={editText || ""}
              onChange={(e) => setEditText?.(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 resize-none"
              rows={2}
            />

            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={() => onStartEdit(comment)}
                className="px-2 py-1 text-gray-300 rounded border border-gray-600 hover:bg-gray-700"
              >
                Batal
              </button>

              <button
                onClick={() => onUpdate(comment.id, editText || "")}
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
              {comment.text}
            </p>

            <div className="flex items-center gap-2 flex-wrap text-gray-400">
              <span className="font-semibold text-gray-200">
                {comment.commenter || "Anonim"}
              </span>

              <span>· {formatDate(comment.created_at)}</span>

              <button
                onClick={() => onStartReply(comment.id)}
                className="text-sky-300 hover:text-sky-200"
              >
                Reply
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={() => onStartEdit(comment)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(comment.id, true)}
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

      {/* ================= REPLY INPUT ================= */}
      {isReplying && (
        <div className="ml-4 sm:ml-6 flex flex-col gap-1">
          <textarea
            id={`reply-text-${comment.id}`}
            name="replyText"
            value={replyText || ""}
            onChange={(e) => setReplyText?.(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 resize-none"
            placeholder="Tulis balasan..."
            rows={2}
          />

          <input
            id={`reply-name-${comment.id}`}
            name="replyName"
            value={replyName || ""}
            onChange={(e) => setReplyName?.(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="Nama kamu..."
          />

          <div className="flex gap-2 mt-1 justify-end">
            <button onClick={onCancelReply} className="text-gray-300 hover:underline">
              Batal
            </button>

            <button
              onClick={() =>
                onSendReply(comment.id, replyText || "", replyName || "")
              }
              disabled={sending}
              className="text-sky-500 hover:underline disabled:opacity-60"
            >
              {sending ? "Mengirim..." : "Balas"}
            </button>
          </div>
        </div>
      )}

      {/* ================= REPLIES LIST ================= */}
      {replies.length > 0 && (
        <div className="ml-4 sm:ml-6 space-y-2">
          {replies.map((r) => (
            <CommentReplyItem
              key={r.id}
              reply={r}
              deviceIdentity={deviceIdentity}
              editId={editId}
              editText={editText}
              setEditText={setEditText}
              onStartEdit={onStartEdit}
              onUpdate={onUpdate}
              onDelete={onDelete}
              sending={sending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
