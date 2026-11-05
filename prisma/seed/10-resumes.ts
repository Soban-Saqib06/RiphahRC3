import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "../../src/lib/db";
import { extractPdfText } from "../../src/lib/pdf";

function createPdfBuffer(lines: string[]): Buffer {
  const contentStream = lines
    .map((l, i) => `${i === 0 ? "72 720 Td" : "0 -16 Td"}\n(${l.replace(/([()\\])/g, "\\$1")}) Tj`)
    .join("\n");

  const streamBody = `BT\n/F1 10 Tf\n${contentStream}\nET`;
  const streamLength = Buffer.byteLength(streamBody);

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamBody}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000350 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
430
%%EOF`;

  return Buffer.from(pdf);
}

export default async function seedResumes(): Promise<void> {
  console.log("🌱 Running 10-resumes.ts...");

  const storageDir = path.join(process.cwd(), "storage", "resumes");
  await fs.mkdir(storageDir, { recursive: true });

  const resumesSeedData = [
    {
      email: "candidate1@demo.example",
      originalFileName: "Ethan_Calder_Backend_CV.pdf",
      lines: [
        "Ethan Calder - Senior Backend Engineer",
        "Email: candidate1@demo.example | Phone: +92 300 1234567 | Lahore, Pakistan",
        "Summary: Results-driven backend engineer with 5+ years building scalable microservices in Python and Django.",
        "Led design and scaling of core Python distributed services processing 50k requests/min.",
        "Engineered multi-tenant Django applications with custom authentication and middleware.",
        "Optimized complex PostgreSQL queries, partitioning tables with over 20M records.",
        "Wrote multi-stage Dockerfiles and managed containerized staging and production deployments via docker-compose.",
        "Built distributed REST APIs and caching mechanisms using Redis and Postgres.",
        "Skills: Python, Django, PostgreSQL, Postgres, Docker, docker-compose, REST APIs, Git, Linux",
        "Education: BS in Computer Science, FAST National University (2015-2019)",
      ],
      parsedData: {
        fullName: "Ethan Calder",
        email: "candidate1@demo.example",
        phone: "+92 300 1234567",
        location: "Lahore, Pakistan",
        summary: "Results-driven backend engineer with 5+ years building scalable microservices in Python and Django.",
        totalYearsExperience: 5.0,
        skills: [
          { name: "Python", evidence: "Led design and scaling of core Python distributed services processing 50k requests/min." },
          { name: "Django", evidence: "Engineered multi-tenant Django applications with custom authentication and middleware." },
          { name: "PostgreSQL", evidence: "Optimized complex PostgreSQL queries, partitioning tables with over 20M records." },
          { name: "Docker", evidence: "Wrote multi-stage Dockerfiles and managed containerized staging and production deployments via docker-compose." },
          { name: "REST APIs", evidence: "Built distributed REST APIs and caching mechanisms using Redis and Postgres." },
          { name: "Git", evidence: "Skills: Python, Django, PostgreSQL, Postgres, Docker, docker-compose, REST APIs, Git, Linux" },
        ],
        experience: [
          {
            company: "FinTech Scale Systems",
            title: "Senior Backend Developer",
            startDate: "2021-01",
            endDate: null,
            isCurrent: true,
            description: "Led design and scaling of core Python distributed services processing 50k requests/min.",
            technologies: ["Python", "Django", "PostgreSQL", "Docker", "docker-compose"],
          },
        ],
        education: [
          {
            institution: "FAST National University",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startYear: 2015,
            endYear: 2019,
          },
        ],
        projects: [
          {
            name: "High-Throughput Ledger",
            description: "Distributed transaction system using Python, Django, and PostgreSQL.",
            technologies: ["Python", "Django", "PostgreSQL", "Docker"],
          },
        ],
        certifications: ["Docker Certified Associate"],
      },
    },
    {
      email: "candidate2@demo.example",
      originalFileName: "Priya_Nandakumar_API_Engineer.pdf",
      lines: [
        "Priya Nandakumar - Full Stack & API Engineer",
        "Email: candidate2@demo.example | Phone: +92 301 9876543 | Islamabad, Pakistan",
        "Summary: Software engineer focusing on Python web services with FastAPI, relational databases, and containerized deployments.",
        "Experience: 3 years building REST APIs with Python, FastAPI, and Flask frameworks.",
        "Designed schemas and optimized queries in MySQL and PostgreSQL databases.",
        "Managed containerized services with Docker and Kubernetes deployments.",
        "Skills: Python, FastAPI, Flask, MySQL, PostgreSQL, Docker, Kubernetes, REST APIs, Git",
        "Education: BS Software Engineering, NUST (2017-2021)",
      ],
      parsedData: {
        fullName: "Priya Nandakumar",
        email: "candidate2@demo.example",
        phone: "+92 301 9876543",
        location: "Islamabad, Pakistan",
        summary: "Software engineer focusing on Python web services with FastAPI, relational databases, and containerized deployments.",
        totalYearsExperience: 3.0,
        skills: [
          { name: "Python", evidence: "Experience: 3 years building REST APIs with Python, FastAPI, and Flask frameworks." },
          { name: "FastAPI", evidence: "building REST APIs with Python, FastAPI, and Flask frameworks." },
          { name: "MySQL", evidence: "Designed schemas and optimized queries in MySQL and PostgreSQL databases." },
          { name: "Docker", evidence: "Managed containerized services with Docker and Kubernetes deployments." },
        ],
        experience: [
          {
            company: "TechNova Solutions",
            title: "API Software Engineer",
            startDate: "2021-06",
            endDate: null,
            isCurrent: true,
            description: "Developed asynchronous REST APIs using FastAPI and Flask.",
            technologies: ["Python", "FastAPI", "MySQL", "Docker"],
          },
        ],
        education: [
          {
            institution: "NUST",
            degree: "BS",
            field: "Software Engineering",
            startYear: 2017,
            endYear: 2021,
          },
        ],
        projects: [
          {
            name: "Realtime Data Collector",
            description: "API microservice processing telemetry streams with FastAPI.",
            technologies: ["Python", "FastAPI", "MySQL"],
          },
        ],
        certifications: [],
      },
    },
    {
      email: "candidate3@demo.example",
      originalFileName: "Jonas_Weber_Resume.pdf",
      lines: [
        "Jonas Weber - Software Developer",
        "Email: candidate3@demo.example | Phone: +92 302 5551234 | Karachi, Pakistan",
        "Summary: Software developer with background in enterprise Java services and scripting in Python.",
        "Built enterprise backend services using Java, Spring Boot, and relational SQL databases.",
        "Authored internal automation scripts in Python for data sanitization.",
        "Skills: Java, Spring Boot, SQL, Python, Git",
        "Education: BS Computer Science, Karachi University (2018-2022)",
      ],
      parsedData: {
        fullName: "Jonas Weber",
        email: "candidate3@demo.example",
        phone: "+92 302 5551234",
        location: "Karachi, Pakistan",
        summary: "Software developer with background in enterprise Java services and scripting in Python.",
        totalYearsExperience: 2.0,
        skills: [
          { name: "Java", evidence: "Built enterprise backend services using Java, Spring Boot, and relational SQL databases." },
          { name: "Spring Boot", evidence: "Built enterprise backend services using Java, Spring Boot, and relational SQL databases." },
          { name: "Python", evidence: "Authored internal automation scripts in Python for data sanitization." },
          { name: "SQL", evidence: "relational SQL databases." },
        ],
        experience: [
          {
            company: "Enterprise Labs",
            title: "Junior Backend Developer",
            startDate: "2022-07",
            endDate: null,
            isCurrent: true,
            description: "Maintained Java Spring Boot microservices.",
            technologies: ["Java", "Spring Boot", "SQL"],
          },
        ],
        education: [
          {
            institution: "Karachi University",
            degree: "BS",
            field: "Computer Science",
            startYear: 2018,
            endYear: 2022,
          },
        ],
        projects: [
          {
            name: "Internal Inventory Manager",
            description: "Spring Boot application with SQL backend.",
            technologies: ["Java", "Spring Boot", "SQL"],
          },
        ],
        certifications: [],
      },
    },
    {
      email: "candidate4@demo.example",
      originalFileName: "Lena_Okafor_Frontend_CV.pdf",
      lines: [
        "Lena Okafor - Senior Frontend Specialist",
        "Email: candidate4@demo.example | Phone: +92 303 7778899 | Lahore, Pakistan",
        "Summary: Frontend engineer passionate about accessible interfaces, component libraries, and performant web applications.",
        "Architected reusable design system components using React, TypeScript, and Tailwind CSS.",
        "Optimized web vitals, accessibility compliance (WCAG AA), and responsive layouts across platforms.",
        "Skills: React, TypeScript, Tailwind CSS, Next.js, HTML, CSS, Accessibility, Git",
        "Education: BS Computer Science, ITU Lahore (2016-2020)",
      ],
      parsedData: {
        fullName: "Lena Okafor",
        email: "candidate4@demo.example",
        phone: "+92 303 7778899",
        location: "Lahore, Pakistan",
        summary: "Frontend engineer passionate about accessible interfaces, component libraries, and performant web applications.",
        totalYearsExperience: 4.5,
        skills: [
          { name: "React", evidence: "Architected reusable design system components using React, TypeScript, and Tailwind CSS." },
          { name: "TypeScript", evidence: "Architected reusable design system components using React, TypeScript, and Tailwind CSS." },
          { name: "CSS", evidence: "Architected reusable design system components using React, TypeScript, and Tailwind CSS." },
          { name: "Accessibility", evidence: "Optimized web vitals, accessibility compliance (WCAG AA)" },
        ],
        experience: [
          {
            company: "Digital Experience Studio",
            title: "Senior Frontend Engineer",
            startDate: "2020-03",
            endDate: null,
            isCurrent: true,
            description: "Led frontend design systems and application component development.",
            technologies: ["React", "TypeScript", "Tailwind CSS"],
          },
        ],
        education: [
          {
            institution: "ITU Lahore",
            degree: "BS",
            field: "Computer Science",
            startYear: 2016,
            endYear: 2020,
          },
        ],
        projects: [
          {
            name: "Accessible Component Library",
            description: "Headless UI component kit built with React and TypeScript.",
            technologies: ["React", "TypeScript", "Tailwind CSS"],
          },
        ],
        certifications: [],
      },
    },
    {
      email: "candidate5@demo.example",
      originalFileName: "Marco_Silva_Web_Dev.pdf",
      lines: [
        "Marco Silva - Junior Web Developer",
        "Email: candidate5@demo.example | Phone: +92 304 1122334 | Rawalpindi, Pakistan",
        "Summary: Recent computer science graduate with projects built in React and modern JavaScript.",
        "Built responsive web applications with HTML, CSS, JavaScript, and React.",
        "Collaborated on open source GitHub projects and web components.",
        "Skills: JavaScript, HTML, CSS, React, Git",
        "Education: BS Computer Science, Comsats Islamabad (2020-2024)",
      ],
      parsedData: {
        fullName: "Marco Silva",
        email: "candidate5@demo.example",
        phone: "+92 304 1122334",
        location: "Rawalpindi, Pakistan",
        summary: "Recent computer science graduate with projects built in React and modern JavaScript.",
        totalYearsExperience: 1.0,
        skills: [
          { name: "JavaScript", evidence: "Built responsive web applications with HTML, CSS, JavaScript, and React." },
          { name: "HTML", evidence: "Built responsive web applications with HTML, CSS, JavaScript, and React." },
          { name: "CSS", evidence: "Built responsive web applications with HTML, CSS, JavaScript, and React." },
          { name: "React", evidence: "Built responsive web applications with HTML, CSS, JavaScript, and React." },
        ],
        experience: [
          {
            company: "WebCraft Agency",
            title: "Junior Web Developer",
            startDate: "2024-01",
            endDate: null,
            isCurrent: true,
            description: "Developed frontend landing pages and client dashboards.",
            technologies: ["HTML", "CSS", "JavaScript", "React"],
          },
        ],
        education: [
          {
            institution: "Comsats Islamabad",
            degree: "BS",
            field: "Computer Science",
            startYear: 2020,
            endYear: 2024,
          },
        ],
        projects: [
          {
            name: "Personal Portfolio & Blog",
            description: "Interactive portfolio website built with React.",
            technologies: ["React", "JavaScript", "CSS"],
          },
        ],
        certifications: [],
      },
    },
  ];

  for (const item of resumesSeedData) {
    const user = await prisma.user.findUnique({
      where: { email: item.email },
      include: { candidateProfile: true },
    });

    if (!user || !user.candidateProfile) continue;

    const fileBuffer = createPdfBuffer(item.lines);
    const fileName = `${crypto.randomUUID()}.pdf`;
    const fullPath = path.join(storageDir, fileName);
    await fs.writeFile(fullPath, fileBuffer);

    const extractedText = await extractPdfText(fileBuffer);

    await prisma.resume.create({
      data: {
        candidateId: user.candidateProfile.id,
        originalFileName: item.originalFileName,
        storagePath: fileName,
        fileSizeBytes: fileBuffer.length,
        extractedText,
        parseStatus: "PARSED",
        parsedData: item.parsedData as any,
        parsedAt: new Date(),
        uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)),
      },
    });
  }

  console.log("✅ 10-resumes.ts seed completed.");
}
