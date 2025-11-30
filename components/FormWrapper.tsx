// components/FormWrapper.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  onSubmit?: () => void;
  size?: "sm" | "md" | "lg"; // preset size
  className?: string;
  maxHeight?: string; // optional max-height override
}

const SIZE_CLASSES = {
  sm: "p-3 gap-2",
  md: "p-4 gap-4",
  lg: "p-6 gap-6",
};

export function FormWrapper({
  children,
  onSubmit,
  size = "md",
  className = "",
  maxHeight,
}: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`card-base flex flex-col h-full rounded-xl overflow-hidden ${SIZE_CLASSES[size]} ${className}`}
      style={{ maxHeight: maxHeight || undefined }}
    >
      <div className="flex flex-col flex-1 gap-4 overflow-hidden">
        {children}
      </div>
    </form>
  );
}
