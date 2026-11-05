import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { prisma } from "../src/lib/db";

async function wipeDatabase(): Promise<void> {
  console.log("🧹 Wiping tables in foreign-key safe order...");

  await prisma.assessmentItem.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.interviewQuestion.deleteMany({});
  await prisma.interview.deleteMany({});
  await prisma.applicationStatusEvent.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.jobSkill.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.candidateProfile.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✨ All tables wiped clean.");
}

async function runSeeders(): Promise<void> {
  const seedDir = path.join(__dirname, "seed");

  if (!fs.existsSync(seedDir)) {
    console.log("No prisma/seed directory found.");
    return;
  }

  const seedFiles = fs
    .readdirSync(seedDir)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  console.log(`Found ${seedFiles.length} seed file(s): ${seedFiles.join(", ")}`);

  for (const file of seedFiles) {
    const fullPath = path.join(seedDir, file);
    console.log(`➡️  Running seed: ${file}`);
    const module = await import(fullPath);
    const seeder = module.default;

    if (typeof seeder === "function") {
      await seeder();
    } else {
      console.warn(`⚠️  Seed file ${file} does not have a default export function.`);
    }
  }
}

async function main(): Promise<void> {
  try {
    await wipeDatabase();
    await runSeeders();
    console.log("🎉 Seed finished successfully!");
  } catch (error) {
    console.error("❌ Seed failed with error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
