import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { generateOgImageToSupabase } from "@/lib/generateOgImage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const {
      id,
      title,
      description,
      uploader,
      fileBase64,
      fileName,
      fileType,
    } = await req.json();

    // ✅ VALIDASI MINIMAL (title TIDAK lagi wajib)
    if (!id || !uploader?.trim()) {
      return NextResponse.json(
        { error: "ID & uploader wajib diisi" },
        { status: 400 }
      );
    }

    // ✅ AMBIL DATA LAMA LENGKAP (untuk fallback)
    const { data: oldData, error: oldError } = await supabase
      .from("memories")
      .select("title, description, image_url, og_file_name")
      .eq("id", id)
      .single();

    if (oldError || !oldData) {
      return NextResponse.json(
        { error: "Memory tidak ditemukan" },
        { status: 404 }
      );
    }

    let imageUrl: string | undefined = oldData.image_url;
    let ogImageUrl: string | undefined = oldData.og_file_name;

    // ===== JIKA ADA FILE BARU =====
    if (fileBase64 && fileName && fileType) {
      const buffer = Buffer.from(fileBase64, "base64");

      const sanitizedName = `${Date.now()}-${fileName
        .toLowerCase()
        .replace(/[^a-z0-9.\-_]/g, "_")}`;

      const uploadPath = `uploads/${sanitizedName}`;

      // HAPUS IMAGE LAMA
      const oldImagePath = oldData.image_url?.split(
        "/storage/v1/object/public/images/"
      )[1];

      if (oldImagePath) {
        await supabase.storage.from("images").remove([oldImagePath]);
      }

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(uploadPath, buffer, {
          contentType: fileType,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(uploadPath);

      imageUrl = data.publicUrl;

      // HAPUS OG LAMA
      const oldOgPath = oldData.og_file_name?.split(
        "/storage/v1/object/public/images/"
      )[1];

      if (oldOgPath) {
        await supabase.storage.from("images").remove([oldOgPath]);
      }

      // ✅ REGENERATE OG & UPLOAD KE SUPABASE
      ogImageUrl = await generateOgImageToSupabase(buffer, id);
    }

    // ✅ PAYLOAD FINAL (TITLE & DESCRIPTION AMAN)
    const updatePayload = {
      title: title?.trim() || oldData.title,
      description:
        description !== undefined
          ? description
          : oldData.description,
      uploader,
      image_url: imageUrl,
      og_file_name: ogImageUrl,
    };

    // ✅ UPDATE + RETURN DATA TERBARU
    const { data: updatedMemory, error } = await supabase
      .from("memories")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      data: updatedMemory, // ✅ FRONTEND BISA LANGSUNG setState
    });
  } catch (err: any) {
    console.error("MEMORY UPDATE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Gagal update memory" },
      { status: 500 }
    );
  }
}
