# API: profile

Feature folder `profile`. Page: `/profile` (also hosts the resume upload component from feature `resumes`). Tables: CandidateProfile, User.name.

## GET /api/profile
- Access: candidate
- 200 `data`: `{ profile: ProfileDTO, latestResume: ResumeSummaryDTO | null }` (`latestResume` = newest by `uploadedAt`)

## PATCH /api/profile
- Access: candidate
- Body: any subset of `{ name: string (2-80), headline: string|null (max 120), phone: string|null (max 30, digits, spaces, +, -, parentheses), location: string|null (max 80), summary: string|null (max 1000), linkedinUrl: string|null (valid URL, max 200), githubUrl: string|null (valid URL, max 200) }`. `name` updates `User.name`; the rest update CandidateProfile.
- `profileCompleteness` = round(100 * count of the six items that are present / 6): headline, phone, location, summary, (linkedinUrl or githubUrl), at least one PARSED resume.
- 200 `data`: `{ profile: ProfileDTO }`
- Errors: 400 VALIDATION_ERROR
