import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/api";
import {
  processResumeFile,
  getResumesForCandidate,
} from "@/lib/features/resumes/service";


export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return fail("VALIDATION_ERROR", "Please provide a valid PDF file in the 'file' field.", 400);
    }

    const resume = await processResumeFile(auth.user.id, file);
    return ok({ resume }, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const resumes = await getResumesForCandidate(auth.user.id);
    return ok({ resumes });
  } catch (error) {
    return handleError(error);
  }
}
