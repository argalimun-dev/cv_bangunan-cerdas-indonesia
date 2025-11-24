"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CommentList from "./CommentList";
import CommentModal from "./CommentModal";
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
    const [replyText, setReplyText] = useState<string>("");
    const [replyName, setReplyName] = useState<string>("");

    const [editId, setEditId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalText, setModalText] = useState("");
    const [modalName, setModalName] = useState("");
    const [sending, setSending] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal() {
        setModalOpen(true);
      },
    }));

    const buildRepliesMap = (allComments: CommentShape[]) => {
      const map: Record<string, CommentShape[]> = {};
      allComments.forEach((c) => {
        if (c.parent_id) {
          if (!map[c.parent_id]) map[c.parent_id] = [];
          map[c.parent_id].push(c);
        }
      });
      return map;
    };

    const refresh = async () => {
      const { data: commentData } = await supabase
        .from("comments")
        .select("*")
        .eq("memory_id", memoryId)
        .order("created_at", { ascending: true });

      const { data: replyData } = await supabase
        .from("reply_comments")
        .select("*")
        .order("created_at", { ascending: true });

      const internalComments: CommentShape[] = [];

      commentData?.forEach((c: any) =>
        internalComments.push({ ...c, parent_id: null })
      );
      replyData?.forEach((r: any) =>
        internalComments.push({ ...r, parent_id: r.parent_comment_id, commenter: r.name })
      );

      setComments(internalComments.filter((c) => !c.parent_id));
      setReplies(buildRepliesMap(internalComments));
    };

    useEffect(() => {
      if (initialComments?.length) {
        const internal: CommentShape[] = initialComments.map((c) => ({
          ...c,
          parent_id: (c as any).parent_id ?? null,
        }));
        setComments(internal.filter((c) => !c.parent_id));
        setReplies(buildRepliesMap(internal));
      }
    }, [initialComments]);

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
      } else {
        setEditId(c.id);
        setEditText(c.text);
        setReplyToId(null);
        setReplyText("");
        setReplyName("");
      }
    };

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

        <div className="space-y-2">
          <CommentList
            comments={comments}
            replies={replies}
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
        </div>

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
