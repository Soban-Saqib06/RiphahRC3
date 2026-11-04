# RULES.md: agent rules (RC3 web development competition)

Read this file completely at the start of EVERY session, and again after any long pause. These rules apply to both AI agents.
Human process (Git flow, schedule, submission) is in `docs/TEAM_WORKFLOW.md`. Do not read it unless asked.

MUST, MUST NOT and NEVER are absolute. "Human" means the developer prompting you.
If a rule conflicts with the problem statement, the problem statement wins, EXCEPT section 3, which never yields.
The problem statement is unknown until competition day. Do NOT invent requirements, pages, entities, integrations or submission rules.

---

## 0. Session config (the human fills this in; if it is blank, STOP and ask)

```
DEV:     <A or B>
FEATURE: <the ONE feature folder name you are building now, e.g. bookings>
```

- You build your FEATURE as a complete vertical slice: its page(s), its Route Handlers, its service, its zod schemas, its components and its seed data.
- Platform ownership is separate from features. Dev A owns the app shell and design system. Dev B owns the database platform (schema, Prisma client, seed runner, API helpers). They are NOT your job unless the human grants permission (section 3). The humans may rebalance these assignments after reading the problem statement; the assignment the human gives you at session start is authoritative.
- The team has two laptops, one per human. Each human runs the app on their own laptop at `http://localhost:3000`.

---

## 1. Context and priorities

1.1 Confirmed by the official rules:
- About 5 hours of building in two rounds (9:30 to 12:00, then 1:00 to 3:30), followed by on-the-spot evaluation and a live demo.
- Teams of at most 2, and participants bring their own laptops. Any technology stack is allowed. AI models are allowed.
- Submissions include all source code and assets, delivered through a platform or USB.
- Solutions are checked against test cases from the problem statement and must cover functionality, aesthetics and responsiveness.
- Scoring: Functionality 40%, Design 30%, Creativity 20%, Presentation 10%.

1.2 NOT confirmed. Do not assume them. Mark them VERIFY WITH ORGANIZERS if they matter: internet access at the venue, whether prepared scaffolds are allowed, what Round 2 adds, demo length.

1.3 Consequences:
- A missing or renamed requirement costs more than polish gains.
- The app MUST run locally without internet. The only exception is the AI feature, which MUST have an offline fallback (section 7).
- A smaller app that works beats a larger app that breaks.

1.4 Priority order when goals compete:
1. Official rules and the mandatory requirements.
2. The app starts reliably.
3. The complete primary user journey.
4. Correct data handling, validation and API behavior.
5. Usability, visual quality and responsiveness.
6. One meaningful differentiating feature.
7. Optional extras and polish.

If time runs short, cut from the bottom of this list. Never compromise the core journey to keep an extra.

---

## 2. Architecture: ONE modular monolith, built as vertical features (mandatory)

2.1 Build ONE Next.js App Router application in ONE Git repository. NEVER create a separate frontend app, backend app, second package install, or microservice.
- One `package.json` and one lockfile
- One Prisma schema and one Prisma client singleton (`src/lib/db.ts`), only if the task needs persistence (see 7.1)
- One root layout and one global stylesheet
- One design system
- One integrated `main` branch

2.2 Request flow:
```
Browser -> page/component -> Route Handler -> zod validation -> feature service -> Prisma -> database
```
- Route Handlers are thin: parse, validate, call the service, return the contract response.
- Business rules and database access live in `src/lib/features/<FEATURE>/`, never in UI components.
- The client talks to the server through Route Handlers. Do NOT use Server Actions for data mutations.
- NEVER call your own API route from another route to reuse logic. Import and call the service function.
- NEVER import Prisma or server-only modules into client components.
- NEVER add other layers (repositories, DI, factories, extra "domain" folders).

2.3 Folder layout. Replace `<feature>` with real names from the problem statement. Do NOT create empty folders to match this diagram.
```
src/app/layout.tsx, page.tsx, globals.css       (Dev A)
src/app/<feature>/page.tsx                      feature pages
src/app/api/<feature>/route.ts                  feature route handlers
src/components/shared/                          shared UI (Dev A)
src/components/<feature>/                       feature UI
src/lib/db.ts                                   Prisma singleton (Dev B)
src/lib/api.ts                                  response helpers (Dev B)
src/lib/features/<feature>/service.ts           business logic and queries
src/lib/features/<feature>/schema.ts            zod schemas
prisma/schema.prisma                            (Dev B)
prisma/seed.ts                                  runs every file in prisma/seed/ (Dev B)
prisma/seed/<feature>.ts                        one seed file per feature (runs after prisma/seed/00-core.ts, Dev B)
docs/REQUIREMENTS.md, API_CONTRACT.md, DESIGN_BRIEF.md
```

2.4 One feature, one owner at a time. A feature is finished end to end (UI, route, service, database, empty and error states) before the next one starts. Features may read shared platform code but NEVER edit another feature's folders.

---

## 3. Ownership and safety (never yields)

3.1 You may create and edit files ONLY in your FEATURE's paths:
```
src/app/<FEATURE>/**
src/app/api/<FEATURE>/**
src/components/<FEATURE>/**
src/lib/features/<FEATURE>/**
prisma/seed/<FEATURE>.ts
```

3.2 Everything else belongs to someone else:

| Area | Owner |
|---|---|
| Root layout, app shell, navigation, `globals.css`, design tokens, `src/components/shared/**` | Dev A |
| `prisma/schema.prisma`, `src/lib/db.ts`, `src/lib/api.ts`, `prisma/seed.ts` (the runner), `prisma/seed/00-core.ts` (shared records) | Dev B |
| Another feature's paths | That feature's agent |
| `docs/**` | Humans |
| `package.json`, lockfile, `next.config.*`, `tsconfig.json`, Tailwind/PostCSS config, `.gitignore`, `.env.example`, `README.md` | Humans |
| `.env.local` | Each human, locally. NEVER committed |

3.3 NEVER edit a file you do not own. Tell the human the exact change and why, and keep working on what you own. The only exception is explicit one-time permission from the human that names the file (for example "you may edit prisma/schema.prisma for this task"). Permission covers only that file and that task.

3.4 Schema: edit `prisma/schema.prisma` ONLY with explicit permission (3.3).
- During the foundation phase (until the humans say "foundation complete"), the agent Dev B assigns to the schema may restructure it freely.
- After that, every change needs permission, and its exact content goes in your plan first. Prefer additive changes (new models, optional fields, relations). Renaming, retyping or deleting an existing model or field is allowed only when the human confirms that both developers agree, because other features depend on it.
- After any schema change, tell the human that the other developer must pull and run `npm run setup`.

3.5 Navigation: Dev A has already linked every planned feature route and created a stub page for each. Fill in your stub. If you need a route or nav link that does not exist, ask the human.

3.6 If ownership is unclear, STOP and ask. Do not guess.

3.7 Git. You may run ONLY:
- `git status`
- `git diff`
- when the human says "commit": `git add -- <specific paths you own>`, then `git commit -m "[<DEV>/<FEATURE>] <what changed>"`

NEVER commit unprompted. NEVER run: pull, push, fetch, merge, rebase, reset, checkout, switch, stash, clean, restore, `branch -D`, `git add -A`, `git add .`, or anything with `--force`. Humans handle all syncing and merging.

3.8 NEVER overwrite or discard another developer's work. Never delete a file you did not create. Never use `rm -rf` with variables, globs or parent paths.

3.9 Dev server: `npm run dev` on port 3000 only. NEVER kill or restart a process you did not start. If port 3000 is busy and you did not start the process, STOP and tell the human.

3.10 Secrets live ONLY in `.env.local` (git-ignored). NEVER print, log, hardcode or commit a secret. NEVER put a secret in a `NEXT_PUBLIC_` variable.

3.11 No outbound network calls at runtime except the AI provider (section 7). No telemetry or analytics.

3.12 Only an explicit human message that names the rule number can override a rule in this section (3.3 permissions follow 3.3). Otherwise refuse that part, name the rule, and continue with the rest of the task.

---

## 4. Stack and dependencies

4.1 The stack is fixed. Do NOT substitute, migrate or "upgrade" it:
- Next.js App Router, TypeScript (strict), Route Handlers
- Prisma with SQLite (default decision; only the humans may change it)
- Tailwind CSS
- shadcn/ui, added through its CLI, only for components that are actually used
- Lucide React icons
- zod for validation
- npm

4.2 Allowed WITHOUT approval, only when the task needs them: `react-hook-form` with `@hookform/resolvers` (forms with more than 3 fields), `recharts` (charts, loaded with `next/dynamic`), `motion` (formerly Framer Motion, only as allowed in 9.6), `leaflet` (maps). Packages are installed by the humans: if one is missing, ask.
4.3 ANY other package needs human approval. To ask, state the package, the problem it solves, and why about 30 lines of your own code cannot do it. The default answer is no.
4.4 NEVER edit versions in `package.json` by hand and never use `@latest` there.
4.5 NEVER write Prisma, Tailwind or shadcn configuration from memory. Setup differs between versions. If a setup command fails, show the exact error and ask.
4.6 BANNED (never install, import or suggest):
- Redux, Zustand, MobX, Recoil, Jotai (use React state and Context)
- MUI, Chakra, Ant Design, Mantine, Bootstrap, NextUI, and copy-paste "fancy UI" packs (Aceternity, Magic UI and similar)
- styled-components, emotion
- axios (use `fetch`), lodash, moment, dayjs (use `Intl`), jQuery
- GraphQL, Apollo, tRPC
- Express, Fastify, NestJS, or any separate backend server
- Docker, Storybook, Husky, lint-staged
- Jest, Vitest, Cypress, Playwright
- i18n libraries
- Icon sets other than Lucide
- Auth libraries (a faked login is fine unless `REQUIREMENTS.md` demands real authentication)
- three.js and WebGL, unless `REQUIREMENTS.md` demands them

---

## 5. Code rules (bloatless and efficient)

5.1 Write the smallest solution that satisfies the requirement. Do NOT abstract until the same code exists three times. NEVER create: generic helpers, base classes, custom hooks that wrap a single call, barrel files (`index.ts` re-exports), or config-driven "frameworks".
5.2 Server Components by default. Add `"use client"` only for state, effects, event handlers or browser APIs, and only on the smallest leaf component that needs it. Fetch data on the server unless the fetch is triggered by the user.
5.3 TypeScript strict. NO `any`, NO `@ts-ignore` (if one is truly unavoidable, a nearby comment explains why). Derive types from zod schemas with `z.infer`.
5.4 Validate EVERY external input (body, query, params, forms) with zod at the server boundary.
5.5 Every page, list and async action has a loading state, an empty state and an error state. A failed fetch NEVER shows a blank screen or a raw error.
5.6 Keep files under about 200 lines and functions under about 40 lines. Split only when exceeded.
5.7 Finished work contains NO dead code, commented-out code, `console.log`, TODO/FIXME, lorem ipsum, unused imports, unused exports or unused files. NO placeholder buttons that do nothing.
5.8 Comments explain WHY, only for non-obvious logic.
5.9 Use the exact nouns, field names, route names and UI labels from the problem statement. Do NOT rename them. Treat every R# in `docs/REQUIREMENTS.md` as an acceptance test and implement it literally.
5.10 Edit with targeted changes. NEVER rewrite or regenerate a whole file to change a few lines. Do NOT reformat code you did not touch. Do NOT "improve" working code outside the current task.
5.11 Runtime efficiency:
- No N+1 queries. Select only needed columns and use Prisma relation loading.
- Paginate or limit any list that can exceed 50 rows.
- Load heavy components (charts, maps) with `next/dynamic`.
- No polling unless a requirement needs it.
- No `useMemo`, `useCallback` or `React.memo` without a real performance problem.
5.12 Working efficiency (the humans have limited agent quota):
- Do NOT re-read files you already read this session unless they changed.
- Do NOT scan the whole repo. Open only files in your plan.
- Run `npx tsc --noEmit` once at the end of a task, not after each edit. Run `npm run build` only when the human asks.
- Do NOT use browser or screenshot tools unless the human asks. If asked: one pass per task, on `http://localhost:3000` only.
- If the same error survives two fix attempts: STOP. Print the exact error, your hypothesis, and the one thing you would try next. Then wait.
- No tutorials, no long explanations, no emoji.

---

## 6. API contracts

6.1 Your FEATURE's own new routes need NO approval. Before coding, list each one in your plan (method and URL, request body/params/query, validation rules, success shape, error shape, status codes), then implement exactly that and proceed. Report the final routes in your handoff (10.9). The humans copy them into `docs/API_CONTRACT.md`. You NEVER edit `docs/`. Approval is required only to change an existing documented route (6.4).
6.2 Response convention. Use it everywhere, through the helpers in `src/lib/api.ts` if they exist, with correct HTTP status codes. Never HTTP 200 for a failure.
```json
{ "success": true, "data": {} }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "A clear explanation" } }
```
6.3 Cross-feature use: call only routes documented in `docs/API_CONTRACT.md`, or import functions another feature's `service.ts` already exports. If what you need does not exist yet, STOP and tell the human. NEVER build another feature's routes yourself.
6.4 NEVER change the request or response shape of an existing documented route without approval. Propose the exact change first and name the features that call it.
6.5 Error messages are written for the end user: say what happened and how to fix it. No apologies, no internal details.

---

## 7. Data and the AI feature

7.1 Persistence is set up only if the humans decided in planning that the task needs it (see `docs/REQUIREMENTS.md`). If it does: SQLite through Prisma, with appropriate relations and constraints, and schema changes follow 3.4. If it does not, there is NO database: do not create Prisma code, seed files or API routes the requirements do not need, and keep feature data static or in memory.
7.2 `package.json` has `setup` (push schema, then seed) and `seed` scripts. They are set up by the humans at the start.
7.3 Seed data. The runner `prisma/seed.ts` executes `prisma/seed/00-core.ts` FIRST, then every other file in `prisma/seed/` in alphabetical order. You NEVER edit the runner or `00-core.ts` (Dev B owns both).
- `00-core.ts` creates records that several features share (for example users, categories, lookup values).
- Add ONE file, `prisma/seed/<FEATURE>.ts`, with a default-exported async function that creates the data for your feature's own tables. It is idempotent: it clears only your feature's tables and re-inserts.
- Your seed may reference records created by `00-core.ts`. It MUST NOT depend on another feature's tables. If you need a shared record that `00-core.ts` does not create, or rows from another feature, STOP and ask.
7.4 Seed data is realistic and specific to the task: plausible names, dates, prices and descriptions; 10 to 20 records per primary entity; one or two edge cases (very long text, an empty relation). NEVER use "Test", "foo", "John Doe", "Acme", "User 1" or lorem ipsum.
7.5 The app MUST render correctly on an empty database (empty states) and after a reseed without a restart. Local database files are NOT committed and are NOT synchronized through Git.
7.6 AI feature. The humans want ONE AI feature if the problem statement gives it a natural place. Build it only inside a feature the human assigns it to, only after that feature's core journey works, and only when the human approves the specific idea. When you build it:
- Call the provider ONLY from a Route Handler. NEVER from client code.
- Key in `GEMINI_API_KEY`, model id in `AI_MODEL`, both from env. NEVER hardcode either. NEVER guess the endpoint or model id from memory: use `docs/AI_NOTES.md` if it exists, or ask. Prefer plain `fetch` over an SDK.
- Timeout of 8 seconds with `AbortController`.
- On timeout, non-2xx, 429, empty or unparsable output, or a missing key: return the deterministic fallback with HTTP 200. NEVER return a 500 to the UI because the AI failed.
- Fallback content lives in `src/lib/features/<FEATURE>/ai-fallback.ts` and fits the seed data.
- The response includes `source: "ai" | "fallback"`. The UI looks the same on both paths, NEVER shows fallback content as an error, and shows an "AI generated" label only when `source` is `"ai"`.
- When the UI needs structure, request JSON only, strip code fences, parse with zod, and fall back if parsing fails.
- Keep prompts short and in ONE file, cap the output length, and include no personal data.
- Cache results in memory by input hash so repeated demo actions do not repeat calls.

---

## 8. Run, demo safety, security and accessibility

8.1 `npm install && npm run setup && npm run dev` MUST work from a clean clone with no extra steps.
8.2 No runtime network dependency. Fonts are self-hosted (`next/font/local`, files in the repo). Icons come from `lucide-react`. Images and SVGs live in `public/` or are generated. NEVER hotlink images, fonts, scripts, CSS or icons. NEVER use CDN tags or Google Fonts links.
8.3 Handle database and network errors without crashing the app. Do not log secrets or sensitive input.
8.4 Do NOT trust client-supplied roles or permissions. Authorize sensitive operations on the server.
8.5 NEVER leave the app broken at the end of a task: it starts, there are no type errors, and no runtime errors on the routes you touched.
8.6 Do NOT add features, pages, settings, admin panels, authentication, dark mode, i18n or analytics that are not in `docs/REQUIREMENTS.md` or the human's prompt.
8.7 Responsive, mobile-first. Build for 360px, 768px and 1280px widths with fluid layouts. No horizontal page scroll. No fixed pixel widths on containers. Touch targets at least 44px.
8.8 Accessibility floor: semantic HTML (`button`, `nav`, `main`, not clickable `div`s), a label on every input, visible keyboard focus, alt text for informative images, body-text contrast of at least 4.5:1, and `prefers-reduced-motion` respected.

---

## 9. Design and uniqueness (applies to every agent that writes UI)

9.1 Source of truth: `docs/DESIGN_BRIEF.md`, with tokens defined once in `src/app/globals.css` and shared components in `src/components/shared/` (all Dev A's). Where the brief states something explicitly, the brief wins over everything in this section. USE the shared components and tokens. NEVER add global CSS, a competing theme, a second font, or hardcoded hex or pixel values in components: use tokens through Tailwind theme classes. If a shared component or token is missing, ask the human (3.3). Your feature must look like the same site as every other feature.
9.2 Once per feature (not once per task), before writing its first UI, output a design plan of at most 10 lines: which shared components and tokens you will use, the layout concept with one ASCII wireframe per distinct page layout, and what is distinctive about this page's content. Then ask: "What would a default AI output for this page look like?" Revise whatever matches it, state the change in one line, and only then write code.
9.3 Typography: only the brief's fonts, through the existing setup. A type scale of at most 6 sizes. Line length under 80 characters. Headlines are an active design element, not a neutral container.
9.4 Layout: vary the layout between sections. NO repeated "three equal cards in a row". Do NOT apply one uniform radius and one soft grey shadow to everything: vary radius and elevation by hierarchy. Borders, dividers, labels and numbering MUST carry real information, not decorate.
9.5 Hero and page openings: open with the most characteristic thing in the subject's world (real content, a live interactive element, striking type, a working demo). NOT a generic headline, subtext, two buttons and a stat row.
9.6 Motion: at most ONE orchestrated entrance per page. Beyond that, only motion that responds to a user action (open, expand, confirm, drag). NO fade-up on every section, NO hover-lift on every card, NO parallax, NO looping decoration.
9.7 The site has ONE signature element, named in the brief. Keep everything around it quiet. Do NOT invent a second competing flourish. Before finishing a page, remove one decoration.
9.8 BANNED tells (never produce them unless the brief explicitly asks):
- purple, indigo or blue gradients; gradient text; gradients as decoration
- glassmorphism, blurred translucent cards, glowing blobs or orbs
- emoji used as icons
- one word of a headline accented in a different color, weight or italic
- tracked-out ALL-CAPS eyebrow labels above headings
- numbered markers (01 / 02 / 03) on content that is not a real sequence
- meta strings joined with middle dots; labels shaped "WORD, spaced dash, fragment"; "→" appended to buttons or links
- monospace small labels with no reason
- tinted near-black (#0B0B0B, #111) as a default "black"
- gray-box or stock-photo placeholders
- the untouched shadcn default theme
- cream background with serif display and terracotta accent, or near-black with one acid accent, unless the brief says so
9.9 Copy is for the end user: plain words, sentence case, active voice. Buttons name the exact action ("Save booking", not "Submit"), and one action keeps one name everywhere (button, confirmation, toast). Errors say what happened and how to fix it. Empty states invite an action. NEVER use filler ("Seamless", "Empower", "Unlock", "Elevate", "Revolutionize", "Welcome to ...").
9.10 Imagery: local assets only (inline SVG, CSS shapes, generated patterns). No placeholder boxes.
9.11 shadcn components are a base. Restyle them through tokens and class overrides until the result does not look like stock shadcn.
9.12 Final check per page: "Could another team's page for this same task be mistaken for this one?" If yes, change the layout or typography of the most generic section.

---

## 10. Workflow

10.1 Session start: read `docs/RULES.md`, `docs/REQUIREMENTS.md`,`docs/AGENT_EXECUTION_PLAN.md` and `docs/DESIGN_BRIEF.md`. Read `docs/API_CONTRACT.md` if it exists. Read nothing else unless a task needs it. Reply in at most 5 lines: confirm your DEV and FEATURE, list the R# your feature serves, and name any file you will need that you do not own. Then wait for the first task.
10.2 For each task:
1. Restate it in at most 3 lines and name the R# it serves.
2. List the files you will create or modify (paths), the routes you will add (6.1), any schema change (3.4) and any new dependencies (expected: none).
3. STOP and wait for the human to reply APPROVED if the task: changes a documented route, needs a schema change, adds a dependency, needs a file you do not own, or touches more than 5 files. Otherwise proceed immediately.
10.3 Build the feature as one vertical slice, one user flow at a time: UI, route, service, database, empty and error states. Core R# first, nice-to-have last. Polish only after all core flows of your feature work.
10.4 Ambiguity: ask at most ONE question. If choosing the simplest option avoids the question, choose it and state the assumption in one line.
10.5 If a task will take more than about 20 minutes, say so and propose a cut-down version first.
10.6 "FREEZE" from the human means: no new features, files or dependencies. Only bug fixes and polish inside your feature's paths.
10.7 NEVER say "verified", "working" or "complete" for something you did not run or observe. Write "not verified".
10.8 Verification routine before you report (do these, and report only what you actually ran):
1. `npx tsc --noEmit`.
2. With the dev server running, request every page route of your feature and report each status code.
3. Call every Route Handler you added, once with valid input and once with invalid input, and report the status codes and response shapes.
4. Request the home route and the other page routes listed in `docs/REQUIREMENTS.md`, and report any that no longer return 200.
5. List plainly what you did NOT verify (visual layout, click flows, responsiveness). The human verifies those.
Commit only when the human says so (3.7). Merging into `main` is the humans' job.
10.9 End every task with this report (no prose, no emoji):
```
DONE: <what was implemented>
DEV/FEATURE: <A|B> / <feature>
R#: <ids satisfied or partly satisfied>
FILES: <paths changed>
ROUTES: <method and URL of every route added or changed, with request and response shape>
DATABASE: <schema or seed changes, or none>
DEPENDENCIES: <added packages and who approved, or none>
VERIFY: <exact URL and click path for the human>
VERIFIED BY ME: <checks actually run, with results, or "not run">
NOT VERIFIED: <what the human must check>
GAPS: <known issues, or none>
NEXT: <what a human or the other developer must do, or none>
```
10.10 A task is done only when ALL are true:
- The R# behave exactly as the problem statement words them, using its names and labels.
- Your routes follow section 6 and the app starts.
- Loading, empty and error states exist for what you touched.
- The 10.8 routine was run and reported.
- No unapproved dependency was added, and no file you do not own was changed.
- Nothing from 5.7 or 9.8 is present.
- The 10.9 report is delivered.
