# API: questions

Feature folder `questions`. UI component: `QuestionPanel` (list, generate, edit, add, delete), embedded in `/applications/[applicationId]`. Table: InterviewQuestion. Generation rules and output schema: `docs/DATA_MODEL.md` section 8. Use `getApplicationForUser()` to authorize access to the application.

## GET /api/questions
- Access: recruiter
- Query: `applicationId` (required)
- 200 `data`: `{ questions: QuestionDTO[] }` ordered by `sortOrder` ascending
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND

## POST /api/questions/generate
- Access: recruiter. Waits for Gemini (up to about 30 seconds).
- Body: `{ applicationId: string, count?: number (integer 4-12, default 8), replaceAiQuestions?: boolean (default false) }`
- Effects: generates questions, saves them with `source = "AI"` and `sortOrder` continuing after the existing ones. If `replaceAiQuestions` is true, the application's existing `source = "AI"` questions are deleted first; recruiter-written questions are always kept.
- 201 `data`: `{ questions: QuestionDTO[] }` (ALL current questions of the application)
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND, 429 AI_RATE_LIMITED, 502 AI_FAILED (existing questions are untouched on failure)

## POST /api/questions
- Access: recruiter. Adds a manual question.
- Body: `{ applicationId: string, category: QuestionCategory, question: string (5-500) }`
- 201 `data`: `{ question: QuestionDTO }` (`source = "RECRUITER"`)
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND

## PATCH /api/questions/[questionId]
- Access: recruiter
- Body: any subset of `{ question: string (5-500), category: QuestionCategory, sortOrder: number (integer >= 0) }`
- 200 `data`: `{ question: QuestionDTO }`
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND

## DELETE /api/questions/[questionId]
- Access: recruiter
- 200 `data`: `{ deleted: true }`
- Errors: 404 NOT_FOUND
