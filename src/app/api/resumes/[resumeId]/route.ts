import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import {
  getResumeForUser,
  updateCandidateResumeParsedData,
} from "@/lib/features/resumes/service";
import { PatchResumeSchema } from "@/lib/features/resumes/schema";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ resumeId: string }> }
) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    const { resumeId } = await context.params;
    const { searchParams } = new URL(req.url);
    const includeText = searchParams.get("includeText") === "true";

    const resume = await getResumeForUser(resumeId, auth.user, includeText);
    return ok({ resume });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ resumeId: string }> }
) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const { resumeId } = await context.params;
    const json = await req.json();
    const validated = PatchResumeSchema.parse(json);

    const resume = await updateCandidateResumeParsedData(
      resumeId,
      auth.user.id,
      validated.parsedData
    );

    return ok({ resume });
  } catch (err) {
    return handleError(err);
  }
}
