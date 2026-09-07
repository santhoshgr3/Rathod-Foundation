// ── Media upload → Supabase Storage ("media" bucket, public) ─────────────────
// Files are uploaded to storage and only the public URL is stored in the CMS
// tables. Falls back to inline base64 if the bucket is missing so the admin
// keeps working before the storage migration is applied.

import { supabase } from "./supabase";

const BUCKET = "media";

/** Largest file we will embed as base64 inside a CMS table row (storage down). */
const MAX_INLINE_BYTES = 4 * 1024 * 1024;

export type UploadResult = {
  url: string;
  /** true when stored inline as base64 because storage upload failed */
  inline: boolean;
};

/** MIME → file extension, used when the picked file has no usable extension. */
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

/** True for a stored value that should render as <video> rather than <img>. */
export function isVideoSrc(src: string): boolean {
  return src.startsWith("data:video") || /\.(mp4|webm|mov|m4v|avi|mkv)(\?|#|$)/i.test(src);
}

function extensionFor(file: File): string {
  const fromName = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (fromName && fromName.length <= 5 && fromName !== file.name.toLowerCase()) return fromName;
  return EXT_BY_TYPE[file.type] || (file.type.startsWith("video/") ? "mp4" : "jpg");
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

export async function uploadMedia(file: File): Promise<UploadResult> {
  if (!(file.type.startsWith("image/") || file.type.startsWith("video/"))) {
    throw new Error("Only image or video files can be uploaded.");
  }

  if (supabase) {
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type || undefined,
      upsert: false,
    });
    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { url: data.publicUrl, inline: false };
    }
    console.warn("[upload] storage upload failed, trying inline fallback:", error.message);

    // A permissions / auth failure won't be fixed by retrying inline — surface it.
    const msg = error.message.toLowerCase();
    if (msg.includes("row-level security") || msg.includes("unauthorized") || msg.includes("jwt")) {
      throw new Error("Upload rejected — your admin session may have expired. Sign out and back in, then try again.");
    }
  }

  // Inline fallback only for small files — large base64 blobs would bloat the DB.
  if (file.size > MAX_INLINE_BYTES) {
    throw new Error(
      `Upload failed and the file is too large (${(file.size / 1024 / 1024).toFixed(1)} MB) to store inline. ` +
      "Run the storage migration (supabase/migrations/20260710_storage_media.sql), or paste a hosted URL instead."
    );
  }
  return { url: await fileToDataURL(file), inline: true };
}
