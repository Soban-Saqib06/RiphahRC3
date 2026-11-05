import { NextRequest } from "next/server";
import { ok, fail, handleError } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";
import { ComparisonQuerySchema } from "@/lib/features/comparison/schema";
import { getComparisonData } from "@/lib/features/comparison/service";


export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (user && user.role === "CANDIDATE") {
      return fail("FORBIDDEN", "Candidates cannot access candidate comparison matrix.", 403);
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
