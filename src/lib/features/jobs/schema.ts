import { z } from "zod";

export const JobSkillInputSchema = z.object({
  name: z.string().trim().min(1, "Skill name required").max(60, "Skill name max 60 chars"),
  priority: z.enum(["REQUIRED", "PREFERRED"]),
  importance: z.number().int().min(1).max(5),
});

export const CreateJobSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title max 120 characters"),
    department: z.string().trim().min(2, "Department must be at least 2 characters").max(80, "Department max 80 characters"),
    location: z.string().trim().min(2, "Location must be at least 2 characters").max(80, "Location max 80 characters"),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
    salaryMin: z.number().int().min(0).nullable().optional(),
    salaryMax: z.number().int().min(0).nullable().optional(),
    salaryCurrency: z.string().length(3).default("PKR"),
    description: z.string().trim().min(20, "Description must be at least 20 characters").max(5000, "Description max 5000 characters"),
    minYearsExperience: z.number().int().min(0).max(40).default(0),
    requiredQualifications: z.string().trim().max(1000).nullable().optional(),
    status: z.enum(["DRAFT", "OPEN"]).default("DRAFT"),
    skills: z.array(JobSkillInputSchema).min(1, "At least one skill is required").max(30, "Maximum 30 skills"),
  })
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: "salaryMax must be greater than or equal to salaryMin",
      path: ["salaryMax"],
    }
  )
  .refine(
    (data) => {
      const lowerNames = data.skills.map((s) => s.name.toLowerCase());
      return new Set(lowerNames).size === lowerNames.length;
    },
    {
      message: "Skill names must be unique (ignoring case)",
      path: ["skills"],
    }
  )
  .refine(
    (data) => {
      if (data.status === "OPEN") {
        return data.skills.some((s) => s.priority === "REQUIRED");
      }
      return true;
    },
    {
      message: "An OPEN job requires at least one REQUIRED skill",
      path: ["skills"],
    }
  );

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = z
  .object({
    title: z.string().trim().min(3).max(120).optional(),
    department: z.string().trim().min(2).max(80).optional(),
    location: z.string().trim().min(2).max(80).optional(),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]).optional(),
    salaryMin: z.number().int().min(0).nullable().optional(),
    salaryMax: z.number().int().min(0).nullable().optional(),
    salaryCurrency: z.string().length(3).optional(),
    description: z.string().trim().min(20).max(5000).optional(),
    minYearsExperience: z.number().int().min(0).max(40).optional(),
    requiredQualifications: z.string().trim().max(1000).nullable().optional(),
    status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional(),
    skills: z.array(JobSkillInputSchema).min(1).max(30).optional(),
  })
  .refine(
    (data) => {
      if (data.salaryMin != null && data.salaryMax != null) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    {
      message: "salaryMax must be greater than or equal to salaryMin",
      path: ["salaryMax"],
    }
  )
  .refine(
    (data) => {
      if (data.skills) {
        const lowerNames = data.skills.map((s) => s.name.toLowerCase());
        return new Set(lowerNames).size === lowerNames.length;
      }
      return true;
    },
    {
      message: "Skill names must be unique (ignoring case)",
      path: ["skills"],
    }
  );

export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;

export const GetJobsQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type GetJobsQuery = z.infer<typeof GetJobsQuerySchema>;
