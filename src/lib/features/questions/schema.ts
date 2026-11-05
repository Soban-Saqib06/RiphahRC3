import { z } from "zod";

export const QuestionCategoryEnum = z.enum([
  "TECHNICAL",
  "PROJECT",
  "BEHAVIORAL",
  "ROLE_FIT",
]);

export const GetQuestionsQuerySchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
});

export const GenerateQuestionsSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  count: z.coerce.number().int().min(4).max(12).default(8),
  replaceAiQuestions: z.boolean().default(false),
});

export const CreateQuestionSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  category: QuestionCategoryEnum,
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question must not exceed 500 characters"),
});

export const UpdateQuestionSchema = z
  .object({
    question: z
      .string()
      .min(5, "Question must be at least 5 characters")
      .max(500, "Question must not exceed 500 characters")
      .optional(),
    category: QuestionCategoryEnum.optional(),
    sortOrder: z.coerce.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      data.question !== undefined ||
      data.category !== undefined ||
      data.sortOrder !== undefined,
    { message: "At least one field must be provided to update" }
  );

export type GetQuestionsQueryInput = z.infer<typeof GetQuestionsQuerySchema>;
export type GenerateQuestionsInput = z.infer<typeof GenerateQuestionsSchema>;
export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>;
