import { z } from "zod";

function normalizeSkillsInput(input: unknown): { name: string; evidence: string | null }[] {
  if (!input) return [];
  const list: { name: string; evidence: string | null }[] = [];

  const addSkill = (name: unknown, evidence: unknown = null) => {
    if (!name || typeof name !== "string") return;
    const parts = name.split(/[,;\n|]/).map((s) => s.trim()).filter(Boolean);
    for (const p of parts) {
      if (p.length > 0 && !list.some((existing) => existing.name.toLowerCase() === p.toLowerCase())) {
        list.push({
          name: p.slice(0, 1000),
          evidence: typeof evidence === "string" ? evidence.slice(0, 1000) : null,
        });
      }
    }
  };

  if (typeof input === "string") {
    addSkill(input);
  } else if (Array.isArray(input)) {
    for (const item of input) {
      if (typeof item === "string") {
        addSkill(item);
      } else if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const name = obj.name || obj.skill || obj.title || "";
        addSkill(name, obj.evidence);
      }
    }
  } else if (typeof input === "object") {
    for (const val of Object.values(input as Record<string, unknown>)) {
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === "string") addSkill(item);
          else if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            addSkill(obj.name || obj.skill || "", obj.evidence);
          }
        }
      } else if (typeof val === "string") {
        addSkill(val);
      }
    }
  }

  return list.slice(0, 60);
}

function normalizeStringArray(input: unknown): string[] {
  if (!input) return [];
  if (typeof input === "string") {
    return input.split(/[,;\n|]/).map((s) => s.trim()).filter(Boolean).slice(0, 30);
  }
  if (Array.isArray(input)) {
    const list: string[] = [];
    for (const item of input) {
      if (typeof item === "string") {
        const parts = item.split(/[,;\n|]/).map((s) => s.trim()).filter(Boolean);
        for (const p of parts) {
          if (p && !list.some((x) => x.toLowerCase() === p.toLowerCase())) {
            list.push(p);
          }
        }
      }
    }
    return list.slice(0, 30);
  }
  return [];
}

const NullableNumber = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  },
  z.number().nullable().default(null)
);

export const ParsedResumeSchema = z.object({
  fullName: z.string().max(1000).nullable().default(null),
  email: z.string().max(1000).nullable().default(null),
  phone: z.string().max(1000).nullable().default(null),
  location: z.string().max(1000).nullable().default(null),
  summary: z.string().max(1000).nullable().default(null),
  totalYearsExperience: NullableNumber,
  skills: z.preprocess(
    normalizeSkillsInput,
    z
      .array(
        z.object({
          name: z.string().max(1000),
          evidence: z.string().max(1000).nullable().default(null),
        })
      )
      .max(60)
      .default([])
  ),
  experience: z
    .array(
      z.object({
        company: z.string().max(1000),
        title: z.string().max(1000),
        startDate: z.string().max(1000).nullable().default(null),
        endDate: z.string().max(1000).nullable().default(null),
        isCurrent: z.boolean().default(false),
        description: z.string().max(1000).default(""),
        technologies: z.preprocess(normalizeStringArray, z.array(z.string().max(1000)).default([])),
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
        startYear: NullableNumber,
        endYear: NullableNumber,
      })
    )
    .max(8)
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string().max(1000),
        description: z.string().max(1000).default(""),
        technologies: z.preprocess(normalizeStringArray, z.array(z.string().max(1000)).default([])),
      })
    )
    .max(12)
    .default([]),
  certifications: z.preprocess(normalizeStringArray, z.array(z.string().max(1000)).default([])),
});

export const UpdateParsedResumeSchema = z.object({
  parsedData: ParsedResumeSchema,
});

export type ParsedResumeInput = z.infer<typeof ParsedResumeSchema>;
export type UpdateParsedResumeInput = z.infer<typeof UpdateParsedResumeSchema>;
