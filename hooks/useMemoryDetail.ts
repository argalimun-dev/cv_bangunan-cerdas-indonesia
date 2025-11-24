"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CommentShape } from "@/types/comment";
import { MemoryShape } from "@/types/memory";

export default function useMemoryDetail(memoryId?: string) {
  const [memory, setMemory] = useState<MemoryShape | null>(null);
  const [comments, setComments] = useState<CommentShape[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memoryId) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch memory
      const { data: mem } = await supabase
        .from("memories")
        .select("*")
        .eq("id", memoryId)
        .single();
      setMemory(mem);

      // Fetch comments
      const { data: commentData } = await supabase
        .from("comments")
        .select("*")
        .eq("memory_id", memoryId)
        .order("created_at", { ascending: true });

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

      // Gabungkan comment + reply
      const allComments: CommentShape[] = [
        ...(commentData || []),
        ...(replies.map((r) => ({ ...r, parent_id: r.parent_comment_id })) || []),
      ];

      setComments(allComments);
      setLoading(false);
    };

    fetchData();
  }, [memoryId]);

  // Helper untuk update memory lokal tanpa fetch ulang
  const updateMemoryState = (updated: Partial<MemoryShape>) => {
    setMemory((prev) => prev ? { ...prev, ...updated } : prev);
  };

  return { memory, comments, loading, updateMemoryState };
}
