import { prisma } from "../../src/lib/db";

export default async function seedApplications(): Promise<void> {
  console.log("🌱 Running 20-applications.ts...");

  const recruiter = await prisma.user.findUnique({
    where: { email: "recruiter@demo.example" },
  });

  const backendJob = await prisma.job.findFirst({
    where: { title: "Backend Developer" },
  });
  const frontendJob = await prisma.job.findFirst({
    where: { title: "Frontend Developer" },
  });
  const dataAnalystJob = await prisma.job.findFirst({
    where: { title: "Data Analyst" },
  });

  const ethan = await prisma.user.findUnique({
    where: { email: "candidate1@demo.example" },
    include: { candidateProfile: { include: { resumes: true } } },
  });
  const priya = await prisma.user.findUnique({
    where: { email: "candidate2@demo.example" },
    include: { candidateProfile: { include: { resumes: true } } },
  });
  const jonas = await prisma.user.findUnique({
    where: { email: "candidate3@demo.example" },
    include: { candidateProfile: { include: { resumes: true } } },
  });
  const lena = await prisma.user.findUnique({
    where: { email: "candidate4@demo.example" },
    include: { candidateProfile: { include: { resumes: true } } },
  });
  const marco = await prisma.user.findUnique({
    where: { email: "candidate5@demo.example" },
    include: { candidateProfile: { include: { resumes: true } } },
  });

  const now = Date.now();
  const day = 86400000;

  // 1. Ethan Calder -> Backend Developer (PARSED)
  if (ethan?.candidateProfile && backendJob && ethan.candidateProfile.resumes[0]) {
    const app = await prisma.application.create({
      data: {
        id: "app-ethan-backend",
        jobId: backendJob.id,
        candidateId: ethan.candidateProfile.id,
        resumeId: ethan.candidateProfile.resumes[0].id,
        status: "PARSED",
        coverNote: "I have 5+ years of experience scaling Python & Django architectures with high-volume PostgreSQL databases.",
        submittedAt: new Date(now - 3 * day),
        statusUpdatedAt: new Date(now - 2 * day),
      },
    });

    await prisma.applicationStatusEvent.createMany({
      data: [
        {
          applicationId: app.id,
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedById: ethan.id,
          createdAt: new Date(now - 3 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "SUBMITTED",
          toStatus: "PARSED",
          note: "Resume parsed",
          createdAt: new Date(now - 3 * day + 60000),
        },
      ],
    });
  }

  // 2. Priya Nandakumar -> Backend Developer (PARSED)
  if (priya?.candidateProfile && backendJob && priya.candidateProfile.resumes[0]) {
    const app = await prisma.application.create({
      data: {
        id: "app-priya-backend",
        jobId: backendJob.id,
        candidateId: priya.candidateProfile.id,
        resumeId: priya.candidateProfile.resumes[0].id,
        status: "PARSED",
        coverNote: "Excited to bring my experience in FastAPI microservices and database optimization to the engineering team.",
        submittedAt: new Date(now - 5 * day),
        statusUpdatedAt: new Date(now - 4 * day),
      },
    });

    await prisma.applicationStatusEvent.createMany({
      data: [
        {
          applicationId: app.id,
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedById: priya.id,
          createdAt: new Date(now - 5 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "SUBMITTED",
          toStatus: "PARSED",
          note: "Resume parsed",
          createdAt: new Date(now - 5 * day + 60000),
        },
      ],
    });
  }

  // 3. Jonas Weber -> Backend Developer (SUBMITTED)
  if (jonas?.candidateProfile && backendJob && jonas.candidateProfile.resumes[0]) {
    const app = await prisma.application.create({
      data: {
        id: "app-jonas-backend",
        jobId: backendJob.id,
        candidateId: jonas.candidateProfile.id,
        resumeId: jonas.candidateProfile.resumes[0].id,
        status: "SUBMITTED",
        coverNote: "Software developer with Java background looking to grow in Python backend systems.",
        submittedAt: new Date(now - 1 * day),
        statusUpdatedAt: new Date(now - 1 * day),
      },
    });

    await prisma.applicationStatusEvent.create({
      data: {
        applicationId: app.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        changedById: jonas.id,
        createdAt: new Date(now - 1 * day),
      },
    });
  }

  // 4. Lena Okafor -> Frontend Developer (INTERVIEW) & Data Analyst (SELECTED)
  if (lena?.candidateProfile && frontendJob && lena.candidateProfile.resumes[0]) {
    const app = await prisma.application.create({
      data: {
        id: "app-lena-frontend",
        jobId: frontendJob.id,
        candidateId: lena.candidateProfile.id,
        resumeId: lena.candidateProfile.resumes[0].id,
        status: "INTERVIEW",
        coverNote: "Senior frontend architect passionate about accessible design systems in React and TypeScript.",
        submittedAt: new Date(now - 8 * day),
        statusUpdatedAt: new Date(now - 2 * day),
      },
    });

    await prisma.applicationStatusEvent.createMany({
      data: [
        {
          applicationId: app.id,
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedById: lena.id,
          createdAt: new Date(now - 8 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "SUBMITTED",
          toStatus: "PARSED",
          note: "Resume parsed",
          createdAt: new Date(now - 8 * day + 60000),
        },
        {
          applicationId: app.id,
          fromStatus: "PARSED",
          toStatus: "SHORTLISTED",
          note: "Strong design system experience matches requisition requirements.",
          createdAt: new Date(now - 5 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "SHORTLISTED",
          toStatus: "INTERVIEW",
          note: "Technical panel scheduled.",
          createdAt: new Date(now - 2 * day),
        },
      ],
    });

    // Schedule interview if recruiter exists
    if (recruiter) {
      await prisma.interview.create({
        data: {
          id: "interview-lena-frontend",
          applicationId: app.id,
          scheduledById: recruiter.id,
          scheduledAt: new Date(now + 2 * day),
          durationMinutes: 45,
          type: "TECHNICAL",
          interviewerName: "Maya Hartwell",
          location: "Google Meet / Video Room A",
          status: "SCHEDULED",
        },
      });
    }
  }

  // Lena -> Data Analyst (SELECTED)
  if (lena?.candidateProfile && dataAnalystJob && lena.candidateProfile.resumes[0]) {
    const app = await prisma.application.create({
      data: {
        id: "app-lena-analyst",
        jobId: dataAnalystJob.id,
        candidateId: lena.candidateProfile.id,
        resumeId: lena.candidateProfile.resumes[0].id,
        status: "SELECTED",
        coverNote: "Prior analytical and data dashboard engineering background.",
        submittedAt: new Date(now - 12 * day),
        statusUpdatedAt: new Date(now - 3 * day),
      },
    });

    await prisma.applicationStatusEvent.createMany({
      data: [
        {
          applicationId: app.id,
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedById: lena.id,
          createdAt: new Date(now - 12 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "SUBMITTED",
          toStatus: "PARSED",
          createdAt: new Date(now - 12 * day + 60000),
        },
        {
          applicationId: app.id,
          fromStatus: "PARSED",
          toStatus: "SHORTLISTED",
          createdAt: new Date(now - 9 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "SHORTLISTED",
          toStatus: "INTERVIEW",
          createdAt: new Date(now - 6 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "INTERVIEW",
          toStatus: "SELECTED",
          note: "Candidate accepted offer.",
          createdAt: new Date(now - 3 * day),
        },
      ],
    });

    if (recruiter) {
      await prisma.interview.create({
        data: {
          id: "interview-lena-analyst",
          applicationId: app.id,
          scheduledById: recruiter.id,
          scheduledAt: new Date(now - 6 * day),
          durationMinutes: 60,
          type: "HR",
          interviewerName: "Maya Hartwell",
          location: "Main Office - Meeting Room 2",
          status: "COMPLETED",
          feedbackNotes: "Candidate demonstrated outstanding analytical clarity and cultural alignment.",
        },
      });
    }
  }

  // 5. Marco Silva -> Frontend Developer (REJECTED)
  if (marco?.candidateProfile && frontendJob && marco.candidateProfile.resumes[0]) {
    const app = await prisma.application.create({
      data: {
        id: "app-marco-frontend",
        jobId: frontendJob.id,
        candidateId: marco.candidateProfile.id,
        resumeId: marco.candidateProfile.resumes[0].id,
        status: "REJECTED",
        coverNote: "Enthusiastic junior web developer looking to contribute to modern React interfaces.",
        submittedAt: new Date(now - 6 * day),
        statusUpdatedAt: new Date(now - 4 * day),
      },
    });

    await prisma.applicationStatusEvent.createMany({
      data: [
        {
          applicationId: app.id,
          fromStatus: null,
          toStatus: "SUBMITTED",
          changedById: marco.id,
          createdAt: new Date(now - 6 * day),
        },
        {
          applicationId: app.id,
          fromStatus: "SUBMITTED",
          toStatus: "PARSED",
          createdAt: new Date(now - 6 * day + 60000),
        },
        {
          applicationId: app.id,
          fromStatus: "PARSED",
          toStatus: "REJECTED",
          note: "Requisition requires senior React and TypeScript architectural depth.",
          createdAt: new Date(now - 4 * day),
        },
      ],
    });
  }

  console.log("✅ 20-applications.ts seed completed.");
}
