import { prisma } from "../../src/lib/db";
import { hashPassword } from "../../src/lib/auth";

export default async function seedCore(): Promise<void> {
  console.log("🌱 Running 00-core.ts...");

  const demoPasswordHash = await hashPassword("Demo@12345");

  // 1. Recruiter user
  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@demo.example" },
    update: {
      name: "Maya Hartwell",
      role: "RECRUITER",
      passwordHash: demoPasswordHash,
    },
    create: {
      email: "recruiter@demo.example",
      name: "Maya Hartwell",
      role: "RECRUITER",
      passwordHash: demoPasswordHash,
    },
  });

  // 2. Candidate users & profiles
  const candidatesData = [
    {
      email: "candidate1@demo.example",
      name: "Ethan Calder",
      headline: "Senior Backend Engineer | Python, PostgreSQL & Distributed Systems",
      location: "Lahore, Pakistan",
      summary: "Backend engineer with 4+ years of experience designing robust microservices and scalable REST APIs using Python, Django, and PostgreSQL.",
      linkedinUrl: "https://linkedin.com/in/ethan-calder",
      githubUrl: "https://github.com/ethancalder",
    },
    {
      email: "candidate2@demo.example",
      name: "Priya Nandakumar",
      headline: "Full Stack & API Engineer | FastAPI, Flask, MySQL",
      location: "Islamabad, Pakistan",
      summary: "Software engineer focusing on Python web services with FastAPI, relational databases, and containerized deployments.",
      linkedinUrl: "https://linkedin.com/in/priya-nandakumar",
      githubUrl: "https://github.com/priyananda",
    },
    {
      email: "candidate3@demo.example",
      name: "Jonas Weber",
      headline: "Backend Developer | Java, Spring Boot & Python",
      location: "Karachi, Pakistan",
      summary: "Software developer with background in enterprise Java services and scripting in Python.",
      linkedinUrl: "https://linkedin.com/in/jonas-weber",
      githubUrl: "https://github.com/jonasweber",
    },
    {
      email: "candidate4@demo.example",
      name: "Lena Okafor",
      headline: "Senior Frontend Specialist | React, TypeScript & Design Systems",
      location: "Lahore, Pakistan",
      summary: "Frontend engineer passionate about accessible interfaces, component libraries, and performant web applications.",
      linkedinUrl: "https://linkedin.com/in/lena-okafor",
      githubUrl: "https://github.com/lenaokafor",
    },
    {
      email: "candidate5@demo.example",
      name: "Marco Silva",
      headline: "Junior Web Developer | JavaScript & React",
      location: "Rawalpindi, Pakistan",
      summary: "Recent computer science graduate with projects built in React and modern JavaScript.",
      linkedinUrl: "https://linkedin.com/in/marco-silva",
      githubUrl: "https://github.com/marcosilva",
    },
  ];

  for (const c of candidatesData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {
        name: c.name,
        role: "CANDIDATE",
        passwordHash: demoPasswordHash,
      },
      create: {
        email: c.email,
        name: c.name,
        role: "CANDIDATE",
        passwordHash: demoPasswordHash,
      },
    });

    await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      update: {
        headline: c.headline,
        location: c.location,
        summary: c.summary,
        linkedinUrl: c.linkedinUrl,
        githubUrl: c.githubUrl,
      },
      create: {
        userId: user.id,
        headline: c.headline,
        location: c.location,
        summary: c.summary,
        linkedinUrl: c.linkedinUrl,
        githubUrl: c.githubUrl,
      },
    });
  }

  // 3. Baseline Jobs and JobSkills
  // 3.1 Backend Developer (OPEN)
  const backendJob = await prisma.job.upsert({
    where: { id: "job-backend-dev" },
    update: {
      recruiterId: recruiter.id,
      title: "Backend Developer",
      department: "Engineering",
      location: "Lahore (Hybrid)",
      employmentType: "FULL_TIME",
      salaryMin: 250000,
      salaryMax: 400000,
      salaryCurrency: "PKR",
      status: "OPEN",
      minYearsExperience: 3,
      requiredQualifications:
        "Bachelor's degree in Computer Science, Software Engineering or equivalent practical experience",
      description:
        "Join our backend team building scalable talent intelligence APIs and microservices. You will work on robust backend systems, data pipelines, and intelligent candidate matching engines.",
    },
    create: {
      id: "job-backend-dev",
      recruiterId: recruiter.id,
      title: "Backend Developer",
      department: "Engineering",
      location: "Lahore (Hybrid)",
      employmentType: "FULL_TIME",
      salaryMin: 250000,
      salaryMax: 400000,
      salaryCurrency: "PKR",
      status: "OPEN",
      minYearsExperience: 3,
      requiredQualifications:
        "Bachelor's degree in Computer Science, Software Engineering or equivalent practical experience",
      description:
        "Join our backend team building scalable talent intelligence APIs and microservices. You will work on robust backend systems, data pipelines, and intelligent candidate matching engines.",
    },
  });

  const backendSkills = [
    { name: "Python", priority: "REQUIRED" as const, importance: 5 },
    { name: "Django", priority: "REQUIRED" as const, importance: 5 },
    { name: "PostgreSQL", priority: "REQUIRED" as const, importance: 4 },
    { name: "Docker", priority: "REQUIRED" as const, importance: 3 },
    { name: "REST API design", priority: "PREFERRED" as const, importance: 3 },
    { name: "Git", priority: "PREFERRED" as const, importance: 2 },
  ];

  for (const skill of backendSkills) {
    await prisma.jobSkill.upsert({
      where: {
        jobId_name: {
          jobId: backendJob.id,
          name: skill.name,
        },
      },
      update: {
        priority: skill.priority,
        importance: skill.importance,
      },
      create: {
        jobId: backendJob.id,
        name: skill.name,
        priority: skill.priority,
        importance: skill.importance,
      },
    });
  }

  // 3.2 Frontend Developer (OPEN)
  const frontendJob = await prisma.job.upsert({
    where: { id: "job-frontend-dev" },
    update: {
      recruiterId: recruiter.id,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Lahore (Hybrid)",
      employmentType: "FULL_TIME",
      salaryMin: 200000,
      salaryMax: 350000,
      salaryCurrency: "PKR",
      status: "OPEN",
      minYearsExperience: 2,
      requiredQualifications:
        "Bachelor's degree in Computer Science or proven frontend web development experience.",
      description:
        "Build intuitive, responsive, and accessible candidate and recruiter interfaces using Next.js and Tailwind CSS.",
    },
    create: {
      id: "job-frontend-dev",
      recruiterId: recruiter.id,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Lahore (Hybrid)",
      employmentType: "FULL_TIME",
      salaryMin: 200000,
      salaryMax: 350000,
      salaryCurrency: "PKR",
      status: "OPEN",
      minYearsExperience: 2,
      requiredQualifications:
        "Bachelor's degree in Computer Science or proven frontend web development experience.",
      description:
        "Build intuitive, responsive, and accessible candidate and recruiter interfaces using Next.js and Tailwind CSS.",
    },
  });

  const frontendSkills = [
    { name: "React", priority: "REQUIRED" as const, importance: 5 },
    { name: "TypeScript", priority: "REQUIRED" as const, importance: 4 },
    { name: "CSS", priority: "REQUIRED" as const, importance: 3 },
    { name: "Accessibility", priority: "PREFERRED" as const, importance: 2 },
  ];

  for (const skill of frontendSkills) {
    await prisma.jobSkill.upsert({
      where: {
        jobId_name: {
          jobId: frontendJob.id,
          name: skill.name,
        },
      },
      update: {
        priority: skill.priority,
        importance: skill.importance,
      },
      create: {
        jobId: frontendJob.id,
        name: skill.name,
        priority: skill.priority,
        importance: skill.importance,
      },
    });
  }

  // 3.3 Data Analyst (CLOSED)
  const analystJob = await prisma.job.upsert({
    where: { id: "job-data-analyst" },
    update: {
      recruiterId: recruiter.id,
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      employmentType: "FULL_TIME",
      salaryMin: 180000,
      salaryMax: 300000,
      salaryCurrency: "PKR",
      status: "CLOSED",
      closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      minYearsExperience: 2,
      requiredQualifications:
        "Degree in Statistics, Mathematics, Computer Science or related quantitative field.",
      description:
        "Analyze recruitment funnel data, hiring metrics, and operational performance to deliver strategic business insights.",
    },
    create: {
      id: "job-data-analyst",
      recruiterId: recruiter.id,
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      employmentType: "FULL_TIME",
      salaryMin: 180000,
      salaryMax: 300000,
      salaryCurrency: "PKR",
      status: "CLOSED",
      closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      minYearsExperience: 2,
      requiredQualifications:
        "Degree in Statistics, Mathematics, Computer Science or related quantitative field.",
      description:
        "Analyze recruitment funnel data, hiring metrics, and operational performance to deliver strategic business insights.",
    },
  });

  const analystSkills = [
    { name: "SQL", priority: "REQUIRED" as const, importance: 5 },
    { name: "Excel", priority: "REQUIRED" as const, importance: 3 },
    { name: "Data visualization", priority: "REQUIRED" as const, importance: 4 },
  ];

  for (const skill of analystSkills) {
    await prisma.jobSkill.upsert({
      where: {
        jobId_name: {
          jobId: analystJob.id,
          name: skill.name,
        },
      },
      update: {
        priority: skill.priority,
        importance: skill.importance,
      },
      create: {
        jobId: analystJob.id,
        name: skill.name,
        priority: skill.priority,
        importance: skill.importance,
      },
    });
  }

  // 3.4 DevOps Engineer (DRAFT)
  const devopsJob = await prisma.job.upsert({
    where: { id: "job-devops-engineer" },
    update: {
      recruiterId: recruiter.id,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Lahore (On-site)",
      employmentType: "FULL_TIME",
      salaryMin: 220000,
      salaryMax: 380000,
      salaryCurrency: "PKR",
      status: "DRAFT",
      minYearsExperience: 3,
      requiredQualifications:
        "Strong background in Linux system administration and cloud infrastructure.",
      description:
        "Maintain and scale our cloud deployment pipelines, container orchestration, and automated CI/CD workflows.",
    },
    create: {
      id: "job-devops-engineer",
      recruiterId: recruiter.id,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Lahore (On-site)",
      employmentType: "FULL_TIME",
      salaryMin: 220000,
      salaryMax: 380000,
      salaryCurrency: "PKR",
      status: "DRAFT",
      minYearsExperience: 3,
      requiredQualifications:
        "Strong background in Linux system administration and cloud infrastructure.",
      description:
        "Maintain and scale our cloud deployment pipelines, container orchestration, and automated CI/CD workflows.",
    },
  });

  const devopsSkills = [
    { name: "Linux", priority: "REQUIRED" as const, importance: 4 },
    { name: "CI/CD", priority: "REQUIRED" as const, importance: 4 },
    { name: "Docker", priority: "REQUIRED" as const, importance: 3 },
  ];

  for (const skill of devopsSkills) {
    await prisma.jobSkill.upsert({
      where: {
        jobId_name: {
          jobId: devopsJob.id,
          name: skill.name,
        },
      },
      update: {
        priority: skill.priority,
        importance: skill.importance,
      },
      create: {
        jobId: devopsJob.id,
        name: skill.name,
        priority: skill.priority,
        importance: skill.importance,
      },
    });
  }

  console.log("✅ 00-core.ts seed completed.");
}
