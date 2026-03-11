"use server";

import path from "path";
import { getStore } from "@netlify/blobs";

export type UploadResult = { success: true; path: string } | { success: false; error: string };

export async function uploadImage(formData: FormData, fieldName = "image"): Promise<UploadResult> {
  const file = formData.get(fieldName);
  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowed.includes(file.type)) {
    return { success: false, error: "Invalid file type. Use JPEG, PNG, GIF or WebP." };
  }
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { success: false, error: "File too large. Max 5MB." };
  }
  const ext = path.extname(file.name) || ".jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
  const bytes = await file.arrayBuffer();

  const store = getStore({ name: "images", consistency: "strong" });
  await store.set(name, bytes, {
    metadata: { contentType: file.type },
  });

  // Serve via Next.js API route which reads from the blob store
  return { success: true, path: `/api/images/${name}` };
}
