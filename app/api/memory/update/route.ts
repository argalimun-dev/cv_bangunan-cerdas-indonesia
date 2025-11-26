import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { generateOgImageToSupabase } from "@/lib/generateOgImage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { id, title, description, uploader, fileBase64, fileName, fileType } = await req.json();

    if (!id || !uploader?.trim()) {
      return NextResponse.json({ error: "ID & uploader wajib diisi" }, { status: 400 });
    }

    const { data: oldData, error: oldError } = await supabase
      .from("memories")
      .select("title, description, image_url, og_file_name")
      .eq("id", id)
      .single();

    if (oldError || !oldData) return NextResponse.json({ error: "Memory tidak ditemukan" }, { status: 404 });

    let imageUrl: string | undefined = oldData.image_url;
    let ogImageUrl: string | undefined = oldData.og_file_name;

    // Upload image baru & regenerate OG
    if (fileBase64 && fileName && fileType) {
      const buffer = Buffer.from(fileBase64, "base64");
      const sanitizedName = `${Date.now()}-${fileName.toLowerCase().replace(/[^a-z0-9.\-_]/g, "_")}`;
      const uploadPath = `uploads/${sanitizedName}`;

      // Hapus image lama
      const oldImagePath = oldData.image_url?.split("/storage/v1/object/public/images/")[1];
      if (oldImagePath) await supabase.storage.from("images").remove([oldImagePath]);

      const { error: uploadError } = await supabase.storage.from("images").upload(uploadPath, buffer, { contentType: fileType, upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(uploadPath);
      imageUrl = data.publicUrl;

      // Hapus OG lama
      const oldOgPath = oldData.og_file_name?.split("/storage/v1/object/public/images/")[1];
      if (oldOgPath) await supabase.storage.from("images").remove([oldOgPath]);

      // Generate OG baru
      ogImageUrl = await generateOgImageToSupabase(buffer, id);
    }

    // Update memory (title & description optional)
    const updatePayload = {
      title: title?.trim() || oldData.title,
      description: description !== undefined ? description : oldData.description,
      uploader,
      image_url: imageUrl,
      og_file_name: ogImageUrl,
    };

    const { data: updatedMemory, error } = await supabase
      .from("memories")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, data: updatedMemory });
  } catch (err: any) {
    console.error("MEMORY UPDATE ERROR:", err);
    return NextResponse.json({ error: err.message || "Gagal update memory" }, { status: 500 });
  }
}
