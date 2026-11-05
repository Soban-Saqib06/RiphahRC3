import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError, AppError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { parseStoredResume, toResumeDTO } from "@/lib/features/resumes/service";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ resumeId: string }> }
) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const { resumeId } = await context.params;

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: { candidate: true },
    });

    if (!resume || resume.candidate.userId !== auth.user.id) {
      throw new AppError("NOT_FOUND", "Resume not found.", 404);
    }

    const updated = await parseStoredResume(resumeId);
    return ok({ resume: updated });
  } catch (err) {
    return handleError(err);
  }
}
