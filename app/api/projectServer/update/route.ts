// app/api/projectServer/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateOgImageToSupabase } from "@/lib/generateOgImage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // ✅ Ambil FormData
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const uploader = formData.get("uploader") as string;
    const secretCode = formData.get("secretCode") as string | null;
    const file = formData.get("file") as File | null;

    if (!id || !uploader?.trim()) {
      return NextResponse.json({ error: "ID & uploader wajib diisi" }, { status: 400 });
    }

    // ✅ Validasi secret code
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

    // ✅ Ambil data lama
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

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const sanitizedName = `${Date.now()}-${file.name
        .toLowerCase()
        .replace(/[^a-z0-9.\-_]/g, "_")}`;
      const uploadPath = `uploads/${sanitizedName}`;

      // ✅ Hapus file lama jika ada
      const oldImagePath = oldData.image_url?.split("/storage/v1/object/public/images/")[1];
      if (oldImagePath) {
        await supabaseServer.storage.from("images").remove([oldImagePath]);
      }

      // ✅ Upload file baru
      await supabaseServer.storage.from("images").upload(uploadPath, buffer, {
        contentType: file.type,
      });

      const { data } = supabaseServer.storage.from("images").getPublicUrl(uploadPath);
      imageUrl = data.publicUrl;

      // ✅ Hapus OG lama & generate baru
      const oldOgPath = oldData.og_file_name?.split("/storage/v1/object/public/images/")[1];
      if (oldOgPath) {
        await supabaseServer.storage.from("images").remove([oldOgPath]);
      }

      ogImageUrl = await generateOgImageToSupabase(buffer, id);
    }

    // ✅ Update payload
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
