# API: resumes

Feature folder `resumes`. UI component: resume upload and review panel, used on `/profile` and read-only on the recruiter's `/applications/[applicationId]`. Tables: Resume. Pipeline details: `docs/DATA_MODEL.md` section 7.

## POST /api/resumes
- Access: candidate
- Body: `multipart/form-data` with ONE field `file` (a PDF, 1 byte to 5 MB). Read it with `request.formData()`.
- Effects (synchronous, may take up to about 30 seconds): validate file, save it, extract text, call Gemini for structured extraction, store the result.
- 201 `data`: `{ resume: ResumeDTO }`. **A resume whose parsing failed is still returned with HTTP 201**, with `parseStatus: "FAILED"` and a visible `parseError`, so the UI can show the error plus "Try again" and "Enter details manually".
- Errors: 400 INVALID_FILE ("Please upload a PDF file."), 413 FILE_TOO_LARGE ("The file is larger than 5 MB."), 400 VALIDATION_ERROR (no `file` field)

## GET /api/resumes
- Access: candidate (own resumes only)
- 200 `data`: `{ resumes: ResumeSummaryDTO[] }` newest first

## GET /api/resumes/[resumeId]
- Access: candidate (own resume) or recruiter (any resume)
- Query: `includeText?` ("true" adds `extractedText`; recruiters use it for the evidence view)
- 200 `data`: `{ resume: ResumeDTO }`
- Errors: 404 NOT_FOUND

## PATCH /api/resumes/[resumeId]
- Access: candidate (own resume). Candidate corrections of the extracted data.
- Body: `{ parsedData: ParsedResume }` (full replacement, validated with the ParsedResume zod schema, limits in DATA_MODEL section 4)
- Effects: sets `parsedData`; if the resume was FAILED it becomes PARSED and `parseError` is cleared (manual entry). Existing assessments are NOT changed; the recruiter can re-run them.
- 200 `data`: `{ resume: ResumeDTO }`
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND

## GET /api/resumes/[resumeId]/file
- Access: candidate (own) or recruiter
- Success is NOT JSON: the PDF bytes with `Content-Type: application/pdf` and `Content-Disposition: inline; filename="<originalFileName>"`. Errors use the normal envelope.
- Errors: 404 NOT_FOUND

## POST /api/resumes/[resumeId]/reparse
- Access: candidate (own resume)
- Body: none. Re-reads the stored PDF and runs text extraction and Gemini extraction again.
- 200 `data`: `{ resume: ResumeDTO }` (may be FAILED again with `parseError`)
- Errors: 404 NOT_FOUND, 429 AI_RATE_LIMITED (resume is left unchanged), 502 AI_FAILED (resume is marked FAILED)
