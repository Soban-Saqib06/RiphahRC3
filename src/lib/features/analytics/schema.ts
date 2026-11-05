import { z } from "zod";

export const AnalyticsQuerySchema = z.object({
  jobId: z.string().optional(),
});

export type AnalyticsQueryInput = z.infer<typeof AnalyticsQuerySchema>;
