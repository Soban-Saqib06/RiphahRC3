# PRODUCT_BRIEF.md

## Recruitment & Talent Intelligence Platform

**Status:** Draft for user review\
**Purpose:** Academic web-development assignment\
**Primary evaluation objective:** Maximize performance against the
supplied 100-mark evaluation rubric\
**Time budget:** 3 hours for design and development\
**Deployment target:** Local machine

------------------------------------------------------------------------

## 1. Product Overview

An AI-powered recruitment platform that helps recruiters manage
vacancies, review applicants, understand job-related candidate evidence,
shortlist applicants, and coordinate interviews. Candidates have a basic
portal to maintain a profile, upload a resume, apply for vacancies, and
track application status.

The recruiter experience is the primary focus. The application must
demonstrate a coherent end-to-end recruitment workflow using preloaded
demo data, while retaining basic functional candidate and recruiter
experiences.

The platform must use genuine AI-supported analysis rather than
hardcoded AI outputs. Hiring decisions remain under human control.

## 2. Problem Statement

Recruiters need to process applications and assess how well candidates
meet job requirements. Simple keyword matching can overlook equivalent
terminology and relevant experience expressed in different words. It can
also make it difficult to understand why a candidate was recommended or
which requirements lack supporting evidence.

The platform addresses this by extracting structured information from
resumes, comparing candidate evidence with job requirements, explaining
recommendations, and supporting recruiter-led application decisions.

## 3. Product Vision

Provide a demonstrable recruitment workflow in which resume information
is extracted, candidates are assessed against a vacancy using
explainable AI-supported matching, and recruiters can take and track
hiring actions.

## 4. Target Users and Roles

### 4.1 Recruiter

The primary user and principal focus of the MVP.

Recruiters should be able to: - View recruitment activity and key
dashboard metrics. - Create and manage vacancies. - Review applicants
for a vacancy. - Inspect parsed resume information and job-related
evidence. - Review match scores, matched skills, evidence gaps, and
explanations. - Compare candidates and make manual shortlist or
rejection decisions. - Generate and edit interview questions. - Schedule
interviews and record basic feedback or decisions where feasible.

### 4.2 Candidate

A secondary user with a deliberately smaller MVP experience.

Candidates should be able to: - Register, log in, and maintain a basic
profile. - Upload a PDF resume. - Browse available vacancies and submit
applications. - View the status of their applications.

## 5. Core Value Proposition

-   **For recruiters:** Faster, more structured review of applicants,
    with job-related recommendations that include explanations and
    supporting resume evidence.
-   **For candidates:** A straightforward way to provide their profile
    and resume, apply for vacancies, and follow application progress.

The system assists recruitment decisions; it does not make final hiring
decisions autonomously.

## 6. Product Goals

1.  Demonstrate a working recruiter-to-candidate recruitment workflow.
2.  Implement genuine resume text extraction and structured information
    extraction.
3.  Implement AI-supported semantic job-to-candidate matching.
4.  Make match results explainable through matched requirements,
    evidence, and gaps.
5.  Keep shortlisting and hiring decisions under recruiter control.
6.  Deliver a polished, usable interface within the three-hour
    development constraint.
7.  Provide preloaded data so the evaluation workflow can be
    demonstrated immediately.

## 7. MVP Scope

### 7.1 Included Features

  -----------------------------------------------------------------------------------------------
  Feature                 MVP scope               Priority                 Owner
  ----------------------- ----------------------- ----------------------- -----------------------
 1. Authentication and      Basic functional        High                   B
  roles                   registration/login for  
                          recruiter and candidate 
                          roles; role-aware       
                          access                  

 2. Recruiter dashboard     Key recruitment KPIs,   High                   A
                          vacancies, application  
                          pipeline and interview  
                          overview.                

 3. Job management          Create and manage       High                   A
                          vacancies with core job 
                          requirements            

 4. Candidate portal        Basic profile, PDF      Medium                 B
                          resume upload, job      
                          browsing, applications  
                          and status tracking     

 5. Resume parsing          Extract PDF text and    High
                          structure relevant      
                          candidate information   

 6. AI candidate matching   Compare candidate       Critical
                          evidence with vacancy   
                          requirements and        
                          provide an explainable  
                          score                   

 7. Candidate review        View candidate details, High
                          evidence, gaps and      
                          application information 

 8. Candidate comparison    Basic side-by-side      High
                          comparison of selected  
                          applicants              

 9. Application decisions   Recruiter can shortlist High
                          or reject applicants;   
                          maintain visible        
                          application status      

 10. Interview questions     Generate role-specific  Medium
                          questions using Gemini; 
                          allow basic editing     

 11. Interview scheduling    Record interview        Medium
                          date/time and           
                          interviewer or          
                          interview type where    
                          feasible                

 12. Analytics               Basic counts and        Medium
                          recruitment-stage       
                          statistics              

 13. Demo data               Preloaded vacancy and   Critical
                          candidate records,      
                          including three         
                          candidates for the      
                          demonstration scenario
                           
 14. AI AutoReview          Recruiter can            Nice to Have/Extra
                          set requirements for 
                          things that must be in
                          the application resume.
                          These must be verified by
                          Ai. Both the applicant and 
                          reviewwer can get these 
                          for each application.
  -----------------------------------------------------------------------

### 7.2 Matching Approach

Use the assignment's suggested weighted scoring as the initial baseline:

  Assessment dimension     Suggested weight
  ---------------------- ------------------
  Skills                                50%
  Experience                            25%
  Project relevance                     15%
  Qualifications                        10%
  **Total**                        **100%**

The score should be accompanied by: - Matched skills or requirements. -
Missing or insufficiently evidenced requirements. - Supporting resume
excerpts or evidence. - A concise explanation of the recommendation.

A lack of evidence must be represented as missing or unverified
evidence, not automatically as proof that the candidate does not possess
the skill. Recruiters must be able to review the evidence and override
or disregard recommendations.

The assignment allows teams to justify alternative weights. The weights
above are selected as the MVP starting point because they are explicitly
suggested in the project PDF.

### 7.3 Demonstration Scenario

The main demonstration should follow the scenario in the assignment:

1.  A recruiter posts a Backend Developer vacancy requiring Python,
    Django, PostgreSQL, and Docker.
2.  Three candidates apply using resumes.
3.  The system extracts candidate information and supporting evidence.
4.  The system generates job-relevance scores and explanations,
    including missing evidence.
5.  The recruiter reviews and compares candidates.
6.  The recruiter shortlists one applicant.
7.  The recruiter generates interview questions and schedules an
    interview.
8.  The dashboard reflects the updated recruitment activity.

Preloaded demo data should make this flow available immediately after
starting the application.

## 8. Functional Requirements

### 8.1 Authentication and Access Control

-   Provide recruiter and candidate registration, login, and logout.
-   Show role-appropriate application areas.
-   Prevent candidates from accessing recruiter-only information.
-   Validate inputs and handle sessions and passwords securely within
    the implementation's scope.

### 8.2 Job Management

-   Allow recruiters to create and manage vacancies.
-   Capture job title, department, location, type, salary, description,
    required/preferred skills, experience, qualifications, and skill
    importance as practical within the MVP.
-   Display vacancies and applicant counts.
-   Support the Backend Developer demonstration vacancy.

### 8.3 Resume Upload and Parsing

-   Support PDF resume uploads.
-   Extract available name, contact information, skills, education,
    relevant experience, and projects.
-   Store structured extraction results for review and matching.
-   Handle unsupported, empty, or failed uploads with a visible error
    state.
-   Allow candidate corrections where feasible.

### 8.4 Candidate Matching and Explainability

-   Compare resume evidence with job requirements using semantic
    analysis, not only exact keyword equality.
-   Produce a job-relevance score and explanation.
-   Identify matched requirements and evidence gaps.
-   Link extracted skills and generated claims to resume evidence where
    possible.
-   Make clear when information is not found rather than asserting that
    a candidate lacks the skill.
-   Keep final decisions with the recruiter.

### 8.5 Application Pipeline

-   Allow candidates to submit applications and view their status.
-   Allow recruiters to review, shortlist, and reject applicants.
-   Display application status changes.
-   Use a simplified status flow based on the assignment's suggested
    stages: Submitted, Parsed, AI Assessment Available, Recruiter
    Review, Shortlisted/Rejected, Interview, and Selected/Rejected.

### 8.6 Interview Support

-   Generate role-specific interview questions using Gemini.
-   Support questions about candidate projects and role requirements.
-   Allow recruiters to edit or remove generated questions where
    feasible.
-   Record basic interview scheduling information.

### 8.7 Analytics (R-10 — Analytics Screen)

-   Display active jobs, applications, shortlisted candidates, pending reviews, and interviews using real application and seeded data.
-   Show KPI cards and performance overview (Time to Hire, Applicant Conversion, AI Match Accuracy, Active Requisitions).
-   Recruitment Pipeline Funnel (Applied, Screened, Interviewed, Offer, Hired with conversion stages).
-   Sourcing Breakdown (distribution of hires across LinkedIn, Career Page, Referrals, Agencies, Job Boards).

#### New Feature: Talent Cluster Map

Introduce a prominent section titled "Talent Cluster Map" within the R-10 Analytics screen.

**Purpose:**
Help recruiters understand the applicant pool visually, without requiring them to interpret complex technical recruitment metrics.

**Visualization:**
- Interactive 2D candidate cluster visualization.
- Each candidate is represented by a circular point on a spatial map.
- Two meaningful, job-specific dimensions:
  - **X-axis:** Technical Skill Fit (0–100 scale).
  - **Y-axis:** Experience Fit (0–100 scale).
- Candidate positions must be calculated from structured candidate assessment data, not arbitrarily generated by AI.

**Candidate clusters:**
Use meaningful visual groupings grounded in assessment evidence:
1. **Strong Matches:** Candidates with strong technical and experience alignment.
2. **Transferable Skills:** Candidates with relevant adjacent skills and experience.
3. **Partial Matches:** Candidates who satisfy some important requirements but have notable gaps.
4. **Insufficient Evidence:** Candidates whose resumes do not provide enough information for reliable assessment.
*Note: Do not treat missing resume information as proof that a candidate lacks a skill. For the demo dataset, present these as AI-assessed fit groups rather than claiming statistically significant machine-learning clusters.*

**Visual encoding:**
- **Position:** Technical skill fit ($X$) and experience fit ($Y$).
- **Color:** Candidate fit group (palette consistent with Warm Neutral and terracotta design system).
- **Bubble size:** Evidence coverage, if reliable structured data is available.
- **Selected candidate:** Distinct outline or highlight.
- **Hover:** Candidate name, overall match percentage, and short summary.

**Interactions:**
- Hover over a candidate to reveal a compact information tooltip.
- Click a candidate to open their candidate assessment/profile.
- Click a cluster label to highlight or isolate that group.
- Provide a reset/clear selection action.
- Include a short explanation of what the two axes represent.
- Include a small legend explaining cluster colors.

**Empty and limited-data states:**
- If there are too few candidates to form meaningful groups, show the individual candidate points without pretending that statistically meaningful clusters exist.
- If assessment evidence is insufficient, communicate that limitation clearly.

## 9. Non-Functional Requirements

-   **Usability:** Clear navigation and readable recruiter workflows;
    the recruiter experience receives the greatest design attention.
-   **Reliability:** The preloaded demonstration flow should work
    consistently on the local machine.
-   **Security:** Enforce role-based access on server-side operations,
    validate inputs, and avoid exposing secrets to the browser.
-   **Data integrity:** Persist application, vacancy, candidate, and
    interview records in the database.
-   **Explainability:** AI-generated assessment claims should be
    traceable to resume content where possible.
-   **Maintainability:** Use understandable code and a consistent
    project structure.
-   **Time efficiency:** Prefer a small number of complete, demonstrable
    flows over numerous partially implemented features.

## 10. Main Application Sections

### Recruiter

-   Recruiter dashboard
-   Jobs / vacancy management
-   Job applicants
-   Candidate details and AI assessment
-   Candidate comparison
-   Interview questions
-   Interview schedule

### Candidate

-   Candidate dashboard
-   Profile
-   Resume upload
-   Browse jobs
-   My applications

The exact navigation labels and screen composition will be finalized
during design discovery.

## 11. Core User Journeys

### 11.1 Recruiter Journey

1.  Recruiter logs in.
2.  Recruiter views dashboard and vacancies.
3.  Recruiter opens a vacancy and reviews applicants.
4.  Recruiter opens a candidate assessment.
5.  Recruiter reviews score, matched requirements, gaps, and resume
    evidence.
6.  Recruiter compares candidates and makes a manual decision.
7.  Recruiter shortlists an applicant.
8.  Recruiter generates interview questions and schedules an interview.
9.  Recruiter returns to the dashboard to see updated activity.

### 11.2 Candidate Journey

1.  Candidate registers or logs in.
2.  Candidate completes a basic profile.
3.  Candidate uploads a PDF resume.
4.  Candidate browses open vacancies.
5.  Candidate applies for a vacancy.
6.  Candidate checks application status.

## 12. Technical Direction

### Confirmed Stack

-   **Application framework:** Next.js
-   **ORM:** Prisma
-   **Database:** MySQL
-   **Validation:** Zod
-   **AI provider:** Regular Gemini API (free tier availability
    confirmed by user)
-   **Development environment:** Antigravity-assisted development
-   **Deployment:** Local machine

### Architecture Direction

Use Next.js for the frontend and server-side application functionality.
Use Prisma to access MySQL. Apply Zod validation to incoming data at
appropriate boundaries. Keep Gemini API calls on the server so API
credentials are not exposed to client code.

Use a PDF text-extraction approach to obtain resume content before
sending relevant text to Gemini for structured extraction and
assessment. Persist the resulting structured records and assessment
results where appropriate.

Do not introduce a separate backend service, vector database, or
additional infrastructure unless implementation needs demonstrate that
it is necessary within the time limit.

### AI Implementation Note

Use the regular Gemini API for request/response tasks such as structured
resume extraction, job-candidate assessment, and interview question
generation. The user has confirmed availability of the regular API. The
exact model identifier and request limits should be verified in the
development environment before implementation.

## 13. Demo Data Requirements

Seed the local database with: - At least one recruiter demo account. -
Candidate demo accounts or candidate records. - The Backend Developer
vacancy from the assignment's demonstration scenario. - Three candidate
profiles and corresponding sample resume content or PDF files. -
Applications linking the three candidates to the vacancy. - Enough
application and interview data to populate dashboard metrics
meaningfully.

Demo credentials and sample data should be clearly documented for
evaluation. Do not use real people's personal information in sample
records.

## 14. Out of Scope or Simplified for the MVP

The following advanced requirements from the assignment are not part of
the committed MVP unless time remains: - Advanced natural-language
talent search across the full candidate database. - Dedicated semantic
resume vector search infrastructure. - Duplicate candidate/application
detection and record merging. - Automated resume-to-job recommendations
for candidates. - Advanced talent-pool discovery and retention
workflows. - Extensive fairness testing infrastructure and automated
bias audit reporting. - Full-featured interviewer feedback workflows and
complex scheduling conflict management. - Production deployment,
production-scale monitoring, and enterprise-grade operational
infrastructure. - DOCX resume parsing (PDF is the required MVP format;
DOCX is optional in the assignment).

These are deferred to protect the three-hour delivery constraint. The
MVP should still implement basic role separation, evidence-based
matching, and human-controlled decisions.

## 15. Assumptions and Unresolved Decisions

### Confirmed

-   The project is being built to satisfy the supplied academic
    evaluation rubric.
-   Total available time is three hours, including design and
    development.
-   Development will be assisted by Antigravity and Gemini 3.8 Flash.
-   The application stack is Next.js, Prisma, MySQL, and Zod.
-   A regular Gemini API key is available on the free tier.
-   MySQL must be set up for the project.
-   The application will run locally.
-   Preloaded demo data is required.
-   Both recruiter and candidate roles will exist, with the recruiter
    experience prioritized.
-   The user approved the proposed MVP scope.

### Recommendations, Not Yet Separately Confirmed

-   Use the assignment's suggested 50/25/15/10 matching weights as the
    initial scoring model.
-   Use the Backend Developer scenario as the primary evaluation
    walkthrough.
-   Keep advanced talent-intelligence features out of the initial build
    unless time remains.
-   Use server-side Gemini calls and server-side authorization checks.

### To Resolve During Design / Implementation

-   Exact page layouts, navigation style, colors, typography, and visual
    references.
-   Exact Gemini model identifier supported by the available API key.
-   MySQL hosting or local installation method and connection details.
-   Exact PDF parsing library and upload storage approach.
-   Whether interview feedback and scheduling conflict detection can fit
    after the core workflow is complete.

## 16. Evaluation Alignment

  ------------------------------------------------------------------------
  Evaluation criterion                         Marks MVP response
  --------------------- ---------------------------- ---------------------
  Architecture &                                  30 Role-aware app, job
  functional                                         management,
  completeness                                       applications,
                                                     recruiter/candidate
                                                     journeys, interview
                                                     workflow

  AI implementation &                             25 Real Gemini-powered
  matching quality                                   semantic assessment
                                                     with weighted score
                                                     and explanations

  Resume parsing &                                15 PDF text extraction
  extraction                                         and structured
                                                     candidate information

  UI & experience                                 15 Cohesive, polished,
                                                     recruiter-first
                                                     interface with a
                                                     basic candidate
                                                     portal

  Innovation, testing,                            15 Evidence-linked
  security & deployment                              recommendations,
                                                     human control, role
                                                     authorization,
                                                     validation, local
                                                     demo reliability

  **Total**                                  **100** 
  ------------------------------------------------------------------------

The MVP is optimized for the assignment's stated success criterion: a
reliable end-to-end workflow, meaningful AI functionality, transparent
evidence-based recommendations, and solid engineering---not simply the
largest feature count.

------------------------------------------------------------------------

**End of Product Brief draft.**
