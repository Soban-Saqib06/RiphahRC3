import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import {
  GetQuestionsQuerySchema,
  CreateQuestionSchema,
} from "@/lib/features/questions/schema";
import {
  getQuestions,
  createQuestion,
} from "@/lib/features/questions/service";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const query = GetQuestionsQuerySchema.parse({
      applicationId: searchParams.get("applicationId") ?? "",
    });

    const questions = await getQuestions(query.applicationId);
    return ok({ questions });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const body = await req.json();
    const input = CreateQuestionSchema.parse(body);

    const question = await createQuestion(input);
    return ok({ question }, 201);
  } catch (error) {
    return handleError(error);
  }
}
