// app/api/projectServer/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { memoryId, secretCode } = await req.json();

    if (!memoryId || !secretCode?.trim()) {
      return NextResponse.json(
        { error: "Project ID atau kode rahasia hilang" },
        { status: 400 }
      );
    }

    const { data: validCode } = await supabaseServer
      .from("access_codes")
      .select("id")
      .ilike("code", secretCode.trim())
      .single();

    if (!validCode) {
      return NextResponse.json({ error: "Kode rahasia salah" }, { status: 403 });
    }

    const { data: commentRows } = await supabaseServer
      .from("comments")
      .select("id")
      .eq("memory_id", memoryId);

    const commentIds = commentRows?.map((c) => c.id) || [];

    if (commentIds.length > 0) {
      await supabaseServer
        .from("reply_comments")
        .delete()
        .in("parent_comment_id", commentIds);
    }

    await supabaseServer.from("comments").delete().eq("memory_id", memoryId);

    const { data: memData } = await supabaseServer
      .from("memories")
      .select("image_url, og_file_name")
      .eq("id", memoryId)
      .single();

    if (!memData) {
      return NextResponse.json({ error: "Project tidak ditemukan" }, { status: 404 });
    }

    const imagePath = memData.image_url?.split(
      "/storage/v1/object/public/images/"
    )[1];
    if (imagePath) {
      await supabaseServer.storage.from("images").remove([imagePath]);
    }

    const ogPath = memData.og_file_name?.split(
      "/storage/v1/object/public/images/"
    )[1];
    if (ogPath) {
      await supabaseServer.storage.from("images").remove([ogPath]);
    }

    await supabaseServer.from("memories").delete().eq("id", memoryId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("MEMORY DELETE ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menghapus Project" },
      { status: 500 }
    );
  }
}
