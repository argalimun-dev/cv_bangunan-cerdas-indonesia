// components/HandleComments/CommentSection.tsx
"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import CommentList from "./CommentList";
import CommentModal from "../Modals/CommentModal";
import { supabase } from "@/lib/supabaseClient";
import type { CommentShape } from "@/types/comment";

export interface CommentSectionRef {
  openModal: () => void;
}

interface Props {
  memoryId: string;
  initialComments: CommentShape[];
  deviceIdentity: string | null;
}

const CommentSection = forwardRef<CommentSectionRef, Props>(
  ({ memoryId, initialComments, deviceIdentity }, ref) => {
    const [comments, setComments] = useState<CommentShape[]>([]);
    const [replies, setReplies] = useState<Record<string, CommentShape[]>>({});

    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replyName, setReplyName] = useState("");

    const [editId, setEditId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalName, setModalName] = useState("");

    const [sending, setSending] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal() {
        setModalOpen(true);
      },
    }));

    // ✅ Utility tidak berubah secara perilaku
    const buildRepliesMap = useCallback((all: CommentShape[]) => {
      const map: Record<string, CommentShape[]> = {};
      all.forEach((c) => {
        if (c.parent_id) {
          if (!map[c.parent_id]) map[c.parent_id] = [];
          map[c.parent_id].push(c);
        }
      });
      return map;
    }, []);

    // ✅ Refresh aman (tidak di-paralelkan, tidak over-filter)
    const refresh = useCallback(async () => {
      try {
        const { data: commentData, error: cErr } = await supabase
          .from("comments")
          .select("*")
          .eq("memory_id", memoryId)
          .order("created_at", { ascending: true });

        const { data: replyData, error: rErr } = await supabase
          .from("reply_comments")
          .select("*")
          .order("created_at", { ascending: true });

        if (cErr || rErr) {
          console.error("CommentSection.refresh error", { cErr, rErr });
          return;
        }

        const internal: CommentShape[] = [];

        commentData?.forEach((c: any) => {
          internal.push({ ...c, parent_id: null });
        });

        replyData?.forEach((r: any) => {
          internal.push({
            ...r,
            parent_id: r.parent_comment_id,
            commenter: r.name,
          });
        });

        setComments(internal.filter((c) => !c.parent_id));
        setReplies(buildRepliesMap(internal));
      } catch (err) {
        console.error("CommentSection.refresh fatal", err);
      }
    }, [memoryId, buildRepliesMap]);

    // ✅ Hydration awal tetap dipertahankan
    useEffect(() => {
      if (!initialComments?.length) return;

      const internal: CommentShape[] = initialComments.map((c) => ({
        ...c,
        parent_id: (c as any).parent_id ?? null,
      }));

      setComments(internal.filter((c) => !c.parent_id));
      setReplies(buildRepliesMap(internal));
    }, [initialComments, buildRepliesMap]);

    // ✅ Kirim komentar utama
    const onSendComment = async () => {
      if (!modalText.trim()) return;
      setSending(true);

      await supabase.from("comments").insert({
        text: modalText,
        commenter: modalName || deviceIdentity,
        device_identity: deviceIdentity,
        memory_id: memoryId,
      });

      setSending(false);
      setModalText("");
      setModalName("");
      setModalOpen(false);
      refresh();
    };

    const onStartReply = (id: string) => {
      setReplyToId(id);
      setReplyText("");
      setReplyName("");
      setEditId(null);
      setEditText("");
    };

    const onCancelReply = () => {
      setReplyToId(null);
      setReplyText("");
      setReplyName("");
    };

    // ✅ Kirim reply
    const onSendReply = async (parentId: string, text: string, name?: string) => {
      if (!text.trim()) return;
      setSending(true);

      await supabase.from("reply_comments").insert({
        parent_comment_id: parentId,
        text,
        name: name?.trim() || deviceIdentity,
        device_identity: deviceIdentity,
      });

      setSending(false);
      setReplyToId(null);
      setReplyText("");
      setReplyName("");
      refresh();
    };

    const onStartEdit = (c: CommentShape) => {
      if (editId === c.id) {
        setEditId(null);
        setEditText("");
        return;
      }

      setEditId(c.id);
      setEditText(c.text);
      setReplyToId(null);
      setReplyText("");
      setReplyName("");
    };

    // ✅ Update parent / reply tetap aman
    const onUpdate = async (id: string, newText: string) => {
      if (!newText.trim()) return;
      setSending(true);

      const item =
        comments.find((c) => c.id === id) ||
        Object.values(replies).flat().find((r) => r.id === id);

      if (!item) {
        setSending(false);
        return;
      }

      if (item.parent_id) {
        await supabase.from("reply_comments").update({ text: newText }).eq("id", id);
      } else {
        await supabase.from("comments").update({ text: newText }).eq("id", id);
      }

      setSending(false);
      setEditId(null);
      setEditText("");
      refresh();
    };

    // ✅ Delete aman
    const onDelete = async (id: string, isParent?: boolean) => {
      setSending(true);

      if (isParent) {
        await supabase.from("reply_comments").delete().eq("parent_comment_id", id);
        await supabase.from("comments").delete().eq("id", id);
      } else {
        await supabase.from("reply_comments").delete().eq("id", id);
      }

      setSending(false);
      refresh();
    };

    return (
      <div className="space-y-3 mt-4">
        <h3 className="text-md font-semibold text-white">Komentar</h3>

        <CommentList
          comments={comments}
          replies={replies}
          deviceIdentity={deviceIdentity}
          onStartReply={onStartReply}
          onCancelReply={onCancelReply}
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

        <CommentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultName={deviceIdentity || "Anonim"}
          text={modalText}
          setText={setModalText}
          name={modalName}
          setName={setModalName}
          onSubmit={onSendComment}
          sending={sending}
        />
      </div>
    );
  }
);

CommentSection.displayName = "CommentSection";
export default CommentSection;
