import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import {
  ListInterviewsQuerySchema,
  CreateInterviewSchema,
} from "@/lib/features/interviews/schema";
import {
  listInterviews,
  createInterview,
} from "@/lib/features/interviews/service";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const query = ListInterviewsQuerySchema.parse({
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      applicationId: searchParams.get("applicationId") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const interviews = await listInterviews(query);
    return ok({ interviews });
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
    const input = CreateInterviewSchema.parse(body);

    const result = await createInterview(auth.user, input);
    return ok(result, 201);
  } catch (error) {
    return handleError(error);
  }
}
