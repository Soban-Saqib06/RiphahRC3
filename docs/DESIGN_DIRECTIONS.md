# DESIGN_DIRECTIONS.md

## 1. Purpose

This document defines the approved visual and interaction direction for the Recruitment & Talent Intelligence Platform. It translates the completed design-discovery decisions into a consistent guide for the product's interface.

The product is an academic-assignment MVP. The design should make recruiter workflows, candidate evaluation, and explainable AI results easy to understand without adding unnecessary visual or interaction complexity.

## 2. Approved design identity

**Direction:** Editorial Modern × Linear

The interface should combine the clarity and disciplined layout of a modern productivity tool with a warmer, more editorial visual identity.

Design principles:
- Clear hierarchy and deliberate spacing.
- Calm, professional surfaces rather than decorative UI.
- Strong typography for important headings and metrics.
- Dense information presented in structured, scannable groups.
- Visual emphasis reserved for important candidate and job signals.
- Consistent, restrained interaction patterns.

## 3. Theme and color

**Theme:** Warm light throughout.

**Palette direction:** Warm Neutral.

Use the following palette as the starting point:

| Role | Color | Hex |
|---|---|---|
| Main page background | Warm off-white | `#F5F2EC` |
| Secondary surface | Warm light grey | `#E8E3DA` |
| Primary text | Deep charcoal | `#242522` |
| Secondary text | Muted grey | `#77776E` |
| Primary accent | Terracotta / muted orange | `#D97745` |

Usage guidance:
- Keep most surfaces light and neutral.
- Use charcoal for primary text and important labels.
- Use muted grey for supporting information.
- Use terracotta as the primary accent for selected states, key actions, and important data highlights.
- Maintain sufficient contrast for text, controls, and data visualizations.
- Do not introduce gradients as a defining visual treatment.

## 4. Typography

Use a modern sans-serif foundation with selective geometric and bold display emphasis.

Guidance:
- Use the sans-serif family consistently for interface text, labels, tables, and forms.
- Use stronger geometric weights for page titles, key metrics, and selected section headings.
- Keep body text readable and compact.
- Establish hierarchy through size, weight, and spacing rather than excessive font styles.

## 5. Navigation and layout

**Primary navigation:** Top horizontal navigation.

Keep the main navigation clear and compact. Use role-aware navigation so recruiters and candidates see the appropriate areas.

**Information density:** Balanced.

The interface should show enough useful information to support real workflows without making pages feel crowded. Use clear section headings, consistent spacing, and structured content groups.

## 6. Recruiter dashboard

**Layout direction:** Hybrid overview and work dashboard.

Recommended content order:
1. KPI summary at the top.
2. Pending candidate reviews and priority work.
3. Active jobs.
4. Recent activity.
5. Compact AI insight widget.

The dashboard should make the recruiter's current workload and hiring progress easy to scan. Keep the AI insight widget small and secondary on the initial dashboard view.

### AI insight widget interaction

The widget expands **inline** when clicked. It should reveal additional insight in place, preserving the user's dashboard context. Avoid opening a separate side panel or navigating away for this interaction.

## 7. Candidate listings

Use a **compact table/list with expandable candidate previews**.

The collapsed view should make candidates easy to scan and compare. An expanded preview should reveal useful details without requiring immediate navigation to a full profile.

Prioritize:
- Candidate identity and relevant role information.
- Match score.
- Application or pipeline status.
- A small set of useful matching signals.
- Clear recruiter actions.

Avoid turning every candidate into a large card; preserve efficient scanning.

## 8. Candidate profile

**Layout direction:** Assessment-first.

At the top of the profile, prioritize:
- Candidate summary.
- AI match score.
- Assessment recommendation or status.
- Key strengths.
- Skill gaps and areas needing verification.

Place detailed resume information, skills, experience, projects, and education below the assessment summary. The recruiter should be able to understand the initial assessment quickly and then inspect the underlying profile details.

## 9. Job details

**Layout direction:** Overview-focused.

The job details page should bring together:
- Job summary and description.
- Required and preferred qualifications.
- Applicant overview.
- Hiring pipeline and candidate progress.
- Access to candidate review and management actions.

The page should feel like a workspace for managing a vacancy, not merely a job-editing form.

## 10. Candidate assessment and matching visuals

**Presentation direction:** Visual dashboard.

Use prominent visual metrics and skill indicators to make matching results easy to understand. The visual presentation must remain tied to evidence from the candidate's resume and profile.

The assessment should communicate:
- Overall match percentage.
- Matching skills.
- Experience relevance.
- Project relevance.
- Qualification alignment.
- Missing or unverified evidence.
- Supporting resume excerpts where available.

Use the assignment's baseline weighting:
- Skills: 50%.
- Experience: 25%.
- Project relevance: 15%.
- Qualifications: 10%.

Do not present missing evidence as proof that a candidate lacks a skill or qualification. Clearly distinguish between confirmed information, missing information, and information that needs human verification. AI output is decision support; the recruiter retains hiring authority.

### Overall match-score visualization: animated liquid circle

Use a circular container with a floating liquid fill to represent the overall match percentage.

Visual and behavior requirements:
- A clearly defined circular outer container.
- Liquid inside the circle, with its fill height mapped to the match percentage.
- A gently moving wave at the liquid surface.
- The percentage displayed clearly in the center of the circle.
- Terracotta as the liquid's primary color, coordinated with the Warm Neutral palette.
- Smooth, subtle movement that feels polished rather than playful or distracting.
- The displayed percentage and liquid level must remain synchronized.
- The fill must accurately represent the score; do not use arbitrary visual levels.

Use horizontal or other compact indicators for individual scoring categories where comparison is useful. The liquid circle is the primary visualization for the overall score, not a replacement for the detailed evidence breakdown.

### Charts and analytics

**Style:** Bold.

Use prominent charts, stronger visual emphasis, and larger metric indicators for analytics. Keep chart layouts clean and labels readable. Use color purposefully so that emphasis does not become visual noise. Maintain consistency with the warm-neutral palette and terracotta accent.

## 11. Interaction and motion

Motion should communicate state and provide feedback, not decorate the interface.

- Use subtle transitions for expanding the AI widget and candidate previews.
- The liquid score should have a gently moving wave.
- Keep animations smooth and restrained.
- Respect reduced-motion preferences where supported.
- Ensure essential score information remains understandable without animation.

## 12. Responsive and accessibility guidance

- Preserve the information hierarchy on smaller screens.
- Allow horizontal navigation to adapt without obscuring core actions.
- Keep tables usable on narrow screens through responsive layouts or controlled horizontal scrolling.
- Use semantic headings, labels, and form controls.
- Ensure keyboard access and visible focus states.
- Do not rely on color alone to communicate match status, score meaning, or pipeline state.
- Maintain readable contrast and text sizes.

## 13. Consistency across roles

The recruiter experience is the primary design priority. The candidate portal should use the same design system while keeping its workflows simpler and focused on:
- Candidate profile management.
- Resume upload.
- Job browsing and applications.
- Application status tracking.

Role-specific navigation and actions should be clear, with no recruiter-only controls exposed in the candidate experience.

## 14. Scope and implementation discipline

This document defines the visual and interaction direction; it does not expand the approved MVP scope.

Prioritize:
1. Consistent layout and component patterns.
2. Recruiter dashboard and vacancy workflows.
3. Candidate review and assessment clarity.
4. Evidence-based AI visualization.
5. Candidate-facing application flows.

Avoid spending the limited implementation time on elaborate motion, decorative effects, or advanced features outside the approved MVP. The liquid score animation should remain lightweight and performant.

## 15. Design decisions at a glance

| Area | Approved direction |
|---|---|
| Overall identity | Editorial Modern × Linear |
| Theme | Warm light |
| Palette | Warm Neutral |
| Primary accent | Terracotta / muted orange |
| Typography | Modern sans-serif with geometric/bold emphasis |
| Navigation | Top horizontal |
| Information density | Balanced |
| Recruiter dashboard | Hybrid: KPIs, pending reviews, active jobs, activity, AI insight |
| Candidate listings | Compact table/list with expandable previews |
| Dashboard AI widget | Compact, expands inline |
| Candidate profile | Assessment-first |
| Job details | Overview-focused |
| Candidate assessment | Visual dashboard |
| Overall match visualization | Circular container with gently moving liquid fill |
| Analytics charts | Bold |
| Candidate decisions | Human-led, evidence-based |

---

**Status:** Approved design direction, based on the user's design-discovery decisions.

**Next phase:** Translate the approved product brief and design direction into `AI_FLOW_PROMPT.md`, defining the AI workflows, prompt behavior, structured outputs, evidence requirements, and safeguards for the MVP.
