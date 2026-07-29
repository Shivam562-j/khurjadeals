import { uploadImage } from "./cloudinary";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Validate and upload a File from a FormData field */
export async function handleImageUpload(
  file: File,
  folder: string = "khurjadeals"
): Promise<{ url: string; publicId: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`);
  }

  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_SIZE_MB) {
    throw new Error(`File too large. Max size: ${MAX_SIZE_MB}MB`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadImage(buffer, folder);
}

/** Upload multiple files, returns array of results */
export async function handleMultipleUploads(
  files: File[],
  folder: string = "khurjadeals"
): Promise<{ url: string; publicId: string }[]> {
  return Promise.all(files.map((f) => handleImageUpload(f, folder)));
}
