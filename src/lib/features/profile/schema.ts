import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name must not exceed 80 characters").optional(),
  headline: z.string().trim().max(120, "Headline must not exceed 120 characters").nullable().optional(),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number must not exceed 30 characters")
    .regex(/^[\d\s+\-()]*$/, "Phone may only contain digits, spaces, +, -, and parentheses")
    .nullable()
    .optional(),
  location: z.string().trim().max(80, "Location must not exceed 80 characters").nullable().optional(),
  summary: z.string().trim().max(1000, "Summary must not exceed 1000 characters").nullable().optional(),
  linkedinUrl: z
    .string()
    .trim()
    .max(200, "LinkedIn URL must not exceed 200 characters")
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
  githubUrl: z
    .string()
    .trim()
    .max(200, "GitHub URL must not exceed 200 characters")
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
