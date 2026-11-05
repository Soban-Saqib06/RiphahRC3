import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import {
  getAssessmentForApplication,
  runAssessment,
} from "@/lib/features/assessments/service";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ applicationId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) return auth.response;

    const { applicationId } = await context.params;
    const assessment = await getAssessmentForApplication(applicationId);

    return ok({ assessment });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ applicationId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) return auth.response;

    const { applicationId } = await context.params;
    const assessment = await runAssessment(applicationId);

    return ok({ assessment }, 200);
  } catch (err) {
    return handleError(err);
  }
}
