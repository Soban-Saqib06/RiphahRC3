import dns from "node:dns";
import { z } from "zod";
import { AppError } from "@/lib/api";

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

export interface GenerateJsonOptions<T> {
  system?: string;
  prompt: string;
  schema: z.ZodType<T>;
  timeoutMs?: number;
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  return cleaned.trim();
}

import { setGlobalDispatcher, Agent } from "undici";

// Ensure all fetch calls resolve via IPv4 to prevent IPv6 timeouts on Linux
try {
  setGlobalDispatcher(
    new Agent({
      connect: {
        lookup: (hostname, options, callback) => {
          dns.lookup(hostname, { ...options, family: 4 }, callback);
        },
      },
    })
  );
} catch {
  // Ignore if already set
}

/**
 * Single call to Gemini API with timeout using fetch.
 */
async function callGeminiOnce(
  apiKey: string,
  model: string,
  prompt: string,
  system?: string,
  timeoutMs = 30000
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body: Record<string, unknown> = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    if (system) {
      body.systemInstruction = { parts: [{ text: system }] };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (res.status === 429) {
      throw new AppError(
        "AI_RATE_LIMITED",
        "AI model quota hit. Please retry in a few moments.",
        429
      );
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`Gemini API returned ${res.status}: ${errText}`);
      throw new AppError(
        "AI_FAILED",
        `AI service unavailable (status ${res.status}).`,
        502
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== "string") {
      throw new AppError("AI_FAILED", "Model returned an empty response.", 502);
    }

    return text;
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }
    if ((err as Error)?.name === "AbortError") {
      throw new AppError("AI_FAILED", "AI request timed out after 30 seconds.", 502);
    }
    console.error("Gemini network error:", err);
    throw new AppError("AI_FAILED", "AI service connection error.", 502);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generate structured JSON output with Zod validation and 1 retry on invalid JSON.
 */
export async function generateJson<T>({
  system,
  prompt,
  schema,
  timeoutMs = 30000,
}: GenerateJsonOptions<T>): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.AI_MODEL || "gemini-3.8-flash";

  if (!apiKey) {
    throw new AppError("AI_FAILED", "AI configuration error: missing GEMINI_API_KEY.", 502);
  }

  let rawText = "";
  try {
    rawText = await callGeminiOnce(apiKey, model, prompt, system, timeoutMs);
    const cleaned = cleanJsonString(rawText);
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (firstErr: unknown) {
    if (firstErr instanceof AppError && firstErr.code === "AI_RATE_LIMITED") {
      throw firstErr;
    }

    // If it failed because of invalid JSON or schema, retry once only
    console.warn("First Gemini attempt failed schema/parse validation. Error was:", firstErr);
    console.warn("Raw text received was:", rawText.slice(0, 300));
    try {
      const retryPrompt = `${prompt}\n\nIMPORTANT: Return valid raw JSON only matching the schema exactly. Do not wrap in markdown or markdown fences.`;
      rawText = await callGeminiOnce(apiKey, model, retryPrompt, system, timeoutMs);
      const cleaned = cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned);
      return schema.parse(parsed);
    } catch (secondErr: unknown) {
      if (secondErr instanceof AppError) {
        throw secondErr;
      }
      console.error("Gemini retry failed:", secondErr);
      throw new AppError("AI_FAILED", "Failed to obtain valid structured output from AI model.", 502);
    }
  }
}
