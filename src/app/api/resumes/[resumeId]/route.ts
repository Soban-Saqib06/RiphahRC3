import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import {
  getResumeById,
  updateParsedResume,
} from "@/lib/features/resumes/service";
import { UpdateParsedResumeSchema } from "@/lib/features/resumes/schema";


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ resumeId: string }> }
) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    const { resumeId } = await context.params;
    const includeText = request.nextUrl.searchParams.get("includeText") === "true";

    const resume = await getResumeById(resumeId, auth.user, includeText);
    return ok({ resume });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ resumeId: string }> }
) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const { resumeId } = await context.params;
    const body = await request.json();
    const { parsedData } = UpdateParsedResumeSchema.parse(body);

    const resume = await updateParsedResume(resumeId, auth.user.id, parsedData);
    return ok({ resume });
  } catch (error) {
    return handleError(error);
  }
}
