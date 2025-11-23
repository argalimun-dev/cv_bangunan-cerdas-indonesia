"use client";

import React from "react";

export interface CommentShape {
  id: string;
  text: string;
  created_at: string;
  commenter?: string | null; // untuk komentar utama
  device_identity?: string | null;
  name?: string | null; // untuk reply, dari Supabase kolom 'name'
}

export interface InternalComment extends CommentShape {
  parent_id?: string | null;
}

interface Props {
  comment: InternalComment;
  replies?: InternalComment[];
  deviceIdentity?: string | null;

  onStartReply: (commentId: string) => void;
  onSendReply: (parentCommentId: string, text: string, name?: string) => void;

  onStartEdit: (c: InternalComment) => void;
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

export default function CommentItem({
  comment,
  replies = [],
  deviceIdentity,
  onStartReply,
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
    <div className="space-y-2">
      {/* MAIN COMMENT */}
      <div className="bg-gray-800 border border-gray-700 p-3 rounded-xl shadow-md">
        {isEditing ? (
          <div>
            <textarea
              value={editText || ""}
              onChange={(e) => setEditText?.(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white resize-none border border-gray-600"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => onStartEdit(comment)}
                className="px-3 py-1 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={() => onUpdate(comment.id, editText || "")}
                className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-500"
              >
                Simpan
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-200 whitespace-pre-line leading-relaxed">
              {comment.text}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <div>
                <span className="font-semibold text-gray-200 mr-2">
                  {comment.commenter || "Anonim"}
                </span>
                <span>
                  ·{" "}
                  {new Date(comment.created_at).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onStartReply(comment.id)}
                  className="text-sky-300 hover:text-sky-200 text-sm"
                >
                  Reply
                </button>

                {isOwner && (
                  <>
                    <button
                      onClick={() => onStartEdit(comment)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment.id, true)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* REPLY BOX */}
      {isReplying && (
        <div className="ml-6">
          <div className="bg-gray-850 border border-gray-700 p-3 rounded-xl shadow-lg">
            <textarea
              value={replyText || ""}
              onChange={(e) => setReplyText?.(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white resize-none border border-gray-600"
              placeholder="Tulis balasan..."
            />
            <input
              value={replyName || ""}
              onChange={(e) => setReplyName?.(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 mt-2"
              placeholder="Nama kamu..."
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setReplyText?.("");
                  setReplyName?.("");
                }}
                className="px-3 py-1 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={() =>
                  onSendReply(comment.id, replyText || "", replyName || "")
                }
                disabled={sending}
                className="px-3 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-50"
              >
                {sending ? "Mengirim..." : "Balas"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPLY LIST */}
      {replies.length > 0 && (
        <div className="ml-6 space-y-2">
          {replies.map((r) => {
            const isReplyOwner = deviceIdentity === r.device_identity;
            const isEditingReply = editId === r.id;
            return (
              <div key={r.id} className="bg-gray-800 border border-gray-700 p-3 rounded-xl shadow-md">
                {isEditingReply ? (
                  <div>
                    <textarea
                      value={editText || ""}
                      onChange={(e) => setEditText?.(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-700 text-white resize-none border border-gray-600"
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => onStartEdit(r)}
                        className="px-3 py-1 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => onUpdate(r.id, editText || "")}
                        className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-500"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                      {r.text}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <div>
                        <span className="font-semibold text-gray-200 mr-2">
                          {r.name || "Anonim"}
                        </span>
                        <span>
                          ·{" "}
                          {new Date(r.created_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {isReplyOwner && (
                          <>
                            <button
                              onClick={() => onStartEdit(r)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(r.id, false)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
