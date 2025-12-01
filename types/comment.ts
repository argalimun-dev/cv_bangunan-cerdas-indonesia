// types/comment.ts
export interface CommentShape {
  id: string;
  text: string;
  created_at: string;

  // scope data
  memory_id?: string | null; // ✅ PENTING (BARU)

  // komentar utama
  commenter?: string | null;

  // reply
  name?: string | null;

  // kepemilikan / device
  device_identity?: string | null;

  // relasi parent
  parent_id?: string | null;

  // field tambahan dari Supabase jika ada
  [key: string]: unknown;  // ✅ lebih aman daripada any
}
