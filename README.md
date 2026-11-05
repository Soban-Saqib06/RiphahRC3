# RiphahRC3 — Recruitment & Talent Intelligence Platform

RC3 2026 Web Development Competition project.

## Quick Start

1. Ensure MySQL / MariaDB is active on `localhost:3306`.
2. Configure `.env`:
   ```env
   DATABASE_URL="mysql://root:devpass@localhost:3306/recruit"
   ```
3. Initialize the database and load baseline seed data:
   ```bash
   npm run setup
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Platform Architecture & Documentation

- **Platform Guide for Agents & Developers:** See [`docs/PLATFORM_HANDOFF.md`](./docs/PLATFORM_HANDOFF.md)
- **API Contracts:** See [`docs/API_CONTRACT.md`](./docs/API_CONTRACT.md)
- **Data Model:** See [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md)
- **Rules of Engagement:** See [`docs/RULES.md`](./docs/RULES.md)

### Seed Demo Accounts
Password for all demo accounts: **`Demo@12345`**
- Recruiter: `recruiter@demo.example` (Maya Hartwell)
- Candidates: `candidate1@demo.example` through `candidate5@demo.example`
