// app/api/projectServer/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateOgImageToSupabase } from "@/lib/generateOgImage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { id, title, description, uploader, fileBase64, fileName, fileType, secretCode } =
      await req.json();

    if (!id || !uploader?.trim()) {
      return NextResponse.json({ error: "ID & uploader wajib diisi" }, { status: 400 });
    }

    // ✅ VALIDASI SECRET CODE (baru ditambahkan)
    if (!secretCode?.trim()) {
      return NextResponse.json({ error: "Masukkan kode rahasia" }, { status: 403 });
    }

    const { data: validCode } = await supabaseServer
      .from("access_codes")
      .select("id")
      .ilike("code", secretCode.trim())
      .single();

    if (!validCode) {
      return NextResponse.json({ error: "Kode rahasia salah" }, { status: 403 });
    }

    const { data: oldData } = await supabaseServer
      .from("memories")
      .select("title, description, image_url, og_file_name")
      .eq("id", id)
      .single();

    if (!oldData) {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    }

    let imageUrl = oldData.image_url;
    let ogImageUrl = oldData.og_file_name;

    if (fileBase64 && fileName && fileType) {
      const buffer = Buffer.from(fileBase64, "base64");
      const sanitizedName = `${Date.now()}-${fileName
        .toLowerCase()
        .replace(/[^a-z0-9.\-_]/g, "_")}`;
      const uploadPath = `uploads/${sanitizedName}`;

      const oldImagePath = oldData.image_url?.split("/storage/v1/object/public/images/")[1];
      if (oldImagePath) {
        await supabaseServer.storage.from("images").remove([oldImagePath]);
      }

      await supabaseServer.storage.from("images").upload(uploadPath, buffer, {
        contentType: fileType,
      });

      const { data } = supabaseServer.storage
        .from("images")
        .getPublicUrl(uploadPath);

      imageUrl = data.publicUrl;

      const oldOgPath = oldData.og_file_name?.split(
        "/storage/v1/object/public/images/"
      )[1];
      if (oldOgPath) {
        await supabaseServer.storage.from("images").remove([oldOgPath]);
      }

      ogImageUrl = await generateOgImageToSupabase(buffer, id);
    }

    const updatePayload = {
      title: title?.trim() || oldData.title,
      description: description ?? oldData.description,
      uploader,
      image_url: imageUrl,
      og_file_name: ogImageUrl,
    };

    const { data: updatedMemory } = await supabaseServer
      .from("memories")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    return NextResponse.json({ ok: true, data: updatedMemory });
  } catch (err: any) {
    console.error("MEMORY UPDATE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Gagal update Project" },
      { status: 500 }
    );
  }
}
