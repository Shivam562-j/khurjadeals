import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

/** Upload a file buffer to Cloudinary */
export async function uploadImage(
  buffer: Buffer,
  folder: string = "khurjadeals"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Extract Cloudinary public_id from a Cloudinary URL or raw public ID.
 * Handles:
 * - Direct public_id: "khurjadeals/sample" -> "khurjadeals/sample"
 * - Standard URL: https://res.cloudinary.com/<cloud>/image/upload/v1234567/khurjadeals/sample.jpg -> "khurjadeals/sample"
 * - Transformed URL: https://res.cloudinary.com/<cloud>/image/upload/c_scale,w_500/v1234567/khurjadeals/sample.webp -> "khurjadeals/sample"
 * - Nested folders: https://res.cloudinary.com/<cloud>/image/upload/v1234567/khurjadeals/cars/sedan.jpg -> "khurjadeals/cars/sedan"
 * Returns null if not a Cloudinary asset.
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // If already a relative public ID (doesn't start with http/https)
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    const dotIndex = trimmed.lastIndexOf(".");
    return dotIndex !== -1 ? trimmed.substring(0, dotIndex) : trimmed;
  }

  // Check if it is a Cloudinary URL
  if (!trimmed.includes("cloudinary.com")) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    const pathname = parsed.pathname;
    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const afterUpload = pathname.substring(uploadIndex + "/upload/".length);
    const segments = afterUpload.split("/");

    let startIndex = 0;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (/^v\d+$/.test(seg)) {
        startIndex = i + 1;
        break;
      }
      const hasVersionLater = segments.slice(i + 1).some((s) => /^v\d+$/.test(s));
      if (hasVersionLater) {
        continue;
      } else {
        if (seg.includes(",") || /^(c|w|h|q|f|b|g|e|r|a|co|fl|pg)_[a-zA-Z0-9_]+$/.test(seg)) {
          startIndex = i + 1;
        } else {
          startIndex = i;
          break;
        }
      }
    }

    const publicIdWithExt = segments.slice(startIndex).join("/");
    if (!publicIdWithExt) return null;

    const lastDot = publicIdWithExt.lastIndexOf(".");
    const publicId = lastDot !== -1 ? publicIdWithExt.substring(0, lastDot) : publicIdWithExt;

    return decodeURIComponent(publicId);
  } catch (err) {
    console.error("Error parsing Cloudinary URL:", url, err);
    return null;
  }
}

/** Delete a single image from Cloudinary by publicId or URL */
export async function deleteImage(publicIdOrUrl: string): Promise<boolean> {
  const publicId = extractPublicIdFromUrl(publicIdOrUrl) || publicIdOrUrl;
  if (!publicId) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res?.result === "ok" || res?.result === "not found";
  } catch (err) {
    console.error("Failed to delete Cloudinary image:", publicId, err);
    return false;
  }
}

/**
 * Delete multiple images from Cloudinary given an array of URLs or public IDs.
 * Automatically extracts valid public IDs, batches them in chunks of 100, and cleans them up.
 */
export async function deleteImagesByUrls(
  urls: (string | undefined | null)[]
): Promise<{ deleted: number; failed: number }> {
  if (!Array.isArray(urls) || urls.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const validPublicIds = urls
    .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    .map(extractPublicIdFromUrl)
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  if (validPublicIds.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const uniqueIds = Array.from(new Set(validPublicIds));

  let deleted = 0;
  let failed = 0;

  // Cloudinary delete_resources supports up to 100 per chunk
  const chunkSize = 100;
  for (let i = 0; i < uniqueIds.length; i += chunkSize) {
    const chunk = uniqueIds.slice(i, i + chunkSize);
    try {
      if (chunk.length === 1) {
        const res = await cloudinary.uploader.destroy(chunk[0]);
        if (res?.result === "ok" || res?.result === "not found") {
          deleted++;
        } else {
          failed++;
        }
      } else {
        const res = await cloudinary.api.delete_resources(chunk);
        const resDeleted = res?.deleted || {};
        deleted += Object.keys(resDeleted).length;
      }
    } catch (err) {
      console.error("Cloudinary batch deletion error, falling back to individual deletes:", err);
      const settled = await Promise.allSettled(
        chunk.map((id) => cloudinary.uploader.destroy(id))
      );
      for (const s of settled) {
        if (s.status === "fulfilled") deleted++;
        else failed++;
      }
    }
  }

  return { deleted, failed };
}

/**
 * Delete all resources in Cloudinary under a prefix or folder (defaults to 'khurjadeals').
 * Used when dropping or resetting database assets.
 */
export async function deleteCloudinaryFolder(
  prefix: string = "khurjadeals"
): Promise<{ totalDeleted: number }> {
  let nextCursor: string | undefined = undefined;
  let totalDeleted = 0;

  const cleanPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;

  try {
    do {
      const response: any = await cloudinary.api.delete_resources_by_prefix(cleanPrefix, {
        next_cursor: nextCursor,
      });

      if (response?.deleted) {
        totalDeleted += Object.keys(response.deleted).length;
      }
      nextCursor = response?.next_cursor;
    } while (nextCursor);

    // Also attempt to delete the folder itself
    try {
      await cloudinary.api.delete_folder(prefix);
    } catch {
      // Ignored if folder is not empty or doesn't exist
    }
  } catch (err) {
    console.error("Failed to delete Cloudinary resources by prefix:", err);
  }

  return { totalDeleted };
}
