import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { UpdateQuestionSchema } from "@/lib/features/questions/schema";
import {
  updateQuestion,
  deleteQuestion,
} from "@/lib/features/questions/service";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ questionId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { questionId } = await props.params;
    const body = await req.json();
    const input = UpdateQuestionSchema.parse(body);

    const question = await updateQuestion(questionId, input);
    return ok({ question });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ questionId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { questionId } = await props.params;
    const result = await deleteQuestion(questionId);
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
