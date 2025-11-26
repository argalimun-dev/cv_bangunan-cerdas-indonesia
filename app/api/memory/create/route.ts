import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { generateOgImageToSupabase } from "@/lib/generateOgImage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { title, description, uploader, fileBase64, fileName, fileType, secretCode } = await req.json();

    if (!title?.trim() || !uploader?.trim()) {
      return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
    }

    // Validasi kode rahasia
    const { data: validCode, error: codeErr } = await supabase
      .from("access_codes")
      .select("id")
      .ilike("code", secretCode?.trim())
      .single();

    if (codeErr || !validCode) {
      return NextResponse.json({ error: "Kode rahasia salah" }, { status: 403 });
    }

    let imageUrl: string | undefined;
    let ogImageUrl: string | undefined;
    let originalBuffer: Buffer | null = null;

    if (fileBase64 && fileName && fileType) {
      originalBuffer = Buffer.from(fileBase64, "base64");
      const sanitizedName = `${Date.now()}-${fileName.toLowerCase().replace(/[^a-z0-9.\-_]/g, "_")}`;
      const uploadPath = `uploads/${sanitizedName}`;

      const { error: uploadError } = await supabase.storage.from("images").upload(uploadPath, originalBuffer, { contentType: fileType, upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("images").getPublicUrl(uploadPath);
      imageUrl = data.publicUrl;
    }

    // Insert memory
    const { data: insertedRows, error: insertErr } = await supabase
      .from("memories")
      .insert([{ title, description, uploader, image_url: imageUrl }])
      .select("id")
      .single();

    if (insertErr || !insertedRows?.id) throw insertErr;
    const memoryId = insertedRows.id;

    // Generate OG jika ada image
    if (originalBuffer) {
      ogImageUrl = await generateOgImageToSupabase(originalBuffer, memoryId);
      await supabase.from("memories").update({ og_file_name: ogImageUrl }).eq("id", memoryId);
    }

    return NextResponse.json({ ok: true, id: memoryId, image_url: imageUrl, og_image_url: ogImageUrl });
  } catch (err: any) {
    console.error("MEMORY CREATE ERROR:", err);
    return NextResponse.json({ error: err.message || "Gagal membuat memory" }, { status: 500 });
  }
}
