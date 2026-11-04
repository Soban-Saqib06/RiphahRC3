# Agent Execution Plan — Riphah C3 Web Development Competition

## 1. Core operating principle

Both agents follow the same process:

**Understand → Plan → Coordinate → Build → Integrate → Verify → Report.**

A feature is not complete because its page looks finished, its API returns data, or its database model exists.

A feature is complete only when its entire user journey works, including:
- UI and interactions
- Input validation
- API routes
- Business logic
- Database operations, if persistence is required
- Loading, empty, success and error states
- Responsive behaviour
- Integration with the rest of the application

Both agents own complete vertical features. Neither agent is restricted to frontend-only or backend-only feature work.

### Permanent platform ownership

| Responsibility | Owner |
|---|---|
| Root layout, app shell, navigation | Developer A |
| Global CSS, design tokens, shared UI components | Developer A |
| Prisma schema and database configuration | Developer B |
| Prisma client (`src/lib/db.ts`) | Developer B |
| Shared API response helpers (`src/lib/api.ts`) | Developer B |
| Core seed (`prisma/seed/00-core.ts`) and seed runner | Developer B |
| Assigned feature, including its UI and backend | Assigned feature owner |
| Requirements, prioritisation and final decisions | Both developers / humans |
| Integration and end-to-end verification | Both developers |

A platform owner may help with a feature, but must coordinate before changing files owned by the other developer.

---

# 2. Competition-day execution order

## Phase 1 — Understand the problem

**Both agents wait until the humans provide the actual problem statement.**

The humans create `docs/REQUIREMENTS.md`.

Use this format:

```md
# Requirements

## Product
One-sentence description of the application.

## Core requirements
- [ ] R1: Exact requirement from the problem statement.
- [ ] R2: Exact requirement from the problem statement.
- [ ] R3: Exact requirement from the problem statement.

## Nice-to-have requirements
- [ ] R4: Optional improvement.

## Constraints
- Required technologies:
- Required pages:
- Required integrations:
- Submission requirements:
- Other restrictions:
```

Do not invent requirements or add features just because they seem useful.

Both agents must understand:
1. What the application is supposed to do.
2. Who will use it.
3. What the primary user journey is.
4. Which requirements are mandatory.
5. Which requirements can be postponed.

## Phase 2 — Establish the foundation

**Target: finish the initial foundation during the first planning/building window.**

The humans decide three things:

1. What is the one-sentence product?
2. Does the application actually need persistent data?
3. What is the first user flow each developer will implement?

### Persistence decision

Do not automatically introduce Prisma.

Use this decision:

- If the task needs persistent records, relationships, user accounts or data that must survive restarts, use the agreed database setup.
- If the task only needs temporary state or a self-contained interactive experience, use client state.
- If the task needs a small amount of local persistence, consider browser storage if appropriate.
- If the task needs persistence but Prisma setup becomes a blocker, use the agreed fallback behind the same service interface.

The goal is to satisfy the problem statement, not to demonstrate a particular technology.

### Developer A: foundation responsibilities

- Establish the root layout.
- Establish global styling and design tokens.
- Configure the shared font setup.
- Build the initial application shell.
- Build the navigation structure.
- Create only the shared components actually needed.
- Ensure the application starts and renders.

### Developer B: foundation responsibilities

If persistence is required:

- Establish Prisma and SQLite.
- Configure the database connection.
- Create the Prisma client singleton.
- Create shared API response helpers.
- Establish the initial database schema.
- Create the seed runner.
- Create `prisma/seed/00-core.ts` for shared records.
- Establish the setup and seed commands.

If persistence is not required, do not spend time building an unnecessary database layer.

### Foundation completion gate

Before feature development begins:

- [ ] The application starts locally.
- [ ] Both developers understand the folder structure.
- [ ] Shared styling and design tokens exist.
- [ ] The app shell renders.
- [ ] Database setup works, if required.
- [ ] Shared database models are agreed upon, if required.
- [ ] Shared API conventions are agreed upon.
- [ ] Each developer has an assigned first feature.
- [ ] No two agents are editing the same shared file.

Do not spend the entire first round perfecting the foundation.

---

# 3. Feature assignment and prioritisation

Break the problem statement into **user flows**, not arbitrary pages or technical components.

A user flow is a sequence of actions that accomplishes something meaningful.

For example, in a booking application:

- Browse available services.
- View a service's details.
- Create a booking.
- View existing bookings.
- Cancel a booking.

Each flow should have one owner.

### Feature assignment template

```md
# Feature Assignment

Feature:
Owner: A / B

## User goal
What is the user trying to accomplish?

## Entry point
Where does the user begin?

## Main flow
1.
2.
3.
4.

## Expected result
What should happen when the flow succeeds?

## Requirements covered
R1, R2, R3

## Dependencies
- Shared components:
- Other features:
- Database models:
- Existing API routes:

## Persistence
Required / Not required

## Priority
Core / Nice-to-have
```

### Assignment rules

1. Each feature has one primary owner.
2. The owner is responsible for the complete feature.
3. Shared files retain their designated owners.
4. Dependencies must be identified before implementation.
5. Do not assign both agents the same feature unless the humans explicitly request collaboration.
6. Assign work based on complexity and available time, not simply the number of pages.

A feature that depends on another unfinished feature should either wait or use an explicitly agreed temporary interface.

### Priority order

Build in this order:

1. Features required for the primary user journey.
2. Features required for other core requirements.
3. Supporting features.
4. Nice-to-have features.
5. AI or other differentiating functionality.

Do not build optional features while a core user journey is incomplete.

---

# 4. The universal feature implementation procedure

**Every feature must follow this sequence.**

## Step 1 — Understand the feature

Before writing code, the agent identifies:

- The user goal.
- The entry point.
- The expected interactions.
- The successful outcome.
- Possible failure cases.
- Requirements covered.
- Dependencies on other features.

The agent must not begin by immediately generating components or database models.

## Step 2 — Produce a short feature plan

Use this template:

```md
# Feature Plan: [Feature Name]

Owner: A / B

## Goal
[One sentence]

## Requirements
- R1:
- R2:

## User flow
1.
2.
3.

## Pages and components
- Page:
- Components:

## Data
- Required entities:
- Relationships:
- Existing shared models:
- Persistent data required: Yes / No

## API
- Method + route:
- Purpose:
- Input:
- Output:

## Dependencies
- Existing features:
- Shared components:
- Shared files:

## Files to create or modify
- path/to/file

## Risks or unknowns
- 
```

Keep this short. It is a coordination document, not an essay.

The agent should list its new routes and their request/response shapes in its plan. New routes inside its own feature do not need separate human approval. Changes to an existing documented contract, shared schema or another owner's files require coordination.

## Step 3 — Design the feature

Do this once per feature, not once per component.

The agent should identify:

- Page layout.
- Shared components it will reuse.
- Design tokens it will use.
- Main visual hierarchy.
- One distinctive aspect of the page.

Include a small ASCII wireframe for each distinct page layout.

Example:

```text
+--------------------------------------+
| Navigation                           |
+--------------------------------------+
|                                      |
| Page heading       Primary action    |
|                                      |
+----------------------+---------------+
| Main content         | Details       |
|                      |               |
|                      |               |
+----------------------+---------------+
```

The feature must use the existing design system.

Do not create a competing theme or independently invent global styles.

## Step 4 — Identify the data requirements

If persistence is required, identify:

- Entities.
- Fields.
- Field types.
- Required versus optional values.
- Relationships.
- Unique constraints.
- Foreign keys.
- Important validation rules.

Example:

```text
Entity: Booking

id          String
serviceId   String
customerId  String
date        DateTime
status      String
createdAt   DateTime

Relationships:
Booking -> Service
Booking -> Customer
```

Before implementing, check whether the required models already exist.

### Schema coordination

Developer B owns `prisma/schema.prisma`.

The feature owner proposes the exact schema changes.

During foundation, the data model can change as the actual requirements become clear. After foundation, changes should be coordinated and additive where practical.

Never silently rename, delete or change the meaning of fields another feature uses.

If a schema change affects another feature, both owners must agree before implementation.

## Step 5 — Define the API

For each endpoint, define:

```md
### Create booking

POST /api/bookings

Request:
{
  "serviceId": "string",
  "date": "ISO date"
}

Success:
{
  "success": true,
  "data": {}
}

Errors:
- 400: Invalid input
- 404: Service not found
- 500: Unexpected server error
```

Also identify:
- Query parameters.
- Route parameters.
- Validation rules.
- Success status codes.
- Error status codes.
- Whether authentication or authorisation is required.

Keep the API consistent with existing application conventions.

If another feature depends on this endpoint, communicate its contract to that feature's owner.

## Step 6 — Implement the backend

If the feature needs a backend, implement in this order:

1. Zod validation schemas.
2. Feature service functions.
3. Database queries and mutations.
4. Route Handler.
5. Error handling.
6. Response formatting.

The Route Handler should remain thin:

```text
Request
  ↓
Parse input
  ↓
Validate with Zod
  ↓
Call service
  ↓
Service performs business logic and database work
  ↓
Return consistent response
```

Do not put business logic inside the page or UI component.

Do not duplicate logic across Route Handlers.

If persistence is not needed, skip these steps rather than building an artificial backend.

## Step 7 — Implement the frontend

Implement in this order:

1. Page structure.
2. Main content and hierarchy.
3. Shared components.
4. Feature-specific components.
5. User interactions.
6. API or service integration.
7. Loading state.
8. Empty state.
9. Error state.
10. Success feedback.

Use mock data temporarily if the backend is not ready, but make the mock match the agreed API response shape.

**Important:** mocks must be replaced with the real integration before the feature is marked complete.

Do not leave fake buttons, dead links or interactions that only look functional.

## Step 8 — Integrate the complete user flow

Test the feature from the user's perspective.

Example:

```text
Open page
  ↓
Load available services
  ↓
Select service
  ↓
Enter required details
  ↓
Submit form
  ↓
Validate input
  ↓
Save booking
  ↓
Receive success response
  ↓
Display confirmation
  ↓
Verify booking appears in the relevant list
```

Check both the frontend and backend.

Do not mark the feature complete simply because individual files compile.

## Step 9 — Verify the feature

Use this checklist:

```md
## Feature Verification

### Functionality
- [ ] Main user flow works.
- [ ] All required interactions work.
- [ ] Data is displayed correctly.
- [ ] Data is saved correctly, if applicable.
- [ ] Related features receive the expected data.

### Validation
- [ ] Valid input succeeds.
- [ ] Invalid input is rejected.
- [ ] Missing required fields are handled.
- [ ] Invalid IDs or missing records are handled.
- [ ] Server errors do not crash the page.

### UI
- [ ] Loading state exists.
- [ ] Empty state exists.
- [ ] Error state exists.
- [ ] Success feedback exists.
- [ ] No dead buttons or links.

### Integration
- [ ] API response matches the agreed shape.
- [ ] Shared components work correctly.
- [ ] No conflicting navigation or styles.
- [ ] No broken dependencies on other features.

### Quality
- [ ] TypeScript check passes.
- [ ] Relevant routes return expected status codes.
- [ ] Responsive layout checked.
- [ ] No console errors observed.
```

The agent must clearly distinguish checks it actually performed from checks the human still needs to perform.

## Step 10 — Report and hand off

Every completed feature ends with:

```md
# Feature Handoff

Feature:
Owner:

## Implemented
- 

## Requirements covered
- R1:
- R2:

## Files changed
- 

## Routes added or changed
- METHOD /api/...

## Database changes
- Models:
- Fields:
- Seed changes:

## Dependencies
- 

## Integration notes
- Other features that use this feature:
- Contracts they need:
- Known assumptions:

## Verification
- TypeScript:
- Routes:
- Valid input:
- Invalid input:
- UI:
- Responsive behaviour:

## Remaining issues
- 

## Next recommended task
- 
```

The other developer should be able to understand how to use the feature without reading every implementation file.

---

# 5. Integration protocol between A and B

This is the most important part of the process.

Vertical ownership reduces coordination, but it does not remove the need for shared interfaces.

## Rule 1 — One owner per shared file

Never let both agents independently edit:

- `src/app/layout.tsx`
- `src/app/globals.css`
- Shared navigation components
- Shared design tokens
- `prisma/schema.prisma`
- `src/lib/db.ts`
- `src/lib/api.ts`
- `prisma/seed.ts`
- `package.json`

The designated owner makes the change.

The other agent submits a precise request.

## Rule 2 — Communicate before depending on another feature

If Feature A needs data from Feature B:

1. Feature A's owner explains what data it needs.
2. Feature B's owner confirms the existing route or service.
3. Both agree on the input and output shape.
4. Feature A integrates against that interface.
5. Feature B notifies Feature A if the interface changes.

Do not silently import another feature's internal implementation.

Use documented routes or explicitly exported service functions.

## Rule 3 — Agree on shared entities early

Examples include:

- Users
- Categories
- Products
- Services
- Organisations
- Roles

Shared entities belong in the central Prisma schema.

Do not create two separate versions of the same concept in different features.

## Rule 4 — Use one shared seed dependency order

Use:

```text
prisma/seed/
  00-core.ts
  10-feature-a.ts
  20-feature-b.ts
  30-feature-c.ts
```

`00-core.ts` is owned by Developer B and creates shared records.

Feature seed files may depend on records created by `00-core.ts`.

A feature seed must not silently delete or recreate records owned by another feature.

The seed runner executes files in the agreed order.

## Rule 5 — Integrate continuously

Do not wait until every feature is finished.

Integrate after each completed core user flow.

The humans handle Git synchronisation and merging.

After a merge or sync:

- Check the app starts.
- Check the affected routes.
- Check the affected feature's user flow.
- Resolve conflicts before starting more dependent work.

## Rule 6 — Do not change shared interfaces silently

If an API response, shared entity or component contract must change:

1. Tell the other affected owner.
2. Explain why.
3. State the old and new shape.
4. Identify affected features.
5. Coordinate the change.
6. Verify all affected features afterward.

---

# 6. Seed data and database rules

If Prisma is being used:

### Shared seed

`00-core.ts` contains shared records required by multiple features.

Examples:
- Shared categories.
- Default system roles.
- Common reference data.
- Demo records needed by multiple features.

### Feature seeds

Each feature owns its own seed file.

A feature seed must:
- Create only records it owns.
- Be safe to run more than once.
- Preserve shared records.
- Respect foreign-key dependencies.
- Use realistic data.
- Avoid arbitrary deletion of records belonging to other features.

### Database verification

After schema changes:

1. Run the agreed setup command.
2. Run the seed command.
3. Check that records exist.
4. Start the application.
5. Test the feature using seeded data.
6. Repeat seeding to confirm it does not break the database.

---
### AI Usage Efficiency

- Avoid repeatedly reconsidering decisions already established in `RULES.md`, `design_Brief.md`, and the execution plan.
- Do not perform broad repository exploration when the relevant files and dependencies are already known.
- Keep tasks bounded to the assigned feature and its documented dependencies.
- Prefer one clear implementation pass followed by targeted testing and fixes over repeated speculative rewrites.
- Do not introduce unnecessary dependencies, abstractions, or architectural complexity.
- Before requesting help with a bug, identify the failing flow and provide the relevant error, file, and expected behavior.
- Do not repeatedly regenerate working code to improve minor stylistic details.
- Prioritize completing and integrating functional user journeys over polishing isolated components.
- Preserve working implementations unless a concrete requirement or bug justifies changing them.

# 7. Checkpoints for the humans

The agents should not decide priorities independently. The humans reassess progress at fixed checkpoints.

## Checkpoint 1 — Foundation complete

Ask:
- Does the app run?
- Is the design system established?
- Is persistence actually needed?
- Are the first two features clearly assigned?

If the foundation is taking too long, simplify it.

## Checkpoint 2 — First core flows complete

Ask:
- Can each developer demonstrate their assigned flow?
- Do the features work with real data?
- Are there integration problems?
- Is the primary journey possible from start to finish?

If not, stop optional work and fix the core journey.

## Checkpoint 3 — Midpoint reassessment

Ask:
- Which mandatory requirements remain?
- Which features are partially implemented?
- Is either developer blocked?
- Can unfinished features be simplified?
- Is the database or AI feature taking unnecessary time?

Reassign remaining work if necessary.

## Checkpoint 4 — Feature freeze

At the agreed freeze time:

- No new features.
- No new dependencies.
- No architecture changes.
- No unnecessary schema changes.

Only:
- Fix broken functionality.
- Fix integration problems.
- Improve the most important UI issues.
- Verify mandatory requirements.

## Checkpoint 5 — Final verification

Both developers and humans verify:

- The app starts from the agreed setup instructions.
- The primary user journey works end to end.
- All core requirements are satisfied.
- Database setup and seeding work, if applicable.
- No broken navigation exists.
- No dead buttons exist.
- Responsive behaviour is acceptable.
- No runtime or TypeScript errors remain.
- The submission contains the required source code and assets.

Run the final build check.

Do not introduce a new feature during final verification.

---

# 8. Rules for unfinished or blocked features

Time is limited. Agents must not spend an unlimited amount of time trying to perfect one feature.

If blocked:

1. Identify the exact blocker.
2. State what has already been attempted.
3. Suggest the simplest viable alternative.
4. Tell the human what functionality would be lost.
5. Wait for the decision if the alternative changes architecture or requirements.

If a feature is too large:

- Implement its mandatory path first.
- Remove secondary interactions.
- Simplify its data model.
- Use a simpler UI layout.
- Postpone optional enhancements.

Never leave a half-integrated feature that breaks the application.

A smaller working implementation is preferable to a larger unfinished one.

---

# 9. Agent prompt template

Use this at the beginning of every feature task:

```text
You are working on the Riphah C3 competition application.

Read RULES.md and the relevant requirements and design documents.
Follow AGENT_EXECUTION_PLAN.md.

DEV: [A or B]
FEATURE: [Feature name]

Your task:
[Describe the user flow and expected outcome.]

Requirements covered:
[R# list]

Follow the complete feature implementation procedure:
1. Understand the user flow.
2. Produce a short feature plan.
3. Identify UI and design requirements.
4. Identify data requirements.
5. Define required API routes.
6. Implement backend if required.
7. Implement frontend.
8. Integrate the complete user flow.
9. Verify functionality and edge cases.
10. Provide the required handoff report.

Ownership:
- Do not edit files owned by the other developer.
- Coordinate shared schema, API and component changes.
- Do not silently change existing contracts.

Priorities:
- Mandatory requirements first.
- Working end-to-end functionality before polish.
- No unnecessary abstractions or dependencies.
- Do not build optional functionality without approval.

Do not claim something works unless you actually verified it.
```

---

# 10. Definition of a complete application

The application is ready only when all of these are true:

- [ ] Every mandatory requirement has an implementation.
- [ ] Every core user journey works end to end.
- [ ] All features are integrated.
- [ ] Shared data is consistent.
- [ ] Navigation connects the application properly.
- [ ] API contracts are consistent.
- [ ] Database and seed setup work, if applicable.
- [ ] No major loading, empty or error state is missing.
- [ ] No dead interactions remain.
- [ ] Responsive layouts have been checked.
- [ ] The app starts reliably.
- [ ] TypeScript and final build checks pass.
- [ ] The application can be demonstrated without manually repairing data or code.

**Final principle: Finish user journeys, not files.**

A finished page, a finished API and a finished database model are three separate pieces of work. A finished feature is when all three work together to deliver the intended result to the user.