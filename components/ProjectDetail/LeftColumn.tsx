// components/ProjectDetail/LeftColumn.tsx
"use client";

import React from "react";
import type { ProjectShape } from "@/types/project";

interface Props {
  memory: ProjectShape;
  onFullscreen: () => void;
  onBack: () => void;
}

export default function LeftColumn({ memory, onFullscreen, onBack }: Props) {
  return (
    <div className="space-y-4 md:pr-2">
      <button
        onClick={onBack}
        className="text-sky-400 hover:underline"
      >
        ← Kembali ke Smart Project Wall
      </button>

      <div
        className="rounded-2xl bg-white/5 border border-white/10 cursor-zoom-in shadow-xl p-2 flex items-center justify-center"
        role="button"
        onClick={onFullscreen}
        aria-label="Perbesar gambar"
      >
        <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden">
          <img
            loading="eager"
            src={memory.image_url}
            alt={memory.title || "Gambar Project CV. Bangunan Cerdas Indonesia"}
            className="
              object-contain
              w-auto
              max-w-full
              max-h-[70vh]
              rounded-xl
              bg-black/20
              backdrop-blur-sm
            "
          />
        </div>
      </div>
    </div>
  );
}
