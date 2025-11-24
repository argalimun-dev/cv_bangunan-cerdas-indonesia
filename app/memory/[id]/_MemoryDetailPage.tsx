"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

import LeftColumn from "@/components/MemoryDetail/LeftColumn";
import RightColumn from "@/components/MemoryDetail/RightColumn";
import CommentSection, { CommentSectionRef } from "@/components/CommentSection";
import FullscreenViewer from "@/components/FullscreenViewer";
import DeleteModal from "@/components/DeleteModal";
import EditModal from "@/components/EditModal";

import useMemoryDetail from "@/hooks/useMemoryDetail";
import useDeviceIdentity from "@/hooks/useDeviceIdentity";
import useScrollLock from "@/hooks/useScrollLock";

import { deleteMemory, updateMemory } from "@/services/memoryService";
import type { MemoryShape } from "@/types/memory";

export default function MemoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memoryId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const commentRef = useRef<CommentSectionRef>(null);

  // Hooks
  const { memory, comments, loading } = useMemoryDetail(memoryId);
  const deviceIdentity = useDeviceIdentity();

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUploader, setEditUploader] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  useScrollLock(isFullscreen);

  // -------------------------
  // DELETE MEMORY
  // -------------------------
  const handleDelete = async () => {
    if (!memory) return;
    if (!secretCode.trim()) {
      alert("Masukkan kode rahasia!");
      return;
    }
    if (!confirm("⚠️ Yakin ingin menghapus Project ini?")) return;

    try {
      setDeleting(true);
      await deleteMemory(memory.id, secretCode);
      alert("Project berhasil dihapus!");
      router.push("/memory");
      router.refresh();
    } catch (err: any) {
      alert(`Kesalahan: ${err.message || "Gagal menghapus!"}`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setSecretCode("");
    }
  };

  // -------------------------
  // UPDATE MEMORY
  // -------------------------
  const handleUpdateMemory = async () => {
    if (!memory) return;

    try {
      setEditLoading(true);
      const updated = await updateMemory({
        id: memory.id,
        title: editTitle,
        description: editDescription,
        uploader: editUploader,
        file: editImageFile,
      });

      alert("Berhasil disimpan!");
      memory.title = updated.title;
      memory.description = updated.description;
      memory.uploader = updated.uploader;
      memory.image_url = updated.image_url;

      setShowEditModal(false);
    } catch (err: any) {
      alert(`Gagal menyimpan perubahan: ${err.message || ""}`);
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
      <div
        className="
          w-full max-w-[1400px] mx-auto
          px-4 sm:px-6 py-4
          text-slate-100
          grid grid-cols-1 md:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.7fr_1fr]
          gap-6 md:gap-10
          relative
          h-auto md:h-[calc(100vh-2rem)]   /* Mobile auto, desktop full viewport */
        "
      >
        {/* LEFT COLUMN */}
        <LeftColumn
          memory={memory}
          onFullscreen={() => setIsFullscreen(true)}
          onBack={() => router.push("/memory")}
        />

        {/* RIGHT COLUMN */}
        <div className="overflow-y-auto scrollbar-custom">
          <RightColumn
            memory={memory}
            comments={comments}
            deviceIdentity={deviceIdentity}
            commentRef={commentRef}
            onEdit={() => {
              setEditTitle(memory.title || "");
              setEditDescription(memory.description || "");
              setEditUploader(memory.uploader || "");
              setEditImageFile(null);
              setShowEditModal(true);
            }}
            onDelete={() => setShowDeleteModal(true)}
          />
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
