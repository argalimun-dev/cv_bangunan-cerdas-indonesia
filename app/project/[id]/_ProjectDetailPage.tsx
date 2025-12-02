// app/project/[id]/_ProjectDetailPage.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import LeftColumn from "@/components/ProjectDetail/LeftColumn";
import RightColumn from "@/components/ProjectDetail/RightColumn";
import CommentSection, { CommentSectionRef } from "@/components/HandleComments/CommentSection";
import FullscreenViewer from "@/components/FullscreenViewer";
import DeleteModal from "@/components/Modals/DeleteModal";
import EditModal from "@/components/Modals/EditModal";

import useProjectDetail from "@/hooks/useProjectDetail";
import useDeviceIdentity from "@/hooks/useDeviceIdentity";
import useScrollLock from "@/hooks/useScrollLock";

import { deleteMemory, updateMemory } from "@/services/projectService";

interface ProjectDetailPageProps {
  id: string;
}

export default function ProjectDetailPage({ id }: ProjectDetailPageProps) {
  const router = useRouter();
  const memoryId = id;

  const commentRef = useRef<CommentSectionRef>(null);

  const { memory, comments, loading, updateMemoryState } = useProjectDetail(memoryId);
  const deviceIdentity = useDeviceIdentity();

  // ----------------------
  // Modal States
  // ----------------------
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

  // ----------------------
  // DELETE MEMORY
  // ----------------------
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
      router.push("/project");
      router.refresh();
    } catch (err: any) {
      alert(`Kesalahan: ${err.message || "Gagal menghapus!"}`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setSecretCode("");
    }
  };

  // ----------------------
  // UPDATE MEMORY (FINAL REALTIME) dengan Secret Code
  // ----------------------
 const handleUpdateMemory = async (secretCode: string) => {
  if (!memory) return;

  if (!secretCode.trim()) {
    alert("Masukkan kode rahasia!");
    return;
  }

  setEditLoading(true);

  const result = await updateMemory({
    id: memory.id,
    title: editTitle,
    description: editDescription,
    uploader: editUploader,
    file: editImageFile,
    secretCode,
  });

  if (!result.ok) {
    alert(result.error || "Gagal menyimpan perubahan");
    setEditLoading(false);
    return;
  }

  alert("Berhasil disimpan!");
  updateMemoryState(result.data);
  setShowEditModal(false);
  setEditLoading(false);
};

  if (loading)
    return <p className="text-gray-200 p-6 max-w-3xl mx-auto">Memuat Detail Project...</p>;

  if (!memory)
    return (
      <p className="text-gray-200 p-6 max-w-3xl mx-auto">
        Project tidak ditemukan.
      </p>
    );

  return (
    <>
      <div className="w-full pt-2 pb-4 px-1 sm:pt-8 sm:pb-6 sm:px-1 md:pt-8 md:pb-8 md:pr-1 md:pl-2 text-slate-100 grid grid-cols-1 md:grid-cols-[1.4fr_0.5fr] xl:grid-cols-[1.7fr_1fr] gap-y-4 gap-x-1 md:gap-y-8 md:gap-x-10 relative h-auto min-h-0">
        {/* LEFT COLUMN */}
        <div className="pt-2 pb-2 pr-2 pl-2 md:pb-2">
          <LeftColumn
            memory={memory}
            onFullscreen={() => setIsFullscreen(true)}
            onBack={() => router.push("/project")}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="pt-2 pb-2 pr-0 pl-2 overflow-y-auto scrollbar-custom min-h-0">
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

      {/* DELETE MODAL */}
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

      {/* EDIT MODAL dengan Secret Code */}
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
        onSave={handleUpdateMemory} // ✅ sekarang menerima secretCode dari modal
        loading={editLoading}
      />
    </>
  );
}
