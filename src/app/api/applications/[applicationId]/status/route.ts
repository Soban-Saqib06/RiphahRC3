import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, fail, handleError } from "@/lib/api";
import { UpdateApplicationStatusSchema } from "@/lib/features/applications/schema";
import {
  transitionStatus,
  toApplicationSummary,
  toStatusEventDTO,
} from "@/lib/features/applications/service";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ applicationId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) return auth.response;

    const { applicationId } = await context.params;
    const body = await request.json();

    // Specific check for INTERVIEW per docs/applications.md
    if (body?.status === "INTERVIEW") {
      return fail(
        "USE_INTERVIEW_SCHEDULING",
        "Schedule an interview to move this candidate to the interview stage.",
        400
      );
    }

    const validated = UpdateApplicationStatusSchema.parse(body);

    const { application, statusEvent } = await transitionStatus(
      applicationId,
      validated.status as any,
      {
        changedById: auth.user.id,
        note: validated.note || null,
      }
    );

    return ok({
      application: toApplicationSummary(application),
      statusEvent: toStatusEventDTO(statusEvent),
    });
  } catch (error) {
    return handleError(error);
  }
}
