import { z } from "zod";

export const CreateApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  resumeId: z.string().nullable().optional(),
  coverNote: z
    .string()
    .trim()
    .max(1500, "Cover note must not exceed 1500 characters")
    .nullable()
    .optional(),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
