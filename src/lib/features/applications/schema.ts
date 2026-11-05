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

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum(["IN_REVIEW", "SHORTLISTED", "REJECTED", "SELECTED"], {
    message: "Status must be IN_REVIEW, SHORTLISTED, REJECTED, or SELECTED",
  }),
  note: z
    .string()
    .max(500, "Note must not exceed 500 characters")
    .nullable()
    .optional(),
});

export type UpdateApplicationStatusInput = z.infer<
  typeof UpdateApplicationStatusSchema
>;

export const UpdateRecruiterNotesSchema = z.object({
  recruiterNotes: z
    .string()
    .max(2000, "Recruiter notes must not exceed 2000 characters")
    .nullable()
    .optional(),
});

export type UpdateRecruiterNotesInput = z.infer<
  typeof UpdateRecruiterNotesSchema
>;
