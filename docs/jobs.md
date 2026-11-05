# API: jobs

Feature folder `jobs`. Pages: `/jobs`, `/jobs/new`, `/jobs/[jobId]`. Tables: Job, JobSkill (read applicant counts from Application).

## GET /api/jobs
- Access: any
- Query: `q?` (matches title or department, contains), `status?` (recruiter only: DRAFT | OPEN | CLOSED), `limit?`
- Recruiter: all jobs, newest first. Each row is `JobSummaryDTO & { stageCounts: Record<ApplicationStatus, number> }` (all 8 keys, zero when none).
- Candidate: only OPEN jobs, newest first (`status` is ignored). Each row is `JobSummaryDTO & { hasApplied: boolean }`.
- 200 `data`: `{ jobs: [...] }`

## POST /api/jobs
- Access: recruiter
- Body:
```ts
{
  title: string (3-120), department: string (2-80), location: string (2-80),
  employmentType: EmploymentType,
  salaryMin?: number | null (integer >= 0), salaryMax?: number | null (integer >= salaryMin), salaryCurrency?: string (3 letters, default "PKR"),
  description: string (20-5000), minYearsExperience: number (integer 0-40),
  requiredQualifications?: string | null (max 1000),
  status?: "DRAFT" | "OPEN" (default "DRAFT"),
  skills: { name: string (1-60), priority: SkillPriority, importance: number (integer 1-5) }[]  // 1 to 30 items, names unique ignoring case
}
```
- Rule: status OPEN requires at least one REQUIRED skill.
- 201 `data`: `{ job: JobDetailDTO }`
- Errors: 400 VALIDATION_ERROR

## GET /api/jobs/[jobId]
- Access: any. Candidates can read only OPEN jobs (otherwise 404).
- 200 `data`: `{ job: JobDetailDTO, myApplication?: { id: string; status: ApplicationStatus } | null }` (`myApplication` only for candidates)
- Errors: 404 NOT_FOUND

## PATCH /api/jobs/[jobId]
- Access: recruiter
- Body: any subset of the POST fields. If `skills` is present it replaces the whole list: skills are matched by name (ignoring case); matched skills are updated in place (their ids are kept, so existing AssessmentItems keep their link), new ones are created, missing ones are deleted.
- `status` may move DRAFT -> OPEN -> CLOSED and CLOSED -> OPEN. Moving to CLOSED sets `closedAt`; moving to OPEN clears it.
- 200 `data`: `{ job: JobDetailDTO }`
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND
- Note: changing skills does NOT change existing assessments. The UI should show a "Job requirements changed, re-run assessment" hint when `job.updatedAt` is newer than `assessment.generatedAt`.

## DELETE /api/jobs/[jobId]
- Access: recruiter
- 200 `data`: `{ deleted: true }`
- Errors: 404 NOT_FOUND, 409 JOB_HAS_APPLICATIONS ("This job has applications. Close it instead.")
