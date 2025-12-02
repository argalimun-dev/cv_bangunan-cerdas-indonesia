// services/projectService.ts

export interface UpdateMemoryParams {
  id: string;
  title?: string;          // ✅ opsional
  description?: string;    // ✅ opsional
  uploader: string;        // ✅ wajib
  file?: File | null;      // ✅ opsional
  secretCode?: string;     // ✅ opsional: bisa update tanpa kode rahasia
}

// ================================
// DELETE MEMORY (client-safe)
// ================================
export async function deleteMemory(memoryId: string, secretCode: string) {
  if (!memoryId) throw new Error("Project ID invalid");
  if (!secretCode?.trim()) throw new Error("Masukkan kode rahasia!");

  const res = await fetch("/api/projectServer/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memoryId, secretCode }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Gagal menghapus Project!");
  }

  return true;
}

// ================================
// UPDATE MEMORY (client-safe, FormData + ERROR INDICATOR)
// ================================
export async function updateMemory({
  id,
  title,
  description,
  uploader,
  file,
  secretCode,
}: UpdateMemoryParams) {
  if (!id) {
    return { ok: false, error: "Project ID invalid" };
  }

  if (!uploader?.trim()) {
    return { ok: false, error: "Uploader wajib diisi" };
  }

  const formData = new FormData();
  formData.append("id", id);
  formData.append("uploader", uploader);

  if (title !== undefined) formData.append("title", title);
  if (description !== undefined) formData.append("description", description);
  if (secretCode?.trim()) formData.append("secretCode", secretCode);
  if (file) formData.append("file", file);

  try {
    const res = await fetch("/api/projectServer/update", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: text || "Gagal memperbarui project",
        status: res.status,
      };
    }

    const json = await res.json();
    return { ok: true, data: json.data };

  } catch (err: any) {
    console.warn("UPDATE MEMORY NETWORK ERROR:", err);
    return {
      ok: false,
      error: "Koneksi internet terputus atau server tidak merespons",
    };
  }
}
