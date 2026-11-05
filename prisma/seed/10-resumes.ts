import fs from "fs/promises";
import path from "path";
import { prisma } from "../../src/lib/db";
import { saveResumeFile } from "../../src/lib/files";
import { extractPdfText } from "../../src/lib/pdf";
import { parseStoredResume } from "../../src/lib/features/resumes/service";

const SEED_RESUMES = [
  { email: "candidate1@demo.example", file: "ethan-calder.pdf" },
  { email: "candidate2@demo.example", file: "priya-nandakumar.pdf" },
  { email: "candidate3@demo.example", file: "jonas-weber.pdf" },
  { email: "candidate4@demo.example", file: "lena-okafor.pdf" },
  { email: "candidate5@demo.example", file: "marco-silva.pdf" },
];

export default async function seedResumes(): Promise<void> {
  console.log("📄 Running 10-resumes.ts...");

  const assetsDir = path.join(process.cwd(), "seed-assets", "resumes");

  for (const item of SEED_RESUMES) {
    const user = await prisma.user.findUnique({
      where: { email: item.email },
      include: { candidateProfile: true },
    });

    if (!user || !user.candidateProfile) {
      console.warn(`⚠️ Candidate ${item.email} has no profile. Skipping resume.`);
      continue;
    }

    const filePath = path.join(assetsDir, item.file);
    const buffer = await fs.readFile(filePath);

    // 1. Save to storage
    const { storagePath, fileSizeBytes } = await saveResumeFile(buffer);

    // 2. Extract text
    let extractedText = "";
    try {
      extractedText = await extractPdfText(buffer);
    } catch (err) {
      console.warn(`⚠️ Could not extract text from ${item.file}:`, err);
    }

    // 3. Create initial Resume record
    const resume = await prisma.resume.create({
      data: {
        candidateId: user.candidateProfile.id,
        originalFileName: item.file,
        storagePath,
        fileSizeBytes,
        extractedText: extractedText || null,
        parseStatus: "PENDING",
      },
    });

    // 4. Best-effort AI parsing
    try {
      console.log(`🤖 Attempting AI parse for ${item.email} (${item.file})...`);
      const parsed = await parseStoredResume(resume.id);
      console.log(`   Status: ${parsed.parseStatus}`);
    } catch (aiErr: any) {
      console.warn(`   AI parsing deferred for ${item.email}: ${aiErr?.message || aiErr}`);
    }
  }

  console.log("✅ 10-resumes.ts seed completed.");
}
