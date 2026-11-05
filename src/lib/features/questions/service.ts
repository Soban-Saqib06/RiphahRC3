import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import { generateJson } from "@/lib/ai/gemini";
import type { QuestionDTO, QuestionCategory } from "@/lib/dto";
import {
  CreateQuestionInput,
  UpdateQuestionInput,
} from "./schema";
import {
  buildQuestionPrompt,
  QuestionModelOutputSchema,
} from "./prompt";

function toQuestionDTO(item: {
  id: string;
  applicationId: string;
  category: string;
  question: string;
  rationale: string | null;
  source: string;
  sortOrder: number;
  updatedAt: Date;
}): QuestionDTO {
  return {
    id: item.id,
    applicationId: item.applicationId,
    category: item.category as QuestionCategory,
    question: item.question,
    rationale: item.rationale,
    source: item.source as "AI" | "RECRUITER",
    sortOrder: item.sortOrder,
    updatedAt: item.updatedAt.toISOString(),
  };
}

/**
 * List all questions for an application ordered by sortOrder ascending.
 */
export async function getQuestions(applicationId: string): Promise<QuestionDTO[]> {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found", 404);
  }

  const items = await prisma.interviewQuestion.findMany({
    where: { applicationId },
    orderBy: { sortOrder: "asc" },
  });

  return items.map(toQuestionDTO);
}

/**
 * Generate role-specific interview questions using Gemini AI.
 */
export async function generateQuestions(
  applicationId: string,
  count = 8,
  replaceAiQuestions = false
): Promise<QuestionDTO[]> {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      candidate: {
        include: { user: { select: { name: true } } },
      },
      job: {
        include: { skills: true },
      },
      resume: {
        select: { parsedData: true },
      },
      assessment: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found", 404);
  }

  // Filter unverified/partial assessment items
  const unverifiedOrPartial = (application.assessment?.items || [])
    .filter((i) => i.verdict === "PARTIAL" || i.verdict === "NOT_EVIDENCED")
    .map((i) => ({
      requirement: i.requirement,
      dimension: i.dimension,
      verdict: i.verdict,
      reasoning: i.reasoning,
    }));

  const { system, prompt } = buildQuestionPrompt({
    jobTitle: application.job.title,
    jobDescription: application.job.description,
    jobSkills: application.job.skills.map((s) => ({
      name: s.name,
      priority: s.priority,
      importance: s.importance,
    })),
    candidateName: application.candidate.user.name,
    parsedResume: (application.resume.parsedData as Record<string, unknown>) || null,
    unverifiedOrPartialItems: unverifiedOrPartial,
    targetCount: count,
  });

  // Call Gemini model
  const generated = await generateJson({
    system,
    prompt,
    schema: QuestionModelOutputSchema,
    timeoutMs: 30000,
  });

  // Persist generated questions in a transaction
  await prisma.$transaction(async (tx) => {
    if (replaceAiQuestions) {
      await tx.interviewQuestion.deleteMany({
        where: { applicationId, source: "AI" },
      });
    }

    const maxSort = await tx.interviewQuestion.aggregate({
      where: { applicationId },
      _max: { sortOrder: true },
    });

    let currentOrder = (maxSort._max.sortOrder ?? -1) + 1;

    for (const q of generated.questions) {
      await tx.interviewQuestion.create({
        data: {
          applicationId,
          category: q.category,
          question: q.question,
          rationale: q.rationale,
          source: "AI",
          sortOrder: currentOrder++,
        },
      });
    }
  });

  // Return all questions for the application
  const allQuestions = await prisma.interviewQuestion.findMany({
    where: { applicationId },
    orderBy: { sortOrder: "asc" },
  });

  return allQuestions.map(toQuestionDTO);
}

/**
 * Add a manual question created by the recruiter.
 */
export async function createQuestion(
  input: CreateQuestionInput
): Promise<QuestionDTO> {
  const application = await prisma.application.findUnique({
    where: { id: input.applicationId },
    select: { id: true },
  });

  if (!application) {
    throw new AppError("NOT_FOUND", "Application not found", 404);
  }

  const maxSort = await prisma.interviewQuestion.aggregate({
    where: { applicationId: input.applicationId },
    _max: { sortOrder: true },
  });

  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  const created = await prisma.interviewQuestion.create({
    data: {
      applicationId: input.applicationId,
      category: input.category,
      question: input.question,
      source: "RECRUITER",
      sortOrder: nextSort,
    },
  });

  return toQuestionDTO(created);
}

/**
 * Update an existing question (content, category, or order).
 */
export async function updateQuestion(
  questionId: string,
  input: UpdateQuestionInput
): Promise<QuestionDTO> {
  const existing = await prisma.interviewQuestion.findUnique({
    where: { id: questionId },
  });

  if (!existing) {
    throw new AppError("NOT_FOUND", "Question not found", 404);
  }

  const updated = await prisma.interviewQuestion.update({
    where: { id: questionId },
    data: {
      question: input.question ?? undefined,
      category: input.category ?? undefined,
      sortOrder: input.sortOrder ?? undefined,
    },
  });

  return toQuestionDTO(updated);
}

/**
 * Delete a question.
 */
export async function deleteQuestion(
  questionId: string
): Promise<{ deleted: true }> {
  const existing = await prisma.interviewQuestion.findUnique({
    where: { id: questionId },
  });

  if (!existing) {
    throw new AppError("NOT_FOUND", "Question not found", 404);
  }

  await prisma.interviewQuestion.delete({
    where: { id: questionId },
  });

  return { deleted: true };
}
