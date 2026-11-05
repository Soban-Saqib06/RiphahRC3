import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { UpdateInterviewSchema } from "@/lib/features/interviews/schema";
import { updateInterview } from "@/lib/features/interviews/service";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ interviewId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { interviewId } = await props.params;
    const body = await req.json();
    const input = UpdateInterviewSchema.parse(body);

    const interview = await updateInterview(interviewId, input);
    return ok({ interview });
  } catch (error) {
    return handleError(error);
  }
}
