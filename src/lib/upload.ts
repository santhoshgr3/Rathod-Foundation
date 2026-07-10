// ── Media upload → Supabase Storage ("media" bucket, public) ─────────────────
// Files are uploaded to storage and only the public URL is stored in the CMS
// tables. Falls back to inline base64 if the bucket is missing so the admin
// keeps working before the storage migration is applied.

import { supabase } from "./supabase";

const BUCKET = "media";

export type UploadResult = {
  url: string;
  /** true when stored inline as base64 because storage upload failed */
  inline: boolean;
};

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadMedia(file: File): Promise<UploadResult> {
  if (supabase) {
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type || undefined,
    });
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { url: data.publicUrl, inline: false };
    }
    console.warn("[upload] storage upload failed, falling back to inline base64:", error.message);
  }
  // Inline fallback only for small files — large base64 blobs would bloat the DB
  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Storage upload failed and the file is too large to store inline. Run the storage migration (supabase/migrations/20260710_storage_media.sql) to enable uploads up to 200 MB.");
  }
  return { url: await fileToDataURL(file), inline: true };
}
