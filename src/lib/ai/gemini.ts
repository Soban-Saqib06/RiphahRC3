import { z } from "zod";
import { AppError } from "@/lib/api";

export interface GenerateJsonOptions<T> {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  timeoutMs?: number;
}

/**
 * Strip markdown code blocks (e.g. ```json ... ```) from raw model output.
 */
function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();
  const fenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const match = fenceRegex.exec(trimmed);
  return match ? match[1].trim() : trimmed;
}

/**
 * Call Gemini REST API using plain fetch to produce structured JSON output validated by Zod.
 * Follows competition rules:
 * - Reads GEMINI_API_KEY and AI_MODEL from env
 * - 30-second timeout with AbortController
 * - Single retry only on invalid JSON output (never on HTTP 429)
 * - Returns typed, validated output or throws AppError
 */
export async function generateJson<T>({
  system,
  prompt,
  schema,
  timeoutMs = 30000,
}: GenerateJsonOptions<T>): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError(
      "AI_FAILED",
      "Gemini API key is not configured in environment.",
      502
    );
  }

  const model = process.env.AI_MODEL || process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: `${system}\nReturn valid JSON only. Do not include markdown code fences.` }],
    },
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  };

  let attempts = 0;
  const maxAttempts = 2; // initial + 1 retry on invalid JSON

  while (attempts < maxAttempts) {
    attempts++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        throw new AppError("AI_FAILED", "AI generation timed out after 30 seconds.", 502);
      }
      throw new AppError("AI_FAILED", "Failed to reach AI service.", 502);
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      if (response.status === 429) {
        // Never retry 429 per rules
        throw new AppError(
          "AI_RATE_LIMITED",
          "AI rate limit reached. Please try again shortly.",
          429
        );
      }
      throw new AppError(
        "AI_FAILED",
        `AI service returned HTTP ${response.status}.`,
        502
      );
    }

    const data = await response.json();
    const candidatePart = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidatePart) {
      if (attempts >= maxAttempts) {
        throw new AppError("AI_FAILED", "Empty response received from AI model.", 502);
      }
      continue;
    }

    const rawJson = stripMarkdownFences(candidatePart);
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      if (attempts >= maxAttempts) {
        throw new AppError("AI_FAILED", "Model output was not valid JSON.", 502);
      }
      continue;
    }

    const validation = schema.safeParse(parsed);
    if (!validation.success) {
      if (attempts >= maxAttempts) {
        throw new AppError(
          "AI_FAILED",
          `Model output did not match expected schema: ${validation.error.issues[0]?.message}`,
          502
        );
      }
      continue;
    }

    return validation.data;
  }

  throw new AppError("AI_FAILED", "AI generation failed after retries.", 502);
}
