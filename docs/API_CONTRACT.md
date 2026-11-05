# API_CONTRACT (index)

> Humans own this file and `docs/api/*.md`. Agents read them and NEVER edit them.
> **Read this index fully, then ONLY `docs/api/<your feature>.md` and the feature files of routes you call.**
> Tables and rules behind these routes: `docs/DATA_MODEL.md` and `prisma/schema.prisma`.

## 1. Conventions

- Base path `/api`. All bodies are JSON (`Content-Type: application/json`), except the resume upload (multipart) and the resume file download (PDF bytes).
- Every JSON response uses the envelope from `src/lib/api.ts`:
```json
{ "success": true, "data": { } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Plain-language message", "fields": { "email": "Enter a valid email address" } } }
```
`fields` appears only for `VALIDATION_ERROR`. Messages are written for the end user.
- Auth: cookie `session` (see DATA_MODEL section 9). Every route states its access level: **public**, **any** (logged in), **recruiter**, **candidate**.
- Authorization is enforced inside every route handler with `requireUser(roles?)`. Candidates may only read and write their own records.
- A record the caller may not see returns `404 NOT_FOUND` (not 403), so IDs cannot be probed. Use `403 FORBIDDEN` only for a wrong role.
- All route handlers run on the Node.js runtime. All inputs are validated with zod (schemas in `src/lib/features/<feature>/schema.ts`). Unknown body fields are rejected or stripped (`.strict()` or default strip; pick one and be consistent).
- Lists accept `limit` (1 to 100, default 50). Order is stated per route.
- Dates are ISO 8601 UTC strings. Enum values are the UPPER_SNAKE_CASE strings from the schema.

## 2. Error codes

| HTTP | `error.code` | Meaning |
|---|---|---|
| 400 | VALIDATION_ERROR | Input failed validation (`fields` lists them) |
| 400 | INVALID_FILE | Upload is not a readable PDF |
| 400 | NO_PARSED_RESUME | Candidate has no successfully parsed resume |
| 400 | RESUME_NOT_READY | Chosen resume is not PARSED |
| 400 | USE_INTERVIEW_SCHEDULING | Set INTERVIEW by scheduling an interview |
| 401 | UNAUTHENTICATED | No valid session |
| 401 | INVALID_CREDENTIALS | Wrong email or password |
| 403 | FORBIDDEN | Wrong role |
| 404 | NOT_FOUND | Missing or not visible to the caller |
| 409 | EMAIL_TAKEN, ALREADY_APPLIED, JOB_CLOSED, JOB_HAS_APPLICATIONS, INVALID_TRANSITION, ASSESSMENT_IN_PROGRESS, ASSESSMENT_NOT_READY | State conflicts, see each route |
| 413 | FILE_TOO_LARGE | Over 5 MB |
| 429 | AI_RATE_LIMITED | Model quota hit; retry later |
| 502 | AI_FAILED | Model call failed or returned unusable output |
| 500 | INTERNAL_ERROR | Unexpected; no internals leaked |

## 3. Endpoint index

| Method and path | Access | Feature (owner folder) | Route file |
|---|---|---|---|
| POST /api/auth/register | public | auth | `src/app/api/auth/register/route.ts` |
| POST /api/auth/login | public | auth | `.../auth/login/route.ts` |
| POST /api/auth/logout | any | auth | `.../auth/logout/route.ts` |
| GET /api/auth/me | any | auth | `.../auth/me/route.ts` |
| GET, POST /api/jobs | any / recruiter | jobs | `.../jobs/route.ts` |
| GET, PATCH, DELETE /api/jobs/[jobId] | any / recruiter | jobs | `.../jobs/[jobId]/route.ts` |
| GET, PATCH /api/profile | candidate | profile | `.../profile/route.ts` |
| GET, POST /api/resumes | candidate | resumes | `.../resumes/route.ts` |
| GET, PATCH /api/resumes/[resumeId] | candidate or recruiter | resumes | `.../resumes/[resumeId]/route.ts` |
| GET /api/resumes/[resumeId]/file | candidate or recruiter | resumes | `.../resumes/[resumeId]/file/route.ts` |
| POST /api/resumes/[resumeId]/reparse | candidate | resumes | `.../resumes/[resumeId]/reparse/route.ts` |
| GET, POST /api/applications | any | applications | `.../applications/route.ts` |
| GET /api/applications/[applicationId] | any | applications | `.../applications/[applicationId]/route.ts` |
| PATCH /api/applications/[applicationId]/status | recruiter | applications | `.../[applicationId]/status/route.ts` |
| PUT /api/applications/[applicationId]/notes | recruiter | applications | `.../[applicationId]/notes/route.ts` |
| GET, POST /api/assessments/[applicationId] | recruiter | assessments | `.../assessments/[applicationId]/route.ts` |
| PATCH /api/assessments/[applicationId]/override | recruiter | assessments | `.../[applicationId]/override/route.ts` |
| GET /api/comparison | recruiter | comparison | `.../comparison/route.ts` |
| GET, POST /api/questions | recruiter | questions | `.../questions/route.ts` |
| POST /api/questions/generate | recruiter | questions | `.../questions/generate/route.ts` |
| PATCH, DELETE /api/questions/[questionId] | recruiter | questions | `.../questions/[questionId]/route.ts` |
| GET, POST /api/interviews | recruiter | interviews | `.../interviews/route.ts` |
| PATCH /api/interviews/[interviewId] | recruiter | interviews | `.../interviews/[interviewId]/route.ts` |
| GET /api/dashboard | any | dashboard | `.../dashboard/route.ts` |

Details per feature: `docs/api/auth.md`, `jobs.md`, `profile.md`, `resumes.md`, `applications.md`, `assessments.md`, `comparison.md`, `questions.md`, `interviews.md`, `dashboard.md`.

## 4. Shared types (create `src/lib/dto.ts` from these)

```ts
type Role = "RECRUITER" | "CANDIDATE";
type JobStatus = "DRAFT" | "OPEN" | "CLOSED";
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
type SkillPriority = "REQUIRED" | "PREFERRED";
type ParseStatus = "PENDING" | "PARSED" | "FAILED";
type ApplicationStatus = "SUBMITTED" | "PARSED" | "ASSESSED" | "IN_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED";
type AssessmentStatus = "PENDING" | "COMPLETED" | "FAILED";
type Dimension = "SKILLS" | "EXPERIENCE" | "PROJECTS" | "QUALIFICATIONS";
type Verdict = "MATCHED" | "PARTIAL" | "NOT_EVIDENCED";
type QuestionCategory = "TECHNICAL" | "PROJECT" | "BEHAVIORAL" | "ROLE_FIT";
type InterviewType = "PHONE_SCREEN" | "TECHNICAL" | "HR" | "PANEL";
type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

type UserDTO = { id: string; name: string; email: string; role: Role };

type JobSkillDTO = { id: string; name: string; priority: SkillPriority; importance: number /* 1-5 */ };
type JobSummaryDTO = {
  id: string; title: string; department: string; location: string; employmentType: EmploymentType;
  salaryMin: number | null; salaryMax: number | null; salaryCurrency: string;
  status: JobStatus; createdAt: string; applicantCount: number;
};
type JobDetailDTO = JobSummaryDTO & {
  description: string; minYearsExperience: number; requiredQualifications: string | null;
  skills: JobSkillDTO[]; updatedAt: string; closedAt: string | null; recruiter: { id: string; name: string };
};

type CandidateBriefDTO = { id: string /* CandidateProfile id */; userId: string; name: string; email: string; headline: string | null; location: string | null };
type ProfileDTO = CandidateBriefDTO & {
  phone: string | null; summary: string | null; linkedinUrl: string | null; githubUrl: string | null;
  profileCompleteness: number; /* 0-100 */
};

type ParsedResume = /* exactly as in docs/DATA_MODEL.md section 4 */ object;
type ResumeSummaryDTO = {
  id: string; originalFileName: string; fileSizeBytes: number; parseStatus: ParseStatus;
  parseError: string | null; uploadedAt: string; parsedAt: string | null;
};
type ResumeDTO = ResumeSummaryDTO & { parsedData: ParsedResume | null; extractedText?: string /* only when includeText=true */ };

type AssessmentSummaryDTO = {
  status: AssessmentStatus; overallScore: number | null; effectiveScore: number | null; overridden: boolean; generatedAt: string | null;
};
type AssessmentItemDTO = {
  id: string; dimension: Dimension; requirement: string; jobSkillId: string | null;
  priority: SkillPriority | null; importance: number | null; /* from the linked JobSkill, SKILLS items only */
  verdict: Verdict; evidenceExcerpt: string | null; reasoning: string;
};
type AssessmentDTO = {
  id: string; applicationId: string; status: AssessmentStatus;
  overallScore: number | null; effectiveScore: number | null;
  dimensionScores: { skills: number | null; experience: number | null; projects: number | null; qualifications: number | null };
  weights: { skills: number; experience: number; projects: number; qualifications: number };
  summary: string | null; modelId: string | null; errorMessage: string | null; generatedAt: string | null;
  override: { score: number | null; note: string | null; at: string | null; by: { id: string; name: string } | null };
  items: AssessmentItemDTO[]; /* ordered by sortOrder */
};

type StatusEventDTO = {
  id: string; fromStatus: ApplicationStatus | null; toStatus: ApplicationStatus; note: string | null;
  changedBy: { id: string; name: string } | null; createdAt: string;
};
type InterviewDTO = {
  id: string; applicationId: string; scheduledAt: string; durationMinutes: number; type: InterviewType;
  interviewerName: string; location: string | null; status: InterviewStatus; feedbackNotes: string | null; createdAt: string;
};
type InterviewListItemDTO = InterviewDTO & { candidate: { id: string; name: string }; job: { id: string; title: string } };
type QuestionDTO = {
  id: string; applicationId: string; category: QuestionCategory; question: string;
  rationale: string | null; source: "AI" | "RECRUITER"; sortOrder: number; updatedAt: string;
};

/** Recruiter's list row. */
type ApplicationSummaryDTO = {
  id: string; jobId: string; status: ApplicationStatus; submittedAt: string; statusUpdatedAt: string;
  candidate: CandidateBriefDTO; resumeId: string; assessment: AssessmentSummaryDTO | null;
};
/** Recruiter's full review page. */
type ApplicationDetailDTO = ApplicationSummaryDTO & {
  job: JobDetailDTO; coverNote: string | null; recruiterNotes: string | null; profile: ProfileDTO;
  resume: ResumeDTO; /* with parsedData, without extractedText */
  assessment: AssessmentDTO | null; statusEvents: StatusEventDTO[]; /* oldest first */
  interviews: InterviewDTO[]; questionCount: number;
};
/** What a candidate sees. NEVER includes recruiterNotes, assessment, scores, questions or feedback. */
type CandidateApplicationDTO = {
  id: string; status: ApplicationStatus; displayStatus: string; submittedAt: string; statusUpdatedAt: string;
  coverNote: string | null; job: JobSummaryDTO;
  timeline: { displayStatus: string; at: string }[]; /* consecutive duplicate labels collapsed, oldest first */
  upcomingInterviews: { id: string; scheduledAt: string; durationMinutes: number; type: InterviewType; location: string | null }[];
};
```
