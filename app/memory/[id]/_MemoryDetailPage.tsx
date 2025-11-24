"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import CommentSection, { CommentSectionRef } from "@/components/CommentSection";
import FullscreenViewer from "@/components/FullscreenViewer";
import DeleteModal from "@/components/DeleteModal";
import EditModal from "@/components/EditModal";

// Safe UUID fallback
const safeUUID = () => {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {}
  return Math.random().toString(36).substring(2) + Date.now();
};

export default function MemoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memoryId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const commentRef = useRef<CommentSectionRef>(null);

  const [initialComments, setInitialComments] = useState<any[]>([]);
  const [deviceIdentity, setDeviceIdentity] = useState<string>("");

  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUploader, setEditUploader] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lock/unlock scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isFullscreen]);

  // Generate deviceIdentity safely
  useEffect(() => {
    try {
      let id = localStorage.getItem("deviceIdentity");
      if (!id) {
        id = safeUUID();
        localStorage.setItem("deviceIdentity", id);
      }
      setDeviceIdentity(id);
    } catch {
      setDeviceIdentity(safeUUID());
    }
  }, []);

  // Fetch memory + comments + reply_comments
  useEffect(() => {
    const fetchData = async () => {
      if (!memoryId) return;

      const { data: mem } = await supabase
        .from("memories")
        .select("*")
        .eq("id", memoryId)
        .single();
      setMemory(mem);

      const { data: comments } = await supabase
        .from("comments")
        .select("*")
        .eq("memory_id", memoryId)
        .order("created_at", { ascending: true });

      let replies: any[] = [];
      if (comments?.length) {
      const { data: replyData } = await supabase
        .from("reply_comments")
        .select("*")
        .in("parent_comment_id", comments.map((c: any) => c.id))
        .order("created_at", { ascending: true });

      replies = replyData || [];
      }

      // Gabungkan reply ke comments flat
      const allComments = [
        ...(comments || []),
        ...(replies?.map((r: any) => ({ ...r, parent_id: r.parent_comment_id })) || []),
      ];

      setInitialComments(allComments);
      setLoading(false);
    };

    fetchData();
  }, [memoryId]);

  // DELETE MEMORY
  const handleDelete = async () => {
    if (!secretCode.trim()) return alert("Masukkan kode rahasia!");
    if (!memory) return;

    if (!confirm("⚠️ Yakin ingin menghapus Project ini?")) return;

    try {
      setDeleting(true);

      const { data: validCode, error: codeErr } = await supabase
        .from("access_codes")
        .select("*")
        .ilike("code", secretCode.trim())
        .single();

      if (codeErr || !validCode) {
        alert("🚫 Kode rahasia salah!");
        setDeleting(false);
        return;
      }

      // Get comment IDs first
      const { data: commentRows } = await supabase
        .from("comments")
        .select("id")
        .eq("memory_id", memory.id);

      const commentIds = commentRows?.map((c: any) => c.id) || [];

      if (commentIds.length > 0) {
        await supabase
          .from("reply_comments")
          .delete()
          .in("parent_comment_id", commentIds);
      }

      await supabase.from("comments").delete().eq("memory_id", memory.id);
      
      // Delete image from storage
      const imagePath = memory.image_url?.split("/storage/v1/object/public/images/")[1];
      if (imagePath) await supabase.storage.from("images").remove([imagePath]);

      await supabase.from("memories").delete().eq("id", memory.id);

      alert("Project berhasil dihapus!");
      router.push("/memory");
      router.refresh();
    } catch {
      alert("Kesalahan saat menghapus!");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setSecretCode("");
    }
  };

  // UPDATE MEMORY
  const handleUpdateMemory = async () => {
    if (!memory) return;
    setEditLoading(true);

    try {
      // Validate file
      if (editImageFile) {
        if (!editImageFile.type.startsWith("image/")) {
          alert("Hanya file gambar yang diperbolehkan.");
          setEditLoading(false);
          return;
        }
        if (editImageFile.size > 5 * 1024 * 1024) {
          alert("Ukuran maksimal gambar adalah 5MB.");
          setEditLoading(false);
          return;
        }
      }

      let imageUrl = memory.image_url;

      if (editImageFile) {
        const oldPath = memory.image_url?.split("/storage/v1/object/public/images/")[1];
        const ext = editImageFile.name.split(".").pop();
        const fileName = `${memory.id}-${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, editImageFile, { upsert: true });
        if (uploadError) throw uploadError;

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;

        if (oldPath) await supabase.storage.from("images").remove([oldPath]).catch(() => {});
      }

      const { error } = await supabase
        .from("memories")
        .update({
          title: editTitle,
          description: editDescription,
          uploader: editUploader,
          image_url: imageUrl,
        })
        .eq("id", memory.id);

      if (error) throw error;

      setMemory({
        ...memory,
        title: editTitle,
        description: editDescription,
        uploader: editUploader,
        image_url: imageUrl,
      });

      alert("Berhasil disimpan!");
      setShowEditModal(false);
    } catch {
      alert("Gagal menyimpan perubahan.");
    } finally {
      setEditLoading(false);
      setEditImageFile(null);
    }
  };

  if (loading)
    return <p className="text-gray-200 p-6 max-w-3xl mx-auto">Loading...</p>;

  if (!memory)
    return (
      <p className="text-gray-200 p-6 max-w-3xl mx-auto">
        Memory tidak ditemukan.
      </p>
    );

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.7fr_1fr] gap-10 relative">
        {/* LEFT COLUMN — IMAGE */}
        <div className="space-y-4 md:pr-2">
          <button
            onClick={() => router.push("/memory")}
            className="text-sky-400 hover:underline"
          >
            ← Kembali ke Smart Project Wall
          </button>

          <div
            className="rounded-2xl bg-white/5 border border-white/10 cursor-zoom-in shadow-xl p-2 flex items-center justify-center"
            role="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Perbesar gambar"
          >
            <div
              className="
                w-full
                h-[330px]          /* ← HEIGHT FIXED (Mobile) */
                md:h-[410px]       /* ← FIXED HEIGHT TABLET */
                lg:h-[460px]       /* ← FIXED HEIGHT DESKTOP */
                xl:h-[510px]       /* ← FIXED HEIGHT LARGE DESKTOP */
                2xl:h-[550px]      /* ← Opsional monitor besar */
                overflow-hidden
                flex items-center justify-center
              "
            >
              <img
                loading="eager"
                src={memory.image_url}
                alt={memory.title || 'Gambar Project CV. Bangunan Cerdas Indonesia'}
                className="
                  object-contain
                  w-full
                  h-full
                  rounded-xl
                  bg-black/20
                  backdrop-blur-sm
                "
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — CONTENT */}
        <div className="flex flex-col h-full">
          <h1 className="text-3xl font-semibold text-white mb-3">{memory.title}</h1>
          <p className="text-gray-300 mb-6 leading-relaxed">{memory.description}</p>

          <div className="w-full flex flex-wrap justify-end gap-4 text-sm text-gray-300 items-center mb-6">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>
                {new Date(memory.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) || new Date(memory.created_at).toDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>👤</span>
              <span className="font-medium">{memory.uploader || "Anonim"}</span>
            </div>

            <button
              onClick={() => commentRef.current?.openModal()}
              className="hover:underline"
              aria-label="Buka komentar"
            >
              Komentar
            </button>

            <button
              onClick={() => {
                setEditTitle(memory.title || "");
                setEditDescription(memory.description || "");
                setEditUploader(memory.uploader || "");
                setEditImageFile(null);
                setShowEditModal(true);
              }}
              className="hover:underline text-sky-300"
              aria-label="Sunting project"
            >
              Sunting
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="hover:underline text-red-400"
              aria-label="Hapus project"
            >
              Hapus
            </button>
          </div>

          <hr className="border-gray-800 mb-4" />

          {/* COMMENT SECTION */}
          <CommentSection
            memoryId={memory.id}
            initialComments={initialComments} // sudah termasuk reply
            deviceIdentity={deviceIdentity}
            ref={commentRef}
          />

          <hr className="border-gray-800 mt-6" />
        </div>
      </div>

      {isFullscreen && (
        <FullscreenViewer
          imageUrl={memory.image_url}
          title={memory.title}
          onClose={() => setIsFullscreen(false)}
        />
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        secretCode={secretCode}
        setSecretCode={setSecretCode}
        loading={deleting}
        onCancel={() => {
          setShowDeleteModal(false);
          setSecretCode("");
        }}
        onConfirm={handleDelete}
      />

      <EditModal
        isOpen={showEditModal}
        title={editTitle}
        description={editDescription}
        uploader={editUploader}
        file={editImageFile}
        setTitle={setEditTitle}
        setDescription={setEditDescription}
        setUploader={setEditUploader}
        setFile={setEditImageFile}
        onCancel={() => {
          setShowEditModal(false);
          setEditImageFile(null);
        }}
        onSave={handleUpdateMemory}
        loading={editLoading}
      />
    </>
  );
}
