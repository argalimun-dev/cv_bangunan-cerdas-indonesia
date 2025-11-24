import { supabase } from "@/lib/supabaseClient";

export interface UpdateMemoryParams {
  id: string;
  title: string;
  description?: string;
  uploader?: string;
  file?: File | null;
}

export async function deleteMemory(memoryId: string, secretCode: string) {
  if (!secretCode.trim()) throw new Error("Masukkan kode rahasia!");
  if (!memoryId) throw new Error("Memory ID invalid");

  // Validasi secret code
  const { data: validCode, error: codeErr } = await supabase
    .from("access_codes")
    .select("*")
    .ilike("code", secretCode.trim())
    .single();

  if (codeErr || !validCode) {
    throw new Error("Kode rahasia salah!");
  }

  // Ambil comment IDs
  const { data: commentRows } = await supabase
    .from("comments")
    .select("id")
    .eq("memory_id", memoryId);

  const commentIds = commentRows?.map((c: any) => c.id) || [];

  // Delete reply_comments
  if (commentIds.length > 0) {
    await supabase.from("reply_comments").delete().in("parent_comment_id", commentIds);
  }

  // Delete comments
  await supabase.from("comments").delete().eq("memory_id", memoryId);

  // Delete memory image
  const { data: memData } = await supabase
    .from("memories")
    .select("image_url")
    .eq("id", memoryId)
    .single();

  const imagePath = memData?.image_url?.split("/storage/v1/object/public/images/")[1];
  if (imagePath) await supabase.storage.from("images").remove([imagePath]);

  // Delete memory row
  await supabase.from("memories").delete().eq("id", memoryId);
}

export async function updateMemory({ id, title, description, uploader, file }: UpdateMemoryParams) {
  if (!id) throw new Error("Memory ID invalid");

  // Ambil data lama
  const { data: oldMemory, error: oldErr } = await supabase
    .from("memories")
    .select("image_url")
    .eq("id", id)
    .single();
  if (oldErr) throw oldErr;

  let imageUrl = oldMemory?.image_url; // default: tetap pakai image lama

  if (file) {
    if (!file.type.startsWith("image/")) throw new Error("Hanya file gambar yang diperbolehkan.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Ukuran maksimal gambar adalah 5MB.");

    const oldPathRes = await supabase
      .from("memories")
      .select("image_url")
      .eq("id", id)
      .single();
    const oldPath = oldPathRes.data?.image_url?.split("/storage/v1/object/public/images/")[1];

    const ext = file.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file, { upsert: true });
    if (uploadError) throw uploadError;

    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;

    if (oldPath) await supabase.storage.from("images").remove([oldPath]).catch(() => {});
  }

  // Update memory
  const { error } = await supabase
    .from("memories")
    .update({
      title,
      description,
      uploader,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    })
    .eq("id", id);

  if (error) throw error;

  return {
    id,
    title,
    description,
    uploader,
    image_url: imageUrl,
  };
}
