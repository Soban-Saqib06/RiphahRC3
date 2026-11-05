import { z } from "zod";

/**
 * Parsed resume skill shape with verbatim evidence excerpt.
 */
const StringOrArrayToString = z
  .union([z.string(), z.array(z.string())])
  .transform((val) => (Array.isArray(val) ? val.join("\n") : val));

const FlexibleNumber = z
  .union([z.number(), z.string()])
  .nullable()
  .optional()
  .transform((val) => {
    if (val === null || val === undefined) return null;
    const num = typeof val === "number" ? val : parseFloat(val);
    return isNaN(num) ? null : num;
  });

export const ResumeSkillSchema = z.union([
  z.string().transform((s) => ({ name: s, evidence: null })),
  z
    .object({
      name: z.string().optional(),
      skill: z.string().optional(),
      evidence: z.string().max(400).nullable().optional(),
    })
    .transform((obj) => ({
      name: obj.name || obj.skill || "Skill",
      evidence: obj.evidence || null,
    })),
]);

export const ResumeExperienceSchema = z
  .object({
    company: z.string().optional().default(""),
    title: z.string().optional().default(""),
    role: z.string().optional(),
    startDate: z.string().max(100).nullable().optional(),
    endDate: z.string().max(100).nullable().optional(),
    isCurrent: z.boolean().optional().default(false),
    description: StringOrArrayToString.optional().default(""),
    technologies: z.array(z.string().max(100)).optional().default([]),
  })
  .transform((obj) => ({
    company: obj.company,
    title: obj.title || obj.role || "",
    startDate: obj.startDate || null,
    endDate: obj.endDate || null,
    isCurrent: !!obj.isCurrent,
    description: obj.description,
    technologies: obj.technologies,
  }));

export const ResumeEducationSchema = z
  .object({
    institution: z.string().optional().default(""),
    degree: z.string().nullable().optional(),
    field: z.string().nullable().optional(),
    startYear: FlexibleNumber,
    endYear: FlexibleNumber,
  })
  .transform((obj) => ({
    institution: obj.institution,
    degree: obj.degree || null,
    field: obj.field || null,
    startYear: obj.startYear !== null && obj.startYear !== undefined ? Math.round(obj.startYear) : null,
    endYear: obj.endYear !== null && obj.endYear !== undefined ? Math.round(obj.endYear) : null,
  }));

export const ResumeProjectSchema = z
  .object({
    name: z.string().optional().default(""),
    description: StringOrArrayToString.optional().default(""),
    technologies: z.array(z.string().max(100)).optional().default([]),
  })
  .transform((obj) => ({
    name: obj.name,
    description: obj.description,
    technologies: obj.technologies,
  }));

export const ParsedResumeSchema = z.object({
  fullName: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  summary: StringOrArrayToString.nullable().optional(),
  totalYearsExperience: FlexibleNumber,
  skills: z.array(ResumeSkillSchema).max(60).default([]),
  experience: z.array(ResumeExperienceSchema).max(15).default([]),
  education: z.array(ResumeEducationSchema).max(8).default([]),
  projects: z.array(ResumeProjectSchema).max(12).default([]),
  certifications: z.array(z.string().max(500)).max(20).default([]),
});

export type ParsedResume = z.infer<typeof ParsedResumeSchema>;

export const PatchResumeSchema = z.object({
  parsedData: ParsedResumeSchema,
});
