import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import type {
  ComparisonDTO,
  ComparisonCandidateDTO,
  ComparisonMatrixRowDTO,
  AssessmentItemDTO,
  ApplicationStatus,
  AssessmentStatus,
  Dimension,
  SkillPriority,
  Verdict,
} from "@/lib/dto";

/**
 * Fetch and construct side-by-side comparison matrix for candidate applications.
 *
 * Requirements:
 * - Query: jobId (required), applicationIds (2 to 4 comma-separated ids)
 * - Returns ComparisonDTO strictly ordered by applicationIds
 * - Throws 400 VALIDATION_ERROR if count not 2-4 or any application does not belong to the job
 * - Throws 404 NOT_FOUND if job does not exist
 */
export async function getComparisonData(
  jobId: string,
  rawApplicationIds: string | string[]
): Promise<ComparisonDTO> {
  const ids = Array.isArray(rawApplicationIds)
    ? rawApplicationIds
    : rawApplicationIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  if (ids.length < 2 || ids.length > 4) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Comparison requires between 2 and 4 candidate applications",
      400
    );
  }

  // 1. Fetch job with its skills ordered by importance descending
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      skills: {
        orderBy: [{ priority: "asc" }, { importance: "desc" }],
      },
    },
  });

  if (!job) {
    throw new AppError("NOT_FOUND", "Job vacancy not found", 404);
  }

  // 2. Fetch applications with candidates, resumes, and completed/pending assessments
  const applications = await prisma.application.findMany({
    where: {
      id: { in: ids },
    },
    include: {
      candidate: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      resume: {
        select: {
          id: true,
          parsedData: true,
        },
      },
      assessment: {
        include: {
          items: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  // Verify all requested applications were found
  if (applications.length !== ids.length) {
    throw new AppError(
      "VALIDATION_ERROR",
      "One or more candidate applications could not be found",
      400
    );
  }

  // Verify all belong to the specified job
  for (const app of applications) {
    if (app.jobId !== jobId) {
      throw new AppError(
        "VALIDATION_ERROR",
        "All candidate applications must belong to the specified job",
        400
      );
    }
  }

  // Preserve the exact order of applicationIds in query
  const appMap = new Map(applications.map((app) => [app.id, app]));
  const orderedApps = ids.map((id) => appMap.get(id)!);

  // 3. Build candidates list
  const candidates: ComparisonCandidateDTO[] = orderedApps.map((app) => {
    const assessment = app.assessment;
    const isCompleted = assessment?.status === "COMPLETED";
    const effectiveScore = isCompleted
      ? assessment.overrideScore ?? assessment.overallScore
      : null;

    let totalYearsExperience: number | null = null;
    if (app.resume?.parsedData && typeof app.resume.parsedData === "object") {
      const parsed = app.resume.parsedData as Record<string, unknown>;
      if (typeof parsed.totalYearsExperience === "number") {
        totalYearsExperience = parsed.totalYearsExperience;
      }
    }

    return {
      applicationId: app.id,
      candidateName: app.candidate.user.name,
      status: app.status as ApplicationStatus,
      assessmentStatus: (assessment?.status as AssessmentStatus) ?? null,
      effectiveScore,
      dimensionScores: isCompleted
        ? {
            skills: assessment.skillsScore,
            experience: assessment.experienceScore,
            projects: assessment.projectsScore,
            qualifications: assessment.qualificationsScore,
          }
        : null,
      summary: assessment?.summary ?? null,
      totalYearsExperience,
    };
  });

  // 4. Build matrix: one row per job skill, then EXPERIENCE, then QUALIFICATIONS (if applicable)
  const matrix: ComparisonMatrixRowDTO[] = [];

  // 4a. Skills rows
  for (const skill of job.skills) {
    const cells = orderedApps.map((app) => {
      const assessment = app.assessment;
      if (!assessment || assessment.status !== "COMPLETED") {
        return {
          applicationId: app.id,
          verdict: null,
          evidenceExcerpt: null,
        };
      }

      // Match item by jobSkillId or case-insensitive name
      const item = assessment.items.find(
        (i) =>
          (i.jobSkillId && i.jobSkillId === skill.id) ||
          (i.dimension === "SKILLS" &&
            i.requirement.trim().toLowerCase() === skill.name.trim().toLowerCase())
      );

      return {
        applicationId: app.id,
        verdict: (item?.verdict as Verdict) ?? null,
        evidenceExcerpt: item?.evidenceExcerpt ?? null,
      };
    });

    matrix.push({
      requirement: skill.name,
      dimension: "SKILLS",
      priority: skill.priority as SkillPriority,
      importance: skill.importance,
      cells,
    });
  }

  // 4b. Experience row
  const expCells = orderedApps.map((app) => {
    const assessment = app.assessment;
    if (!assessment || assessment.status !== "COMPLETED") {
      return {
        applicationId: app.id,
        verdict: null,
        evidenceExcerpt: null,
      };
    }
    const item = assessment.items.find((i) => i.dimension === "EXPERIENCE");
    return {
      applicationId: app.id,
      verdict: (item?.verdict as Verdict) ?? null,
      evidenceExcerpt: item?.evidenceExcerpt ?? null,
    };
  });

  matrix.push({
    requirement:
      job.minYearsExperience > 0
        ? `Experience (${job.minYearsExperience}+ years)`
        : "Professional Experience",
    dimension: "EXPERIENCE",
    priority: null,
    importance: null,
    cells: expCells,
  });

  // 4c. Qualifications row (when present in job requirements or assessed items)
  const hasJobQual = Boolean(job.requiredQualifications?.trim());
  const hasAssessedQual = orderedApps.some((app) =>
    app.assessment?.items.some((i) => i.dimension === "QUALIFICATIONS")
  );

  if (hasJobQual || hasAssessedQual) {
    const qualCells = orderedApps.map((app) => {
      const assessment = app.assessment;
      if (!assessment || assessment.status !== "COMPLETED") {
        return {
          applicationId: app.id,
          verdict: null,
          evidenceExcerpt: null,
        };
      }
      const item = assessment.items.find((i) => i.dimension === "QUALIFICATIONS");
      return {
        applicationId: app.id,
        verdict: (item?.verdict as Verdict) ?? null,
        evidenceExcerpt: item?.evidenceExcerpt ?? null,
      };
    });

    matrix.push({
      requirement: job.requiredQualifications || "Required Qualifications",
      dimension: "QUALIFICATIONS",
      priority: null,
      importance: null,
      cells: qualCells,
    });
  }

  // 5. Projects list per candidate
  const projects = orderedApps.map((app) => {
    const assessment = app.assessment;
    if (!assessment || assessment.status !== "COMPLETED") {
      return { applicationId: app.id, items: [] };
    }

    const projectItems: AssessmentItemDTO[] = assessment.items
      .filter((i) => i.dimension === "PROJECTS")
      .map((item) => ({
        id: item.id,
        dimension: "PROJECTS" as Dimension,
        requirement: item.requirement,
        jobSkillId: item.jobSkillId,
        priority: null,
        importance: null,
        verdict: item.verdict as Verdict,
        evidenceExcerpt: item.evidenceExcerpt,
        reasoning: item.reasoning,
      }));

    return {
      applicationId: app.id,
      items: projectItems,
    };
  });

  return {
    job: {
      id: job.id,
      title: job.title,
    },
    candidates,
    matrix,
    projects,
  };
}
