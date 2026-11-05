import { z } from "zod";

export const InterviewTypeEnum = z.enum([
  "PHONE_SCREEN",
  "TECHNICAL",
  "HR",
  "PANEL",
]);

export const InterviewStatusEnum = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
]);

export const ListInterviewsQuerySchema = z.object({
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  status: InterviewStatusEnum.optional(),
  applicationId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const CreateInterviewSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  scheduledAt: z
    .string()
    .datetime({ offset: true })
    .refine(
      (val) => new Date(val).getTime() > Date.now(),
      { message: "Scheduled time must be in the future" }
    ),
  durationMinutes: z.coerce.number().int().min(15).max(240).default(45),
  type: InterviewTypeEnum,
  interviewerName: z
    .string()
    .min(2, "Interviewer name must be at least 2 characters")
    .max(80, "Interviewer name must not exceed 80 characters"),
  location: z.string().max(200, "Location must not exceed 200 characters").nullable().optional(),
});

export const UpdateInterviewSchema = z
  .object({
    scheduledAt: z
      .string()
      .datetime({ offset: true })
      .refine(
        (val) => new Date(val).getTime() > Date.now(),
        { message: "Scheduled time must be in the future" }
      )
      .optional(),
    durationMinutes: z.coerce.number().int().min(15).max(240).optional(),
    type: InterviewTypeEnum.optional(),
    interviewerName: z
      .string()
      .min(2, "Interviewer name must be at least 2 characters")
      .max(80, "Interviewer name must not exceed 80 characters")
      .optional(),
    location: z
      .string()
      .max(200, "Location must not exceed 200 characters")
      .nullable()
      .optional(),
    status: InterviewStatusEnum.optional(),
    feedbackNotes: z
      .string()
      .max(2000, "Feedback notes must not exceed 2000 characters")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // feedbackNotes may be set only when resulting status is COMPLETED
      if (data.feedbackNotes && data.status && data.status !== "COMPLETED") {
        return false;
      }
      return true;
    },
    {
      message: "Feedback notes may only be set when the interview status is COMPLETED",
      path: ["feedbackNotes"],
    }
  );

export type ListInterviewsQueryInput = z.infer<typeof ListInterviewsQuerySchema>;
export type CreateInterviewInput = z.infer<typeof CreateInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof UpdateInterviewSchema>;
