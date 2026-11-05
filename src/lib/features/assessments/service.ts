import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import { generateJson } from "@/lib/ai/gemini";
import {
  AssessmentModelOutput,
  AssessmentModelOutputSchema,
  OverrideAssessmentInput,
} from "./schema";
import {
  ASSESSMENT_SYSTEM_PROMPT,
  buildAssessmentPrompt,
} from "./prompt";
import type {
  AssessmentDTO,
  AssessmentItemDTO,
  UserDTO,
} from "@/lib/dto";
import type {
  Assessment,
  AssessmentItem,
  JobSkill,
  User,
  EvidenceVerdict,
} from "@prisma/client";

const DEFAULT_WEIGHTS = {
  skills: 50,
  experience: 25,
  projects: 15,
  qualifications: 10,
};

function normalizeText(str: string): string {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

type AssessmentWithRelations = Assessment & {
  items: (AssessmentItem & { jobSkill?: JobSkill | null })[];
  overriddenBy?: Pick<User, "id" | "name"> | null;
};

export function toAssessmentDTO(assessment: AssessmentWithRelations): AssessmentDTO {
  const effectiveScore =
    assessment.overrideScore !== null && assessment.overrideScore !== undefined
      ? assessment.overrideScore
      : assessment.overallScore;

  const weights =
    (assessment.weights as {
      skills: number;
      experience: number;
      projects: number;
      qualifications: number;
    }) || DEFAULT_WEIGHTS;

  const items: AssessmentItemDTO[] = (assessment.items || []).map((item) => ({
    id: item.id,
    dimension: item.dimension as any,
    requirement: item.requirement,
    jobSkillId: item.jobSkillId,
    priority: (item.jobSkill?.priority as any) || null,
    importance: item.jobSkill?.importance || null,
    verdict: item.verdict as any,
    evidenceExcerpt: item.evidenceExcerpt,
    reasoning: item.reasoning,
  }));

  return {
    id: assessment.id,
    applicationId: assessment.applicationId,
    status: assessment.status as any,
    overallScore: assessment.overallScore,
    effectiveScore,
    dimensionScores: {
      skills: assessment.skillsScore,
      experience: assessment.experienceScore,
      projects: assessment.projectsScore,
      qualifications: assessment.qualificationsScore,
    },
    weights,
    summary: assessment.summary,
    modelId: assessment.modelId,
    errorMessage: assessment.errorMessage,
    generatedAt: assessment.generatedAt ? assessment.generatedAt.toISOString() : null,
    override: {
      score: assessment.overrideScore,
      note: assessment.overrideNote,
      at: assessment.overriddenAt ? assessment.overriddenAt.toISOString() : null,
      by: assessment.overriddenBy
        ? { id: assessment.overriddenBy.id, name: assessment.overriddenBy.name }
        : null,
    },
    items,
  };
}

/**
 * Executes the complete AI Candidate-to-Job Matching Assessment Pipeline.
 * Strictly adheres to docs/DATA_MODEL.md Section 6.
 */
export async function runAssessment(applicationId: string): Promise<AssessmentDTO> {
  // 1. Load application, job (with skills), and resume
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          skills: true,
        },
      },
      resume: true,
    },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found.", 404);
  }

  if (application.resume.parseStatus !== "PARSED") {
    throw new AppError(
      "RESUME_NOT_READY",
      "Candidate resume has not finished parsing or failed parsing.",
      400
    );
  }

  // 2. Upsert Assessment row: status = PENDING, clear old items and overrides, set weights
  const assessmentRecord = await prisma.assessment.upsert({
    where: { applicationId },
    create: {
      applicationId,
      status: "PENDING",
      weights: DEFAULT_WEIGHTS,
    },
    update: {
      status: "PENDING",
      errorMessage: null,
      overrideScore: null,
      overrideNote: null,
      overriddenAt: null,
      overriddenById: null,
      weights: DEFAULT_WEIGHTS,
    },
  });

  // Clear existing items for re-run
  await prisma.assessmentItem.deleteMany({
    where: { assessmentId: assessmentRecord.id },
  });

  try {
    // 3. Build prompt and call Gemini with structured Zod output
    const prompt = buildAssessmentPrompt({
      job: application.job,
      candidate: {
        parsedData: application.resume.parsedData,
        extractedText: application.resume.extractedText,
      },
    });

    const modelOutput: AssessmentModelOutput = await generateJson<AssessmentModelOutput>({
      system: ASSESSMENT_SYSTEM_PROMPT,
      prompt,
      schema: AssessmentModelOutputSchema,
      timeoutMs: 30000,
    });

    // 4. Validate and normalize output on server
    const normalizedExtractedText = application.resume.extractedText
      ? normalizeText(application.resume.extractedText)
      : "";

    // Skills normalization
    const jobSkills = application.job.skills;
    const assessedSkillItems: Array<{
      dimension: "SKILLS";
      requirement: string;
      jobSkillId: string;
      verdict: EvidenceVerdict;
      evidenceExcerpt: string | null;
      reasoning: string;
      importance: number;
    }> = [];

    for (const jobSkill of jobSkills) {
      const match = modelOutput.skills.find(
        (s) => s.name.trim().toLowerCase() === jobSkill.name.trim().toLowerCase()
      );

      let verdict: EvidenceVerdict = match ? match.verdict : "NOT_EVIDENCED";
      let evidenceExcerpt: string | null = match?.evidenceExcerpt || null;
      let reasoning = match
        ? match.reasoning
        : "The model returned no result for this requirement.";

      // Evidence check against normalized extractedText
      if (evidenceExcerpt) {
        const normExcerpt = normalizeText(evidenceExcerpt);
        if (!normalizedExtractedText.includes(normExcerpt)) {
          evidenceExcerpt = null;
          if (verdict === "MATCHED") {
            verdict = "PARTIAL";
          }
          reasoning = `${reasoning} (quoted evidence could not be verified)`.trim();
        }
      }

      assessedSkillItems.push({
        dimension: "SKILLS",
        requirement: jobSkill.name,
        jobSkillId: jobSkill.id,
        verdict,
        evidenceExcerpt,
        reasoning,
        importance: jobSkill.importance,
      });
    }

    // 5. Compute scores strictly on the server per rubric
    // skillsScore: sum(w * credit) / sum(w)
    let totalWeight = 0;
    let earnedWeight = 0;

    for (const item of assessedSkillItems) {
      const jobSkill = jobSkills.find((s) => s.id === item.jobSkillId)!;
      const w = jobSkill.importance * (jobSkill.priority === "REQUIRED" ? 1.0 : 0.5);
      const credit =
        item.verdict === "MATCHED" ? 1.0 : item.verdict === "PARTIAL" ? 0.5 : 0.0;
      totalWeight += w;
      earnedWeight += w * credit;
    }

    const skillsScore =
      totalWeight > 0 ? Math.round((100 * earnedWeight) / totalWeight) : 100;

    // Experience
    const experienceScore = Math.max(
      0,
      Math.min(100, Math.round(modelOutput.experience.score))
    );
    let expExcerpt = modelOutput.experience.evidenceExcerpt || null;
    let expReasoning = modelOutput.experience.reasoning;
    let expVerdict: EvidenceVerdict = modelOutput.experience.verdict;

    if (expExcerpt) {
      if (!normalizedExtractedText.includes(normalizeText(expExcerpt))) {
        expExcerpt = null;
        if (expVerdict === "MATCHED") expVerdict = "PARTIAL";
        expReasoning = `${expReasoning} (quoted evidence could not be verified)`.trim();
      }
    }

    // Projects
    const projectsScore = Math.max(
      0,
      Math.min(100, Math.round(modelOutput.projects.score))
    );

    // Qualifications
    let qualificationsScore = 100;
    let qualItem: {
      requirement: string;
      verdict: EvidenceVerdict;
      evidenceExcerpt: string | null;
      reasoning: string;
    } | null = null;

    if (
      application.job.requiredQualifications &&
      application.job.requiredQualifications.trim().length > 0
    ) {
      qualificationsScore = modelOutput.qualifications
        ? Math.max(0, Math.min(100, Math.round(modelOutput.qualifications.score)))
        : 50;

      if (modelOutput.qualifications) {
        let qualExcerpt = modelOutput.qualifications.evidenceExcerpt || null;
        let qualReasoning = modelOutput.qualifications.reasoning;
        let qualVerdict: EvidenceVerdict = modelOutput.qualifications.verdict;

        if (qualExcerpt) {
          if (!normalizedExtractedText.includes(normalizeText(qualExcerpt))) {
            qualExcerpt = null;
            if (qualVerdict === "MATCHED") qualVerdict = "PARTIAL";
            qualReasoning = `${qualReasoning} (quoted evidence could not be verified)`.trim();
          }
        }

        qualItem = {
          requirement:
            modelOutput.qualifications.requirement ||
            application.job.requiredQualifications,
          verdict: qualVerdict,
          evidenceExcerpt: qualExcerpt,
          reasoning: qualReasoning,
        };
      }
    }

    // Overall weighted score: 50/25/15/10
    const overallScore = Math.round(
      (skillsScore * 50 +
        experienceScore * 25 +
        projectsScore * 15 +
        qualificationsScore * 10) /
        100
    );

    // 6. Write assessment items in order:
    // SKILLS sorted by importance desc, then EXPERIENCE, then PROJECTS, then QUALIFICATIONS
    let sortOrder = 0;
    const itemsToCreate: Array<{
      assessmentId: string;
      dimension: "SKILLS" | "EXPERIENCE" | "PROJECTS" | "QUALIFICATIONS";
      requirement: string;
      jobSkillId?: string | null;
      verdict: EvidenceVerdict;
      evidenceExcerpt?: string | null;
      reasoning: string;
      sortOrder: number;
    }> = [];

    // Sort skills by importance descending
    assessedSkillItems.sort((a, b) => b.importance - a.importance);
    for (const s of assessedSkillItems) {
      itemsToCreate.push({
        assessmentId: assessmentRecord.id,
        dimension: "SKILLS",
        requirement: s.requirement,
        jobSkillId: s.jobSkillId,
        verdict: s.verdict,
        evidenceExcerpt: s.evidenceExcerpt,
        reasoning: s.reasoning,
        sortOrder: sortOrder++,
      });
    }

    // EXPERIENCE item
    itemsToCreate.push({
      assessmentId: assessmentRecord.id,
      dimension: "EXPERIENCE",
      requirement:
        modelOutput.experience.requirement ||
        `Minimum ${application.job.minYearsExperience} years experience`,
      jobSkillId: null,
      verdict: expVerdict,
      evidenceExcerpt: expExcerpt,
      reasoning: expReasoning,
      sortOrder: sortOrder++,
    });

    // PROJECTS items (0 to 3)
    const projectItems = modelOutput.projects.items.slice(0, 3);
    for (const p of projectItems) {
      let pExcerpt = p.evidenceExcerpt || null;
      let pReasoning = p.reasoning;
      let pVerdict: EvidenceVerdict = p.verdict;

      if (pExcerpt) {
        if (!normalizedExtractedText.includes(normalizeText(pExcerpt))) {
          pExcerpt = null;
          if (pVerdict === "MATCHED") pVerdict = "PARTIAL";
          pReasoning = `${pReasoning} (quoted evidence could not be verified)`.trim();
        }
      }

      itemsToCreate.push({
        assessmentId: assessmentRecord.id,
        dimension: "PROJECTS",
        requirement: p.requirement,
        jobSkillId: null,
        verdict: pVerdict,
        evidenceExcerpt: pExcerpt,
        reasoning: pReasoning,
        sortOrder: sortOrder++,
      });
    }

    // QUALIFICATIONS item if relevant
    if (qualItem) {
      itemsToCreate.push({
        assessmentId: assessmentRecord.id,
        dimension: "QUALIFICATIONS",
        requirement: qualItem.requirement,
        jobSkillId: null,
        verdict: qualItem.verdict,
        evidenceExcerpt: qualItem.evidenceExcerpt,
        reasoning: qualItem.reasoning,
        sortOrder: sortOrder++,
      });
    }

    // Insert items in batch
    await prisma.assessmentItem.createMany({
      data: itemsToCreate,
    });

    // Update Assessment record to COMPLETED
    const updatedAssessment = await prisma.assessment.update({
      where: { id: assessmentRecord.id },
      data: {
        status: "COMPLETED",
        overallScore,
        skillsScore,
        experienceScore,
        projectsScore,
        qualificationsScore,
        summary: modelOutput.summary.slice(0, 1000),
        modelId: process.env.AI_MODEL || "gemini-3.8-flash",
        generatedAt: new Date(),
        errorMessage: null,
      },
      include: {
        items: {
          include: {
            jobSkill: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        overriddenBy: {
          select: { id: true, name: true },
        },
      },
    });

    // 7. Transition status PARSED -> ASSESSED if currently PARSED
    if (application.status === "PARSED") {
      try {
        await prisma.$transaction([
          prisma.application.update({
            where: { id: applicationId },
            data: {
              status: "ASSESSED",
              statusUpdatedAt: new Date(),
            },
          }),
          prisma.applicationStatusEvent.create({
            data: {
              applicationId,
              fromStatus: "PARSED",
              toStatus: "ASSESSED",
              note: "AI assessment completed",
            },
          }),
        ]);
      } catch (err) {
        console.warn("Status transition to ASSESSED encountered warning:", err);
      }
    }

    return toAssessmentDTO(updatedAssessment);
  } catch (err: unknown) {
    // 8. On any failure: set status = FAILED and record error message
    const errorMsg =
      err instanceof AppError
        ? err.message
        : (err as Error)?.message || "Failed to generate assessment.";

    await prisma.assessment.update({
      where: { id: assessmentRecord.id },
      data: {
        status: "FAILED",
        errorMessage: errorMsg,
      },
    });

    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("AI_FAILED", errorMsg, 502);
  }
}

/**
 * Retrieves the current assessment for an application.
 */
export async function getAssessmentForApplication(
  applicationId: string
): Promise<AssessmentDTO> {
  const assessment = await prisma.assessment.findUnique({
    where: { applicationId },
    include: {
      items: {
        include: {
          jobSkill: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      overriddenBy: {
        select: { id: true, name: true },
      },
    },
  });

  if (!assessment) {
    throw new AppError("NOT_FOUND", "Assessment not found for this application.", 404);
  }

  return toAssessmentDTO(assessment);
}

/**
 * Allows a recruiter to override the calculated overall assessment score and add an explanation note.
 */
export async function overrideAssessment(
  applicationId: string,
  recruiter: UserDTO,
  input: OverrideAssessmentInput
): Promise<AssessmentDTO> {
  const assessment = await prisma.assessment.findUnique({
    where: { applicationId },
  });

  if (!assessment) {
    throw new AppError("NOT_FOUND", "Assessment not found.", 404);
  }

  const updated = await prisma.assessment.update({
    where: { id: assessment.id },
    data: {
      overrideScore: input.overrideScore,
      overrideNote: input.overrideNote || null,
      overriddenAt: new Date(),
      overriddenById: recruiter.id,
    },
    include: {
      items: {
        include: {
          jobSkill: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      overriddenBy: {
        select: { id: true, name: true },
      },
    },
  });

  return toAssessmentDTO(updated);
}
