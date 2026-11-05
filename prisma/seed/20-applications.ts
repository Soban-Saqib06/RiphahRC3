import { prisma } from "../../src/lib/db";

export default async function seedApplications(): Promise<void> {
  console.log("🌱 Running 20-applications.ts...");

  const recruiter = await prisma.user.findUnique({
    where: { email: "recruiter@demo.example" },
  });
  if (!recruiter) throw new Error("Recruiter not found in 20-applications.ts");

  const candidates = await prisma.user.findMany({
    where: { role: "CANDIDATE" },
    include: {
      candidateProfile: {
        include: {
          resumes: { orderBy: { uploadedAt: "desc" }, take: 1 },
        },
      },
    },
  });

  const getCandidateProfile = (email: string) => {
    const user = candidates.find((c) => c.email === email);
    if (!user || !user.candidateProfile) throw new Error(`Missing profile for ${email}`);
    const resume = user.candidateProfile.resumes[0];
    if (!resume) throw new Error(`Missing resume for ${email}`);
    return { profile: user.candidateProfile, resume, user };
  };

  const jobs = await prisma.job.findMany({ include: { skills: true } });
  const getJob = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) throw new Error(`Missing job ${id}`);
    return job;
  };

  const backendJob = getJob("job-backend-dev");
  const frontendJob = getJob("job-frontend-dev");
  const analystJob = getJob("job-data-analyst");
  const fullstackJob = getJob("job-fullstack-dev");
  const mlJob = getJob("job-ml-engineer");
  const designJob = getJob("job-product-designer");
  const qaJob = getJob("job-qa-engineer");

  const ethan = getCandidateProfile("candidate1@demo.example");
  const priya = getCandidateProfile("candidate2@demo.example");
  const jonas = getCandidateProfile("candidate3@demo.example");
  const lena = getCandidateProfile("candidate4@demo.example");
  const marco = getCandidateProfile("candidate5@demo.example");
  const ayla = getCandidateProfile("candidate6@demo.example");
  const tariq = getCandidateProfile("candidate7@demo.example");
  const sarah = getCandidateProfile("candidate8@demo.example");
  const hamza = getCandidateProfile("candidate9@demo.example");
  const zainab = getCandidateProfile("candidate10@demo.example");
  const david = getCandidateProfile("candidate11@demo.example");
  const fatima = getCandidateProfile("candidate12@demo.example");

  // Helper to create application with status audit trail
  const seedAppWithAudit = async (params: {
    id: string;
    jobId: string;
    candidateId: string;
    resumeId: string;
    status: any;
    coverNote?: string;
    recruiterNotes?: string;
    submittedDaysAgo: number;
    statusEvents: { toStatus: any; daysAgo: number; note?: string; changedById?: string }[];
  }) => {
    const submittedAt = new Date(Date.now() - params.submittedDaysAgo * 24 * 60 * 60 * 1000);
    const lastEvent = params.statusEvents[params.statusEvents.length - 1];
    const statusUpdatedAt = lastEvent
      ? new Date(Date.now() - lastEvent.daysAgo * 24 * 60 * 60 * 1000)
      : submittedAt;

    const app = await prisma.application.upsert({
      where: { id: params.id },
      update: {
        status: params.status,
        resumeId: params.resumeId,
        coverNote: params.coverNote || null,
        recruiterNotes: params.recruiterNotes || null,
        submittedAt,
        statusUpdatedAt,
      },
      create: {
        id: params.id,
        jobId: params.jobId,
        candidateId: params.candidateId,
        resumeId: params.resumeId,
        status: params.status,
        coverNote: params.coverNote || null,
        recruiterNotes: params.recruiterNotes || null,
        submittedAt,
        statusUpdatedAt,
      },
    });

    // Seed status events
    await prisma.applicationStatusEvent.deleteMany({ where: { applicationId: app.id } });
    let fromStatus: any = null;
    for (const ev of params.statusEvents) {
      const createdAt = new Date(Date.now() - ev.daysAgo * 24 * 60 * 60 * 1000);
      await prisma.applicationStatusEvent.create({
        data: {
          applicationId: app.id,
          fromStatus,
          toStatus: ev.toStatus,
          note: ev.note || null,
          changedById: ev.changedById || null,
          createdAt,
        },
      });
      fromStatus = ev.toStatus;
    }

    return app;
  };

  // =========================================================================
  // 1. BACKEND DEVELOPER REQUISITIONS (4 candidates for Comparison)
  // =========================================================================

  // 1.1 Ethan Calder (ASSESSED, Score 94)
  const ethanApp = await seedAppWithAudit({
    id: "app-ethan-backend",
    jobId: backendJob.id,
    candidateId: ethan.profile.id,
    resumeId: ethan.resume.id,
    status: "ASSESSED",
    coverNote: "I have 5+ years scaling Python/Django backends and tuning massive PostgreSQL databases. Eager to contribute to TalentPilot's core architecture.",
    recruiterNotes: "Exceptional system design depth. Discussed table partitioning over 20M rows on phone screen.",
    submittedDaysAgo: 5,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 5, note: "Applied via candidate portal" },
      { toStatus: "PARSED", daysAgo: 5, note: "Resume parsed successfully by Gemini pipeline" },
      { toStatus: "ASSESSED", daysAgo: 4, note: "AI candidate match assessment completed with 94% score" },
    ],
  });

  const ethanAssessment = await prisma.assessment.upsert({
    where: { applicationId: ethanApp.id },
    update: {
      status: "COMPLETED",
      overallScore: 94,
      skillsScore: 96,
      experienceScore: 92,
      projectsScore: 94,
      qualificationsScore: 95,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Exceptional backend developer matching all required proficiencies in Python, Django, PostgreSQL partitioning, and Docker microservices.",
      generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    create: {
      applicationId: ethanApp.id,
      status: "COMPLETED",
      overallScore: 94,
      skillsScore: 96,
      experienceScore: 92,
      projectsScore: 94,
      qualificationsScore: 95,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Exceptional backend developer matching all required proficiencies in Python, Django, PostgreSQL partitioning, and Docker microservices.",
      generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.assessmentItem.deleteMany({ where: { assessmentId: ethanAssessment.id } });
  await prisma.assessmentItem.createMany({
    data: [
      {
        assessmentId: ethanAssessment.id,
        dimension: "SKILLS",
        requirement: "Python",
        verdict: "MATCHED",
        evidenceExcerpt: "Architected microservices processing 50k requests/min using Python 3.11",
        reasoning: "Demonstrates 5+ years of production Python proficiency matching critical requirement.",
        sortOrder: 1,
      },
      {
        assessmentId: ethanAssessment.id,
        dimension: "SKILLS",
        requirement: "Django",
        verdict: "MATCHED",
        evidenceExcerpt: "Developed distributed services using Django REST Framework",
        reasoning: "Proven production experience building Django microservices.",
        sortOrder: 2,
      },
      {
        assessmentId: ethanAssessment.id,
        dimension: "SKILLS",
        requirement: "PostgreSQL",
        verdict: "MATCHED",
        evidenceExcerpt: "Optimized PostgreSQL databases with table partitioning exceeding 20M rows",
        reasoning: "Advanced relational database tuning directly evidenced.",
        sortOrder: 3,
      },
      {
        assessmentId: ethanAssessment.id,
        dimension: "SKILLS",
        requirement: "Docker",
        verdict: "MATCHED",
        evidenceExcerpt: "Built multi-stage Docker containers with automated CI/CD",
        reasoning: "Directly matches containerization requirement.",
        sortOrder: 4,
      },
      {
        assessmentId: ethanAssessment.id,
        dimension: "EXPERIENCE",
        requirement: "3+ years backend experience",
        verdict: "MATCHED",
        evidenceExcerpt: "Lead Backend Architect (2021-Present) and Software Engineer (2019-2021)",
        reasoning: "Over 5 years of verified industry experience.",
        sortOrder: 5,
      },
      {
        assessmentId: ethanAssessment.id,
        dimension: "PROJECTS",
        requirement: "Distributed Systems & Task Scheduling",
        verdict: "MATCHED",
        evidenceExcerpt: "Asynchronous task scheduler handling 1M daily tasks with Redis queues and PostgreSQL",
        reasoning: "High-throughput production deliverable demonstrating architecture scalability.",
        sortOrder: 6,
      },
    ],
  });

  // 1.2 Priya Nandakumar (SHORTLISTED, Score 88, with recruiter override to 91)
  const priyaApp = await seedAppWithAudit({
    id: "app-priya-backend",
    jobId: backendJob.id,
    candidateId: priya.profile.id,
    resumeId: priya.resume.id,
    status: "SHORTLISTED",
    coverNote: "Experienced in Python API design with FastAPI and MySQL. Excited to bring modern asynchronous patterns to the team.",
    recruiterNotes: "Spoke with Priya on screening call. Her async FastAPI design patterns directly translate to our Django ASGI roadmap. Approved for shortlist.",
    submittedDaysAgo: 4,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 4, note: "Applied via candidate portal" },
      { toStatus: "PARSED", daysAgo: 4, note: "Resume parsed successfully" },
      { toStatus: "ASSESSED", daysAgo: 3, note: "AI Match completed with 88% score" },
      { toStatus: "IN_REVIEW", daysAgo: 2, note: "Recruiter initiated screening review", changedById: recruiter.id },
      { toStatus: "SHORTLISTED", daysAgo: 1, note: "Shortlisted following successful screening call", changedById: recruiter.id },
    ],
  });

  const priyaAssessment = await prisma.assessment.upsert({
    where: { applicationId: priyaApp.id },
    update: {
      status: "COMPLETED",
      overallScore: 88,
      overrideScore: 91,
      overrideNote: "Recruiter manual override: Verified production FastAPI microservice scale (10M requests) during screening call. Adjusted score upward.",
      overriddenById: recruiter.id,
      overriddenAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      skillsScore: 86,
      experienceScore: 90,
      projectsScore: 88,
      qualificationsScore: 88,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Strong API and cloud engineering profile. FastAPI is semantic equivalent for Django REST; demonstrated MySQL and Docker on AWS.",
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    create: {
      applicationId: priyaApp.id,
      status: "COMPLETED",
      overallScore: 88,
      overrideScore: 91,
      overrideNote: "Recruiter manual override: Verified production FastAPI microservice scale (10M requests) during screening call. Adjusted score upward.",
      overriddenById: recruiter.id,
      overriddenAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      skillsScore: 86,
      experienceScore: 90,
      projectsScore: 88,
      qualificationsScore: 88,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Strong API and cloud engineering profile. FastAPI is semantic equivalent for Django REST; demonstrated MySQL and Docker on AWS.",
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.assessmentItem.deleteMany({ where: { assessmentId: priyaAssessment.id } });
  await prisma.assessmentItem.createMany({
    data: [
      {
        assessmentId: priyaAssessment.id,
        dimension: "SKILLS",
        requirement: "Python",
        verdict: "MATCHED",
        evidenceExcerpt: "Built asynchronous REST APIs in FastAPI using Python",
        reasoning: "Solid Python experience evidenced in production services.",
        sortOrder: 1,
      },
      {
        assessmentId: priyaAssessment.id,
        dimension: "SKILLS",
        requirement: "Django",
        verdict: "PARTIAL",
        evidenceExcerpt: "FastAPI and Flask microservices with OpenAPI schemas",
        reasoning: "Modern async Python framework skills are highly transferable to Django.",
        sortOrder: 2,
      },
      {
        assessmentId: priyaAssessment.id,
        dimension: "SKILLS",
        requirement: "PostgreSQL",
        verdict: "PARTIAL",
        evidenceExcerpt: "Engineered scalable MySQL schema and index strategies",
        reasoning: "Deep relational DB knowledge in MySQL, with transferable SQL skills.",
        sortOrder: 3,
      },
      {
        assessmentId: priyaAssessment.id,
        dimension: "SKILLS",
        requirement: "Docker",
        verdict: "MATCHED",
        evidenceExcerpt: "Deployed 12 containerized services using Docker on AWS ECS",
        reasoning: "Strong verifiable Docker containerization experience.",
        sortOrder: 4,
      },
      {
        assessmentId: priyaAssessment.id,
        dimension: "PROJECTS",
        requirement: "Cloud Orchestration",
        verdict: "MATCHED",
        evidenceExcerpt: "FastAPI microservice monitoring container health and CPU autoscaling triggers",
        reasoning: "Strong cloud operations deliverable on AWS ECS.",
        sortOrder: 5,
      },
    ],
  });

  // 1.3 Jonas Weber (IN_REVIEW, Score 68)
  const jonasApp = await seedAppWithAudit({
    id: "app-jonas-backend",
    jobId: backendJob.id,
    candidateId: jonas.profile.id,
    resumeId: jonas.resume.id,
    status: "IN_REVIEW",
    coverNote: "Experienced Java engineer with database and scripting background interested in backend Python transitions.",
    recruiterNotes: "Assessing if candidate can ramp up on Django quickly given strong Java OOP background.",
    submittedDaysAgo: 3,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 3, note: "Applied via candidate portal" },
      { toStatus: "PARSED", daysAgo: 3, note: "Resume parsed successfully" },
      { toStatus: "ASSESSED", daysAgo: 2, note: "Assessment finished with 68% score" },
      { toStatus: "IN_REVIEW", daysAgo: 1, note: "Moved to review for team skills assessment", changedById: recruiter.id },
    ],
  });

  const jonasAssessment = await prisma.assessment.upsert({
    where: { applicationId: jonasApp.id },
    update: {
      status: "COMPLETED",
      overallScore: 68,
      skillsScore: 65,
      experienceScore: 70,
      projectsScore: 68,
      qualificationsScore: 75,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Solid enterprise background in Java/Spring Boot. Python and container requirements lack evidence in resume.",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    create: {
      applicationId: jonasApp.id,
      status: "COMPLETED",
      overallScore: 68,
      skillsScore: 65,
      experienceScore: 70,
      projectsScore: 68,
      qualificationsScore: 75,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Solid enterprise background in Java/Spring Boot. Python and container requirements lack evidence in resume.",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.assessmentItem.deleteMany({ where: { assessmentId: jonasAssessment.id } });
  await prisma.assessmentItem.createMany({
    data: [
      {
        assessmentId: jonasAssessment.id,
        dimension: "SKILLS",
        requirement: "Python",
        verdict: "PARTIAL",
        evidenceExcerpt: "Created utility Python automation scripts",
        reasoning: "Basic scripting knowledge present; lacks larger web application context.",
        sortOrder: 1,
      },
      {
        assessmentId: jonasAssessment.id,
        dimension: "SKILLS",
        requirement: "Django",
        verdict: "NOT_EVIDENCED",
        evidenceExcerpt: null,
        reasoning: "No evidence found for Django in candidate resume.",
        sortOrder: 2,
      },
      {
        assessmentId: jonasAssessment.id,
        dimension: "SKILLS",
        requirement: "PostgreSQL",
        verdict: "PARTIAL",
        evidenceExcerpt: "Managed database schema migrations and data integrity in SQL",
        reasoning: "General relational database experience without explicit Postgres mentions.",
        sortOrder: 3,
      },
      {
        assessmentId: jonasAssessment.id,
        dimension: "SKILLS",
        requirement: "Docker",
        verdict: "NOT_EVIDENCED",
        evidenceExcerpt: null,
        reasoning: "No containerization experience cited in resume.",
        sortOrder: 4,
      },
    ],
  });

  // 1.4 Tariq Mehmood (ASSESSED, Score 82)
  const tariqApp = await seedAppWithAudit({
    id: "app-tariq-backend",
    jobId: backendJob.id,
    candidateId: tariq.profile.id,
    resumeId: tariq.resume.id,
    status: "ASSESSED",
    coverNote: "DevOps engineer with heavy Python scripting and Docker/Kubernetes container orchestration experience.",
    submittedDaysAgo: 3,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 3, note: "Applied for backend vacancy" },
      { toStatus: "PARSED", daysAgo: 3, note: "Resume parsed" },
      { toStatus: "ASSESSED", daysAgo: 2, note: "Assessment generated: 82% match score" },
    ],
  });

  const tariqAssessment = await prisma.assessment.upsert({
    where: { applicationId: tariqApp.id },
    update: {
      status: "COMPLETED",
      overallScore: 82,
      skillsScore: 80,
      experienceScore: 88,
      projectsScore: 85,
      qualificationsScore: 80,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Outstanding containerization and infrastructure background. Strong Python scripting; lacks dedicated Django web framework evidence.",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    create: {
      applicationId: tariqApp.id,
      status: "COMPLETED",
      overallScore: 82,
      skillsScore: 80,
      experienceScore: 88,
      projectsScore: 85,
      qualificationsScore: 80,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Outstanding containerization and infrastructure background. Strong Python scripting; lacks dedicated Django web framework evidence.",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.assessmentItem.deleteMany({ where: { assessmentId: tariqAssessment.id } });
  await prisma.assessmentItem.createMany({
    data: [
      {
        assessmentId: tariqAssessment.id,
        dimension: "SKILLS",
        requirement: "Python",
        verdict: "MATCHED",
        evidenceExcerpt: "Created infrastructure automation scripts in Python",
        reasoning: "Solid Python automation capabilities.",
        sortOrder: 1,
      },
      {
        assessmentId: tariqAssessment.id,
        dimension: "SKILLS",
        requirement: "Docker",
        verdict: "MATCHED",
        evidenceExcerpt: "Built hardened multi-stage Docker container images",
        reasoning: "Advanced containerization mastery.",
        sortOrder: 2,
      },
      {
        assessmentId: tariqAssessment.id,
        dimension: "SKILLS",
        requirement: "PostgreSQL",
        verdict: "PARTIAL",
        evidenceExcerpt: "Administered Linux servers and database clusters",
        reasoning: "Server administration includes database clustering.",
        sortOrder: 3,
      },
      {
        assessmentId: tariqAssessment.id,
        dimension: "SKILLS",
        requirement: "Django",
        verdict: "NOT_EVIDENCED",
        evidenceExcerpt: null,
        reasoning: "No Django framework evidence found in resume.",
        sortOrder: 4,
      },
    ],
  });

  // =========================================================================
  // 2. FRONTEND DEVELOPER REQUISITIONS (4 candidates)
  // =========================================================================

  // 2.1 Lena Okafor (INTERVIEW, Score 92)
  const lenaFrontendApp = await seedAppWithAudit({
    id: "app-lena-frontend",
    jobId: frontendJob.id,
    candidateId: lena.profile.id,
    resumeId: lena.resume.id,
    status: "INTERVIEW",
    coverNote: "Senior frontend specialist with a dedication to accessible, atomic design systems and strict TypeScript architectures.",
    recruiterNotes: "Passed technical screening with flying colors. Scheduled for live system design and accessibility round.",
    submittedDaysAgo: 6,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 6, note: "Applied for Frontend vacancy" },
      { toStatus: "PARSED", daysAgo: 6, note: "Resume parsed" },
      { toStatus: "ASSESSED", daysAgo: 5, note: "AI Assessment: 92%" },
      { toStatus: "SHORTLISTED", daysAgo: 4, note: "Shortlisted for high accessibility match", changedById: recruiter.id },
      { toStatus: "INTERVIEW", daysAgo: 2, note: "Technical Interview scheduled", changedById: recruiter.id },
    ],
  });

  const lenaAssessment = await prisma.assessment.upsert({
    where: { applicationId: lenaFrontendApp.id },
    update: {
      status: "COMPLETED",
      overallScore: 92,
      skillsScore: 95,
      experienceScore: 90,
      projectsScore: 90,
      qualificationsScore: 90,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Top tier frontend candidate with comprehensive React, TypeScript, and WCAG AA accessibility compliance across multiple production systems.",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    create: {
      applicationId: lenaFrontendApp.id,
      status: "COMPLETED",
      overallScore: 92,
      skillsScore: 95,
      experienceScore: 90,
      projectsScore: 90,
      qualificationsScore: 90,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Top tier frontend candidate with comprehensive React, TypeScript, and WCAG AA accessibility compliance across multiple production systems.",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.assessmentItem.deleteMany({ where: { assessmentId: lenaAssessment.id } });
  await prisma.assessmentItem.createMany({
    data: [
      {
        assessmentId: lenaAssessment.id,
        dimension: "SKILLS",
        requirement: "React",
        verdict: "MATCHED",
        evidenceExcerpt: "Led component design system development in React and TypeScript",
        reasoning: "Proven leadership in enterprise React component development.",
        sortOrder: 1,
      },
      {
        assessmentId: lenaAssessment.id,
        dimension: "SKILLS",
        requirement: "TypeScript",
        verdict: "MATCHED",
        evidenceExcerpt: "Built strict typesafe components in TypeScript",
        reasoning: "Verified TypeScript experience in production.",
        sortOrder: 2,
      },
      {
        assessmentId: lenaAssessment.id,
        dimension: "SKILLS",
        requirement: "Accessibility",
        verdict: "MATCHED",
        evidenceExcerpt: "Enforced WCAG 2.1 AA accessibility standards across 15+ surfaces",
        reasoning: "Direct match for preferred accessibility requirement.",
        sortOrder: 3,
      },
    ],
  });

  // 2.2 David Kim (SHORTLISTED, Score 89)
  await seedAppWithAudit({
    id: "app-david-frontend",
    jobId: frontendJob.id,
    candidateId: david.profile.id,
    resumeId: david.resume.id,
    status: "SHORTLISTED",
    coverNote: "Experienced React and Next.js developer ready to bring high-performance web engineering to your frontend.",
    recruiterNotes: "Solid React / Next.js background with strong architecture fundamentals.",
    submittedDaysAgo: 5,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 5, note: "Applied for Frontend Developer" },
      { toStatus: "PARSED", daysAgo: 5, note: "Resume parsed" },
      { toStatus: "ASSESSED", daysAgo: 4, note: "Assessment score: 89%" },
      { toStatus: "SHORTLISTED", daysAgo: 2, note: "Candidate shortlisted", changedById: recruiter.id },
    ],
  });

  // 2.3 Marco Silva (REJECTED, Score 54)
  await seedAppWithAudit({
    id: "app-marco-frontend",
    jobId: frontendJob.id,
    candidateId: marco.profile.id,
    resumeId: marco.resume.id,
    status: "REJECTED",
    coverNote: "Junior web developer eager to learn and grow in a fast-paced frontend engineering team.",
    recruiterNotes: "Candidate lacks sufficient commercial TypeScript and Next.js experience for this level. Retain in talent pool for junior intake.",
    submittedDaysAgo: 7,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 7, note: "Applied via website" },
      { toStatus: "PARSED", daysAgo: 7, note: "Parsed" },
      { toStatus: "ASSESSED", daysAgo: 6, note: "AI Assessment: 54% match" },
      { toStatus: "REJECTED", daysAgo: 4, note: "Role requires 2+ years mid-level commercial experience", changedById: recruiter.id },
    ],
  });

  // 2.4 Fatima Noor (SUBMITTED)
  await seedAppWithAudit({
    id: "app-fatima-frontend",
    jobId: frontendJob.id,
    candidateId: fatima.profile.id,
    resumeId: fatima.resume.id,
    status: "SUBMITTED",
    coverNote: "Passionate about clean UI, CSS layouts, and modern React development.",
    submittedDaysAgo: 1,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 1, note: "Application submitted" },
    ],
  });

  // =========================================================================
  // 3. FULL STACK, AI/ML, DESIGN, ANALYST & QA REQUISITIONS
  // =========================================================================

  // 3.1 David Kim -> Full Stack (IN_REVIEW, Score 91)
  await seedAppWithAudit({
    id: "app-david-fullstack",
    jobId: fullstackJob.id,
    candidateId: david.profile.id,
    resumeId: david.resume.id,
    status: "IN_REVIEW",
    coverNote: "5 years building full-stack web applications with Next.js, Node.js, and PostgreSQL.",
    submittedDaysAgo: 4,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 4, note: "Application received" },
      { toStatus: "PARSED", daysAgo: 4, note: "Resume parsed" },
      { toStatus: "ASSESSED", daysAgo: 3, note: "AI Score: 91%" },
      { toStatus: "IN_REVIEW", daysAgo: 1, note: "Reviewing architectural project portfolio", changedById: recruiter.id },
    ],
  });

  // 3.2 Ethan Calder -> Full Stack (PARSED)
  await seedAppWithAudit({
    id: "app-ethan-fullstack",
    jobId: fullstackJob.id,
    candidateId: ethan.profile.id,
    resumeId: ethan.resume.id,
    status: "PARSED",
    coverNote: "Interested in full-stack leadership roles leveraging Python and React.",
    submittedDaysAgo: 2,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 2, note: "Submitted" },
      { toStatus: "PARSED", daysAgo: 2, note: "Resume parsed; awaiting assessment queue" },
    ],
  });

  // 3.3 Ayla Vance -> Machine Learning Engineer (SHORTLISTED, Score 96)
  const aylaApp = await seedAppWithAudit({
    id: "app-ayla-ml",
    jobId: mlJob.id,
    candidateId: ayla.profile.id,
    resumeId: ayla.resume.id,
    status: "SHORTLISTED",
    coverNote: "6 years specializing in NLP transformers and production MLOps deployment pipelines.",
    recruiterNotes: "Top-tier AI researcher and practitioner. Matches all required PyTorch, MLOps, and model evaluation standards.",
    submittedDaysAgo: 5,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 5, note: "Applied for ML Engineer" },
      { toStatus: "PARSED", daysAgo: 5, note: "Parsed" },
      { toStatus: "ASSESSED", daysAgo: 4, note: "AI Assessment: 96% match score" },
      { toStatus: "SHORTLISTED", daysAgo: 2, note: "Fast-tracked for technical interview round", changedById: recruiter.id },
    ],
  });

  const aylaAssessment = await prisma.assessment.upsert({
    where: { applicationId: aylaApp.id },
    update: {
      status: "COMPLETED",
      overallScore: 96,
      skillsScore: 98,
      experienceScore: 95,
      projectsScore: 95,
      qualificationsScore: 95,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Exceptional deep learning specialist matching PyTorch, transformers, ONNX runtime, and MLOps requirements.",
      generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    create: {
      applicationId: aylaApp.id,
      status: "COMPLETED",
      overallScore: 96,
      skillsScore: 98,
      experienceScore: 95,
      projectsScore: 95,
      qualificationsScore: 95,
      weights: { skills: 50, experience: 25, projects: 15, qualifications: 10 },
      summary: "Exceptional deep learning specialist matching PyTorch, transformers, ONNX runtime, and MLOps requirements.",
      generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.assessmentItem.deleteMany({ where: { assessmentId: aylaAssessment.id } });
  await prisma.assessmentItem.createMany({
    data: [
      {
        assessmentId: aylaAssessment.id,
        dimension: "SKILLS",
        requirement: "PyTorch",
        verdict: "MATCHED",
        evidenceExcerpt: "Architected semantic search pipelines with PyTorch",
        reasoning: "Deep proficiency in PyTorch model architectures.",
        sortOrder: 1,
      },
      {
        assessmentId: aylaAssessment.id,
        dimension: "SKILLS",
        requirement: "Transformers",
        verdict: "MATCHED",
        evidenceExcerpt: "Fine-tuned HuggingFace transformers for domain matching",
        reasoning: "Direct match for modern NLP transformer requirement.",
        sortOrder: 2,
      },
    ],
  });

  // 3.4 Sarah Jenkins -> Product Designer (INTERVIEW, Score 95)
  await seedAppWithAudit({
    id: "app-sarah-design",
    jobId: designJob.id,
    candidateId: sarah.profile.id,
    resumeId: sarah.resume.id,
    status: "INTERVIEW",
    coverNote: "Principal designer passionate about enterprise data visualizations and design systems.",
    recruiterNotes: "Portfolio review rated 10/10. Portfolio presentation interview scheduled with Product VP.",
    submittedDaysAgo: 6,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 6, note: "Applied for Design role" },
      { toStatus: "PARSED", daysAgo: 6, note: "Parsed" },
      { toStatus: "ASSESSED", daysAgo: 5, note: "Match Score: 95%" },
      { toStatus: "SHORTLISTED", daysAgo: 3, note: "Shortlisted", changedById: recruiter.id },
      { toStatus: "INTERVIEW", daysAgo: 1, note: "Portfolio presentation scheduled", changedById: recruiter.id },
    ],
  });

  // 3.5 Lena Okafor -> Data Analyst (SELECTED, Score 91)
  await seedAppWithAudit({
    id: "app-lena-analyst",
    jobId: analystJob.id,
    candidateId: lena.profile.id,
    resumeId: lena.resume.id,
    status: "SELECTED",
    coverNote: "Dual frontend and data visualization specialist eager to lead hiring analytics reporting.",
    recruiterNotes: "Candidate accepted offer letter. Start date set for first of next month.",
    submittedDaysAgo: 10,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 10, note: "Applied" },
      { toStatus: "PARSED", daysAgo: 10, note: "Parsed" },
      { toStatus: "ASSESSED", daysAgo: 9, note: "Score: 91%" },
      { toStatus: "SHORTLISTED", daysAgo: 7, note: "Shortlisted", changedById: recruiter.id },
      { toStatus: "INTERVIEW", daysAgo: 5, note: "Panel interview conducted", changedById: recruiter.id },
      { toStatus: "SELECTED", daysAgo: 2, note: "Formal offer extended and accepted", changedById: recruiter.id },
    ],
  });

  // 3.6 Zainab Rashid -> Data Analyst (SHORTLISTED, Score 88)
  await seedAppWithAudit({
    id: "app-zainab-analyst",
    jobId: analystJob.id,
    candidateId: zainab.profile.id,
    resumeId: zainab.resume.id,
    status: "SHORTLISTED",
    coverNote: "Experienced analytics engineer building dimensional SQL models and PowerBI dashboards.",
    recruiterNotes: "Strong candidate for next analytics intake round.",
    submittedDaysAgo: 8,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 8, note: "Applied" },
      { toStatus: "PARSED", daysAgo: 8, note: "Parsed" },
      { toStatus: "ASSESSED", daysAgo: 7, note: "AI Score: 88%" },
      { toStatus: "SHORTLISTED", daysAgo: 4, note: "Shortlisted for interview pipeline", changedById: recruiter.id },
    ],
  });

  // 3.7 Hamza Abbasi -> QA Automation Engineer (ASSESSED, Score 85)
  await seedAppWithAudit({
    id: "app-hamza-qa",
    jobId: qaJob.id,
    candidateId: hamza.profile.id,
    resumeId: hamza.resume.id,
    status: "ASSESSED",
    coverNote: "QA automation engineer specializing in Cypress end-to-end regression suites and CI/CD testing gates.",
    submittedDaysAgo: 3,
    statusEvents: [
      { toStatus: "SUBMITTED", daysAgo: 3, note: "Applied for QA Engineer" },
      { toStatus: "PARSED", daysAgo: 3, note: "Parsed" },
      { toStatus: "ASSESSED", daysAgo: 2, note: "AI Match Score: 85%" },
    ],
  });

  console.log("✅ 20-applications.ts seed completed.");
}
