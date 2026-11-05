import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { getSessionUser, requireUser } from "@/lib/auth";
import { UpdateJobSchema } from "@/lib/features/jobs/schema";
import { deleteJob, getJobById, updateJob } from "@/lib/features/jobs/service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const user = await getSessionUser();
    const result = await getJobById(jobId, user);
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { jobId } = await params;
    const body = await req.json();
    const validated = UpdateJobSchema.parse(body);
    const job = await updateJob(jobId, auth.user, validated);

    return ok({ job });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { jobId } = await params;
    const result = await deleteJob(jobId, auth.user);

    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
