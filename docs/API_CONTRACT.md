# Recruitment & Talent Intelligence Platform
# Database Schema and API Contract

**Purpose:** Shared implementation contract for both coding agents.
**Source of truth:** `PRODUCT_BRIEF.md`.
**Stack:** Next.js App Router, TypeScript, Prisma, MySQL, Zod, Gemini API.
**Target:** Local-machine MVP under a three-hour competition constraint.

---

## 0. Instructions to both agents

1. Treat this document and `schema.prisma` as the agreed database/API contract.
2. Do not independently rename models, fields, enum values, endpoint paths, or response properties.
3. Agent B owns `prisma/schema.prisma`, Prisma migrations, Prisma client setup, database helpers, and the core seed. Feature owners must coordinate schema changes rather than silently editing the schema.
4. Feature owners own their assigned vertical feature: UI, Route Handlers, validation, business logic, and feature-specific seed data.
5. If an implementation detail is not specified, choose the simplest implementation consistent with the product brief and record the decision.
6. Do not add Redis, a vector database, a separate backend service, queues, or other infrastructure for this MVP.
7. Use real database data for dashboard metrics and the demo workflow. Do not substitute decorative hardcoded KPIs or hardcoded AI assessment results.
8. AI outputs are recommendations/evidence summaries only. Recruiters make all shortlist/reject/select decisions.
9. Validate request bodies and query parameters with Zod on the server. Enforce authorization on the server, not only by hiding UI controls.
10. Before completion, run Prisma validation/generation, TypeScript checks, and feature user-flow tests.

## 1. Product scope represented

The schema supports:
- Recruiter and candidate accounts and profiles.
- Recruiter-owned vacancies and structured job requirements.
- Candidate PDF resume metadata, stored file location, extracted text, and structured extraction.
- Applications linking candidates, vacancies, and the resume version used.
- Application status history.
- Repeatable AI assessments with weighted scores and per-requirement evidence/gaps.
- Recruiter comparison using assessment data (computed at request time; no comparison table).
- Interviews, generated/editable questions, scheduling, feedback, and decision notes.
- Dashboard analytics computed from persisted records (no analytics table).

It intentionally excludes advanced semantic vector search, talent-pool CRM, duplicate merging, complex calendar availability, and autonomous hiring decisions.

## 2. Database model map

```text
User
 ├── CandidateProfile (one-to-one, role=CANDIDATE)
 │    ├── Resume (one-to-many)
 │    │    └── ResumeExtraction (one-to-one per resume)
 │    └── Application (one-to-many)
 │
 └── RecruiterProfile (one-to-one, role=RECRUITER)
      └── Job (one-to-many)
           ├── JobRequirement (one-to-many)
           │    └── AssessmentRequirementResult
           └── Application (one-to-many)
                ├── ApplicationStatusHistory (one-to-many)
                ├── Assessment (one-to-many; preserves re-runs)
                │    └── AssessmentRequirementResult (one-to-many)
                └── Interview (one-to-many)
                     └── InterviewQuestion (one-to-many)
```

`Application` is the central join between a candidate and a job. A unique constraint on `(jobId, candidateId)` prevents duplicate applications to the same vacancy.

### 2.1 Model purpose

| Model | Purpose |
|---|---|
| `User` | Login identity, role, active flag |
| `CandidateProfile` | Candidate-facing profile data |
| `RecruiterProfile` | Recruiter organization/title |
| `Job` | Vacancy and matching dimension weights |
| `JobRequirement` | Individual skill/experience/project/qualification criteria |
| `Resume` | PDF metadata and local storage key |
| `ResumeExtraction` | Extracted raw text and structured fields |
| `Application` | Candidate applies to a job; current hiring status |
| `ApplicationStatusHistory` | Auditable status transitions |
| `Assessment` | One AI assessment run for an application/resume |
| `AssessmentRequirementResult` | Match/evidence/gap for one job requirement |
| `Interview` | Interview plan and scheduled interview |
| `InterviewQuestion` | Editable AI/manual questions |

### 2.2 Relationship rules

- A `User` has exactly one role. Candidate accounts should have a `CandidateProfile`; recruiter accounts should have a `RecruiterProfile`. Enforce this invariant in registration/service logic because the relational schema cannot enforce the conditional one-to-one requirement by role alone.
- A recruiter owns jobs through `Job.recruiterId`.
- A job owns its requirements. Deleting a job cascades to its requirements, but applications restrict job deletion. Prefer changing `Job.status` to `ARCHIVED` or `CLOSED`; do not hard-delete a job with applications.
- A candidate owns resumes. Files are stored on disk in a controlled upload directory; `Resume.storageKey` stores a generated relative key/path, not file bytes or an arbitrary client-provided path.
- An application belongs to one job and one candidate profile. A candidate can apply to a given job only once.
- `Application.resumeId` records the resume version used for that application. The recommended MVP flow requires a parsed/current resume before applying.
- A resume can be used by multiple applications. An assessment records both `applicationId` and the exact `resumeId`, preserving which resume version produced the result.
- An application can have multiple assessments over time. Use the newest completed assessment as current in normal UI, but retain earlier runs.
- Each `AssessmentRequirementResult` refers to one requirement and one assessment. At most one result per `(assessmentId, requirementId)`.
- A requirement's `importance` is relative importance inside its dimension. The job's four dimension weights are global weights and default to 50/25/15/10.
- `NO_EVIDENCE` means the resume did not provide sufficient evidence. It is not proof that the candidate lacks the skill.
- Interview questions are children of an interview draft/scheduled interview. Generate questions by creating a draft interview first, then attaching question records.
- Candidate comparison is a read-only projection across selected applications; do not persist a comparison record for the MVP.

## 3. Schema and database setup

The accompanying `schema.prisma` is canonical.

Expected `.env` key (never commit the real secret):

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
```

Commands:

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init
```

Do not silently switch to SQLite or another database: the product brief confirms MySQL.

### 3.1 Invariants to enforce in application code

- A candidate cannot apply twice to the same job.
- Only a recruiter may create/manage their own jobs.
- Only a candidate may create an application for their own candidate profile.
- A candidate may only read their own profile, resumes, and applications.
- A recruiter may only manage jobs they own and applications belonging to those jobs.
- A resume selected for an application must belong to the applying candidate.
- An assessment's `resumeId` must belong to the candidate on that assessment's application.
- Assessment scores must be in the range 0–100.
- Job matching weights must be non-negative and sum to exactly 100.
- Requirement `importance` must be greater than zero.
- Interview duration, when provided, must be a positive integer.
- A scheduled interview must have `scheduledAt`; a draft interview may omit it.
- A job must be `PUBLISHED` to receive an application.
- A recruiter decision/status change must create an `ApplicationStatusHistory` row in the same logical operation.
- A candidate cannot set their own application to `SHORTLISTED`, `REJECTED`, `INTERVIEW`, or `SELECTED`.
- Do not automatically shortlist/reject based on an AI score.

### 3.2 Keep three status concepts separate

**Application status** = recruitment lifecycle:
`SUBMITTED → PARSED → ASSESSMENT_READY → IN_REVIEW → SHORTLISTED / REJECTED → INTERVIEW → SELECTED`

`WITHDRAWN` is candidate-initiated. Transitions are validated server-side and need not be strictly linear.

**Resume status** = file/parsing lifecycle:
`UPLOADED → PROCESSING → PARSED` or `FAILED`.

**Assessment status** = AI assessment lifecycle:
`PENDING → PROCESSING → COMPLETED` or `FAILED`.

A parser/Gemini failure must not be represented as an application hiring decision.

## 4. API conventions

Base path: `/api`.

### 4.1 Authentication/session

Assume a server-managed session represented by a secure, HttpOnly cookie. The exact session library is a foundation decision. The browser must never receive password hashes or secrets.

Success envelope:

```json
{ "data": {}, "message": "Optional human-readable message" }
```

Error envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be validated",
    "details": []
  }
}
```

HTTP status conventions:
- `200` successful read/update.
- `201` created.
- `204` successful deletion with no response body, only when deletion is appropriate.
- `400` malformed/invalid input.
- `401` unauthenticated.
- `403` authenticated but not permitted.
- `404` missing resource (also use this when revealing existence would leak another user's resource).
- `409` duplicate application or conflicting/invalid state transition.
- `413` upload too large.
- `415` unsupported file type.
- `422` semantically invalid operation, if used consistently.
- `500` unexpected server error; never return stack traces or secrets.

Dates/times are ISO 8601 strings. IDs are opaque strings. Scores are numbers from 0 to 100. Paginated responses:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Default `pageSize=20`, maximum 100; validate `page >= 1`.

### 4.2 Authentication endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `POST /api/auth/register` | Public | Register candidate or recruiter |
| `POST /api/auth/login` | Public | Create session |
| `POST /api/auth/logout` | Authenticated | Destroy session |
| `GET /api/auth/me` | Authenticated | Return safe current user/profile |

Register request:

```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.test",
  "password": "example-password",
  "role": "CANDIDATE"
}
```

For `CANDIDATE`, create `User` and `CandidateProfile` in one Prisma transaction. For `RECRUITER`, create `User` and `RecruiterProfile` in one transaction. Do not permit arbitrary roles. Hash passwords with a suitable password-hashing library; never store plaintext passwords. If using a seeded recruiter, document local-only demo credentials.

Login request:

```json
{ "email": "ayesha@example.test", "password": "example-password" }
```

Success sets the session cookie and returns safe identity/profile data. Never return `passwordHash`.

`GET /api/auth/me` data example:

```json
{
  "id": "user_id",
  "name": "Ayesha Khan",
  "email": "ayesha@example.test",
  "role": "CANDIDATE",
  "candidateProfile": {
    "id": "candidate_profile_id",
    "headline": "Junior Backend Developer",
    "location": "Lahore"
  }
}
```

For recruiters return `recruiterProfile` instead.

### 4.3 Candidate profile endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `GET /api/candidate/profile` | Candidate | Read own profile |
| `PATCH /api/candidate/profile` | Candidate | Update own profile |

PATCH accepts optional fields:

```json
{
  "phone": "+92...",
  "location": "Lahore",
  "headline": "Backend Developer",
  "summary": "Candidate-written summary",
  "linkedinUrl": "https://www.linkedin.com/in/example",
  "portfolioUrl": "https://example.test"
}
```

Only update allowlisted profile fields. Do not accept `userId`, role, or another candidate's profile ID from the client.

### 4.4 Job/vacancy endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `GET /api/jobs` | Public/authenticated | List published vacancies |
| `GET /api/jobs/:jobId` | Public/authenticated | Vacancy details and requirements |
| `POST /api/jobs` | Recruiter | Create own vacancy |
| `PATCH /api/jobs/:jobId` | Owning recruiter | Update vacancy and requirements |
| `PATCH /api/jobs/:jobId/status` | Owning recruiter | Publish, close, or archive |

Public list query parameters: `q`, `location`, `employmentType`, `page`, `pageSize`. Only return `PUBLISHED` jobs to public/candidate callers. Recruiters can list their own jobs of all statuses through recruiter dashboard/job endpoints.

Create request:

```json
{
  "title": "Backend Developer",
  "department": "Engineering",
  "location": "Lahore",
  "employmentType": "FULL_TIME",
  "salaryMin": 80000,
  "salaryMax": 150000,
  "salaryCurrency": "PKR",
  "description": "Build and maintain backend services...",
  "experienceMinYears": 1,
  "experienceMaxYears": 3,
  "qualificationSummary": "CS degree or equivalent experience",
  "matchingWeights": {
    "skills": 50,
    "experience": 25,
    "projectRelevance": 15,
    "qualification": 10
  },
  "requirements": [
    {
      "dimension": "SKILL",
      "title": "Python",
      "description": "Practical Python development experience",
      "isRequired": true,
      "importance": 1.5,
      "sortOrder": 1
    },
    {
      "dimension": "SKILL",
      "title": "Django",
      "description": "Experience building Django applications",
      "isRequired": true,
      "importance": 1.5,
      "sortOrder": 2
    },
    {
      "dimension": "SKILL",
      "title": "PostgreSQL",
      "description": "Relational database design and querying",
      "isRequired": true,
      "importance": 1,
      "sortOrder": 3
    },
    {
      "dimension": "SKILL",
      "title": "Docker",
      "description": "Containerization experience",
      "isRequired": true,
      "importance": 1,
      "sortOrder": 4
    },
    {
      "dimension": "EXPERIENCE",
      "title": "Backend development experience",
      "description": "Relevant professional or substantial project experience",
      "isRequired": true,
      "importance": 1,
      "sortOrder": 1
    },
    {
      "dimension": "PROJECT",
      "title": "Backend/API project",
      "description": "Evidence of building a backend service or API",
      "isRequired": false,
      "importance": 1,
      "sortOrder": 1
    },
    {
      "dimension": "QUALIFICATION",
      "title": "Relevant degree or equivalent",
      "description": "Computer science or related qualification, or equivalent evidence",
      "isRequired": false,
      "importance": 1,
      "sortOrder": 1
    }
  ]
}
```

The server derives `recruiterId` from the authenticated session; never trust a client-supplied recruiter ID. Create the job and requirements in a transaction. Validate matching weights sum to 100.

For PATCH, accept scalar job fields and an optional complete `requirements` array. If `requirements` is supplied, replace the list transactionally; if omitted, leave it unchanged.

Publish/close request:

```json
{ "status": "PUBLISHED" }
```

On first publish set `publishedAt`; when closed set `closedAt`. Do not delete jobs to remove them from listings.

Job detail response includes:

```json
{
  "id": "job_id",
  "title": "Backend Developer",
  "department": "Engineering",
  "location": "Lahore",
  "employmentType": "FULL_TIME",
  "description": "...",
  "status": "PUBLISHED",
  "matchingWeights": {
    "skills": 50,
    "experience": 25,
    "projectRelevance": 15,
    "qualification": 10
  },
  "requirements": [
    {
      "id": "requirement_id",
      "dimension": "SKILL",
      "title": "Python",
      "description": "...",
      "isRequired": true,
      "importance": 1.5,
      "sortOrder": 1
    }
  ],
  "applicationCount": 3
}
```

Do not include private applicant data in public job responses.

### 4.5 Resume upload and parsing endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `POST /api/resumes` | Candidate | Upload PDF and create Resume |
| `GET /api/resumes` | Candidate | List own resumes |
| `GET /api/resumes/:resumeId` | Owning candidate; authorized recruiter in application review | Read metadata/permitted extraction |
| `POST /api/resumes/:resumeId/parse` | Owning candidate or authorized recruiter action | Start/retry extraction |
| `PATCH /api/resumes/:resumeId/current` | Candidate | Set current resume |

Upload uses `multipart/form-data` with a `file` field. Validate PDF MIME type and file signature, enforce a configured size limit, generate the storage filename on the server, and store only the generated relative `storageKey`. Never trust the uploaded filename as a filesystem path. Store files outside publicly served static directories. The exact size limit and parser library are implementation decisions.

Upload response:

```json
{
  "data": {
    "id": "resume_id",
    "originalFilename": "candidate-cv.pdf",
    "status": "UPLOADED",
    "isCurrent": true,
    "uploadedAt": "2026-11-05T10:00:00.000Z"
  }
}
```

When setting a resume current, set other resumes for that candidate to `isCurrent=false` and the selected resume to `true` in a transaction.

Parsing can be synchronous for the local MVP:

```json
{
  "data": {
    "id": "resume_id",
    "status": "PARSED",
    "parsedAt": "2026-11-05T10:02:00.000Z",
    "extraction": {
      "extractedName": "Demo Candidate One",
      "extractedEmail": "candidate1@example.test",
      "extractedPhone": null,
      "professionalSummary": "Backend developer...",
      "skills": ["Python", "Django", "PostgreSQL"],
      "education": [],
      "experience": [],
      "projects": []
    }
  }
}
```

If extraction fails, set `Resume.status=FAILED` and return a clear error. Do not fabricate extracted fields. Preserve extracted raw text in `ResumeExtraction.rawText`. Validate structured JSON with Zod before persistence. Candidate correction/editing is optional; never silently overwrite the original raw text.

### 4.6 Application endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `POST /api/jobs/:jobId/applications` | Candidate | Apply to published job |
| `GET /api/candidate/applications` | Candidate | List own applications/status |
| `GET /api/applications/:applicationId` | Candidate owner or owning recruiter | Read application |
| `PATCH /api/applications/:applicationId/status` | Owning recruiter | Change hiring status |
| `POST /api/applications/:applicationId/withdraw` | Candidate owner | Withdraw own application |
| `GET /api/jobs/:jobId/applications` | Owning recruiter | List applicants for own job |

Apply request:

```json
{
  "resumeId": "resume_id",
  "coverLetter": "Optional short cover letter"
}
```

Verify caller is a candidate, resume belongs to that candidate, job is published, no prior application exists, and (recommended MVP rule) resume is parsed. Create application with `SUBMITTED` and initial history row (`fromStatus=null`, `toStatus=SUBMITTED`) in one transaction. Return `409 DUPLICATE_APPLICATION` for the unique constraint conflict.

Recruiter status update:

```json
{
  "status": "SHORTLISTED",
  "note": "Strong evidence for the required backend skills."
}
```

Only allow valid recruiter transitions. At minimum support `IN_REVIEW`, `SHORTLISTED`, `REJECTED`, `INTERVIEW`, and `SELECTED`. Do not let recruiters manually set `PARSED` or `ASSESSMENT_READY`; those are processing milestones. Create status history in the same transaction. Do not assume an interview exists merely because status becomes `INTERVIEW`.

Candidate application list returns only caller's own applications and safe fields:

```json
{
  "id": "application_id",
  "status": "ASSESSMENT_READY",
  "appliedAt": "2026-11-05T10:05:00.000Z",
  "job": {
    "id": "job_id",
    "title": "Backend Developer",
    "location": "Lahore",
    "status": "PUBLISHED"
  }
}
```

Do not expose recruiter-only assessment details to candidates unless explicitly added to scope.

### 4.7 AI assessment endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `POST /api/applications/:applicationId/assessment` | Owning recruiter | Run/re-run AI assessment |
| `GET /api/applications/:applicationId/assessment` | Owning recruiter | Get latest assessment |
| `GET /api/assessments/:assessmentId` | Owning recruiter | Get assessment and requirement evidence |

POST request:

```json
{ "forceNew": false }
```

Processing contract:
1. Verify recruiter owns the job linked to the application.
2. Verify application has a parsed resume and extraction.
3. Create `Assessment` with `PENDING`, then `PROCESSING`, and exact `resumeId`.
4. Load job description, requirements, matching weights, resume extraction, and raw text.
5. Call Gemini from the server only; never expose the API key to browser code.
6. Require structured JSON output and validate with Zod before saving.
7. Save dimension scores, overall score, recommendation, summary/explanation, model/prompt version, and one result per job requirement.
8. Mark assessment `COMPLETED` and application `ASSESSMENT_READY` unless recruiter has already moved it to a later hiring stage. Never regress a later status.
9. On failure, mark assessment `FAILED`, save a safe error message, and do not store a fake score.

Response example:

```json
{
  "id": "assessment_id",
  "status": "COMPLETED",
  "scores": {
    "skills": 86,
    "experience": 70,
    "projectRelevance": 82,
    "qualification": 65,
    "overall": 78.9
  },
  "recommendation": "STRONG_MATCH",
  "summary": "The candidate shows relevant backend experience...",
  "explanation": "The strongest evidence is...",
  "requirementResults": [
    {
      "requirementId": "req_python",
      "requirementTitle": "Python",
      "dimension": "SKILL",
      "evidenceStatus": "MATCHED",
      "score": 95,
      "evidenceExcerpt": "Built a Django REST API using Python...",
      "evidenceSection": "Projects",
      "explanation": "Direct project evidence supports this requirement."
    },
    {
      "requirementId": "req_docker",
      "requirementTitle": "Docker",
      "dimension": "SKILL",
      "evidenceStatus": "NO_EVIDENCE",
      "score": null,
      "evidenceExcerpt": null,
      "evidenceSection": null,
      "explanation": "No supporting Docker evidence was found in the supplied resume text."
    }
  ]
}
```

Scoring rules:
- Default dimension weights: skills 50%, experience 25%, project relevance 15%, qualifications 10%.
- Dimension and overall scores are 0–100.
- Calculate overall deterministically in application code:
  `(skillsScore * skillsWeight + experienceScore * experienceWeight + projectRelevanceScore * projectRelevanceWeight + qualificationScore * qualificationWeight) / 100`.
- If a dimension cannot genuinely be assessed, do not silently treat missing data as zero. Mark insufficient/incomplete with an explicit policy or return a conservative score with a clear evidence limitation; document the chosen policy.
- Model evidence excerpts must be grounded in supplied resume text. Verify an excerpt exists in or is traceable to stored text before presenting it as a direct quotation. Otherwise label it as an AI summary, not a quote.
- `NO_EVIDENCE` means “not found in the supplied resume,” not “candidate does not have this skill.”
- Recommendation is advisory and must never automatically change hiring status.
- Assess job-related evidence only. Do not use or infer protected personal characteristics.

### 4.8 Candidate comparison endpoint

| Method and path | Access | Purpose |
|---|---|---|
| `POST /api/jobs/:jobId/candidates/compare` | Owning recruiter | Side-by-side comparison |

Request:

```json
{
  "applicationIds": ["application_id_1", "application_id_2", "application_id_3"]
}
```

Accept 2–5 unique IDs. Every application must belong to the specified job, and caller must own that job. Return candidate display information, latest completed scores, recommendation, matched requirements, and evidence gaps. Do not create a database row. If an application has no completed assessment, return `assessment: null` and an explicit pending indicator rather than inventing scores.

### 4.9 Interview endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `POST /api/applications/:applicationId/interviews` | Owning recruiter | Create interview draft |
| `GET /api/interviews` | Recruiter | List interviews for own jobs |
| `GET /api/interviews/:interviewId` | Owning recruiter | Read interview and questions |
| `PATCH /api/interviews/:interviewId` | Owning recruiter | Edit/schedule/update feedback |
| `POST /api/interviews/:interviewId/questions/generate` | Owning recruiter | Generate questions with Gemini |
| `POST /api/interviews/:interviewId/questions` | Owning recruiter | Add manual question |
| `PATCH /api/interviews/:interviewId/questions/:questionId` | Owning recruiter | Edit question |
| `DELETE /api/interviews/:interviewId/questions/:questionId` | Owning recruiter | Remove question |

Create draft request:

```json
{
  "type": "TECHNICAL",
  "durationMinutes": 60,
  "interviewerName": "Hiring Manager",
  "interviewerEmail": "manager@example.test"
}
```

Derive `createdById` from session. The application must belong to a job owned by caller.

Schedule/update request:

```json
{
  "status": "SCHEDULED",
  "scheduledAt": "2026-11-07T10:00:00.000Z",
  "durationMinutes": 60,
  "type": "TECHNICAL",
  "interviewerName": "Hiring Manager",
  "interviewerEmail": "manager@example.test",
  "locationOrMeetingLink": "Room 2"
}
```

When status is `SCHEDULED`, require `scheduledAt`. Duration, if provided, must be positive. Do not implement complex calendar conflict detection for this MVP.

Generate questions request:

```json
{
  "focusAreas": ["Django", "PostgreSQL", "candidate project experience"],
  "count": 6
}
```

Limit count to 3–10. Generate questions based on vacancy, candidate evidence, and job requirements. Persist as `AI_GENERATED`; recruiters can edit/delete. If Gemini fails, return an error and preserve existing questions.

Manual question request:

```json
{
  "question": "Explain how you would design a Django REST API for...",
  "category": "Django",
  "sortOrder": 1
}
```

Feedback and decision fields are human-authored. Never fabricate interview feedback.

### 4.10 Dashboard and analytics endpoints

| Method and path | Access | Purpose |
|---|---|---|
| `GET /api/recruiter/dashboard` | Recruiter | Real KPI counts and recent activity |
| `GET /api/recruiter/analytics` | Recruiter | Counts by job and application stage |

Response example:

```json
{
  "data": {
    "activeJobs": 2,
    "totalApplications": 12,
    "pendingReviews": 4,
    "shortlistedCandidates": 3,
    "upcomingInterviews": 2,
    "applicationsByStage": {
      "SUBMITTED": 2,
      "PARSED": 1,
      "ASSESSMENT_READY": 3,
      "IN_REVIEW": 3,
      "SHORTLISTED": 2,
      "REJECTED": 1,
      "INTERVIEW": 0,
      "SELECTED": 0,
      "WITHDRAWN": 0
    },
    "recentApplications": []
  }
}
```

This is a shape example only. Counts must be computed from authenticated recruiter's jobs/applications. Define `pendingReviews` consistently (recommended: `SUBMITTED`, `PARSED`, `ASSESSMENT_READY`, `IN_REVIEW`). Define `upcomingInterviews` as scheduled interviews in the future. Never count another recruiter's records.

## 5. Status transition policy

Use one server-side function such as `canTransitionApplicationStatus(from, to, actorRole)`. Do not scatter rules across pages.

Recommended recruiter transitions:
- `SUBMITTED → IN_REVIEW`
- `PARSED → IN_REVIEW`
- `ASSESSMENT_READY → IN_REVIEW`
- `IN_REVIEW → SHORTLISTED | REJECTED`
- `SHORTLISTED → INTERVIEW | REJECTED`
- `INTERVIEW → SELECTED | REJECTED`
- Optionally allow `SHORTLISTED → SELECTED` if the team intentionally supports skipping interviews.
- `WITHDRAWN` is set only by candidate owner.
- Parsing/assessment services may set `SUBMITTED → PARSED → ASSESSMENT_READY`, but must not overwrite later recruiter decisions.
- If an assessment completes after recruiter moved the application to `IN_REVIEW`, keep `IN_REVIEW`; do not regress to `ASSESSMENT_READY`.

Every successful transition creates history with previous status, next status, actor, timestamp, and optional note.

## 6. Zod validation contracts

Create shared Zod schemas for:
- `registerSchema`, `loginSchema`
- `candidateProfileUpdateSchema`
- `jobCreateSchema`, `jobUpdateSchema`, `jobStatusSchema`
- `jobRequirementSchema`
- parsed resume extraction response
- `applyToJobSchema`
- `applicationStatusUpdateSchema`
- assessment request and Gemini assessment output
- `compareCandidatesSchema`
- `interviewCreateSchema`, `interviewUpdateSchema`
- `generateQuestionsSchema`, `manualInterviewQuestionSchema`

Validate required strings, email/URLs, enums, sensible numeric ranges, weights summing to 100, scores 0–100, 2–5 unique comparison IDs, and question count 3–10. Reject unexpected fields where practical. Never mass-assign Prisma records directly from request JSON.

## 7. Transaction boundaries

Use Prisma `$transaction` for:
1. Registration: User + role-specific profile.
2. Job creation: Job + JobRequirement rows.
3. Job update with requirement replacement.
4. Application submission: Application + initial status history.
5. Application status change: Application + status history.
6. Assessment persistence: Assessment + all requirement results; mark completed only after valid results are stored.
7. Interview creation with initial questions, if done together.
8. Setting current resume: unset prior current resume + set selected resume.

Do not hold a DB transaction open while waiting for Gemini or PDF parsing. Create a processing record, perform external work, then persist the result in a short transaction.

## 8. Seed data contract

Use deterministic, idempotent seeds with `upsert` where practical. Feature seeds must never delete shared/core data.

Suggested order:
- `prisma/seed/00-core.ts`: demo recruiter and shared user/profile records. Owned by Agent B.
- `prisma/seed/10-jobs.ts`: Backend Developer vacancy and requirements.
- `prisma/seed/20-candidates-resumes.ts`: three demo candidates, profiles, resume metadata and safe sample resume text/extractions.
- `prisma/seed/30-applications.ts`: three applications linking candidates to vacancy, with meaningful statuses.
- `prisma/seed/40-assessments.ts`: only genuine prior assessment results. Do not seed fabricated AI scores as if Gemini generated them. If sample scores are unavoidable, label them clearly as demo/sample in UI and documentation; preferably generate genuine assessments during demo preparation.
- `prisma/seed/50-interviews.ts`: interview and questions where useful.

Demo flow:
1. Recruiter signs in and sees dashboard.
2. Opens Backend Developer vacancy.
3. Sees three applicants.
4. Inspects resume information and evidence.
5. Generates/retrieves genuine Gemini assessments.
6. Compares candidates.
7. Manually shortlists one.
8. Generates/edits questions and schedules interview.
9. Dashboard reflects database changes.

Use fictional data only. Document local demo credentials.

## 9. Recommended ownership and implementation order

Permanent platform ownership:
- **Agent A:** root layout, app shell, navigation, global styling, design tokens, shared UI components.
- **Agent B:** Prisma schema/migrations, database connection, Prisma singleton, shared API helpers, core seed and seed runner.

Feature work remains vertical. Suggested sequence:
1. Foundation: app starts, DB connects, schema validates, conventions agreed.
2. Authentication and profiles.
3. Jobs: recruiter CRUD, requirements, public listing/detail.
4. Candidate resume: PDF upload, extraction, persistence.
5. Applications: apply, recruiter applicant list, status history.
6. AI matching: Gemini structured output, evidence and scores.
7. Candidate review/comparison.
8. Interviews: question generation/editing and scheduling.
9. Dashboard: real aggregate counts and recent activity.
10. Final integration: complete recruiter demo and basic candidate journey.

This is dependency-aware, not a requirement to build serially. Independent vertical features can run in parallel once shared contracts are agreed.

## 10. Minimum acceptance checklist

### Database
- [ ] `npx prisma validate` passes.
- [ ] `npx prisma generate` passes.
- [ ] Migration applies to configured MySQL.
- [ ] Foreign keys and unique constraints work.
- [ ] Seeds can run repeatedly without duplicating demo records.

### Security/access
- [ ] Passwords are hashed.
- [ ] Session cookie is HttpOnly and server-validated.
- [ ] Candidate cannot access recruiter APIs.
- [ ] Recruiter cannot access another recruiter's jobs/applications.
- [ ] Candidate cannot read another candidate's profile/resume/application.
- [ ] Gemini key and password hashes never reach client responses.

### Core workflow
- [ ] Recruiter creates and publishes a job with requirements.
- [ ] Candidate uploads PDF and sees parsing status.
- [ ] Candidate applies to a published job once.
- [ ] Recruiter sees applicants for their job.
- [ ] Genuine Gemini assessment can be generated and persisted.
- [ ] Assessment includes scores, explanation, matched evidence, and gaps.
- [ ] Missing evidence is not described as proof of absence.
- [ ] Recruiter manually shortlists/rejects.
- [ ] Recruiter compares applicants.
- [ ] Recruiter generates/edits questions and schedules interview.
- [ ] Dashboard reflects real database changes.

## 11. Explicit MVP simplifications

- No vector database or embedding infrastructure.
- No background queue/worker; synchronous server request is acceptable for local MVP, with loading UI and sensible timeouts.
- No multi-tenant organizations or complex permission matrix.
- No full calendar integration or conflict engine.
- No candidate-to-job recommendation engine.
- No separate analytics tables; compute dashboard aggregates from existing records.
- No autonomous hiring decision.
- No event-sourcing architecture beyond application status history.
- No hard deletion of jobs with applications.
- No microservices.

If scope must shrink, preserve this order: job → candidate/resume → application → genuine assessment with evidence → recruiter decision → interview. A polished dashboard must not take precedence over a working end-to-end recruiter workflow.
