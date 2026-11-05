import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const RESUMES_DIR = path.join(process.cwd(), "storage", "resumes");

async function ensureResumesDir(): Promise<void> {
  await fs.mkdir(RESUMES_DIR, { recursive: true });
}

export async function saveResumeFile(
  buffer: Buffer
): Promise<{ storagePath: string; fileSizeBytes: number }> {
  await ensureResumesDir();
  const fileId = crypto.randomUUID();
  const fileName = `${fileId}.pdf`;
  const absolutePath = path.join(RESUMES_DIR, fileName);

  await fs.writeFile(absolutePath, buffer);

  return {
    storagePath: fileName,
    fileSizeBytes: buffer.length,
  };
}

export async function readResumeFile(storagePath: string): Promise<Buffer> {
  const safeName = path.basename(storagePath);
  const absolutePath = path.join(RESUMES_DIR, safeName);
  return await fs.readFile(absolutePath);
}
