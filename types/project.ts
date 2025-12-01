// types/project.ts
export interface ProjectShape {
  id: string;
  title?: string;
  description?: string;
  uploader?: string;
  image_url?: string;
  file?: File;
  secretCode: string;
  og_file_name?: string;
  created_at?: string;
  [key: string]: any;
}
