// services/memoryService.ts

export interface UpdateMemoryParams {
  id: string;
  title?: string;          // ✅ TIDAK WAJIB
  description?: string;    // ✅ TIDAK WAJIB
  uploader: string;
  file?: File | null;
}

// ================================
// UTIL: Safe ArrayBuffer → Base64
// ================================
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

// ================================
// DELETE MEMORY (client-safe)
// ================================
export async function deleteMemory(memoryId: string, secretCode: string) {
  if (!memoryId) throw new Error("Memory ID invalid");
  if (!secretCode?.trim()) throw new Error("Masukkan kode rahasia!");

  const res = await fetch("/api/memory/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memoryId, secretCode }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Gagal menghapus memory!");
  }

  return true;
}

// ================================
// UPDATE MEMORY (client-safe, final realtime)
// ================================
export async function updateMemory({
  id,
  title,
  description,
  uploader,
  file,
}: UpdateMemoryParams) {
  if (!id) throw new Error("Memory ID invalid");
  if (!uploader?.trim()) throw new Error("Uploader wajib diisi");

  let fileBase64: string | undefined;
  let fileName: string | undefined;
  let fileType: string | undefined;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    fileBase64 = arrayBufferToBase64(arrayBuffer);
    fileName = file.name;
    fileType = file.type;
  }

  // ✅ PAYLOAD AMAN: hanya kirim field yang ada
  const payload: any = {
    id,
    uploader,
  };

  if (title !== undefined) payload.title = title;
  if (description !== undefined) payload.description = description;
  if (fileBase64 && fileName && fileType) {
    payload.fileBase64 = fileBase64;
    payload.fileName = fileName;
    payload.fileType = fileType;
  }

  const res = await fetch("/api/memory/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Gagal memperbarui memory!");
  }

  // ✅ RETURN DATA TERBARU untuk langsung update state di frontend
  return await res.json(); // { ok: true, data: updatedMemory }
}
