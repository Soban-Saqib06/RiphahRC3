# REQUIREMENTS

> Humans fill this in during the 9:00 to 9:30 planning. Agents read it and NEVER edit it.
> Copy the statement's exact wording. Do not rename or reinterpret anything.

## 1. Problem statement (pasted verbatim)

<paste the full statement here>

## 2. Product in one sentence

For <who the user is>, <product name> <does what> so that <outcome>.

## 3. Decisions

- Persistence needed: YES | NO. Why: <one line>
- AI feature: YES | NO. Feature: <name>. Fallback shown offline: <what the user sees>
- Roles after rebalancing: A = <platform + which features>, B = <platform (if any) + which features>

## 4. Requirements

Status values: `todo`, `in progress`, `done (verified)`, `done (not verified)`.

| ID | Requirement (exact wording from the statement) | Core / Nice | Feature | Builder (A/B) | Status |
|----|----|----|----|----|----|
| R1 | | Core | | | todo |
| R2 | | Core | | | todo |

## 5. Features (one folder each, name = folder name)

| Feature | Pages / routes | Entities | R# served | Builder (A/B) |
|----|----|----|----|----|
| | | | | |

## 6. Page routes (A builds the nav and one stub page per row)

| Route | Feature | Nav label |
|----|----|----|
| / | home | |

## 7. Data model (only if persistence = YES)

Entity `<Name>`: `field: type (required | optional)`, ..., relations: `<Other> (1-to-many)`.

Shared records created in `prisma/seed/00-core.ts`: <users, categories, lookups, or "none">

## 8. Demo flows (3)

1. <flow, with the R# it shows>
2.
3.

## 9. Cut list (we will NOT build)

- 

## 10. Ambiguities

| Question | Asked to | Answer |
|----|----|----|
| | | |
