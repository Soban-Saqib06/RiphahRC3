import { prisma } from "@/lib/db";
import {
  ApplicationStatus,
  CandidateDashboardDTO,
  DashboardDTO,
  InterviewListItemDTO,
  InterviewStatus,
  InterviewType,
  JobStatus,
  RecruiterDashboardDTO,
  UserDTO,
} from "@/lib/dto";

const PIPELINE_STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "PARSED",
  "ASSESSED",
  "IN_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
];

export async function getDashboardData(user: UserDTO): Promise<DashboardDTO> {
  if (user.role === "RECRUITER") {
    return getRecruiterDashboard();
  } else {
    return getCandidateDashboard(user.id);
  }
}

async function getRecruiterDashboard(): Promise<RecruiterDashboardDTO> {
  const now = new Date();

  // Active jobs (OPEN)
  const activeJobs = await prisma.job.count({
    where: { status: "OPEN" },
  });

  // Total applications
  const totalApplications = await prisma.application.count();

  // Pending reviews: PARSED, ASSESSED, IN_REVIEW
  const pendingReview = await prisma.application.count({
    where: {
      status: {
        in: ["PARSED", "ASSESSED", "IN_REVIEW"],
      },
    },
  });

  // Shortlisted
  const shortlisted = await prisma.application.count({
    where: { status: "SHORTLISTED" },
  });

  // Upcoming interviews: SCHEDULED with scheduledAt >= now
  const upcomingInterviewsCount = await prisma.interview.count({
    where: {
      status: "SCHEDULED",
      scheduledAt: { gte: now },
    },
  });

  // Average match score: mean effectiveScore of COMPLETED assessments
  const completedAssessments = await prisma.assessment.findMany({
    where: { status: "COMPLETED" },
    select: {
      overallScore: true,
      overrideScore: true,
    },
  });

  let averageMatchScore: number | null = null;
  if (completedAssessments.length > 0) {
    const sum = completedAssessments.reduce((acc, curr) => {
      const eff = curr.overrideScore ?? curr.overallScore ?? 0;
      return acc + eff;
    }, 0);
    averageMatchScore = Math.round(sum / completedAssessments.length);
  }

  // Pipeline counts for all 8 statuses in order
  const applicationStatusCounts = await prisma.application.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const statusMap = new Map<string, number>();
  for (const item of applicationStatusCounts) {
    statusMap.set(item.status, item._count.status);
  }

  const pipeline = PIPELINE_STATUSES.map((status) => ({
    status,
    count: statusMap.get(status) || 0,
  }));

  // Jobs: OPEN and CLOSED jobs, newest first
  const jobs = await prisma.job.findMany({
    where: {
      status: { in: ["OPEN", "CLOSED"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      applications: {
        select: {
          status: true,
          assessment: {
            select: {
              overallScore: true,
              overrideScore: true,
              status: true,
            },
          },
        },
      },
    },
  });

  const jobSummaries = jobs.map((job) => {
    const applicants = job.applications.length;
    const jobShortlisted = job.applications.filter(
      (a) => a.status === "SHORTLISTED"
    ).length;

    let topScore: number | null = null;
    for (const app of job.applications) {
      if (app.assessment && app.assessment.status === "COMPLETED") {
        const eff =
          app.assessment.overrideScore ?? app.assessment.overallScore;
        if (eff !== null && eff !== undefined) {
          if (topScore === null || eff > topScore) {
            topScore = eff;
          }
        }
      }
    }

    return {
      jobId: job.id,
      title: job.title,
      status: job.status as JobStatus,
      applicants,
      shortlisted: jobShortlisted,
      topScore,
    };
  });

  // Upcoming interviews: next 5 by time
  const nextInterviews = await prisma.interview.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { gte: now },
    },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    include: {
      application: {
        include: {
          candidate: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
          },
          job: {
            select: { id: true, title: true },
          },
        },
      },
    },
  });

  const upcomingInterviews: InterviewListItemDTO[] = nextInterviews.map((iv) => ({
    id: iv.id,
    applicationId: iv.applicationId,
    scheduledAt: iv.scheduledAt.toISOString(),
    durationMinutes: iv.durationMinutes,
    type: iv.type as InterviewType,
    interviewerName: iv.interviewerName,
    location: iv.location,
    status: iv.status as InterviewStatus,
    feedbackNotes: iv.feedbackNotes,
    createdAt: iv.createdAt.toISOString(),
    candidate: {
      id: iv.application.candidate.id,
      name: iv.application.candidate.user.name,
    },
    job: {
      id: iv.application.job.id,
      title: iv.application.job.title,
    },
  }));

  // Recent activity: last 10 status events
  const statusEvents = await prisma.applicationStatusEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      application: {
        include: {
          candidate: {
            include: {
              user: {
                select: { name: true },
              },
            },
          },
          job: {
            select: { title: true },
          },
        },
      },
    },
  });

  const recentActivity = statusEvents.map((event) => ({
    id: event.id,
    at: event.createdAt.toISOString(),
    candidateName: event.application.candidate.user.name,
    jobTitle: event.application.job.title,
    toStatus: event.toStatus as ApplicationStatus,
    note: event.note,
  }));

  return {
    role: "RECRUITER",
    kpis: {
      activeJobs,
      totalApplications,
      pendingReview,
      shortlisted,
      upcomingInterviews: upcomingInterviewsCount,
      averageMatchScore,
    },
    pipeline,
    jobs: jobSummaries,
    upcomingInterviews,
    recentActivity,
  };
}

async function getCandidateDashboard(
  userId: string
): Promise<CandidateDashboardDTO> {
  const now = new Date();

  // Find candidate profile
  const profile = await prisma.candidateProfile.findUnique({
    where: { userId },
    include: {
      resumes: {
        orderBy: { uploadedAt: "desc" },
      },
      applications: {
        orderBy: { submittedAt: "desc" },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              department: true,
              location: true,
              employmentType: true,
              salaryMin: true,
              salaryMax: true,
              salaryCurrency: true,
              status: true,
              createdAt: true,
              _count: {
                select: { applications: true },
              },
            },
          },
          statusEvents: {
            orderBy: { createdAt: "asc" },
          },
          interviews: {
            where: {
              status: "SCHEDULED",
              scheduledAt: { gte: now },
            },
            orderBy: { scheduledAt: "asc" },
          },
        },
      },
    },
  });

  if (!profile) {
    return {
      role: "CANDIDATE",
      profileCompleteness: 0,
      hasParsedResume: false,
      counts: {
        total: 0,
        underReview: 0,
        shortlisted: 0,
        interviews: 0,
        notSelected: 0,
      },
      recentApplications: [],
      upcomingInterviews: [],
    };
  }

  const parsedResume = profile.resumes.find((r) => r.parseStatus === "PARSED");
  const hasParsedResume = !!parsedResume;

  // Profile completeness formula: 6 items (headline, phone, location, summary, linkedin or github, parsed resume)
  let completeCount = 0;
  if (profile.headline) completeCount++;
  if (profile.phone) completeCount++;
  if (profile.location) completeCount++;
  if (profile.summary) completeCount++;
  if (profile.linkedinUrl || profile.githubUrl) completeCount++;
  if (hasParsedResume) completeCount++;

  const profileCompleteness = Math.round((completeCount / 6) * 100);

  // Application counts
  let underReview = 0;
  let shortlisted = 0;
  let interviews = 0;
  let notSelected = 0;

  for (const app of profile.applications) {
    if (["SUBMITTED", "PARSED", "ASSESSED", "IN_REVIEW"].includes(app.status)) {
      underReview++;
    } else if (app.status === "SHORTLISTED") {
      shortlisted++;
    } else if (app.status === "INTERVIEW") {
      interviews++;
    } else if (app.status === "REJECTED") {
      notSelected++;
    }
  }

  const counts = {
    total: profile.applications.length,
    underReview,
    shortlisted,
    interviews,
    notSelected,
  };

  // Recent applications (take latest 5)
  const recentApplications = profile.applications.slice(0, 5).map((app) => {
    // Map status to candidate displayStatus
    let displayStatus = "Submitted";
    if (app.status === "ASSESSED" || app.status === "IN_REVIEW") {
      displayStatus = "Under review";
    } else if (app.status === "SHORTLISTED") {
      displayStatus = "Shortlisted";
    } else if (app.status === "INTERVIEW") {
      displayStatus = "Interview scheduled";
    } else if (app.status === "SELECTED") {
      displayStatus = "Selected";
    } else if (app.status === "REJECTED") {
      displayStatus = "Not selected";
    }

    // Collapse consecutive duplicate labels for timeline
    const timeline: { displayStatus: string; at: string }[] = [];
    for (const ev of app.statusEvents) {
      let evDisplay = "Submitted";
      if (ev.toStatus === "ASSESSED" || ev.toStatus === "IN_REVIEW") {
        evDisplay = "Under review";
      } else if (ev.toStatus === "SHORTLISTED") {
        evDisplay = "Shortlisted";
      } else if (ev.toStatus === "INTERVIEW") {
        evDisplay = "Interview scheduled";
      } else if (ev.toStatus === "SELECTED") {
        evDisplay = "Selected";
      } else if (ev.toStatus === "REJECTED") {
        evDisplay = "Not selected";
      }

      if (
        timeline.length === 0 ||
        timeline[timeline.length - 1].displayStatus !== evDisplay
      ) {
        timeline.push({
          displayStatus: evDisplay,
          at: ev.createdAt.toISOString(),
        });
      }
    }

    return {
      id: app.id,
      status: app.status as ApplicationStatus,
      displayStatus,
      submittedAt: app.submittedAt.toISOString(),
      statusUpdatedAt: app.statusUpdatedAt.toISOString(),
      coverNote: app.coverNote,
      job: {
        id: app.job.id,
        title: app.job.title,
        department: app.job.department,
        location: app.job.location,
        employmentType: app.job.employmentType as any,
        salaryMin: app.job.salaryMin,
        salaryMax: app.job.salaryMax,
        salaryCurrency: app.job.salaryCurrency,
        status: app.job.status as JobStatus,
        createdAt: app.job.createdAt.toISOString(),
        applicantCount: app.job._count.applications,
      },
      timeline,
      upcomingInterviews: app.interviews.map((iv) => ({
        id: iv.id,
        scheduledAt: iv.scheduledAt.toISOString(),
        durationMinutes: iv.durationMinutes,
        type: iv.type as InterviewType,
        location: iv.location,
      })),
    };
  });

  // Upcoming interviews across all applications
  const upcomingInterviews: {
    id: string;
    applicationId: string;
    jobTitle: string;
    scheduledAt: string;
    type: InterviewType;
    location: string | null;
  }[] = [];

  for (const app of profile.applications) {
    for (const iv of app.interviews) {
      upcomingInterviews.push({
        id: iv.id,
        applicationId: app.id,
        jobTitle: app.job.title,
        scheduledAt: iv.scheduledAt.toISOString(),
        type: iv.type as InterviewType,
        location: iv.location,
      });
    }
  }

  upcomingInterviews.sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  return {
    role: "CANDIDATE",
    profileCompleteness,
    hasParsedResume,
    counts,
    recentApplications,
    upcomingInterviews,
  };
}
