import { prisma } from "../../src/lib/db";
import { hashPassword } from "../../src/lib/auth";

export default async function seedCore(): Promise<void> {
  console.log("🌱 Running 00-core.ts...");

  const demoPasswordHash = await hashPassword("Demo@12345");

  // 1. Recruiter users
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

  const recruiter2 = await prisma.user.upsert({
    where: { email: "recruiter2@demo.example" },
    update: {
      name: "Bilal Tariq",
      role: "RECRUITER",
      passwordHash: demoPasswordHash,
    },
    create: {
      email: "recruiter2@demo.example",
      name: "Bilal Tariq",
      role: "RECRUITER",
      passwordHash: demoPasswordHash,
    },
  });

  // 2. Candidate users & profiles (12 diverse candidates across experience levels & domains)
  const candidatesData = [
    {
      email: "candidate1@demo.example",
      name: "Ethan Calder",
      headline: "Senior Backend Engineer | Python, PostgreSQL & Distributed Systems",
      location: "Lahore, Pakistan",
      summary: "Backend engineer with 5+ years of experience designing high-throughput microservices and scalable REST APIs using Python, Django, and PostgreSQL.",
      linkedinUrl: "https://linkedin.com/in/ethan-calder",
      githubUrl: "https://github.com/ethancalder",
    },
    {
      email: "candidate2@demo.example",
      name: "Priya Nandakumar",
      headline: "Full Stack & API Engineer | FastAPI, Flask, MySQL & Docker",
      location: "Islamabad, Pakistan",
      summary: "Software engineer focusing on modern asynchronous Python web services with FastAPI, relational databases, and containerized deployments on AWS.",
      linkedinUrl: "https://linkedin.com/in/priya-nandakumar",
      githubUrl: "https://github.com/priyananda",
    },
    {
      email: "candidate3@demo.example",
      name: "Jonas Weber",
      headline: "Backend Developer | Java, Spring Boot & Python Scripting",
      location: "Karachi, Pakistan",
      summary: "Software developer with 2+ years of background in enterprise Java services and automation scripting in Python.",
      linkedinUrl: "https://linkedin.com/in/jonas-weber",
      githubUrl: "https://github.com/jonasweber",
    },
    {
      email: "candidate4@demo.example",
      name: "Lena Okafor",
      headline: "Senior Frontend Specialist | React, TypeScript & Design Systems",
      location: "Lahore, Pakistan",
      summary: "Frontend specialist with 4+ years of experience building accessible component libraries, interactive data tables, and high-performance UI.",
      linkedinUrl: "https://linkedin.com/in/lena-okafor",
      githubUrl: "https://github.com/lenaokafor",
    },
    {
      email: "candidate5@demo.example",
      name: "Marco Silva",
      headline: "Junior Web Developer | HTML, CSS & React",
      location: "Rawalpindi, Pakistan",
      summary: "Recent computer science graduate with projects built in modern React and responsive CSS.",
      linkedinUrl: "https://linkedin.com/in/marco-silva",
      githubUrl: "https://github.com/marcosilva",
    },
    {
      email: "candidate6@demo.example",
      name: "Ayla Vance",
      headline: "Lead AI & ML Engineer | PyTorch, NLP & LLM Deployment",
      location: "Islamabad, Pakistan",
      summary: "Staff AI researcher and engineer with 6 years leading NLP teams, fine-tuning transformer architectures, and building production inference pipelines.",
      linkedinUrl: "https://linkedin.com/in/ayla-vance",
      githubUrl: "https://github.com/aylavance",
    },
    {
      email: "candidate7@demo.example",
      name: "Tariq Mehmood",
      headline: "Senior Cloud & DevOps Engineer | Kubernetes, Terraform & CI/CD",
      location: "Lahore, Pakistan",
      summary: "Infrastructure engineer with 5 years automating multi-cloud environments, building robust GitOps pipelines, and scaling Kubernetes clusters.",
      linkedinUrl: "https://linkedin.com/in/tariq-mehmood-devops",
      githubUrl: "https://github.com/tariqdevops",
    },
    {
      email: "candidate8@demo.example",
      name: "Sarah Jenkins",
      headline: "Principal Product Designer | Design Systems, UX Research & Figma",
      location: "Remote",
      summary: "User experience leader with 7 years crafting intuitive SaaS workflows, component design systems, and conducting mixed-methods user research.",
      linkedinUrl: "https://linkedin.com/in/sarah-jenkins-ux",
      githubUrl: "https://github.com/sarahdesign",
    },
    {
      email: "candidate9@demo.example",
      name: "Hamza Abbasi",
      headline: "QA Automation Engineer | Cypress, Playwright & Python",
      location: "Karachi, Pakistan",
      summary: "Quality engineer with 3+ years implementing end-to-end regression suites, API test automation, and integrating testing into CI/CD pipelines.",
      linkedinUrl: "https://linkedin.com/in/hamza-abbasi-qa",
      githubUrl: "https://github.com/hamzaqa",
    },
    {
      email: "candidate10@demo.example",
      name: "Zainab Rashid",
      headline: "Data Analyst & Analytics Engineer | SQL, PowerBI & dbt",
      location: "Lahore, Pakistan",
      summary: "Analytics specialist with 4 years translating raw operational metrics into executive dashboards, funnel optimizations, and strategic insights.",
      linkedinUrl: "https://linkedin.com/in/zainab-rashid-data",
      githubUrl: "https://github.com/zainabrashid",
    },
    {
      email: "candidate11@demo.example",
      name: "David Kim",
      headline: "Senior Full Stack Engineer | Next.js, Node.js & PostgreSQL",
      location: "Remote",
      summary: "Full stack builder with 5 years shipping scalable B2B web applications across the entire stack from database schema design to responsive UI.",
      linkedinUrl: "https://linkedin.com/in/david-kim-fullstack",
      githubUrl: "https://github.com/davidkimdev",
    },
    {
      email: "candidate12@demo.example",
      name: "Fatima Noor",
      headline: "Associate Frontend Developer | React, Tailwind & Next.js",
      location: "Peshawar, Pakistan",
      summary: "Motivated frontend developer with 1 year of experience building clean, responsive web pages and reusable React components.",
      linkedinUrl: "https://linkedin.com/in/fatima-noor-dev",
      githubUrl: "https://github.com/fatimanoor",
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

  // 3. Baseline Jobs and JobSkills (8 jobs across 5 departments)
  const jobsData = [
    // 3.1 Backend Developer (OPEN)
    {
      id: "job-backend-dev",
      title: "Backend Developer",
      department: "Engineering",
      location: "Lahore (Hybrid)",
      employmentType: "FULL_TIME" as const,
      salaryMin: 250000,
      salaryMax: 400000,
      salaryCurrency: "PKR",
      status: "OPEN" as const,
      minYearsExperience: 3,
      requiredQualifications:
        "Bachelor's degree in Computer Science, Software Engineering or equivalent practical experience",
      description:
        "Join our backend team building scalable talent intelligence APIs and microservices. You will work on robust backend systems, data pipelines, and intelligent candidate matching engines.",
      skills: [
        { name: "Python", priority: "REQUIRED" as const, importance: 5 },
        { name: "Django", priority: "REQUIRED" as const, importance: 5 },
        { name: "PostgreSQL", priority: "REQUIRED" as const, importance: 4 },
        { name: "Docker", priority: "REQUIRED" as const, importance: 3 },
        { name: "REST API design", priority: "PREFERRED" as const, importance: 3 },
        { name: "Git", priority: "PREFERRED" as const, importance: 2 },
      ],
    },
    // 3.2 Frontend Developer (OPEN)
    {
      id: "job-frontend-dev",
      title: "Frontend Developer",
      department: "Engineering",
      location: "Lahore (Hybrid)",
      employmentType: "FULL_TIME" as const,
      salaryMin: 200000,
      salaryMax: 350000,
      salaryCurrency: "PKR",
      status: "OPEN" as const,
      minYearsExperience: 2,
      requiredQualifications:
        "Bachelor's degree in Computer Science or proven frontend web development experience.",
      description:
        "Build intuitive, responsive, and accessible candidate and recruiter interfaces using Next.js and Tailwind CSS.",
      skills: [
        { name: "React", priority: "REQUIRED" as const, importance: 5 },
        { name: "TypeScript", priority: "REQUIRED" as const, importance: 4 },
        { name: "CSS", priority: "REQUIRED" as const, importance: 3 },
        { name: "Accessibility", priority: "PREFERRED" as const, importance: 2 },
      ],
    },
    // 3.3 Data Analyst (CLOSED)
    {
      id: "job-data-analyst",
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      employmentType: "FULL_TIME" as const,
      salaryMin: 180000,
      salaryMax: 300000,
      salaryCurrency: "PKR",
      status: "CLOSED" as const,
      closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      minYearsExperience: 2,
      requiredQualifications:
        "Degree in Statistics, Mathematics, Computer Science or related quantitative field.",
      description:
        "Analyze recruitment funnel data, hiring metrics, and operational performance to deliver strategic business insights.",
      skills: [
        { name: "SQL", priority: "REQUIRED" as const, importance: 5 },
        { name: "Excel", priority: "REQUIRED" as const, importance: 3 },
        { name: "Data visualization", priority: "REQUIRED" as const, importance: 4 },
      ],
    },
    // 3.4 DevOps Engineer (DRAFT)
    {
      id: "job-devops-engineer",
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Lahore (On-site)",
      employmentType: "FULL_TIME" as const,
      salaryMin: 220000,
      salaryMax: 380000,
      salaryCurrency: "PKR",
      status: "DRAFT" as const,
      minYearsExperience: 3,
      requiredQualifications:
        "Strong background in Linux system administration and cloud infrastructure.",
      description:
        "Maintain and scale our cloud deployment pipelines, container orchestration, and automated CI/CD workflows.",
      skills: [
        { name: "Linux", priority: "REQUIRED" as const, importance: 4 },
        { name: "CI/CD", priority: "REQUIRED" as const, importance: 4 },
        { name: "Docker", priority: "REQUIRED" as const, importance: 3 },
      ],
    },
    // 3.5 Full Stack Engineer (OPEN)
    {
      id: "job-fullstack-dev",
      title: "Full Stack Engineer",
      department: "Engineering",
      location: "Remote",
      employmentType: "FULL_TIME" as const,
      salaryMin: 280000,
      salaryMax: 450000,
      salaryCurrency: "PKR",
      status: "OPEN" as const,
      minYearsExperience: 3,
      requiredQualifications:
        "BS in Computer Science with proficiency across frontend React and backend Node.js / SQL.",
      description:
        "Ship complete end-to-end product features from high-performance Next.js interfaces down to PostgreSQL database queries and microservices.",
      skills: [
        { name: "React", priority: "REQUIRED" as const, importance: 5 },
        { name: "Node.js", priority: "REQUIRED" as const, importance: 4 },
        { name: "TypeScript", priority: "REQUIRED" as const, importance: 4 },
        { name: "PostgreSQL", priority: "REQUIRED" as const, importance: 4 },
        { name: "Docker", priority: "PREFERRED" as const, importance: 3 },
      ],
    },
    // 3.6 Machine Learning Engineer (OPEN)
    {
      id: "job-ml-engineer",
      title: "Machine Learning Engineer",
      department: "AI Labs",
      location: "Islamabad (Hybrid)",
      employmentType: "FULL_TIME" as const,
      salaryMin: 350000,
      salaryMax: 550000,
      salaryCurrency: "PKR",
      status: "OPEN" as const,
      minYearsExperience: 4,
      requiredQualifications:
        "Master's or Bachelor's in CS / AI with strong foundation in PyTorch, transformers, and model evaluation.",
      description:
        "Train, fine-tune, and deploy multimodal generative models, vector embeddings, and semantic matching algorithms for talent ranking.",
      skills: [
        { name: "Python", priority: "REQUIRED" as const, importance: 5 },
        { name: "PyTorch", priority: "REQUIRED" as const, importance: 4 },
        { name: "Transformers", priority: "REQUIRED" as const, importance: 4 },
        { name: "MLOps", priority: "PREFERRED" as const, importance: 3 },
        { name: "SQL", priority: "PREFERRED" as const, importance: 3 },
      ],
    },
    // 3.7 Senior Product Designer UI/UX (OPEN)
    {
      id: "job-product-designer",
      title: "Senior Product Designer",
      department: "Design",
      location: "Lahore (Hybrid)",
      employmentType: "FULL_TIME" as const,
      salaryMin: 220000,
      salaryMax: 360000,
      salaryCurrency: "PKR",
      status: "OPEN" as const,
      minYearsExperience: 4,
      requiredQualifications:
        "Portfolio demonstrating complex SaaS workflows, design systems, and Figma mastery.",
      description:
        "Lead the product design lifecycle for recruiter analytics, interview candidate scoring dashboards, and mobile candidate experiences.",
      skills: [
        { name: "Figma", priority: "REQUIRED" as const, importance: 5 },
        { name: "Design Systems", priority: "REQUIRED" as const, importance: 5 },
        { name: "User Research", priority: "REQUIRED" as const, importance: 4 },
        { name: "Prototyping", priority: "PREFERRED" as const, importance: 3 },
      ],
    },
    // 3.8 QA Automation Engineer (OPEN)
    {
      id: "job-qa-engineer",
      title: "QA Automation Engineer",
      department: "Engineering",
      location: "Karachi (Hybrid)",
      employmentType: "FULL_TIME" as const,
      salaryMin: 180000,
      salaryMax: 300000,
      salaryCurrency: "PKR",
      status: "OPEN" as const,
      minYearsExperience: 2,
      requiredQualifications:
        "Experience writing automated end-to-end test suites using Cypress, Selenium, or Playwright.",
      description:
        "Ensure enterprise reliability and regression immunity across our core web APIs, candidate submission flows, and reporting pipelines.",
      skills: [
        { name: "Cypress", priority: "REQUIRED" as const, importance: 4 },
        { name: "Selenium", priority: "REQUIRED" as const, importance: 4 },
        { name: "Python", priority: "REQUIRED" as const, importance: 3 },
        { name: "CI/CD", priority: "PREFERRED" as const, importance: 3 },
      ],
    },
  ];

  for (const jobItem of jobsData) {
    const { skills, ...jobFields } = jobItem;

    const job = await prisma.job.upsert({
      where: { id: jobFields.id },
      update: {
        recruiterId: recruiter.id,
        ...jobFields,
      },
      create: {
        recruiterId: recruiter.id,
        ...jobFields,
      },
    });

    for (const skill of skills) {
      await prisma.jobSkill.upsert({
        where: {
          jobId_name: {
            jobId: job.id,
            name: skill.name,
          },
        },
        update: {
          priority: skill.priority,
          importance: skill.importance,
        },
        create: {
          jobId: job.id,
          name: skill.name,
          priority: skill.priority,
          importance: skill.importance,
        },
      });
    }
  }

  console.log("✅ 00-core.ts seed completed.");
}
