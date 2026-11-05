# API: comparison

Feature folder `comparison`. Page: `/comparison?jobId=...&applicationIds=a,b,c`. Reads Application, Assessment, AssessmentItem, JobSkill. Builds on `assessments` data; it never writes.

## GET /api/comparison
- Access: recruiter
- Query: `jobId` (required), `applicationIds` (required, comma-separated, 2 to 4 ids, all must belong to the job)
- 200 `data`:
```ts
{
  job: { id: string; title: string };
  candidates: {
    applicationId: string; candidateName: string; status: ApplicationStatus;
    assessmentStatus: AssessmentStatus | null;          // null = never started
    effectiveScore: number | null;
    dimensionScores: { skills: number | null; experience: number | null; projects: number | null; qualifications: number | null } | null;
    summary: string | null;
    totalYearsExperience: number | null;                // from parsedData
  }[];
  matrix: {                                             // one row per job skill, then EXPERIENCE, then QUALIFICATIONS (when present)
    requirement: string; dimension: Dimension;
    priority: SkillPriority | null; importance: number | null;
    cells: { applicationId: string; verdict: Verdict | null; evidenceExcerpt: string | null }[]; // same order as `candidates`; verdict null when no completed assessment
  }[];
  projects: { applicationId: string; items: AssessmentItemDTO[] }[];  // PROJECTS items per candidate
}
```
- Order of `candidates` and `cells` follows the order of `applicationIds` in the query.
- Errors: 400 VALIDATION_ERROR (missing params, fewer than 2 or more than 4 ids, an id outside the job), 404 NOT_FOUND (job)
- UI: highlight the highest `effectiveScore` neutrally ("Highest score"), never as "Best candidate" or "Winner". Include a button per candidate to open the review page. Comparing never changes any status.
