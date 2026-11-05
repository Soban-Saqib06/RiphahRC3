import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { AnalyticsQuerySchema } from "@/lib/features/analytics/schema";
import { getAnalyticsData } from "@/lib/features/analytics/service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser(["RECRUITER"]);
    if (!auth.ok) return auth.response;

    const searchParams = request.nextUrl.searchParams;
    const query = AnalyticsQuerySchema.parse({
      jobId: searchParams.get("jobId") || undefined,
    });

    const data = await getAnalyticsData(query.jobId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
