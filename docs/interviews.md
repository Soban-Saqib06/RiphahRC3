# API: interviews

Feature folder `interviews`. Page: `/interviews` (schedule). UI component: `InterviewPanel` (schedule form, list, feedback), embedded in `/applications/[applicationId]`. Table: Interview. Scheduling moves the application status via `transitionStatus()`.

## GET /api/interviews
- Access: recruiter
- Query: `from?` (ISO date-time), `to?` (ISO date-time), `status?` (InterviewStatus), `applicationId?`, `limit?`
- 200 `data`: `{ interviews: InterviewListItemDTO[] }` ordered by `scheduledAt` ascending

## POST /api/interviews
- Access: recruiter
- Body: `{ applicationId: string, scheduledAt: string (ISO date-time, must be in the future), durationMinutes?: number (integer 15-240, default 45), type: InterviewType, interviewerName: string (2-80), location?: string | null (max 200) }`
- Rules: the application status must be SHORTLISTED or INTERVIEW, otherwise 409 INVALID_TRANSITION ("Shortlist the candidate before scheduling an interview."). If it is SHORTLISTED, move it to INTERVIEW through `transitionStatus()` (event note "Interview scheduled"). Overlap and conflict detection is out of scope.
- 201 `data`: `{ interview: InterviewDTO, applicationStatus: ApplicationStatus }`
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND, 409 INVALID_TRANSITION

## PATCH /api/interviews/[interviewId]
- Access: recruiter
- Body: any subset of `{ scheduledAt: string (future ISO date-time), durationMinutes: number (15-240), type: InterviewType, interviewerName: string (2-80), location: string | null (max 200), status: InterviewStatus, feedbackNotes: string | null (max 2000) }`
- Rules: `feedbackNotes` may be set only when the resulting status is COMPLETED. Cancelling an interview does not change the application status in this MVP (the recruiter updates it manually).
- 200 `data`: `{ interview: InterviewDTO }`
- Errors: 400 VALIDATION_ERROR, 404 NOT_FOUND

## Candidate visibility
Candidates do not call this feature. They see only date, duration, type and location of their upcoming interviews inside `CandidateApplicationDTO.upcomingInterviews` (never interviewer notes or feedback).
