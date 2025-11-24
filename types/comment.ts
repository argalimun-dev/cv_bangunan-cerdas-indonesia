// src/types/comment.ts
export interface CommentShape {
  id: string;
  text: string;
  created_at: string;

  // untuk komentar utama
  commenter?: string | null;

  // untuk reply
  name?: string | null;

  // kepemilikan / device
  device_identity?: string | null;

  // parent_id opsional
  parent_id?: string | null;

  [key: string]: any; // fleksibel untuk field tambahan
}
