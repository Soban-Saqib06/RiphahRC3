# API: dashboard

Feature folder `dashboard`. Page: `/dashboard` (recruiter and candidate versions). Read-only. EVERY number is computed from the database on each request; nothing is hardcoded. Use the mappers `toApplicationSummary()` and `toInterviewListItem()` from the owning features.

## GET /api/dashboard
- Access: any. The response shape depends on the caller's role (`data.role` discriminates).

### Recruiter 200 `data`
```ts
{
  role: "RECRUITER";
  kpis: {
    activeJobs: number;            // jobs with status OPEN
    totalApplications: number;
    pendingReview: number;         // applications in PARSED, ASSESSED or IN_REVIEW
    shortlisted: number;           // applications in SHORTLISTED
    upcomingInterviews: number;    // interviews SCHEDULED with scheduledAt >= now
    averageMatchScore: number | null; // mean effectiveScore of COMPLETED assessments, rounded; null when none
  };
  pipeline: { status: ApplicationStatus; count: number }[];   // all 8 statuses in pipeline order, zero included
  jobs: { jobId: string; title: string; status: JobStatus; applicants: number; shortlisted: number; topScore: number | null }[]; // OPEN and CLOSED jobs, newest first
  upcomingInterviews: InterviewListItemDTO[];                  // next 5 by time
  recentActivity: { id: string; at: string; candidateName: string; jobTitle: string; toStatus: ApplicationStatus; note: string | null }[]; // last 10 status events
}
```

### Candidate 200 `data`
```ts
{
  role: "CANDIDATE";
  profileCompleteness: number;       // same formula as GET /api/profile
  hasParsedResume: boolean;
  counts: { total: number; underReview: number; shortlisted: number; interviews: number; notSelected: number };
  recentApplications: CandidateApplicationDTO[];   // latest 5
  upcomingInterviews: { id: string; applicationId: string; jobTitle: string; scheduledAt: string; type: InterviewType; location: string | null }[];
}
```
`underReview` counts SUBMITTED, PARSED, ASSESSED and IN_REVIEW; `interviews` counts INTERVIEW; `notSelected` counts REJECTED.

- Errors: 401 UNAUTHENTICATED
- UI: the recruiter dashboard must show a useful empty state when counts are zero.
