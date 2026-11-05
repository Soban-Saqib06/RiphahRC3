# Platform Foundation Guide (Dev A & Feature Agents)

This guide documents the shared backend foundation built by **Developer B**. Any agent or developer working on features can use this as a reference.

---

## 1. Quick Setup & Local Database

Ensure MySQL or MariaDB is running on `localhost:3306`.
Environment file `.env`:
```env
DATABASE_URL="mysql://root:devpass@localhost:3306/recruit"
```

To sync the schema and seed the baseline data:
```bash
npm run setup
```
*(Runs `prisma db push` and `tsx prisma/seed.ts`)*

---

## 2. Seed Accounts & Baseline Data

All seed passwords are: **`Demo@12345`**

### Users
| Role | Email | Name | Profile / Notes |
|---|---|---|---|
| `RECRUITER` | `recruiter@demo.example` | Maya Hartwell | Primary demo recruiter |
| `CANDIDATE` | `candidate1@demo.example` | Ethan Calder | Senior Backend Engineer (Lahore) |
| `CANDIDATE` | `candidate2@demo.example` | Priya Nandakumar | Full Stack & API Engineer (Islamabad) |
| `CANDIDATE` | `candidate3@demo.example` | Jonas Weber | Backend Developer (Karachi) |
| `CANDIDATE` | `candidate4@demo.example` | Lena Okafor | Senior Frontend Specialist (Lahore) |
| `CANDIDATE` | `candidate5@demo.example` | Marco Silva | Junior Web Developer (Rawalpindi) |

### Baseline Vacancies (`Job`)
1. **Backend Developer** (`OPEN`, id: `job-backend-dev`) — 6 skills (Python, Django, PostgreSQL, Docker, REST API design, Git)
2. **Frontend Developer** (`OPEN`, id: `job-frontend-dev`) — 4 skills (React, TypeScript, CSS, Accessibility)
3. **Data Analyst** (`CLOSED`, id: `job-data-analyst`) — 3 skills (SQL, Excel, Data visualization)
4. **DevOps Engineer** (`DRAFT`, id: `job-devops-engineer`) — 3 skills (Linux, CI/CD, Docker)

---

## 3. Platform Libraries & Conventions

### A. Database Singleton (`src/lib/db.ts`)
Avoid creating multiple `PrismaClient` instances. Import the singleton:
```ts
import { prisma, db } from "@/lib/db";

// Example query
const activeJobs = await prisma.job.findMany({ where: { status: "OPEN" } });
```

### B. API Response Helpers (`src/lib/api.ts`)
Standard envelope per `docs/API_CONTRACT.md`:
- Success: `{ success: true, data: T }`
- Error: `{ success: false, error: { code: string, message: string, fields?: Record<string, string> } }`

```ts
import { ok, fail, AppError, handleError } from "@/lib/api";

export async function GET() {
  try {
    const data = await getMyData();
    return ok(data); // 200 { success: true, data }
  } catch (err) {
    return handleError(err); // Handles ZodError (400), Prisma errors, AppError, or 500
  }
}
```

### C. Shared DTOs (`src/lib/dto.ts`)
Contains TypeScript types for all entities, requests, responses, and enums:
```ts
import type {
  Role,
  JobStatus,
  JobSummaryDTO,
  JobDetailDTO,
  UserDTO,
  ApplicationSummaryDTO,
  ApplicationDetailDTO,
  CandidateApplicationDTO,
  DashboardDTO,
} from "@/lib/dto";
```

### D. Authentication & Session Helpers (`src/lib/auth.ts`)
Session cookie-based authentication with `scrypt` hashing:
```ts
import { requireUser, getSessionUser } from "@/lib/auth";

// Inside Route Handlers (Enforces role authorization):
export async function POST(req: Request) {
  const auth = await requireUser(["RECRUITER"]);
  if (!auth.ok) {
    return auth.response; // Returns 401 UNAUTHENTICATED or 403 FORBIDDEN
  }
  const user = auth.user; // UserDTO: { id, name, email, role }
  // ...
}

// Inside Server Components / Pages:
const user = await getSessionUser();
if (!user) {
  redirect("/auth/login");
}
```

---

## 4. Seed Architecture (`prisma/`)

- `prisma/schema.prisma`: Canonical schema (MySQL).
- `prisma/seed.ts`: Seed runner. Wipes tables in FK-safe reverse order, then executes `prisma/seed/*.ts` in numeric order.
- `prisma/seed/00-core.ts`: Shared baseline users, candidate profiles, and jobs.
- Feature agents add `prisma/seed/<NN>-<feature>.ts` with a `default export async function`.
