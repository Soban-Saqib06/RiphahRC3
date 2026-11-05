import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { overrideAssessment } from "@/lib/features/assessments/service";
import { OverrideAssessmentSchema } from "@/lib/features/assessments/schema";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ applicationId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) return auth.response;

    const { applicationId } = await context.params;
    const json = await req.json();
    const validated = OverrideAssessmentSchema.parse(json);

    const assessment = await overrideAssessment(
      applicationId,
      auth.user,
      validated
    );

    return ok({ assessment });
  } catch (err) {
    return handleError(err);
  }
}
