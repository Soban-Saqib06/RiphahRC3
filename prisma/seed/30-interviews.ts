import { prisma } from "../../src/lib/db";

export default async function seedInterviews(): Promise<void> {
  console.log("🌱 Running 30-interviews.ts...");

  const recruiter = await prisma.user.findUnique({
    where: { email: "recruiter@demo.example" },
  });
  if (!recruiter) throw new Error("Recruiter not found in 30-interviews.ts");

  const ethanApp = await prisma.application.findUnique({ where: { id: "app-ethan-backend" } });
  const priyaApp = await prisma.application.findUnique({ where: { id: "app-priya-backend" } });
  const lenaFrontendApp = await prisma.application.findUnique({ where: { id: "app-lena-frontend" } });
  const lenaAnalystApp = await prisma.application.findUnique({ where: { id: "app-lena-analyst" } });
  const sarahApp = await prisma.application.findUnique({ where: { id: "app-sarah-design" } });
  const aylaApp = await prisma.application.findUnique({ where: { id: "app-ayla-ml" } });
  const marcoApp = await prisma.application.findUnique({ where: { id: "app-marco-frontend" } });

  // =========================================================================
  // 1. SCHEDULED, COMPLETED & CANCELLED INTERVIEWS
  // =========================================================================

  // 1.1 Upcoming Technical Interview for Lena Okafor (Frontend)
  if (lenaFrontendApp) {
    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    twoDaysFromNow.setHours(10, 0, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: lenaFrontendApp.id,
        scheduledAt: twoDaysFromNow,
        durationMinutes: 45,
        type: "TECHNICAL",
        interviewerName: "Maya Hartwell & Lead UI Architect",
        location: "Google Meet: meet.google.com/tp-frontend-arch",
        status: "SCHEDULED",
        scheduledById: recruiter.id,
      },
    });
  }

  // 1.2 Upcoming Portfolio Presentation for Sarah Jenkins (Design)
  if (sarahApp) {
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    threeDaysFromNow.setHours(14, 0, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: sarahApp.id,
        scheduledAt: threeDaysFromNow,
        durationMinutes: 60,
        type: "PANEL",
        interviewerName: "Maya Hartwell & Head of Product Design",
        location: "Zoom: https://zoom.us/j/8839201948",
        status: "SCHEDULED",
        scheduledById: recruiter.id,
      },
    });
  }

  // 1.3 Upcoming Technical Screening for Priya Nandakumar (Backend)
  if (priyaApp) {
    const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    tomorrow.setHours(15, 30, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: priyaApp.id,
        scheduledAt: tomorrow,
        durationMinutes: 30,
        type: "PHONE_SCREEN",
        interviewerName: "Bilal Tariq",
        location: "Google Meet: meet.google.com/tp-priya-screen",
        status: "SCHEDULED",
        scheduledById: recruiter.id,
      },
    });
  }

  // 1.4 Completed Panel Interview for Lena Okafor (Data Analyst) -> Offer Accepted
  if (lenaAnalystApp) {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    fiveDaysAgo.setHours(11, 0, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: lenaAnalystApp.id,
        scheduledAt: fiveDaysAgo,
        durationMinutes: 60,
        type: "PANEL",
        interviewerName: "Maya Hartwell & VP of Data",
        location: "Executive Meeting Suite A",
        status: "COMPLETED",
        feedbackNotes: "Candidate demonstrated outstanding analytical capability, SQL query optimization depth, and clean communication. Unanimously recommended for offer.",
        scheduledById: recruiter.id,
      },
    });
  }

  // 1.5 Completed Phone Screening for Ethan Calder (Backend Developer)
  if (ethanApp) {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    threeDaysAgo.setHours(16, 0, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: ethanApp.id,
        scheduledAt: threeDaysAgo,
        durationMinutes: 30,
        type: "PHONE_SCREEN",
        interviewerName: "Maya Hartwell",
        location: "Phone Call (+92 300 1234567)",
        status: "COMPLETED",
        feedbackNotes: "Candidate demonstrated comprehensive distributed systems knowledge and deep familiarity with PostgreSQL query plans. Recommended for technical architecture panel.",
        scheduledById: recruiter.id,
      },
    });
  }

  // 1.6 Cancelled Interview for Marco Silva (Junior Frontend)
  if (marcoApp) {
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
    fourDaysAgo.setHours(13, 0, 0, 0);

    await prisma.interview.create({
      data: {
        applicationId: marcoApp.id,
        scheduledAt: fourDaysAgo,
        durationMinutes: 30,
        type: "PHONE_SCREEN",
        interviewerName: "Bilal Tariq",
        location: "Google Meet",
        status: "CANCELLED",
        feedbackNotes: "Candidate application was closed prior to interview due to experience criteria requirement.",
        scheduledById: recruiter.id,
      },
    });
  }

  // =========================================================================
  // 2. STRUCTURED INTERVIEW QUESTIONS (across technical, project, behavioral)
  // =========================================================================

  // 2.1 Questions for Ethan Calder
  if (ethanApp) {
    await prisma.interviewQuestion.deleteMany({ where: { applicationId: ethanApp.id } });
    await prisma.interviewQuestion.createMany({
      data: [
        {
          applicationId: ethanApp.id,
          category: "TECHNICAL",
          question: "Walk us through your PostgreSQL query optimization strategy when scaling beyond 20 million records. How did you design table partitioning?",
          rationale: "Probes candidate's claimed database scaling expertise from resume.",
          source: "AI",
          sortOrder: 1,
        },
        {
          applicationId: ethanApp.id,
          category: "PROJECT",
          question: "In your distributed Python service handling 50k req/min, how did you handle asynchronous task failure and Redis queue retry semantics?",
          rationale: "Evaluates production reliability and distributed systems architecture.",
          source: "AI",
          sortOrder: 2,
        },
        {
          applicationId: ethanApp.id,
          category: "BEHAVIORAL",
          question: "Describe a situation where you had to push back on a product feature request due to architectural complexity or database performance risks.",
          rationale: "Evaluates engineering judgment and cross-functional communication.",
          source: "RECRUITER",
          sortOrder: 3,
        },
        {
          applicationId: ethanApp.id,
          category: "ROLE_FIT",
          question: "What engineering standards and code review practices do you instill in junior developers when authoring multi-tenant Django applications?",
          rationale: "Assesses technical leadership and mentorship readiness for Senior position.",
          source: "RECRUITER",
          sortOrder: 4,
        },
      ],
    });
  }

  // 2.2 Questions for Priya Nandakumar
  if (priyaApp) {
    await prisma.interviewQuestion.deleteMany({ where: { applicationId: priyaApp.id } });
    await prisma.interviewQuestion.createMany({
      data: [
        {
          applicationId: priyaApp.id,
          category: "TECHNICAL",
          question: "How do you handle dependency injection and async database sessions in FastAPI to prevent connection pool exhaustion?",
          rationale: "Probes asynchronous Python concurrency and connection lifecycle management.",
          source: "AI",
          sortOrder: 1,
        },
        {
          applicationId: priyaApp.id,
          category: "ROLE_FIT",
          question: "Given your primary production experience is with FastAPI and Flask, what is your approach to adopting Django's ORM and synchronous middleware?",
          rationale: "Evaluates framework adaptability from gap identified in AI assessment.",
          source: "AI",
          sortOrder: 2,
        },
        {
          applicationId: priyaApp.id,
          category: "PROJECT",
          question: "How did you design the automated OpenAPI schema generator and ensure breaking contract changes were caught before deploying to AWS ECS?",
          rationale: "Validates API governance and release management from resume deliverables.",
          source: "RECRUITER",
          sortOrder: 3,
        },
      ],
    });
  }

  // 2.3 Questions for Lena Okafor
  if (lenaFrontendApp) {
    await prisma.interviewQuestion.deleteMany({ where: { applicationId: lenaFrontendApp.id } });
    await prisma.interviewQuestion.createMany({
      data: [
        {
          applicationId: lenaFrontendApp.id,
          category: "TECHNICAL",
          question: "How do you structure design tokens in Tailwind and TypeScript to maintain strict type safety and accessible contrast ratios?",
          rationale: "Evaluates candidate's design system architecture expertise.",
          source: "AI",
          sortOrder: 1,
        },
        {
          applicationId: lenaFrontendApp.id,
          category: "PROJECT",
          question: "When enforcing WCAG 2.1 AA across 15+ surfaces, how did you automate keyboard navigation and screen reader audits in CI/CD?",
          rationale: "Probes accessibility leadership and testing rigor evidenced on resume.",
          source: "AI",
          sortOrder: 2,
        },
        {
          applicationId: lenaFrontendApp.id,
          category: "BEHAVIORAL",
          question: "Tell us about a time you had to balance pixel-perfect design requirements with tight delivery deadlines. How did you negotiate scope with designers?",
          rationale: "Evaluates cross-functional collaboration with product design squads.",
          source: "RECRUITER",
          sortOrder: 3,
        },
      ],
    });
  }

  // 2.4 Questions for Ayla Vance
  if (aylaApp) {
    await prisma.interviewQuestion.deleteMany({ where: { applicationId: aylaApp.id } });
    await prisma.interviewQuestion.createMany({
      data: [
        {
          applicationId: aylaApp.id,
          category: "TECHNICAL",
          question: "Walk us through your ONNX runtime quantization workflow that reduced inference latency by 45%. What precision trade-offs did you evaluate?",
          rationale: "Probes model optimization and deep learning deployment rigor.",
          source: "AI",
          sortOrder: 1,
        },
        {
          applicationId: aylaApp.id,
          category: "PROJECT",
          question: "In your cross-encoder candidate ranking system, how did you prevent embedding drift when new job skill descriptions were added?",
          rationale: "Validates semantic search production reliability from project deliverable.",
          source: "AI",
          sortOrder: 2,
        },
      ],
    });
  }

  // 2.5 Questions for Sarah Jenkins
  if (sarahApp) {
    await prisma.interviewQuestion.deleteMany({ where: { applicationId: sarahApp.id } });
    await prisma.interviewQuestion.createMany({
      data: [
        {
          applicationId: sarahApp.id,
          category: "PROJECT",
          question: "How did you structure user research interviews that revealed friction in the analytics dashboard and raised the SUS score from 68 to 86?",
          rationale: "Verifies quantitative and qualitative research methodologies cited on resume.",
          source: "AI",
          sortOrder: 1,
        },
        {
          applicationId: sarahApp.id,
          category: "TECHNICAL",
          question: "Describe your approach to building Figma token variables that map 1:1 with developer CSS custom properties.",
          rationale: "Evaluates design-to-code workflow and design system cohesion.",
          source: "AI",
          sortOrder: 2,
        },
      ],
    });
  }

  console.log("✅ 30-interviews.ts seed completed.");
}
