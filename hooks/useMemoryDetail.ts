"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CommentShape } from "@/types/comment";
import { MemoryShape } from "@/types/memory";

export default function useMemoryDetail(memoryId?: string) {
  const [memory, setMemory] = useState<MemoryShape | null>(null);
  const [comments, setComments] = useState<CommentShape[]>([]);
  const [loading, setLoading] = useState(true);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // --------------------------------------------------
  // FETCH AWAL
  // --------------------------------------------------
  useEffect(() => {
    if (!memoryId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: mem, error: memError } = await supabase
          .from("memories")
          .select("*")
          .eq("id", memoryId)
          .single();

        if (memError) throw memError;
        setMemory(mem);

        const { data: commentData, error: commentError } = await supabase
          .from("comments")
          .select("*")
          .eq("memory_id", memoryId)
          .order("created_at", { ascending: true });

        if (commentError) throw commentError;

        let replies: CommentShape[] = [];
        if (commentData?.length) {
          const { data: replyData } = await supabase
            .from("reply_comments")
            .select("*")
            .in(
              "parent_comment_id",
              commentData.map((c) => c.id)
            )
            .order("created_at", { ascending: true });

          replies = replyData || [];
        }

        const allComments: CommentShape[] = [
          ...(commentData || []),
          ...(replies.map((r) => ({
            ...r,
            parent_id: r.parent_comment_id,
          })) || []),
        ];

        setComments(allComments);
      } catch (err) {
        console.error("❌ Gagal fetch memory detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memoryId]);

  // --------------------------------------------------
  // ✅ REALTIME
  // --------------------------------------------------
  useEffect(() => {
    if (!memoryId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`memory-${memoryId}`)

      // COMMENTS
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `memory_id=eq.${memoryId}`,
        },
        (payload) => {
          const newData = payload.new as CommentShape;

          setComments((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, newData];
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((c) =>
                c.id === newData.id ? newData : c
              );
            }

            if (payload.eventType === "DELETE" && payload.old?.id) {
              return prev.filter((c) => c.id !== payload.old.id);
            }

            return prev;
          });
        }
      )

      // REPLY COMMENTS
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reply_comments",
        },
        (payload) => {
          const newReply = payload.new as CommentShape;

          setComments((prev) => {
            if (payload.eventType === "INSERT") {
              return [
                ...prev,
                {
                  ...newReply,
                  parent_id: newReply.parent_comment_id,
                },
              ];
            }

            if (payload.eventType === "UPDATE") {
              return prev.map((c) =>
                c.id === newReply.id ? newReply : c
              );
            }

            if (payload.eventType === "DELETE" && payload.old?.id) {
              return prev.filter((c) => c.id !== payload.old.id);
            }

            return prev;
          });
        }
      )

      // MEMORY UPDATE
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "memories",
          filter: `id=eq.${memoryId}`,
        },
        (payload) => {
          setMemory(payload.new as MemoryShape);
        }
      )

      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [memoryId]);

  // --------------------------------------------------
  // Helper Update Lokal
  // --------------------------------------------------
  const updateMemoryState = (updated: Partial<MemoryShape>) => {
    setMemory((prev) =>
      prev ? { ...prev, ...updated } : prev
    );
  };

  return { memory, comments, loading, updateMemoryState };
}
