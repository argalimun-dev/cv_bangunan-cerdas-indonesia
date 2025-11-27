"use client";

import React from "react";
import CommentSection, { CommentSectionRef } from "@/components/CommentSection";
import type { MemoryShape } from "@/types/memory";

interface Props {
  memory: MemoryShape;
  comments: any[];
  deviceIdentity: string | null;
  commentRef: React.RefObject<CommentSectionRef>;

  onEdit: () => void;
  onDelete: () => void;
}

export default function RightColumn({
  memory,
  comments,
  deviceIdentity,
  commentRef,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className="
        flex flex-col
        h-auto
        overflow-visible
        scrollbar-custom
        scroll-smooth
        pr-2
        min-h-0
      "
    >
      <h1 className="text-3xl font-semibold text-white mb-3">
        {memory.title}
      </h1>

      <div className="flex flex-col overflow-visible min-h-0">
        {/* Deskripsi */}
        <div
          className="
            text-gray-300
            mb-4
            leading-relaxed
            text-justify
            max-h-[280px] sm:max-h-[320px] md:max-h-[360px] lg:max-h-[400px] xl:max-h-[450px]
            overflow-y-auto
            scrollbar-custom
            opacity-80
            hover:opacity-100
            transition-all duration-200
            whitespace-pre-line
            pr-6
          "
        >
          {memory.description}
        </div>

        {/* Metadata & tombol */}
        <div className="w-full flex flex-wrap justify-end gap-3 text-sm text-gray-300 items-center mb-3">
          <div className="flex items-center gap-2">
            <span>🗓️</span>
            <span>
              {new Date(memory.created_at).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>👤</span>
            <span className="font-medium">{memory.uploader || "Anonim"}</span>
          </div>

          <button onClick={() => commentRef.current?.openModal()} className="hover:underline">
            Komentar
          </button>

          <button onClick={onEdit} className="hover:underline text-sky-300">
            Sunting
          </button>

          <button onClick={onDelete} className="hover:underline text-red-400">
            Hapus
          </button>
        </div>

        {/* Comment Section */}
        <div className="max-h-[420px] overflow-y-auto scrollbar-custom px-2">
          <CommentSection
            memoryId={memory.id}
            initialComments={comments}
            deviceIdentity={deviceIdentity}
            ref={commentRef}
          />
        </div>
      </div>
    </div>
  );
}
