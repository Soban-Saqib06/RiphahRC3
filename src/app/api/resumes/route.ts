import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, fail, handleError, AppError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { processResumeFile, getCandidateResumes } from "@/lib/features/resumes/service";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: auth.user.id },
    });

    if (!profile) {
      throw new AppError("NOT_FOUND", "Candidate profile not found.", 404);
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return fail("VALIDATION_ERROR", "A valid PDF file is required.", 400, {
        file: "Please upload a file.",
      });
    }

    const blob = file as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resume = await processResumeFile(
      profile.id,
      (file as any).name || "resume.pdf",
      blob.type || "application/pdf",
      buffer
    );

    return ok({ resume }, 201);
  } catch (err) {
    return handleError(err);
  }
}

export async function GET() {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const resumes = await getCandidateResumes(auth.user.id);
    return ok({ resumes });
  } catch (err) {
    return handleError(err);
  }
}
