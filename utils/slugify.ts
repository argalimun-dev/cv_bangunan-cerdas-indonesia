// utils/slugify.ts
export function slugify(text?: string) {
  if (!text) return "project";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")     // hapus simbol
    .replace(/\s+/g, "-")         // spasi → dash
    .replace(/-+/g, "-");         // dash ganda
}
