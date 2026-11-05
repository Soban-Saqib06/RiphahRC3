import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { UpdateRecruiterNotesSchema } from "@/lib/features/applications/schema";
import { updateRecruiterNotes } from "@/lib/features/applications/service";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ applicationId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) return auth.response;

    const { applicationId } = await context.params;
    const body = await request.json();
    const validated = UpdateRecruiterNotesSchema.parse(body);

    const updated = await updateRecruiterNotes(
      applicationId,
      validated.recruiterNotes ?? null
    );

    return ok({ application: updated });
  } catch (error) {
    return handleError(error);
  }
}
