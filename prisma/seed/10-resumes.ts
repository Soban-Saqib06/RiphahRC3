import fs from "fs/promises";
import path from "path";
import { prisma } from "../../src/lib/db";

export default async function seedResumes(): Promise<void> {
  console.log("🌱 Running 10-resumes.ts...");

  const storageDir = path.join(process.cwd(), "storage", "resumes");
  await fs.mkdir(storageDir, { recursive: true });

  const candidates = await prisma.user.findMany({
    where: { role: "CANDIDATE" },
    include: { candidateProfile: true },
  });

  const minimalPdfHeader = Buffer.from(
    "%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 55 >>\nstream\nBT /F1 12 Tf 72 712 Td (Verified Candidate Resume Document) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000015 00000 n \n0000000068 00000 n \n0000000125 00000 n \n0000000216 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n322\n%%EOF"
  );

  const resumesData = [
    // 1. Ethan Calder
    {
      email: "candidate1@demo.example",
      fileName: "ethan_calder_resume.pdf",
      storagePath: "ethan_calder.pdf",
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
        fullName: "Ethan Calder",
        email: "candidate1@demo.example",
        phone: "+92 300 1234567",
        location: "Lahore, Pakistan",
        summary: "Senior backend engineer with 5+ years of experience architecting high-throughput distributed systems in Python and Django.",
        totalYearsExperience: 5,
        skills: [
          { name: "Python", evidence: "Architected microservices processing 50k requests/min using Python 3.11" },
          { name: "Django", evidence: "Developed distributed services using Django REST Framework" },
          { name: "PostgreSQL", evidence: "Optimized PostgreSQL databases with table partitioning exceeding 20M rows" },
          { name: "Docker", evidence: "Built multi-stage Docker containers with automated CI/CD" },
          { name: "REST API design", evidence: "Designed REST APIs and OpenAPI documentation" },
          { name: "Git", evidence: "Maintained Git branching workflows and automated pull request reviews" },
        ],
        experience: [
          {
            company: "CloudScale Tech",
            title: "Lead Backend Architect",
            startDate: "2021-01",
            endDate: null,
            isCurrent: true,
            description: "Architected microservices processing 50k requests/min using Python and Django. Partitioned PostgreSQL tables exceeding 20M rows. Built multi-stage Docker builds.",
            technologies: ["Python", "Django", "PostgreSQL", "Docker", "Redis"],
          },
          {
            company: "DataStream Inc",
            title: "Software Engineer",
            startDate: "2019-06",
            endDate: "2020-12",
            isCurrent: false,
            description: "Designed REST APIs and caching layers in Redis with Git workflows.",
            technologies: ["Python", "Flask", "PostgreSQL", "Git"],
          },
        ],
        education: [
          {
            institution: "FAST-NUCES",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startYear: 2015,
            endYear: 2019,
          },
        ],
        projects: [
          {
            name: "High-scale Distributed Job Scheduler",
            description: "Asynchronous task scheduler handling 1M daily tasks with Redis queues and PostgreSQL state persistence.",
            technologies: ["Python", "Redis", "PostgreSQL", "Docker"],
          },
        ],
        certifications: ["AWS Certified Solutions Architect", "Docker Certified Associate"],
      },
    },

    // 2. Priya Nandakumar
    {
      email: "candidate2@demo.example",
      fileName: "priya_nandakumar_resume.pdf",
      storagePath: "priya_nandakumar.pdf",
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
        fullName: "Priya Nandakumar",
        email: "candidate2@demo.example",
        phone: "+92 301 7654321",
        location: "Islamabad, Pakistan",
        summary: "Full stack engineer with 3.5 years of experience developing asynchronous RESTful APIs using Python, FastAPI, and Flask.",
        totalYearsExperience: 3.5,
        skills: [
          { name: "Python", evidence: "Built asynchronous REST APIs in FastAPI using Python" },
          { name: "FastAPI", evidence: "Built asynchronous REST APIs in FastAPI with automated schemas" },
          { name: "MySQL", evidence: "Engineered scalable MySQL schema and index strategies" },
          { name: "Docker", evidence: "Deployed 12 containerized services using Docker on AWS ECS" },
          { name: "REST APIs", evidence: "Designed OpenAPI REST specifications" },
        ],
        experience: [
          {
            company: "Apex Web Services",
            title: "Backend & Cloud Engineer",
            startDate: "2022-02",
            endDate: null,
            isCurrent: true,
            description: "Built asynchronous REST APIs in FastAPI. Engineered MySQL schemas and deployed 12 containerized services on AWS ECS.",
            technologies: ["Python", "FastAPI", "MySQL", "Docker", "AWS"],
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
            name: "Cloud Fleet Orchestrator",
            description: "FastAPI microservice monitoring container health and CPU autoscaling triggers.",
            technologies: ["Python", "FastAPI", "Docker", "AWS ECS"],
          },
        ],
        certifications: ["AWS Certified Developer Associate"],
      },
    },

    // 3. Jonas Weber
    {
      email: "candidate3@demo.example",
      fileName: "jonas_weber_resume.pdf",
      storagePath: "jonas_weber.pdf",
      size: 129000,
      extractedText: `Jonas Weber - Backend Developer
Karachi, Pakistan | candidate3@demo.example | https://linkedin.com/in/jonas-weber
Summary: Backend software engineer with 2 years of experience developing enterprise services in Java and Spring Boot. Basic proficiency in Python scripting and relational database maintenance.
Work Experience:
- Enterprise Software Engineer at SecureBank FinTech (2023 - Present): Developed banking enterprise microservices in Java and Spring Boot. Maintained database schema migrations and data integrity in SQL. Created utility Python automation scripts.
Skills: Java, Spring Boot, SQL, Python (Scripting), Git, Microservices.
Education: BS in Computer Science, IBA Karachi (2023).`,
      parsedData: {
        fullName: "Jonas Weber",
        email: "candidate3@demo.example",
        phone: "+92 302 9876543",
        location: "Karachi, Pakistan",
        summary: "Backend software engineer with 2 years of experience developing enterprise services in Java and Spring Boot.",
        totalYearsExperience: 2,
        skills: [
          { name: "Java", evidence: "Developed banking enterprise microservices in Java and Spring Boot" },
          { name: "Spring Boot", evidence: "Engineered microservices with Spring Boot" },
          { name: "SQL", evidence: "Maintained database schema migrations and data integrity in SQL" },
          { name: "Python", evidence: "Created utility Python automation scripts" },
        ],
        experience: [
          {
            company: "SecureBank FinTech",
            title: "Enterprise Software Engineer",
            startDate: "2023-01",
            endDate: null,
            isCurrent: true,
            description: "Developed banking enterprise microservices in Java and Spring Boot with database schema migrations.",
            technologies: ["Java", "Spring Boot", "SQL", "Python"],
          },
        ],
        education: [
          {
            institution: "IBA Karachi",
            degree: "BS",
            field: "Computer Science",
            startYear: 2019,
            endYear: 2023,
          },
        ],
        projects: [
          {
            name: "Automated Ledger Reconciler",
            description: "Java batch processor reconciling transaction ledgers with zero discrepancy tolerance.",
            technologies: ["Java", "Spring Boot", "SQL"],
          },
        ],
        certifications: ["Oracle Certified Professional Java SE 11"],
      },
    },

    // 4. Lena Okafor
    {
      email: "candidate4@demo.example",
      fileName: "lena_okafor_resume.pdf",
      storagePath: "lena_okafor.pdf",
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
        fullName: "Lena Okafor",
        email: "candidate4@demo.example",
        phone: "+92 303 5551234",
        location: "Lahore, Pakistan",
        summary: "Frontend specialist with 4+ years creating intuitive, accessible, and high-performance design systems and web apps with React, TypeScript, and Tailwind CSS.",
        totalYearsExperience: 4.5,
        skills: [
          { name: "React", evidence: "Led design system development in React and TypeScript" },
          { name: "TypeScript", evidence: "Built strict typesafe components in TypeScript" },
          { name: "Tailwind CSS", evidence: "Engineered responsive modern layouts with Tailwind CSS" },
          { name: "Accessibility", evidence: "Enforced WCAG 2.1 AA accessibility standards across 15+ surfaces" },
          { name: "Next.js", evidence: "Built complex web dashboards in React and Next.js" },
        ],
        experience: [
          {
            company: "OmniDesign",
            title: "Senior UI Engineer",
            startDate: "2022-01",
            endDate: null,
            isCurrent: true,
            description: "Led component design system development in React and TypeScript. Enforced WCAG accessibility.",
            technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
          },
        ],
        education: [
          {
            institution: "LUMS",
            degree: "BS",
            field: "Computer Science",
            startYear: 2016,
            endYear: 2020,
          },
        ],
        projects: [
          {
            name: "Universal Component Design System",
            description: "Accessible, themeable React UI library with 40+ atomic components and automated visual regression tests.",
            technologies: ["React", "TypeScript", "Tailwind CSS"],
          },
        ],
        certifications: ["IAAP Certified Professional in Accessibility Core Competencies"],
      },
    },

    // 5. Marco Silva
    {
      email: "candidate5@demo.example",
      fileName: "marco_silva_resume.pdf",
      storagePath: "marco_silva.pdf",
      size: 112000,
      extractedText: `Marco Silva - Junior Web Developer
Rawalpindi, Pakistan | candidate5@demo.example | https://linkedin.com/in/marco-silva
Summary: Junior web developer and recent graduate eager to build modern user interfaces using HTML, CSS, JavaScript, and React.
Experience:
- Frontend Intern at TechSolutions (2024): Assisted in converting Figma designs into responsive HTML and CSS components.
Skills: HTML, CSS, JavaScript, React, Git.
Education: BS in Computer Science, COMSATS (2024).`,
      parsedData: {
        fullName: "Marco Silva",
        email: "candidate5@demo.example",
        phone: "+92 304 8887766",
        location: "Rawalpindi, Pakistan",
        summary: "Junior web developer and recent graduate eager to build modern user interfaces using HTML, CSS, JavaScript, and React.",
        totalYearsExperience: 1,
        skills: [
          { name: "HTML", evidence: "Converted Figma designs into responsive HTML" },
          { name: "CSS", evidence: "Built responsive stylesheets and layout components" },
          { name: "React", evidence: "Built interactive web UI with React hooks" },
          { name: "JavaScript", evidence: "Proficient in modern ES6+ syntax" },
        ],
        experience: [
          {
            company: "TechSolutions",
            title: "Frontend Intern",
            startDate: "2024-01",
            endDate: "2024-07",
            isCurrent: false,
            description: "Converted Figma designs into responsive HTML/CSS components.",
            technologies: ["HTML", "CSS", "React", "JavaScript"],
          },
        ],
        education: [
          {
            institution: "COMSATS",
            degree: "BS",
            field: "Computer Science",
            startYear: 2020,
            endYear: 2024,
          },
        ],
        projects: [
          {
            name: "Personal Portfolio & Blog",
            description: "Responsive personal blog built with React and Markdown parsing.",
            technologies: ["React", "JavaScript", "CSS"],
          },
        ],
        certifications: [],
      },
    },

    // 6. Ayla Vance
    {
      email: "candidate6@demo.example",
      fileName: "ayla_vance_resume.pdf",
      storagePath: "ayla_vance.pdf",
      size: 162000,
      extractedText: `Ayla Vance - Lead AI & Machine Learning Engineer
Islamabad, Pakistan | candidate6@demo.example | https://linkedin.com/in/ayla-vance
Summary: Staff AI engineer and researcher with 6 years leading NLP teams, fine-tuning transformer architectures, and building production inference pipelines in PyTorch and Python.
Experience:
- Staff ML Scientist at Cerebrum Labs (2021 - Present): Architected semantic search and candidate matching pipelines with embeddings and PyTorch. Reduced inference latency by 45% via ONNX runtime optimizations.
- Machine Learning Engineer at CogniTech (2018 - 2021): Built sentiment analysis models, classification engines, and SQL feature engineering stores.
Skills: Python, PyTorch, Transformers, MLOps, SQL, ONNX, Docker, Git.
Education: MS in Artificial Intelligence, NUST (2018).`,
      parsedData: {
        fullName: "Ayla Vance",
        email: "candidate6@demo.example",
        phone: "+92 305 1112233",
        location: "Islamabad, Pakistan",
        summary: "Staff AI engineer and researcher with 6 years leading NLP teams and deploying high-scale transformer models.",
        totalYearsExperience: 6,
        skills: [
          { name: "Python", evidence: "Python 3.11 asynchronous deep learning workflows" },
          { name: "PyTorch", evidence: "Architected semantic search pipelines with PyTorch" },
          { name: "Transformers", evidence: "Fine-tuned HuggingFace transformers for domain matching" },
          { name: "MLOps", evidence: "Production model serving via Triton and ONNX runtime" },
          { name: "SQL", evidence: "Engineered scalable feature stores in SQL databases" },
        ],
        experience: [
          {
            company: "Cerebrum Labs",
            title: "Staff ML Scientist",
            startDate: "2021-03",
            endDate: null,
            isCurrent: true,
            description: "Architected semantic search and candidate matching pipelines. Reduced model latency by 45%.",
            technologies: ["PyTorch", "Python", "Transformers", "MLOps", "Docker"],
          },
        ],
        education: [
          {
            institution: "NUST",
            degree: "MS",
            field: "Artificial Intelligence",
            startYear: 2016,
            endYear: 2018,
          },
        ],
        projects: [
          {
            name: "Neural Candidate Ranking System",
            description: "Cross-encoder scoring engine evaluating resumes against job skill rubrics with sub-50ms inference.",
            technologies: ["PyTorch", "Transformers", "Python", "Docker"],
          },
        ],
        certifications: ["TensorFlow Developer Certified", "DeepLearning.AI NLP Specialization"],
      },
    },

    // 7. Tariq Mehmood
    {
      email: "candidate7@demo.example",
      fileName: "tariq_mehmood_resume.pdf",
      storagePath: "tariq_mehmood.pdf",
      size: 154000,
      extractedText: `Tariq Mehmood - Senior Cloud & DevOps Engineer
Lahore, Pakistan | candidate7@demo.example | https://linkedin.com/in/tariq-mehmood-devops
Summary: Senior infrastructure and DevOps engineer with 5 years automating AWS and Azure clouds, deploying Kubernetes clusters, and building automated GitHub Actions CI/CD pipelines.
Experience:
- Senior DevOps Engineer at CloudNexus (2021 - Present): Built and maintained 8 production Kubernetes clusters on AWS EKS with Terraform. Automated zero-downtime deployment pipelines in GitHub Actions.
- Systems Administrator at SecureHost (2019 - 2021): Administered Linux servers, configured firewall rules, and wrote Bash/Python automation scripts.
Skills: Linux, CI/CD, Docker, Kubernetes, Terraform, AWS, Python, Bash.
Education: BS in Computer Engineering, UET Lahore (2019).`,
      parsedData: {
        fullName: "Tariq Mehmood",
        email: "candidate7@demo.example",
        phone: "+92 306 4445566",
        location: "Lahore, Pakistan",
        summary: "Senior infrastructure and DevOps engineer with 5 years automating clouds, Kubernetes, and CI/CD.",
        totalYearsExperience: 5,
        skills: [
          { name: "Linux", evidence: "Administered Linux servers and kernel tuning" },
          { name: "CI/CD", evidence: "Automated zero-downtime deployment pipelines in GitHub Actions" },
          { name: "Docker", evidence: "Built hardened multi-stage Docker container images" },
          { name: "Kubernetes", evidence: "Managed 8 production Kubernetes clusters on AWS EKS" },
          { name: "Python", evidence: "Created infrastructure automation scripts in Python" },
        ],
        experience: [
          {
            company: "CloudNexus",
            title: "Senior DevOps Engineer",
            startDate: "2021-02",
            endDate: null,
            isCurrent: true,
            description: "Built 8 Kubernetes clusters with Terraform. Implemented zero-downtime CI/CD workflows.",
            technologies: ["Kubernetes", "Docker", "Terraform", "CI/CD", "AWS", "Linux"],
          },
        ],
        education: [
          {
            institution: "UET Lahore",
            degree: "BS",
            field: "Computer Engineering",
            startYear: 2015,
            endYear: 2019,
          },
        ],
        projects: [
          {
            name: "GitOps Infrastructure Platform",
            description: "ArgoCD and Terraform automated deployment cluster maintaining 99.99% uptime across microservices.",
            technologies: ["Kubernetes", "Terraform", "Docker", "GitHub Actions"],
          },
        ],
        certifications: ["Certified Kubernetes Administrator (CKA)", "HashiCorp Certified Terraform Associate"],
      },
    },

    // 8. Sarah Jenkins
    {
      email: "candidate8@demo.example",
      fileName: "sarah_jenkins_resume.pdf",
      storagePath: "sarah_jenkins.pdf",
      size: 148000,
      extractedText: `Sarah Jenkins - Principal Product Designer
Remote | candidate8@demo.example | https://linkedin.com/in/sarah-jenkins-ux
Summary: Principal product designer with 7 years leading UX research, crafting comprehensive multi-brand design systems, and building high-fidelity interactive prototypes in Figma.
Experience:
- Lead Product Designer at Horizon SaaS (2020 - Present): Redesigned core analytics product, boosting SUS score from 68 to 86. Established Figma tokenized design system used across 5 squad teams.
- Senior UX Designer at Apex Digital (2017 - 2020): Led qualitative user interviews, journey mapping, and wireframing for B2B portal.
Skills: Figma, Design Systems, User Research, Prototyping, Wireframing, Usability Testing.
Education: BDes in Interaction Design, National College of Arts (2017).`,
      parsedData: {
        fullName: "Sarah Jenkins",
        email: "candidate8@demo.example",
        phone: "+92 307 9998877",
        location: "Remote",
        summary: "Principal product designer with 7 years leading UX research and design systems in Figma.",
        totalYearsExperience: 7,
        skills: [
          { name: "Figma", evidence: "Established Figma tokenized design system across 5 squad teams" },
          { name: "Design Systems", evidence: "Authored multi-brand tokenized design system" },
          { name: "User Research", evidence: "Led qualitative user interviews and heuristic usability testing" },
          { name: "Prototyping", evidence: "Created high-fidelity interactive prototypes in Figma" },
        ],
        experience: [
          {
            company: "Horizon SaaS",
            title: "Lead Product Designer",
            startDate: "2020-05",
            endDate: null,
            isCurrent: true,
            description: "Redesigned core analytics product, boosting SUS usability score from 68 to 86. Established design tokens.",
            technologies: ["Figma", "Design Systems", "Prototyping", "User Research"],
          },
        ],
        education: [
          {
            institution: "National College of Arts",
            degree: "Bachelor of Design",
            field: "Interaction Design",
            startYear: 2013,
            endYear: 2017,
          },
        ],
        projects: [
          {
            name: "Enterprise Data Visualization System",
            description: "Color-accessible, high-density chart design kit for financial and talent analytics suites.",
            technologies: ["Figma", "Design Tokens", "Accessibility"],
          },
        ],
        certifications: ["Nielsen Norman Group UX Master Certified"],
      },
    },

    // 9. Hamza Abbasi
    {
      email: "candidate9@demo.example",
      fileName: "hamza_abbasi_resume.pdf",
      storagePath: "hamza_abbasi.pdf",
      size: 132000,
      extractedText: `Hamza Abbasi - QA Automation Engineer
Karachi, Pakistan | candidate9@demo.example | https://linkedin.com/in/hamza-abbasi-qa
Summary: QA Automation Engineer with 3+ years writing robust automated test frameworks using Cypress, Selenium, and Python. Experienced in CI/CD test gates.
Experience:
- Automation QA Engineer at QualityFirst (2022 - Present): Built end-to-end regression suites in Cypress covering 250+ user stories. Reduced test cycle time by 60%.
- Junior QA Analyst at SoftLogix (2021 - 2022): Executed manual and automated API tests in Postman and Python.
Skills: Cypress, Selenium, Python, CI/CD, Postman, Jest, Git.
Education: BS in Computer Science, FAST Karachi (2021).`,
      parsedData: {
        fullName: "Hamza Abbasi",
        email: "candidate9@demo.example",
        phone: "+92 308 3332211",
        location: "Karachi, Pakistan",
        summary: "QA Automation Engineer with 3+ years writing automated test frameworks in Cypress and Selenium.",
        totalYearsExperience: 3,
        skills: [
          { name: "Cypress", evidence: "Built end-to-end regression suites in Cypress covering 250+ user stories" },
          { name: "Selenium", evidence: "Maintained cross-browser automated tests with Selenium WebDriver" },
          { name: "Python", evidence: "Developed automated API testing scripts in Python" },
          { name: "CI/CD", evidence: "Integrated automated test stages into GitLab CI" },
        ],
        experience: [
          {
            company: "QualityFirst",
            title: "Automation QA Engineer",
            startDate: "2022-03",
            endDate: null,
            isCurrent: true,
            description: "Built end-to-end regression suites in Cypress. Reduced test cycle time by 60%.",
            technologies: ["Cypress", "Selenium", "Python", "CI/CD"],
          },
        ],
        education: [
          {
            institution: "FAST Karachi",
            degree: "BS",
            field: "Computer Science",
            startYear: 2017,
            endYear: 2021,
          },
        ],
        projects: [
          {
            name: "Automated API Regression Framework",
            description: "Python-based synthetic monitoring framework testing HTTP response payloads with strict JSON schema validation.",
            technologies: ["Python", "Cypress", "CI/CD"],
          },
        ],
        certifications: ["ISTQB Certified Tester Foundation Level"],
      },
    },

    // 10. Zainab Rashid
    {
      email: "candidate10@demo.example",
      fileName: "zainab_rashid_resume.pdf",
      storagePath: "zainab_rashid.pdf",
      size: 139000,
      extractedText: `Zainab Rashid - Data Analyst & BI Specialist
Lahore, Pakistan | candidate10@demo.example | https://linkedin.com/in/zainab-rashid-data
Summary: Analytics professional with 4 years translating customer behavior and recruitment data into actionable SQL models and interactive PowerBI reports.
Experience:
- Senior Analytics Specialist at FinMetrics (2022 - Present): Designed dbt dimensional models in Snowflake and PostgreSQL. Built executive dashboards monitoring pipeline conversion rates.
- Business Analyst at RetailPulse (2020 - 2022): Wrote complex SQL queries, automated weekly cohort reports in Excel and Python.
Skills: SQL, Excel, Data visualization, PowerBI, PostgreSQL, Python.
Education: BS in Statistics & Computer Science, Punjab University (2020).`,
      parsedData: {
        fullName: "Zainab Rashid",
        email: "candidate10@demo.example",
        phone: "+92 309 6667788",
        location: "Lahore, Pakistan",
        summary: "Analytics professional with 4 years translating raw metrics into SQL models and data visualizations.",
        totalYearsExperience: 4,
        skills: [
          { name: "SQL", evidence: "Designed dimensional data models and optimized complex queries in SQL" },
          { name: "Excel", evidence: "Automated financial and cohort models with advanced Excel macros" },
          { name: "Data visualization", evidence: "Built interactive dashboards in PowerBI and Tableau" },
          { name: "PostgreSQL", evidence: "Tuned analytics queries and materialized views in PostgreSQL" },
        ],
        experience: [
          {
            company: "FinMetrics",
            title: "Senior Analytics Specialist",
            startDate: "2022-01",
            endDate: null,
            isCurrent: true,
            description: "Designed dimensional models in SQL. Built executive dashboards monitoring recruitment conversion.",
            technologies: ["SQL", "Excel", "Data visualization", "PostgreSQL"],
          },
        ],
        education: [
          {
            institution: "Punjab University",
            degree: "BS",
            field: "Statistics & Computer Science",
            startYear: 2016,
            endYear: 2020,
          },
        ],
        projects: [
          {
            name: "Hiring Funnel Analytics Dashboard",
            description: "SQL-driven data mart tracking candidate velocity, drop-off stages, and interviewer scorecard correlations.",
            technologies: ["SQL", "Data visualization", "PostgreSQL"],
          },
        ],
        certifications: ["Microsoft Certified Data Analyst Associate"],
      },
    },

    // 11. David Kim
    {
      email: "candidate11@demo.example",
      fileName: "david_kim_resume.pdf",
      storagePath: "david_kim.pdf",
      size: 158000,
      extractedText: `David Kim - Senior Full Stack Engineer
Remote | candidate11@demo.example | https://linkedin.com/in/david-kim-fullstack
Summary: Full stack engineer with 5 years building end-to-end web applications with Next.js, Node.js, TypeScript, PostgreSQL, and Docker.
Experience:
- Senior Full Stack Engineer at HyperScale Web (2021 - Present): Developed high-traffic web applications with Next.js App Router and Node.js microservices. Designed relational schemas and indexed PostgreSQL tables.
- Full Stack Developer at AppCraft (2019 - 2021): Built React SPAs and Express REST APIs with Dockerized deployments.
Skills: React, Node.js, TypeScript, PostgreSQL, Docker, Next.js, Git.
Education: BS in Computer Science, Waterloo (2019).`,
      parsedData: {
        fullName: "David Kim",
        email: "candidate11@demo.example",
        phone: "+92 310 1239876",
        location: "Remote",
        summary: "Full stack builder with 5 years shipping scalable B2B web applications in Next.js, Node.js, and PostgreSQL.",
        totalYearsExperience: 5,
        skills: [
          { name: "React", evidence: "Developed high-traffic interfaces with React and Next.js" },
          { name: "Node.js", evidence: "Built Node.js microservices handling enterprise workloads" },
          { name: "TypeScript", evidence: "Strict end-to-end type safety with TypeScript" },
          { name: "PostgreSQL", evidence: "Designed relational schemas and indexed PostgreSQL tables" },
          { name: "Docker", evidence: "Dockerized local development and container deployments" },
        ],
        experience: [
          {
            company: "HyperScale Web",
            title: "Senior Full Stack Engineer",
            startDate: "2021-04",
            endDate: null,
            isCurrent: true,
            description: "Developed web applications with Next.js App Router and Node.js microservices with PostgreSQL.",
            technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
          },
        ],
        education: [
          {
            institution: "University of Waterloo",
            degree: "BS",
            field: "Computer Science",
            startYear: 2015,
            endYear: 2019,
          },
        ],
        projects: [
          {
            name: "Collaborative Realtime Whiteboard",
            description: "Full-stack Next.js and WebSocket application supporting 50+ concurrent editors with low-latency syncing.",
            technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
          },
        ],
        certifications: [],
      },
    },

    // 12. Fatima Noor
    {
      email: "candidate12@demo.example",
      fileName: "fatima_noor_resume.pdf",
      storagePath: "fatima_noor.pdf",
      size: 118000,
      extractedText: `Fatima Noor - Associate Frontend Developer
Peshawar, Pakistan | candidate12@demo.example | https://linkedin.com/in/fatima-noor-dev
Summary: Associate frontend developer with 1 year experience building clean, responsive web pages and reusable React components using Tailwind CSS and Next.js.
Experience:
- Junior Frontend Developer at KhyberTech (2024 - Present): Created responsive landing pages and dashboard UI with React and Tailwind CSS.
Skills: React, TypeScript, CSS, Tailwind CSS, Next.js, Git.
Education: BS in Software Engineering, UET Peshawar (2024).`,
      parsedData: {
        fullName: "Fatima Noor",
        email: "candidate12@demo.example",
        phone: "+92 311 5556677",
        location: "Peshawar, Pakistan",
        summary: "Associate frontend developer with 1 year experience building clean, responsive web pages in React and Tailwind CSS.",
        totalYearsExperience: 1,
        skills: [
          { name: "React", evidence: "Created responsive dashboard UI with React" },
          { name: "TypeScript", evidence: "Built typed component props with TypeScript" },
          { name: "CSS", evidence: "Responsive styling using Tailwind CSS utility classes" },
          { name: "Next.js", evidence: "Built static and SSR pages in Next.js" },
        ],
        experience: [
          {
            company: "KhyberTech",
            title: "Junior Frontend Developer",
            startDate: "2024-02",
            endDate: null,
            isCurrent: true,
            description: "Created responsive landing pages and dashboard UI with React and Tailwind CSS.",
            technologies: ["React", "TypeScript", "CSS", "Next.js"],
          },
        ],
        education: [
          {
            institution: "UET Peshawar",
            degree: "BS",
            field: "Software Engineering",
            startYear: 2020,
            endYear: 2024,
          },
        ],
        projects: [
          {
            name: "Community Health Portal UI",
            description: "Accessible responsive web interface for local health center appointments.",
            technologies: ["React", "CSS", "Tailwind CSS"],
          },
        ],
        certifications: [],
      },
    },
  ];

  for (const item of resumesData) {
    const candidateUser = candidates.find((c) => c.email === item.email);
    if (!candidateUser?.candidateProfile) continue;

    // Write a physical PDF file into storage/resumes so file downloads always succeed
    const targetFilePath = path.join(storageDir, item.storagePath);
    await fs.writeFile(targetFilePath, minimalPdfHeader);

    // Upsert database Resume record
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
          parsedData: item.parsedData as any,
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
          parsedData: item.parsedData as any,
          parsedAt: new Date(),
        },
      });
    }
  }

  console.log("✅ 10-resumes.ts seed completed.");
}
