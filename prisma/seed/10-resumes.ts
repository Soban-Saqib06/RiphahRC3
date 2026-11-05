import { prisma } from "../../src/lib/db";

export default async function seedResumes(): Promise<void> {
  console.log("🌱 Running 10-resumes.ts...");

  const candidates = await prisma.user.findMany({
    where: { role: "CANDIDATE" },
    include: { candidateProfile: true },
  });

  const resumesData = [
    {
      email: "candidate1@demo.example",
      fileName: "ethan_calder_resume.pdf",
      storagePath: "resumes/demo/ethan_calder.pdf",
      size: 145200,
      extractedText: `Ethan Calder - Senior Backend Engineer
Lahore, Pakistan | candidate1@demo.example | https://linkedin.com/in/ethan-calder
Summary: Senior backend engineer with 5+ years of experience architecting high-throughput distributed systems in Python and Django.
Work Experience:
- Lead Backend Architect at CloudScale Tech (2021 - Present): Architected microservices processing 50k requests/min using Python 3.11 and Django REST Framework. Optimized PostgreSQL databases with table partitioning exceeding 20M rows. Built multi-stage Docker containers with automated CI/CD.
- Software Engineer at DataStream Inc (2019 - 2021): Designed REST APIs, implemented Redis caching layers, and maintained Git branching workflows.
Skills: Python, Django, PostgreSQL, Docker, REST API design, Git, Redis, Linux, Microservices.
Education: BS in Computer Science, FAST-NUCES (2019).`,
      parsedData: {
        personalInfo: {
          name: "Ethan Calder",
          email: "candidate1@demo.example",
          phone: "+92 300 1234567",
          location: "Lahore, Pakistan",
          links: ["https://linkedin.com/in/ethan-calder", "https://github.com/ethancalder"],
        },
        skills: ["Python", "Django", "PostgreSQL", "Docker", "REST API design", "Git", "Redis", "Microservices"],
        experience: [
          {
            title: "Lead Backend Architect",
            company: "CloudScale Tech",
            duration: "2021 - Present (4 years)",
            highlights: [
              "Architected microservices processing 50k requests/min using Python and Django.",
              "Partitioned PostgreSQL tables exceeding 20M rows, achieving sub-10ms queries.",
              "Configured multi-stage Docker builds and automated CI/CD pipelines.",
            ],
          },
        ],
        education: [
          {
            degree: "BS in Computer Science",
            institution: "FAST-NUCES",
            year: "2019",
          },
        ],
      },
    },
    {
      email: "candidate2@demo.example",
      fileName: "priya_nandakumar_resume.pdf",
      storagePath: "resumes/demo/priya_nandakumar.pdf",
      size: 138400,
      extractedText: `Priya Nandakumar - Full Stack & API Engineer
Islamabad, Pakistan | candidate2@demo.example | https://linkedin.com/in/priya-nandakumar
Summary: Full stack engineer with 3.5 years of experience developing asynchronous RESTful APIs using Python, FastAPI, and Flask. Strong background in relational databases (MySQL) and Docker deployments on AWS.
Work Experience:
- Backend & Cloud Engineer at Apex Web Services (2022 - Present): Built asynchronous REST APIs in FastAPI with automated OpenAPI schema generation. Engineered scalable MySQL schema and index strategies. Deployed 12 containerized services using Docker on AWS ECS.
- Junior Python Developer at NextGen Labs (2021 - 2022): Developed utility scripts and microservices in Flask and Python.
Skills: Python, FastAPI, Flask, MySQL, Docker, REST APIs, AWS, Git.
Education: BS in Software Engineering, NUST (2021).`,
      parsedData: {
        personalInfo: {
          name: "Priya Nandakumar",
          email: "candidate2@demo.example",
          phone: "+92 301 7654321",
          location: "Islamabad, Pakistan",
          links: ["https://linkedin.com/in/priya-nandakumar", "https://github.com/priyananda"],
        },
        skills: ["Python", "FastAPI", "Flask", "MySQL", "Docker", "REST APIs", "AWS", "Git"],
        experience: [
          {
            title: "Backend & Cloud Engineer",
            company: "Apex Web Services",
            duration: "2022 - Present (3 years)",
            highlights: [
              "Built asynchronous REST APIs in FastAPI with automated OpenAPI schemas.",
              "Engineered scalable MySQL schema and indexing strategies.",
              "Deployed 12 containerized services using Docker on AWS ECS.",
            ],
          },
        ],
        education: [
          {
            degree: "BS in Software Engineering",
            institution: "NUST",
            year: "2021",
          },
        ],
      },
    },
    {
      email: "candidate3@demo.example",
      fileName: "jonas_weber_resume.pdf",
      storagePath: "resumes/demo/jonas_weber.pdf",
      size: 129000,
      extractedText: `Jonas Weber - Backend Developer
Karachi, Pakistan | candidate3@demo.example | https://linkedin.com/in/jonas-weber
Summary: Backend software engineer with 2 years of experience developing enterprise services in Java and Spring Boot. Basic proficiency in Python scripting and relational database maintenance.
Work Experience:
- Enterprise Software Engineer at SecureBank FinTech (2023 - Present): Developed banking enterprise microservices in Java and Spring Boot. Maintained database schema migrations and data integrity. Created automation scripts in Python.
Skills: Java, Spring Boot, SQL, Python (Scripting), Git, Microservices.
Education: BS in Computer Science, IBA Karachi (2023).`,
      parsedData: {
        personalInfo: {
          name: "Jonas Weber",
          email: "candidate3@demo.example",
          phone: "+92 302 9876543",
          location: "Karachi, Pakistan",
          links: ["https://linkedin.com/in/jonas-weber", "https://github.com/jonasweber"],
        },
        skills: ["Java", "Spring Boot", "SQL", "Python", "Git", "Microservices"],
        experience: [
          {
            title: "Enterprise Software Engineer",
            company: "SecureBank FinTech",
            duration: "2023 - Present (2 years)",
            highlights: [
              "Developed banking enterprise microservices in Java and Spring Boot.",
              "Created utility Python automation scripts.",
              "Managed database schema migrations and integrity.",
            ],
          },
        ],
        education: [
          {
            degree: "BS in Computer Science",
            institution: "IBA Karachi",
            year: "2023",
          },
        ],
      },
    },
    {
      email: "candidate4@demo.example",
      fileName: "lena_okafor_resume.pdf",
      storagePath: "resumes/demo/lena_okafor.pdf",
      size: 151200,
      extractedText: `Lena Okafor - Senior Frontend Specialist
Lahore, Pakistan | candidate4@demo.example | https://linkedin.com/in/lena-okafor
Summary: Frontend specialist with 4+ years creating intuitive, accessible, and high-performance design systems and web apps with React, TypeScript, and Tailwind CSS.
Experience:
- Senior UI Engineer at OmniDesign (2022 - Present): Led design system development in React and TypeScript. Enforced WCAG 2.1 AA accessibility standards across 15+ product surfaces.
- Frontend Engineer at PixelCraft (2020 - 2022): Built complex web dashboards in React and Next.js with data visualization tools.
Skills: React, TypeScript, Tailwind CSS, Accessibility, Next.js, Data visualization, SQL.
Education: BS in Computer Science, LUMS (2020).`,
      parsedData: {
        personalInfo: {
          name: "Lena Okafor",
          email: "candidate4@demo.example",
          phone: "+92 303 5551234",
          location: "Lahore, Pakistan",
          links: ["https://linkedin.com/in/lena-okafor"],
        },
        skills: ["React", "TypeScript", "Tailwind CSS", "Accessibility", "Next.js", "Data visualization", "SQL"],
        experience: [
          {
            title: "Senior UI Engineer",
            company: "OmniDesign",
            duration: "2022 - Present (3 years)",
            highlights: [
              "Led design system development in React and TypeScript.",
              "Enforced WCAG 2.1 AA accessibility standards across 15+ surfaces.",
            ],
          },
        ],
        education: [
          {
            degree: "BS in Computer Science",
            institution: "LUMS",
            year: "2020",
          },
        ],
      },
    },
    {
      email: "candidate5@demo.example",
      fileName: "marco_silva_resume.pdf",
      storagePath: "resumes/demo/marco_silva.pdf",
      size: 112000,
      extractedText: `Marco Silva - Junior Web Developer
Rawalpindi, Pakistan | candidate5@demo.example | https://linkedin.com/in/marco-silva
Summary: Junior web developer and recent graduate eager to build modern user interfaces using HTML, CSS, JavaScript, and React.
Experience:
- Frontend Intern at TechSolutions (2024): Assisted in converting Figma designs into responsive HTML and CSS components.
Skills: HTML, CSS, JavaScript, React, Git.
Education: BS in Computer Science, COMSATS (2024).`,
      parsedData: {
        personalInfo: {
          name: "Marco Silva",
          email: "candidate5@demo.example",
          phone: "+92 304 8887766",
          location: "Rawalpindi, Pakistan",
          links: ["https://linkedin.com/in/marco-silva"],
        },
        skills: ["HTML", "CSS", "JavaScript", "React", "Git"],
        experience: [
          {
            title: "Frontend Intern",
            company: "TechSolutions",
            duration: "2024 (6 months)",
            highlights: ["Converted Figma mockups into responsive HTML/CSS pages."],
          },
        ],
        education: [
          {
            degree: "BS in Computer Science",
            institution: "COMSATS",
            year: "2024",
          },
        ],
      },
    },
  ];

  for (const item of resumesData) {
    const candidateUser = candidates.find((c) => c.email === item.email);
    if (!candidateUser?.candidateProfile) continue;

    // Check if resume already exists for candidate
    const existing = await prisma.resume.findFirst({
      where: { candidateId: candidateUser.candidateProfile.id },
    });

    if (existing) {
      await prisma.resume.update({
        where: { id: existing.id },
        data: {
          originalFileName: item.fileName,
          storagePath: item.storagePath,
          fileSizeBytes: item.size,
          extractedText: item.extractedText,
          parseStatus: "PARSED",
          parsedData: item.parsedData,
          parsedAt: new Date(),
        },
      });
    } else {
      await prisma.resume.create({
        data: {
          candidateId: candidateUser.candidateProfile.id,
          originalFileName: item.fileName,
          storagePath: item.storagePath,
          fileSizeBytes: item.size,
          extractedText: item.extractedText,
          parseStatus: "PARSED",
          parsedData: item.parsedData,
          parsedAt: new Date(),
        },
      });
    }
  }

  console.log("✅ 10-resumes.ts seed completed.");
}
