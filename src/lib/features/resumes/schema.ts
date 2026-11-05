import { z } from "zod";

export const ParsedResumeSchema = z.object({
  fullName: z.string().max(1000).nullable().default(null),
  email: z.string().max(1000).nullable().default(null),
  phone: z.string().max(1000).nullable().default(null),
  location: z.string().max(1000).nullable().default(null),
  summary: z.string().max(1000).nullable().default(null),
  totalYearsExperience: z.number().nullable().default(null),
  skills: z
    .array(
      z.object({
        name: z.string().max(1000),
        evidence: z.string().max(1000).nullable().default(null),
      })
    )
    .max(60)
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string().max(1000),
        title: z.string().max(1000),
        startDate: z.string().max(1000).nullable().default(null),
        endDate: z.string().max(1000).nullable().default(null),
        isCurrent: z.boolean().default(false),
        description: z.string().max(1000).default(""),
        technologies: z.array(z.string().max(1000)).default([]),
      })
    )
    .max(15)
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string().max(1000),
        degree: z.string().max(1000).nullable().default(null),
        field: z.string().max(1000).nullable().default(null),
        startYear: z.number().int().nullable().default(null),
        endYear: z.number().int().nullable().default(null),
      })
    )
    .max(8)
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string().max(1000),
        description: z.string().max(1000).default(""),
        technologies: z.array(z.string().max(1000)).default([]),
      })
    )
    .max(12)
    .default([]),
  certifications: z.array(z.string().max(1000)).default([]),
});

export const UpdateParsedResumeSchema = z.object({
  parsedData: ParsedResumeSchema,
});

export type ParsedResumeInput = z.infer<typeof ParsedResumeSchema>;
export type UpdateParsedResumeInput = z.infer<typeof UpdateParsedResumeSchema>;
