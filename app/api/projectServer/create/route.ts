// app/api/projectServer/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateOgImageToSupabase } from "@/lib/generateOgImage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ✅ AMBIL FORM DATA (BUKAN JSON)
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const uploader = formData.get("uploader") as string;
    const secretCode = formData.get("secretCode") as string;

    const file = formData.get("file") as File | null;

    // ✅ Validasi parameter dasar
    if (!title?.trim() || !uploader?.trim()) {
      return NextResponse.json(
        { error: "Parameter tidak lengkap" },
        { status: 400 }
      );
    }

    // ✅ Validasi kode rahasia (SERVER)
    const { data: validCode } = await supabaseServer
      .from("access_codes")
      .select("id")
      .ilike("code", secretCode?.trim())
      .single();

    if (!validCode) {
      return NextResponse.json(
        { error: "Kode rahasia salah" },
        { status: 403 }
      );
    }

    let imageUrl: string | undefined;
    let ogImageUrl: string | undefined;
    let originalBuffer: Buffer | null = null;

    // ✅ PROSES FILE DARI FORM DATA
    if (file) {
      // ✅ Proteksi ulang ukuran di server (10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ukuran file terlalu besar (maks 10MB)" },
          { status: 413 }
        );
      }

      // ✅ Konversi File → Buffer
      const arrayBuffer = await file.arrayBuffer();
      originalBuffer = Buffer.from(arrayBuffer);

      const sanitizedName = `${Date.now()}-${file.name
        .toLowerCase()
        .replace(/[^a-z0-9.\-_]/g, "_")}`;

      const uploadPath = `uploads/${sanitizedName}`;

      const { error: uploadError } = await supabaseServer.storage
        .from("images")
        .upload(uploadPath, originalBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabaseServer.storage
        .from("images")
        .getPublicUrl(uploadPath);

      imageUrl = data.publicUrl;
    }

    // ✅ SIMPAN KE DATABASE
    const { data: insertedRows, error: insertError } =
      await supabaseServer
        .from("memories")
        .insert([{ title, description, uploader, image_url: imageUrl }])
        .select("id")
        .single();

    if (insertError || !insertedRows) throw insertError;

    const memoryId = insertedRows.id;

    // ✅ GENERATE OG IMAGE JIKA ADA FILE
    if (originalBuffer) {
      ogImageUrl = await generateOgImageToSupabase(
        originalBuffer,
        memoryId
      );

      await supabaseServer
        .from("memories")
        .update({ og_file_name: ogImageUrl })
        .eq("id", memoryId);
    }

    return NextResponse.json({
      ok: true,
      id: memoryId,
      image_url: imageUrl,
      og_image_url: ogImageUrl,
    });
  } catch (err: any) {
    console.error("MEMORY CREATE ERROR:", err);

    return NextResponse.json(
      { error: err?.message || "Gagal membuat Project" },
      { status: 500 }
    );
  }
}
