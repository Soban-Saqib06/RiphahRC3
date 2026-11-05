import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import {
  ApplicationStatus,
  CandidateApplicationDTO,
  ApplicationSummaryDTO,
  ApplicationDetailDTO,
  UserDTO,
} from "@/lib/dto";
import { CreateApplicationInput } from "./schema";

/**
 * Map internal DB status to candidate-facing display status string.
 */
export function toDisplayStatus(status: ApplicationStatus | string): string {
  switch (status) {
    case "SUBMITTED":
    case "PARSED":
      return "Submitted";
    case "ASSESSED":
    case "IN_REVIEW":
      return "Under review";
    case "SHORTLISTED":
      return "Shortlisted";
    case "INTERVIEW":
      return "Interview scheduled";
    case "SELECTED":
      return "Selected";
    case "REJECTED":
      return "Not selected";
    default:
      return status;
  }
}

/**
 * Format Application into CandidateApplicationDTO.
 * Never includes recruiter notes, assessment scores, or internal recruiter data.
 */
export function toCandidateApplicationDTO(app: any): CandidateApplicationDTO {
  const rawEvents = app.statusEvents || [];
  // Oldest first
  const sortedEvents = [...rawEvents].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Collapse consecutive duplicate displayStatus labels
  const timeline: { displayStatus: string; at: string }[] = [];
  for (const ev of sortedEvents) {
    const label = toDisplayStatus(ev.toStatus);
    const at = new Date(ev.createdAt).toISOString();
    const prev = timeline[timeline.length - 1];
    if (!prev || prev.displayStatus !== label) {
      timeline.push({ displayStatus: label, at });
    }
  }

  // If no timeline events exist, provide at least the current status
  if (timeline.length === 0) {
    timeline.push({
      displayStatus: toDisplayStatus(app.status),
      at: new Date(app.statusUpdatedAt || app.submittedAt).toISOString(),
    });
  }

  // Upcoming interviews (SCHEDULED)
  const interviews = (app.interviews || [])
    .filter((inv: any) => inv.status === "SCHEDULED")
    .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .map((inv: any) => ({
      id: inv.id,
      scheduledAt: new Date(inv.scheduledAt).toISOString(),
      durationMinutes: inv.durationMinutes,
      type: inv.type,
      location: inv.location,
    }));

  return {
    id: app.id,
    status: app.status as ApplicationStatus,
    displayStatus: toDisplayStatus(app.status),
    submittedAt: new Date(app.submittedAt).toISOString(),
    statusUpdatedAt: new Date(app.statusUpdatedAt).toISOString(),
    coverNote: app.coverNote,
    job: {
      id: app.job.id,
      title: app.job.title,
      department: app.job.department,
      location: app.job.location,
      employmentType: app.job.employmentType,
      salaryMin: app.job.salaryMin,
      salaryMax: app.job.salaryMax,
      salaryCurrency: app.job.salaryCurrency,
      status: app.job.status,
      createdAt: new Date(app.job.createdAt).toISOString(),
      applicantCount: app.job._count?.applications ?? 0,
    },
    timeline,
    upcomingInterviews: interviews,
  };
}

/**
 * Format Application into recruiter ApplicationSummaryDTO.
 */
export function toApplicationSummary(app: any): ApplicationSummaryDTO {
  const assessment = app.assessment;
  return {
    id: app.id,
    jobId: app.jobId,
    status: app.status as ApplicationStatus,
    submittedAt: new Date(app.submittedAt).toISOString(),
    statusUpdatedAt: new Date(app.statusUpdatedAt).toISOString(),
    candidate: {
      id: app.candidate.id,
      userId: app.candidate.userId,
      name: app.candidate.user.name,
      email: app.candidate.user.email,
      headline: app.candidate.headline,
      location: app.candidate.location,
    },
    resumeId: app.resumeId,
    assessment: assessment
      ? {
          status: assessment.status,
          overallScore: assessment.overallScore,
          effectiveScore: assessment.overrideScore ?? assessment.overallScore,
          overridden: assessment.overrideScore !== null,
          generatedAt: assessment.generatedAt
            ? new Date(assessment.generatedAt).toISOString()
            : null,
        }
      : null,
  };
}

/**
 * Transition application status through the central status machine.
 */
export async function transitionStatus(
  applicationId: string,
  toStatus: ApplicationStatus,
  options: { changedById?: string; note?: string | null } = {}
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found.", 404);
  }

  const fromStatus = application.status;

  // Allowed transitions per docs/DATA_MODEL.md section 5
  const allowedTransitions: Record<string, string[]> = {
    SUBMITTED: ["PARSED"],
    PARSED: ["ASSESSED", "IN_REVIEW", "SHORTLISTED", "REJECTED"],
    ASSESSED: ["IN_REVIEW", "SHORTLISTED", "REJECTED"],
    IN_REVIEW: ["SHORTLISTED", "REJECTED"],
    SHORTLISTED: ["INTERVIEW", "REJECTED"],
    INTERVIEW: ["SELECTED", "REJECTED"],
    SELECTED: [],
    REJECTED: [],
  };

  const allowed = allowedTransitions[fromStatus] || [];
  if (!allowed.includes(toStatus)) {
    throw new AppError(
      "INVALID_TRANSITION",
      `Cannot transition from ${fromStatus} to ${toStatus}. Allowed: ${allowed.join(", ") || "none"}`,
      409
    );
  }

  const now = new Date();

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.application.update({
      where: { id: applicationId },
      data: {
        status: toStatus as any,
        statusUpdatedAt: now,
      },
    });

    const statusEvent = await tx.applicationStatusEvent.create({
      data: {
        applicationId,
        fromStatus: fromStatus as any,
        toStatus: toStatus as any,
        changedById: options.changedById || null,
        note: options.note || null,
        createdAt: now,
      },
      include: {
        changedBy: { select: { id: true, name: true } },
      },
    });

    return { application: updated, statusEvent };
  });
}

/**
 * Submit an application for an open vacancy.
 */
export async function applyForJob(
  candidateUserId: string,
  input: CreateApplicationInput
): Promise<CandidateApplicationDTO> {
  const job = await prisma.job.findUnique({
    where: { id: input.jobId },
    include: { _count: { select: { applications: true } } },
  });

  if (!job) {
    throw new AppError("NOT_FOUND", "Vacancy not found.", 404);
  }

  if (job.status !== "OPEN") {
    throw new AppError(
      "JOB_CLOSED",
      "This vacancy is no longer accepting applications.",
      409
    );
  }

  // Find candidate profile
  let profile = await prisma.candidateProfile.findUnique({
    where: { userId: candidateUserId },
  });

  if (!profile) {
    profile = await prisma.candidateProfile.create({
      data: { userId: candidateUserId },
    });
  }

  // Check if candidate already applied
  const existingApp = await prisma.application.findUnique({
    where: {
      jobId_candidateId: {
        jobId: job.id,
        candidateId: profile.id,
      },
    },
  });

  if (existingApp) {
    throw new AppError(
      "ALREADY_APPLIED",
      "You have already applied for this vacancy.",
      409
    );
  }

  // Determine resume
  let targetResumeId = input.resumeId;
  if (targetResumeId) {
    const resume = await prisma.resume.findUnique({
      where: { id: targetResumeId },
    });
    if (!resume || resume.candidateId !== profile.id) {
      throw new AppError("NOT_FOUND", "Resume not found.", 404);
    }
    if (resume.parseStatus !== "PARSED") {
      throw new AppError(
        "RESUME_NOT_READY",
        "The selected resume has not been successfully parsed yet.",
        400
      );
    }
  } else {
    // Find newest PARSED resume
    const latestParsed = await prisma.resume.findFirst({
      where: {
        candidateId: profile.id,
        parseStatus: "PARSED",
      },
      orderBy: { uploadedAt: "desc" },
    });

    if (!latestParsed) {
      throw new AppError(
        "NO_PARSED_RESUME",
        "Please upload a parsed PDF resume before applying.",
        400
      );
    }
    targetResumeId = latestParsed.id;
  }

  const now = new Date();

  // Create Application in transaction: SUBMITTED -> immediately PARSED
  const createdApp = await prisma.$transaction(async (tx) => {
    const app = await tx.application.create({
      data: {
        jobId: job.id,
        candidateId: profile.id,
        resumeId: targetResumeId!,
        status: "PARSED",
        coverNote: input.coverNote || null,
        submittedAt: now,
        statusUpdatedAt: now,
      },
      include: {
        job: {
          include: { _count: { select: { applications: true } } },
        },
        statusEvents: true,
        interviews: true,
      },
    });

    // 1. Initial event: null -> SUBMITTED
    await tx.applicationStatusEvent.create({
      data: {
        applicationId: app.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        changedById: candidateUserId,
        createdAt: now,
      },
    });

    // 2. Immediate transition: SUBMITTED -> PARSED
    await tx.applicationStatusEvent.create({
      data: {
        applicationId: app.id,
        fromStatus: "SUBMITTED",
        toStatus: "PARSED",
        note: "Resume parsed",
        createdAt: new Date(now.getTime() + 10),
      },
    });

    return app;
  });

  // Re-fetch populated status events for clean DTO
  const finalApp = await prisma.application.findUnique({
    where: { id: createdApp.id },
    include: {
      job: {
        include: { _count: { select: { applications: true } } },
      },
      statusEvents: {
        orderBy: { createdAt: "asc" },
      },
      interviews: true,
    },
  });

  return toCandidateApplicationDTO(finalApp);
}

/**
 * Get all applications for a candidate user, newest first.
 */
export async function getCandidateApplications(
  candidateUserId: string
): Promise<CandidateApplicationDTO[]> {
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId: candidateUserId },
  });

  if (!profile) return [];

  const applications = await prisma.application.findMany({
    where: { candidateId: profile.id },
    orderBy: { submittedAt: "desc" },
    include: {
      job: {
        include: { _count: { select: { applications: true } } },
      },
      statusEvents: {
        orderBy: { createdAt: "asc" },
      },
      interviews: {
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  return applications.map((app) => toCandidateApplicationDTO(app));
}

/**
 * Get single application for a user (enforcing candidate isolation).
 */
export async function getApplicationForUser(
  applicationId: string,
  user: UserDTO
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      job: {
        include: {
          skills: true,
          recruiter: { select: { id: true, name: true } },
          _count: { select: { applications: true } },
        },
      },
      resume: true,
      assessment: {
        include: {
          items: { orderBy: { sortOrder: "asc" } },
          overriddenBy: { select: { id: true, name: true } },
        },
      },
      statusEvents: {
        orderBy: { createdAt: "asc" },
        include: { changedBy: { select: { id: true, name: true } } },
      },
      interviews: {
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found.", 404);
  }

  // Candidate may only view their own application
  if (user.role === "CANDIDATE" && application.candidate.userId !== user.id) {
    throw new AppError("NOT_FOUND", "Application not found.", 404);
  }

  return application;
}

/**
 * Get single candidate application detail for candidate view.
 */
export async function getCandidateApplicationDetail(
  applicationId: string,
  candidateUserId: string
): Promise<CandidateApplicationDTO> {
  const user = await prisma.user.findUnique({ where: { id: candidateUserId } });
  if (!user) throw new AppError("NOT_FOUND", "User not found.", 404);

  const application = await getApplicationForUser(applicationId, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as any,
  });

  return toCandidateApplicationDTO(application);
}
