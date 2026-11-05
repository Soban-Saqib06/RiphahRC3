import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { CreateApplicationSchema } from "@/lib/features/applications/schema";
import {
  applyForJob,
  getCandidateApplications,
  toApplicationSummary,
} from "@/lib/features/applications/service";
import { ApplicationStatus } from "@/lib/dto";


export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const validated = CreateApplicationSchema.parse(body);

    const application = await applyForJob(auth.user.id, validated);
    return ok({ application }, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    // 1. Candidate view: only their own applications
    if (auth.user.role === "CANDIDATE") {
      const applications = await getCandidateApplications(auth.user.id);
      return ok({ applications });
    }

    // 2. Recruiter view: query filtering, sorting, and stage counts
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get("jobId") || undefined;
    const statusParam = searchParams.get("status") as ApplicationStatus | null;
    const sort = searchParams.get("sort") || "score";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const limit = Math.min(Math.max(limitParam || 50, 1), 100);

    const whereClause: any = {};
    if (jobId) whereClause.jobId = jobId;
    if (statusParam) whereClause.status = statusParam;

    const rawApplications = await prisma.application.findMany({
      where: whereClause,
      include: {
        candidate: {
          include: {
            user: true,
          },
        },
        assessment: true,
      },
      take: limit,
      orderBy: { submittedAt: order },
    });

    const applications = rawApplications.map(toApplicationSummary);

    // Sort by effective score if requested
    if (sort === "score") {
      applications.sort((a, b) => {
        const scoreA = a.assessment?.effectiveScore ?? -1;
        const scoreB = b.assessment?.effectiveScore ?? -1;
        return order === "asc" ? scoreA - scoreB : scoreB - scoreA;
      });
    }

    // Compute stage counts for the job (ignoring status filter)
    const countWhere: any = {};
    if (jobId) countWhere.jobId = jobId;

    const groupedCounts = await prisma.application.groupBy({
      by: ["status"],
      where: countWhere,
      _count: { _all: true },
    });

    const allStatuses: ApplicationStatus[] = [
      "SUBMITTED",
      "PARSED",
      "ASSESSED",
      "IN_REVIEW",
      "SHORTLISTED",
      "INTERVIEW",
      "SELECTED",
      "REJECTED",
    ];

    const counts: Record<ApplicationStatus, number> = {
      SUBMITTED: 0,
      PARSED: 0,
      ASSESSED: 0,
      IN_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      SELECTED: 0,
      REJECTED: 0,
    };

    for (const group of groupedCounts) {
      if (group.status in counts) {
        counts[group.status as ApplicationStatus] = group._count._all;
      }
    }

    return ok({ applications, counts });
  } catch (error) {
    return handleError(error);
  }
}
