import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import {
  ApplicationStatus,
  EmploymentType,
  JobDetailDTO,
  JobSkillDTO,
  JobStatus,
  JobSummaryDTO,
  SkillPriority,
  UserDTO,
} from "@/lib/dto";
import { CreateJobInput, GetJobsQuery, UpdateJobInput } from "./schema";

const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "PARSED",
  "ASSESSED",
  "IN_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
];

export async function listJobs(
  user: UserDTO | null,
  query: GetJobsQuery
): Promise<any[]> {
  const isRecruiter = user?.role === "RECRUITER";

  const whereClause: any = {};

  if (query.q) {
    whereClause.OR = [
      { title: { contains: query.q } },
      { department: { contains: query.q } },
    ];
  }

  if (isRecruiter) {
    if (query.status) {
      whereClause.status = query.status;
    }
  } else {
    // Candidates and guests only see OPEN jobs
    whereClause.status = "OPEN";
  }

  const jobs = await prisma.job.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: query.limit,
    include: {
      applications: {
        select: {
          id: true,
          status: true,
          candidateId: true,
        },
      },
    },
  });

  if (isRecruiter) {
    return jobs.map((job) => {
      const stageCounts: Record<ApplicationStatus, number> = {
        SUBMITTED: 0,
        PARSED: 0,
        ASSESSED: 0,
        IN_REVIEW: 0,
        SHORTLISTED: 0,
        INTERVIEW: 0,
        SELECTED: 0,
        REJECTED: 0,
      };

      for (const app of job.applications) {
        const s = app.status as ApplicationStatus;
        if (stageCounts[s] !== undefined) {
          stageCounts[s]++;
        }
      }

      const summary: JobSummaryDTO & { stageCounts: Record<ApplicationStatus, number> } = {
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType as EmploymentType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        status: job.status as JobStatus,
        createdAt: job.createdAt.toISOString(),
        applicantCount: job.applications.length,
        stageCounts,
      };

      return summary;
    });
  } else {
    let candidateProfileId: string | null = null;
    if (user?.role === "CANDIDATE") {
      const profile = await prisma.candidateProfile.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      candidateProfileId = profile?.id ?? null;
    }

    return jobs.map((job) => {
      const hasApplied = candidateProfileId
        ? job.applications.some((app) => app.candidateId === candidateProfileId)
        : false;

      const summary: JobSummaryDTO & { hasApplied: boolean } = {
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType as EmploymentType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        status: job.status as JobStatus,
        createdAt: job.createdAt.toISOString(),
        applicantCount: job.applications.length,
        hasApplied,
      };

      return summary;
    });
  }
}

export async function createJob(
  user: UserDTO,
  input: CreateJobInput
): Promise<JobDetailDTO> {
  const job = await prisma.job.create({
    data: {
      recruiterId: user.id,
      title: input.title,
      department: input.department,
      location: input.location,
      employmentType: input.employmentType,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      salaryCurrency: input.salaryCurrency,
      description: input.description,
      minYearsExperience: input.minYearsExperience,
      requiredQualifications: input.requiredQualifications,
      status: input.status,
      skills: {
        create: input.skills.map((s) => ({
          name: s.name,
          priority: s.priority,
          importance: s.importance,
        })),
      },
    },
    include: {
      skills: true,
      recruiter: {
        select: { id: true, name: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  return toJobDetailDTO(job, job._count.applications);
}

export async function getJobById(
  jobId: string,
  user: UserDTO | null
): Promise<{
  job: JobDetailDTO;
  myApplication?: { id: string; status: ApplicationStatus } | null;
}> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      skills: true,
      recruiter: {
        select: { id: true, name: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) {
    throw new AppError("NOT_FOUND", "The requested vacancy was not found.", 404);
  }

  const isRecruiter = user?.role === "RECRUITER";
  if (!isRecruiter && job.status !== "OPEN") {
    throw new AppError("NOT_FOUND", "The requested vacancy is not available.", 404);
  }

  const jobDTO = toJobDetailDTO(job, job._count.applications);

  if (user?.role === "CANDIDATE") {
    const profile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    let myApplication: { id: string; status: ApplicationStatus } | null = null;
    if (profile) {
      const app = await prisma.application.findUnique({
        where: {
          jobId_candidateId: {
            jobId: job.id,
            candidateId: profile.id,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (app) {
        myApplication = {
          id: app.id,
          status: app.status as ApplicationStatus,
        };
      }
    }

    return { job: jobDTO, myApplication };
  }

  return { job: jobDTO };
}

export async function updateJob(
  jobId: string,
  user: UserDTO,
  input: UpdateJobInput
): Promise<JobDetailDTO> {
  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
    include: { skills: true },
  });

  if (!existingJob) {
    throw new AppError("NOT_FOUND", "The requested vacancy was not found.", 404);
  }

  // Handle closedAt updates on status transition
  let closedAt = existingJob.closedAt;
  if (input.status) {
    if (input.status === "CLOSED" && existingJob.status !== "CLOSED") {
      closedAt = new Date();
    } else if (input.status !== "CLOSED" && existingJob.status === "CLOSED") {
      closedAt = null;
    }
  }

  // Skill replacements if provided
  if (input.skills) {
    const existingSkills = existingJob.skills;
    const inputSkillNamesMap = new Map(
      input.skills.map((s) => [s.name.toLowerCase(), s])
    );

    // 1. Delete skills that are no longer present
    const skillsToDelete = existingSkills.filter(
      (es) => !inputSkillNamesMap.has(es.name.toLowerCase())
    );
    if (skillsToDelete.length > 0) {
      await prisma.jobSkill.deleteMany({
        where: { id: { in: skillsToDelete.map((s) => s.id) } },
      });
    }

    // 2. Update matched skills in place
    for (const es of existingSkills) {
      const matched = inputSkillNamesMap.get(es.name.toLowerCase());
      if (matched) {
        await prisma.jobSkill.update({
          where: { id: es.id },
          data: {
            name: matched.name,
            priority: matched.priority,
            importance: matched.importance,
          },
        });
      }
    }

    // 3. Create new skills that didn't exist before
    const existingSkillNames = new Set(
      existingSkills.map((es) => es.name.toLowerCase())
    );
    const skillsToCreate = input.skills.filter(
      (s) => !existingSkillNames.has(s.name.toLowerCase())
    );
    if (skillsToCreate.length > 0) {
      await prisma.jobSkill.createMany({
        data: skillsToCreate.map((s) => ({
          jobId: existingJob.id,
          name: s.name,
          priority: s.priority,
          importance: s.importance,
        })),
      });
    }
  }

  // Verify status OPEN requirement
  const targetStatus = input.status ?? existingJob.status;
  if (targetStatus === "OPEN") {
    const currentSkills = await prisma.jobSkill.findMany({
      where: { jobId: existingJob.id },
    });
    const hasRequired = currentSkills.some((s) => s.priority === "REQUIRED");
    if (!hasRequired) {
      throw new AppError(
        "VALIDATION_ERROR",
        "An OPEN job requires at least one REQUIRED skill.",
        400
      );
    }
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: {
      title: input.title,
      department: input.department,
      location: input.location,
      employmentType: input.employmentType,
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      salaryCurrency: input.salaryCurrency,
      description: input.description,
      minYearsExperience: input.minYearsExperience,
      requiredQualifications: input.requiredQualifications,
      status: input.status,
      closedAt,
    },
    include: {
      skills: true,
      recruiter: {
        select: { id: true, name: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  return toJobDetailDTO(updated, updated._count.applications);
}

export async function deleteJob(
  jobId: string,
  user: UserDTO
): Promise<{ deleted: true }> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) {
    throw new AppError("NOT_FOUND", "The requested vacancy was not found.", 404);
  }

  if (job._count.applications > 0) {
    throw new AppError(
      "JOB_HAS_APPLICATIONS",
      "This job has applications. Close it instead.",
      409
    );
  }

  await prisma.job.delete({
    where: { id: jobId },
  });

  return { deleted: true };
}

function toJobDetailDTO(job: any, applicantCount: number): JobDetailDTO {
  return {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    employmentType: job.employmentType as EmploymentType,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: job.salaryCurrency,
    status: job.status as JobStatus,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    closedAt: job.closedAt ? job.closedAt.toISOString() : null,
    applicantCount,
    description: job.description,
    minYearsExperience: job.minYearsExperience,
    requiredQualifications: job.requiredQualifications,
    recruiter: {
      id: job.recruiter.id,
      name: job.recruiter.name,
    },
    skills: job.skills.map((s: any) => ({
      id: s.id,
      name: s.name,
      priority: s.priority as SkillPriority,
      importance: s.importance,
    })),
  };
}
