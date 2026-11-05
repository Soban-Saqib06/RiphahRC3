import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "resumes");

/**
 * Ensure the local resume storage directory exists.
 */
async function ensureStorageDir(): Promise<void> {
  await fs.mkdir(STORAGE_ROOT, { recursive: true });
}

/**
 * Save a resume PDF buffer to disk in storage/resumes/<uuid>.pdf.
 * Returns the relative storage path and file size in bytes.
 */
export async function saveResumeFile(
  buffer: Buffer
): Promise<{ storagePath: string; fileSizeBytes: number }> {
  await ensureStorageDir();
  const fileId = crypto.randomUUID();
  const fileName = `${fileId}.pdf`;
  const absolutePath = path.join(STORAGE_ROOT, fileName);

  await fs.writeFile(absolutePath, buffer);

  return {
    storagePath: fileName,
    fileSizeBytes: buffer.length,
  };
}

/**
 * Read a stored resume file by its relative storage path.
 */
export async function readResumeFile(storagePath: string): Promise<Buffer> {
  // Prevent directory traversal
  const safeName = path.basename(storagePath);
  const absolutePath = path.join(STORAGE_ROOT, safeName);
  return await fs.readFile(absolutePath);
}
