import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { ComparisonQuerySchema } from "@/lib/features/comparison/schema";
import { getComparisonData } from "@/lib/features/comparison/service";


export async function GET(req: NextRequest) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const query = ComparisonQuerySchema.parse({
      jobId: searchParams.get("jobId") ?? "",
      applicationIds: searchParams.get("applicationIds") ?? "",
    });

    const data = await getComparisonData(query.jobId, query.applicationIds);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
