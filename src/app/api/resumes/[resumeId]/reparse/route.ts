import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { parseStoredResume } from "@/lib/features/resumes/service";


export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ resumeId: string }> }
) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const { resumeId } = await context.params;
    const resume = await parseStoredResume(resumeId, auth.user.id);
    return ok({ resume });
  } catch (error) {
    return handleError(error);
  }
}
