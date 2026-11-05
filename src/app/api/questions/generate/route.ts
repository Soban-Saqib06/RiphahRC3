import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { GenerateQuestionsSchema } from "@/lib/features/questions/schema";
import { generateQuestions } from "@/lib/features/questions/service";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const body = await req.json();
    const input = GenerateQuestionsSchema.parse(body);

    const questions = await generateQuestions(
      input.applicationId,
      input.count,
      input.replaceAiQuestions
    );

    return ok({ questions }, 201);
  } catch (error) {
    return handleError(error);
  }
}
