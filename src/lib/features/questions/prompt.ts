import { z } from "zod";

export const QuestionModelItemSchema = z.object({
  category: z.enum(["TECHNICAL", "PROJECT", "BEHAVIORAL", "ROLE_FIT"]),
  question: z.string().min(5).max(400),
  rationale: z.string().min(5).max(300),
});

export const QuestionModelOutputSchema = z.object({
  questions: z.array(QuestionModelItemSchema),
});

export type QuestionModelOutput = z.infer<typeof QuestionModelOutputSchema>;

interface BuildPromptParams {
  jobTitle: string;
  jobDescription: string;
  jobSkills: { name: string; priority: string; importance: number }[];
  candidateName: string;
  parsedResume: Record<string, unknown> | null;
  unverifiedOrPartialItems: { requirement: string; dimension: string; verdict: string; reasoning: string }[];
  targetCount?: number;
}

export function buildQuestionPrompt(params: BuildPromptParams): {
  system: string;
  prompt: string;
} {
  const count = params.targetCount || 8;

  const system = `You are an expert technical recruiter and interviewer preparing a structured interview kit for a hiring manager.
Follow these mandatory rules:
1. Generate exactly ${count} structured interview questions.
2. Categories must be one of: "TECHNICAL", "PROJECT", "BEHAVIORAL", "ROLE_FIT".
3. At least 2 questions MUST be category "PROJECT" and explicitly reference specific projects, architectures, or technologies extracted from the candidate's resume portfolio.
4. At least 2 questions MUST probe unverified or partially matched job criteria (category "TECHNICAL" or "ROLE_FIT"). Phrase them as constructive, open-ended inquiries (e.g., "Tell us about your experience working with..."), never as accusations or gotchas.
5. Never ask about protected attributes (age, gender, nationality, religion, family, disability, marital status).
6. Each question must be 1 to 2 clear sentences (maximum 300 characters).
7. Each rationale must be a concise 1-sentence guidance note explaining what the interviewer should listen for.
8. Output pure JSON matching the requested schema. No markdown fences.`;

  const prompt = `Generate ${count} tailored interview questions for candidate ${params.candidateName}.

POSITION VACANCY:
Title: ${params.jobTitle}
Description: ${params.jobDescription.slice(0, 1000)}
Skills:
${params.jobSkills.map((s) => `- ${s.name} (${s.priority}, importance: ${s.importance}/5)`).join("\n")}

CANDIDATE RESUME PROFILE:
Experience & Projects:
${
  params.parsedResume
    ? JSON.stringify(
        {
          experience: params.parsedResume.experience,
          projects: params.parsedResume.projects,
          skills: params.parsedResume.skills,
        },
        null,
        2
      ).slice(0, 2500)
    : "No parsed resume data available."
}

ASSESSMENT GAPS & UNVERIFIED REQUIREMENTS (Focus probing questions here):
${
  params.unverifiedOrPartialItems.length > 0
    ? params.unverifiedOrPartialItems
        .map((item) => `- [${item.verdict}] ${item.dimension}: ${item.requirement} (${item.reasoning})`)
        .join("\n")
    : "All baseline requirements evidenced in resume."
}

Generate exactly ${count} tailored questions in JSON format:
{
  "questions": [
    {
      "category": "TECHNICAL" | "PROJECT" | "BEHAVIORAL" | "ROLE_FIT",
      "question": "string (1-2 sentences)",
      "rationale": "string (1 sentence recruiter note)"
    }
  ]
}`;

  return { system, prompt };
}
