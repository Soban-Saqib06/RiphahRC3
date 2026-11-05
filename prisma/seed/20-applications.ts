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

  const backendJob = await prisma.job.findUnique({
    where: { id: "job-backend-dev" },
    include: { skills: true },
  });
  const frontendJob = await prisma.job.findUnique({
    where: { id: "job-frontend-dev" },
    include: { skills: true },
  });
  const analystJob = await prisma.job.findUnique({
    where: { id: "job-data-analyst" },
    include: { skills: true },
  });

  if (!backendJob || !frontendJob || !analystJob) {
    throw new Error("Missing base jobs in 20-applications.ts");
  }

  // 1. Candidate 1 (Ethan Calder) -> Backend Developer (ASSESSED, Score: 94)
  const ethan = getCandidateProfile("candidate1@demo.example");
  const ethanApp = await prisma.application.upsert({
    where: {
      jobId_candidateId: {
        jobId: backendJob.id,
        candidateId: ethan.profile.id,
      },
    },
    update: {
      status: "ASSESSED",
      resumeId: ethan.resume.id,
      coverNote: "I have 5+ years scaling Python/Django backends and tuning massive PostgreSQL databases. Eager to contribute to TalentPilot's core architecture.",
    },
    create: {
      id: "app-ethan-backend",
      jobId: backendJob.id,
      candidateId: ethan.profile.id,
      resumeId: ethan.resume.id,
      status: "ASSESSED",
      coverNote: "I have 5+ years scaling Python/Django backends and tuning massive PostgreSQL databases. Eager to contribute to TalentPilot's core architecture.",
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      statusUpdatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  // Assessment for Ethan
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

  // Items for Ethan
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
    ],
  });

  // 2. Candidate 2 (Priya Nandakumar) -> Backend Developer (ASSESSED, Score: 88)
  const priya = getCandidateProfile("candidate2@demo.example");
  const priyaApp = await prisma.application.upsert({
    where: {
      jobId_candidateId: {
        jobId: backendJob.id,
        candidateId: priya.profile.id,
      },
    },
    update: {
      status: "ASSESSED",
      resumeId: priya.resume.id,
      coverNote: "Experienced in Python API design with FastAPI and MySQL. Excited to bring modern asynchronous patterns to the team.",
    },
    create: {
      id: "app-priya-backend",
      jobId: backendJob.id,
      candidateId: priya.profile.id,
      resumeId: priya.resume.id,
      status: "ASSESSED",
      coverNote: "Experienced in Python API design with FastAPI and MySQL. Excited to bring modern asynchronous patterns to the team.",
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      statusUpdatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  const priyaAssessment = await prisma.assessment.upsert({
    where: { applicationId: priyaApp.id },
    update: {
      status: "COMPLETED",
      overallScore: 88,
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
    ],
  });

  // 3. Candidate 3 (Jonas Weber) -> Backend Developer (ASSESSED, Score: 68)
  const jonas = getCandidateProfile("candidate3@demo.example");
  const jonasApp = await prisma.application.upsert({
    where: {
      jobId_candidateId: {
        jobId: backendJob.id,
        candidateId: jonas.profile.id,
      },
    },
    update: {
      status: "ASSESSED",
      resumeId: jonas.resume.id,
      coverNote: "Experienced Java engineer with database and scripting background interested in backend Python transitions.",
    },
    create: {
      id: "app-jonas-backend",
      jobId: backendJob.id,
      candidateId: jonas.profile.id,
      resumeId: jonas.resume.id,
      status: "ASSESSED",
      coverNote: "Experienced Java engineer with database and scripting background interested in backend Python transitions.",
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      statusUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
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
        evidenceExcerpt: "Managed database schema migrations and integrity in SQL",
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

  // 4. Candidate 4 (Lena Okafor) -> Frontend Developer (SHORTLISTED) & Data Analyst (SELECTED)
  const lena = getCandidateProfile("candidate4@demo.example");
  await prisma.application.upsert({
    where: {
      jobId_candidateId: {
        jobId: frontendJob.id,
        candidateId: lena.profile.id,
      },
    },
    update: { status: "INTERVIEW", resumeId: lena.resume.id },
    create: {
      id: "app-lena-frontend",
      jobId: frontendJob.id,
      candidateId: lena.profile.id,
      resumeId: lena.resume.id,
      status: "INTERVIEW",
      submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      statusUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.application.upsert({
    where: {
      jobId_candidateId: {
        jobId: analystJob.id,
        candidateId: lena.profile.id,
      },
    },
    update: { status: "SELECTED", resumeId: lena.resume.id },
    create: {
      id: "app-lena-analyst",
      jobId: analystJob.id,
      candidateId: lena.profile.id,
      resumeId: lena.resume.id,
      status: "SELECTED",
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      statusUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  // 5. Candidate 5 (Marco Silva) -> Frontend Developer (REJECTED)
  const marco = getCandidateProfile("candidate5@demo.example");
  await prisma.application.upsert({
    where: {
      jobId_candidateId: {
        jobId: frontendJob.id,
        candidateId: marco.profile.id,
      },
    },
    update: { status: "REJECTED", resumeId: marco.resume.id },
    create: {
      id: "app-marco-frontend",
      jobId: frontendJob.id,
      candidateId: marco.profile.id,
      resumeId: marco.resume.id,
      status: "REJECTED",
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      statusUpdatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ 20-applications.ts seed completed.");
}
