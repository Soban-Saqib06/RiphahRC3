import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { getSessionUser, requireUser } from "@/lib/auth";
import { CreateJobSchema, GetJobsQuerySchema } from "@/lib/features/jobs/schema";
import { createJob, listJobs } from "@/lib/features/jobs/service";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const { searchParams } = new URL(req.url);

    const query = GetJobsQuerySchema.parse({
      q: searchParams.get("q") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const jobs = await listJobs(user, query);
    return ok({ jobs });
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
    const validated = CreateJobSchema.parse(body);
    const job = await createJob(auth.user, validated);

    return ok({ job }, 201);
  } catch (error) {
    return handleError(error);
  }
}
