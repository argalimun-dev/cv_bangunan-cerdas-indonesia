import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { memoryId, secretCode } = await req.json();

    if (!memoryId || !secretCode?.trim()) {
      return NextResponse.json(
        { error: "Memory ID atau kode rahasia hilang" },
        { status: 400 }
      );
    }

    // ===== VALIDASI KODE =====
    const { data: validCode, error: codeErr } = await supabase
      .from("access_codes")
      .select("id")
      .ilike("code", secretCode.trim())
      .single();

    if (codeErr || !validCode)
      return NextResponse.json(
        { error: "Kode rahasia salah" },
        { status: 403 }
      );

    // ===== HAPUS KOMENTAR + REPLY =====
    const { data: commentRows } = await supabase
      .from("comments")
      .select("id")
      .eq("memory_id", memoryId);

    const commentIds = commentRows?.map((c: any) => c.id) || [];

    if (commentIds.length > 0) {
      await supabase
        .from("reply_comments")
        .delete()
        .in("parent_comment_id", commentIds);
    }

    await supabase.from("comments").delete().eq("memory_id", memoryId);

    // ===== AMBIL IMAGE + OG URL =====
    const { data: memData } = await supabase
      .from("memories")
      .select("image_url, og_file_name")
      .eq("id", memoryId)
      .single();

      if (!memData) {
        return NextResponse.json(
          { error: "Memory tidak ditemukan" },
          { status: 404 }
        );
      }

    // ===== HAPUS IMAGE ASLI =====
    const imagePath = memData?.image_url?.split(
      "/storage/v1/object/public/images/"
    )[1];

    if (imagePath) {
      await supabase.storage.from("images").remove([imagePath]);
    }

    // ===== HAPUS OG DI SUPABASE =====
    const ogPath = memData?.og_file_name?.split(
      "/storage/v1/object/public/images/"
    )[1];

    if (ogPath) {
      await supabase.storage.from("images").remove([ogPath]);
    }

    // ===== HAPUS MEMORY =====
    await supabase.from("memories").delete().eq("id", memoryId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("MEMORY DELETE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menghapus memory" },
      { status: 500 }
    );
  }
}
