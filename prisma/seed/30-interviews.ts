import { prisma } from "../../src/lib/db";

export default async function seedInterviews(): Promise<void> {
  console.log("🌱 Running 30-interviews.ts...");

  const recruiter = await prisma.user.findUnique({
    where: { email: "recruiter@demo.example" },
  });
  if (!recruiter) throw new Error("Recruiter not found in 30-interviews.ts");

  const ethanApp = await prisma.application.findUnique({
    where: { id: "app-ethan-backend" },
  });
  const lenaFrontendApp = await prisma.application.findUnique({
    where: { id: "app-lena-frontend" },
  });
  const lenaAnalystApp = await prisma.application.findUnique({
    where: { id: "app-lena-analyst" },
  });

  // 1. Interviews for Lena
  if (lenaFrontendApp) {
    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    twoDaysFromNow.setHours(10, 0, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: lenaFrontendApp.id,
        scheduledAt: twoDaysFromNow,
        durationMinutes: 45,
        type: "TECHNICAL",
        interviewerName: "Maya Hartwell",
        location: "Meeting Room A / Google Meet: meet.google.com/abc-demo",
        status: "SCHEDULED",
        scheduledById: recruiter.id,
      },
    });
  }

  if (lenaAnalystApp) {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    sixDaysAgo.setHours(14, 30, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: lenaAnalystApp.id,
        scheduledAt: sixDaysAgo,
        durationMinutes: 60,
        type: "PANEL",
        interviewerName: "Maya Hartwell & Head of Analytics",
        location: "Executive Boardroom",
        status: "COMPLETED",
        feedbackNotes: "Candidate demonstrated outstanding analytical capability and data visualization skills. Unanimously recommended for offer.",
        scheduledById: recruiter.id,
      },
    });
  }

  // 2. Preloaded interview questions for Ethan Calder
  if (ethanApp) {
    await prisma.interviewQuestion.deleteMany({ where: { applicationId: ethanApp.id } });
    await prisma.interviewQuestion.createMany({
      data: [
        {
          applicationId: ethanApp.id,
          category: "TECHNICAL",
          question: "How did you design the table partitioning scheme for the 20M+ rows PostgreSQL database, and how did you verify index efficiency?",
          rationale: "Candidate resume claims significant database tuning experience; this validates practical knowledge.",
          source: "AI",
          sortOrder: 1,
        },
        {
          applicationId: ethanApp.id,
          category: "PROJECT",
          question: "Walk us through the architecture of the Python microservices handling 50k requests/minute. How did you handle asynchronous tasks and queue backpressure?",
          rationale: "Assesses distributed architecture and resilience under load.",
          source: "AI",
          sortOrder: 2,
        },
        {
          applicationId: ethanApp.id,
          category: "ROLE_FIT",
          question: "How do you coordinate API contract changes across multi-disciplinary frontend and backend teams using Git and CI/CD?",
          rationale: "Evaluates teamwork, communication, and engineering hygiene.",
          source: "RECRUITER",
          sortOrder: 3,
        },
      ],
    });
  }

  console.log("✅ 30-interviews.ts seed completed.");
}
