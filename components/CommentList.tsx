"use client";

import React from "react";
import CommentItem from "./CommentItem";
import { CommentShape } from "@/types/comment";

interface Props {
  comments: CommentShape[];
  replies: Record<string, CommentShape[]>; // mapping comment.id ke array balasan
  deviceIdentity?: string | null;

  onStartReply: (id: string) => void;
  onSendReply: (parentId: string, text: string, name?: string) => void;
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

export default function CommentList({
  comments,
  replies,
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
  return (
    <div className="space-y-2">
      {comments.length === 0 && (
        <p className="text-gray-400 text-sm">Belum ada komentar.</p>
      )}

      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          replies={replies[c.id] || []} // mapping balasan otomatis
          deviceIdentity={deviceIdentity}
          onStartReply={onStartReply}
          onSendReply={onSendReply}
          onStartEdit={onStartEdit}
          onUpdate={onUpdate}
          onDelete={onDelete}
          editId={editId}
          editText={editText}
          setEditText={setEditText}
          replyToId={replyToId}
          replyText={replyText}
          setReplyText={setReplyText}
          replyName={replyName}
          setReplyName={setReplyName}
          sending={sending}
        />
      ))}
    </div>
  );
}
