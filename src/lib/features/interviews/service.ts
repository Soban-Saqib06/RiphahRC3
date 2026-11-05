import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import { transitionStatus } from "@/lib/features/applications/service";
import type {
  InterviewDTO,
  InterviewListItemDTO,
  ApplicationStatus,
  InterviewType,
  InterviewStatus,
  UserDTO,
} from "@/lib/dto";
import {
  ListInterviewsQueryInput,
  CreateInterviewInput,
  UpdateInterviewInput,
} from "./schema";

export function toInterviewDTO(row: {
  id: string;
  applicationId: string;
  scheduledAt: Date;
  durationMinutes: number;
  type: string;
  interviewerName: string;
  location: string | null;
  status: string;
  feedbackNotes: string | null;
  createdAt: Date;
}): InterviewDTO {
  return {
    id: row.id,
    applicationId: row.applicationId,
    scheduledAt: row.scheduledAt.toISOString(),
    durationMinutes: row.durationMinutes,
    type: row.type as InterviewType,
    interviewerName: row.interviewerName,
    location: row.location,
    status: row.status as InterviewStatus,
    feedbackNotes: row.feedbackNotes,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toInterviewListItem(row: any): InterviewListItemDTO {
  const base = toInterviewDTO(row);
  return {
    ...base,
    candidate: {
      id: row.application?.candidate?.id || row.candidate?.id || "",
      name:
        row.application?.candidate?.user?.name ||
        row.candidate?.name ||
        "Unknown Candidate",
    },
    job: {
      id: row.application?.job?.id || row.job?.id || "",
      title: row.application?.job?.title || row.job?.title || "Unknown Role",
    },
  };
}

/**
 * List interviews with optional filters, ordered by scheduledAt ascending.
 */
export async function listInterviews(
  query: ListInterviewsQueryInput
): Promise<InterviewListItemDTO[]> {
  const where: any = {};

  if (query.applicationId) {
    where.applicationId = query.applicationId;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.from || query.to) {
    where.scheduledAt = {};
    if (query.from) {
      where.scheduledAt.gte = new Date(query.from);
    }
    if (query.to) {
      where.scheduledAt.lte = new Date(query.to);
    }
  }

  const rows = await prisma.interview.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
    take: query.limit,
    include: {
      application: {
        include: {
          candidate: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
          job: {
            select: { id: true, title: true },
          },
        },
      },
    },
  });

  return rows.map(toInterviewListItem);
}

/**
 * Schedule a new interview for a candidate.
 * Requires candidate application to be in SHORTLISTED or INTERVIEW status.
 */
export async function createInterview(
  user: UserDTO,
  input: CreateInterviewInput
): Promise<{ interview: InterviewDTO; applicationStatus: ApplicationStatus }> {
  const application = await prisma.application.findUnique({
    where: { id: input.applicationId },
    select: { id: true, status: true },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found", 404);
  }

  if (
    application.status !== "SHORTLISTED" &&
    application.status !== "INTERVIEW"
  ) {
    throw new AppError(
      "INVALID_TRANSITION",
      "Shortlist the candidate before scheduling an interview.",
      409
    );
  }

  let finalAppStatus: ApplicationStatus = application.status as ApplicationStatus;

  // Move SHORTLISTED to INTERVIEW automatically
  if (application.status === "SHORTLISTED") {
    await transitionStatus(input.applicationId, "INTERVIEW", {
      changedById: user.id,
      note: "Interview scheduled",
    });
    finalAppStatus = "INTERVIEW";
  }

  const created = await prisma.interview.create({
    data: {
      applicationId: input.applicationId,
      scheduledAt: new Date(input.scheduledAt),
      durationMinutes: input.durationMinutes,
      type: input.type,
      interviewerName: input.interviewerName,
      location: input.location ?? null,
      status: "SCHEDULED",
      scheduledById: user.id,
    },
  });

  return {
    interview: toInterviewDTO(created),
    applicationStatus: finalAppStatus,
  };
}

/**
 * Update an existing interview (reschedule, cancel, complete, feedback).
 */
export async function updateInterview(
  interviewId: string,
  input: UpdateInterviewInput
): Promise<InterviewDTO> {
  const existing = await prisma.interview.findUnique({
    where: { id: interviewId },
  });

  if (!existing) {
    throw new AppError("NOT_FOUND", "Interview not found", 404);
  }

  const resultingStatus = input.status || existing.status;
  if (input.feedbackNotes && resultingStatus !== "COMPLETED") {
    throw new AppError(
      "VALIDATION_ERROR",
      "Feedback notes may only be set when the interview status is COMPLETED",
      400
    );
  }

  const updated = await prisma.interview.update({
    where: { id: interviewId },
    data: {
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
      durationMinutes: input.durationMinutes ?? undefined,
      type: input.type ?? undefined,
      interviewerName: input.interviewerName ?? undefined,
      location: input.location !== undefined ? input.location : undefined,
      status: input.status ?? undefined,
      feedbackNotes: input.feedbackNotes !== undefined ? input.feedbackNotes : undefined,
    },
  });

  return toInterviewDTO(updated);
}
