import { z } from "zod";

/**
 * Validation schema for GET /api/comparison query parameters.
 */
export const ComparisonQuerySchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  applicationIds: z.string().min(1, "Application IDs are required"),
});

export type ComparisonQueryInput = z.infer<typeof ComparisonQuerySchema>;
