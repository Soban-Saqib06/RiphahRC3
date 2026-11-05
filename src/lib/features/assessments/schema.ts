import { z } from "zod";

const EvidenceVerdictSchema = z.enum(["MATCHED", "PARTIAL", "NOT_EVIDENCED"]);

const FlexibleScore = z
  .union([z.number(), z.string()])
  .transform((val) => {
    const num = typeof val === "number" ? val : parseFloat(val);
    if (isNaN(num)) return 0;
    return Math.max(0, Math.min(100, Math.round(num)));
  });

export const AssessmentSkillItemSchema = z.object({
  name: z.string().min(1),
  verdict: EvidenceVerdictSchema,
  evidenceExcerpt: z.string().max(500).nullable().optional().transform((v) => v || null),
  reasoning: z.string().default(""),
});

export const AssessmentExperienceSchema = z.object({
  requirement: z.string().default("Relevant Experience"),
  score: FlexibleScore,
  verdict: EvidenceVerdictSchema,
  evidenceExcerpt: z.string().max(500).nullable().optional().transform((v) => v || null),
  reasoning: z.string().default(""),
});

export const AssessmentProjectItemSchema = z.object({
  requirement: z.string().min(1),
  verdict: EvidenceVerdictSchema,
  evidenceExcerpt: z.string().max(500).nullable().optional().transform((v) => v || null),
  reasoning: z.string().default(""),
});

export const AssessmentProjectsSchema = z.object({
  score: FlexibleScore,
  items: z.array(AssessmentProjectItemSchema).max(5).default([]),
});

export const AssessmentQualificationsSchema = z
  .object({
    requirement: z.string().default("Required Qualifications"),
    score: FlexibleScore,
    verdict: EvidenceVerdictSchema,
    evidenceExcerpt: z.string().max(500).nullable().optional().transform((v) => v || null),
    reasoning: z.string().default(""),
  })
  .nullable()
  .optional();

export const AssessmentModelOutputSchema = z.object({
  skills: z.array(AssessmentSkillItemSchema).default([]),
  experience: AssessmentExperienceSchema,
  projects: AssessmentProjectsSchema,
  qualifications: AssessmentQualificationsSchema.transform((v) => v || null),
  summary: z.string().default(""),
});

export type AssessmentModelOutput = z.infer<typeof AssessmentModelOutputSchema>;

export const OverrideAssessmentSchema = z.object({
  overrideScore: z.number().int().min(0, "Score must be at least 0").max(100, "Score cannot exceed 100"),
  overrideNote: z.string().max(2000, "Note cannot exceed 2000 characters").nullable().optional(),
});

export type OverrideAssessmentInput = z.infer<typeof OverrideAssessmentSchema>;
