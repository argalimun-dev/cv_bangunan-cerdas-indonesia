// src/types/memory.ts

export interface MemoryShape {
  id: string;
  title: string;
  description?: string;
  uploader?: string;
  image_url?: string;
  created_at?: string;
  [key: string]: any;
}
