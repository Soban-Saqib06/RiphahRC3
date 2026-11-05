# API: applications

Feature folder `applications`. Pages: `/applications` (recruiter: applicant list for `?jobId=`; candidate: "My applications"), `/applications/[applicationId]` (recruiter review page, candidate status page). Tables: Application, ApplicationStatusEvent. Status rules: `docs/DATA_MODEL.md` section 5. ALL status writes go through `transitionStatus()`.

## POST /api/applications
- Access: candidate
- Body: `{ jobId: string, resumeId?: string | null, coverNote?: string | null (max 1500) }`
- Rules:
  - The job must exist and be OPEN, else 404 NOT_FOUND (does not exist) or 409 JOB_CLOSED.
  - `resumeId` must belong to the caller and have `parseStatus = PARSED`, else 400 RESUME_NOT_READY. If omitted, use the caller's newest PARSED resume; if there is none, 400 NO_PARSED_RESUME ("Upload a resume before applying.").
  - One application per (job, candidate): 409 ALREADY_APPLIED.
- Effects, in one database transaction: create the Application (SUBMITTED) with an event (null -> SUBMITTED, `changedBy` = the candidate), then immediately transition SUBMITTED -> PARSED (event note "Resume parsed"). After the transaction commits, START `runAssessment(applicationId)` in the background WITHOUT awaiting it (call it and attach a `.catch` that only logs). The response must not wait for the AI.
- 201 `data`: `{ application: CandidateApplicationDTO }`

## GET /api/applications
- Access: any
- Recruiter query: `jobId?`, `status?` (ApplicationStatus), `sort?` ("score" default | "date"), `order?` ("desc" default | "asc"), `limit?`. `score` sorts by `effectiveScore`, nulls last.
- Recruiter 200 `data`: `{ applications: ApplicationSummaryDTO[], counts: Record<ApplicationStatus, number> }`. `counts` covers the same `jobId` filter but ignores `status`.
- Candidate: query is ignored; returns only their own applications, newest first.
- Candidate 200 `data`: `{ applications: CandidateApplicationDTO[] }`

## GET /api/applications/[applicationId]
- Access: recruiter (any application) or candidate (own application only; otherwise 404)
- Recruiter 200 `data`: `{ application: ApplicationDetailDTO }`
- Candidate 200 `data`: `{ application: CandidateApplicationDTO }`
- Errors: 404 NOT_FOUND

## PATCH /api/applications/[applicationId]/status
- Access: recruiter
- Body: `{ status: "IN_REVIEW" | "SHORTLISTED" | "REJECTED" | "SELECTED", note?: string | null (max 500) }`
- Allowed transitions: the recruiter rows of the table in DATA_MODEL section 5. Setting `status: "INTERVIEW"` is not accepted here: 400 USE_INTERVIEW_SCHEDULING ("Schedule an interview to move this candidate to the interview stage.").
- 200 `data`: `{ application: ApplicationSummaryDTO, statusEvent: StatusEventDTO }`
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND, 409 INVALID_TRANSITION (message names the current status and the allowed ones)

## PUT /api/applications/[applicationId]/notes
- Access: recruiter
- Body: `{ recruiterNotes: string | null (max 2000) }`
- 200 `data`: `{ application: { id: string, recruiterNotes: string | null } }`
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND
