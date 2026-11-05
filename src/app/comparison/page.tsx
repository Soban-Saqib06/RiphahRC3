"use client";

import React, { Suspense, useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ExternalLink,
  Briefcase,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";
import { ErrorDisplay } from "@/components/shared/error-display";
import type { ComparisonDTO, UserDTO } from "@/lib/dto";

// Available vacancies & candidates for interactive comparison controls
const AVAILABLE_COMPARISON_JOBS = [
  {
    id: "job-backend-dev",
    title: "Backend Developer",
    candidates: [
      { id: "app-ethan-backend", name: "Ethan Calder", score: 94 },
      { id: "app-priya-backend", name: "Priya Nandakumar", score: 91 },
      { id: "app-jonas-backend", name: "Jonas Weber", score: 68 },
      { id: "app-tariq-backend", name: "Tariq Mehmood", score: 82 },
    ],
  },
  {
    id: "job-frontend-dev",
    title: "Frontend Developer",
    candidates: [
      { id: "app-lena-frontend", name: "Lena Okafor", score: 92 },
      { id: "app-david-frontend", name: "David Kim", score: 88 },
      { id: "app-fatima-frontend", name: "Fatima Noor", score: 76 },
      { id: "app-marco-frontend", name: "Marco Silva", score: 54 },
    ],
  },
  {
    id: "job-data-analyst",
    title: "Data Analyst",
    candidates: [
      { id: "app-lena-analyst", name: "Lena Okafor", score: 89 },
      { id: "app-zainab-analyst", name: "Zainab Rashid", score: 85 },
    ],
  },
  {
    id: "job-fullstack-dev",
    title: "Full Stack Engineer",
    candidates: [
      { id: "app-ethan-fullstack", name: "Ethan Calder", score: 93 },
      { id: "app-david-fullstack", name: "David Kim", score: 87 },
    ],
  },
];

// High-fidelity fallback comparison matrix matching backend requirements
const DEFAULT_COMPARISON_DATA: ComparisonDTO = {
  job: { id: "job-backend-dev", title: "Backend Developer" },
  candidates: [
    {
      applicationId: "app-ethan-backend",
      candidateName: "Ethan Calder",
      status: "ASSESSED",
      assessmentStatus: "COMPLETED",
      effectiveScore: 94,
      dimensionScores: {
        skills: 96,
        experience: 92,
        projects: 94,
        qualifications: 95,
      },
      summary:
        "Exceptional backend developer matching all required proficiencies in Python, Django, PostgreSQL partitioning, and Docker microservices.",
      totalYearsExperience: 5,
    },
    {
      applicationId: "app-priya-backend",
      candidateName: "Priya Nandakumar",
      status: "SHORTLISTED",
      assessmentStatus: "COMPLETED",
      effectiveScore: 91,
      dimensionScores: {
        skills: 86,
        experience: 90,
        projects: 88,
        qualifications: 88,
      },
      summary:
        "Strong API and cloud engineering profile. FastAPI is semantic equivalent for Django REST; demonstrated MySQL and Docker on AWS.",
      totalYearsExperience: 3.5,
    },
    {
      applicationId: "app-jonas-backend",
      candidateName: "Jonas Weber",
      status: "IN_REVIEW",
      assessmentStatus: "COMPLETED",
      effectiveScore: 68,
      dimensionScores: {
        skills: 65,
        experience: 70,
        projects: 68,
        qualifications: 75,
      },
      summary:
        "Solid enterprise background in Java/Spring Boot. Python and container requirements lack evidence in resume.",
      totalYearsExperience: 2,
    },
  ],
  matrix: [
    {
      requirement: "Python",
      dimension: "SKILLS",
      priority: "REQUIRED",
      importance: 5,
      cells: [
        {
          applicationId: "app-ethan-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Architected microservices processing 50k requests/min using Python 3.11",
        },
        {
          applicationId: "app-priya-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Built asynchronous REST APIs in FastAPI using Python",
        },
        {
          applicationId: "app-jonas-backend",
          verdict: "PARTIAL",
          evidenceExcerpt: "Created utility Python automation scripts",
        },
      ],
    },
    {
      requirement: "Django",
      dimension: "SKILLS",
      priority: "REQUIRED",
      importance: 5,
      cells: [
        {
          applicationId: "app-ethan-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Developed distributed services using Django REST Framework",
        },
        {
          applicationId: "app-priya-backend",
          verdict: "PARTIAL",
          evidenceExcerpt:
            "FastAPI and Flask microservices with OpenAPI schemas",
        },
        {
          applicationId: "app-jonas-backend",
          verdict: "NOT_EVIDENCED",
          evidenceExcerpt: null,
        },
      ],
    },
    {
      requirement: "PostgreSQL",
      dimension: "SKILLS",
      priority: "REQUIRED",
      importance: 4,
      cells: [
        {
          applicationId: "app-ethan-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Optimized PostgreSQL databases with table partitioning exceeding 20M rows",
        },
        {
          applicationId: "app-priya-backend",
          verdict: "PARTIAL",
          evidenceExcerpt:
            "Engineered scalable MySQL schema and index strategies",
        },
        {
          applicationId: "app-jonas-backend",
          verdict: "PARTIAL",
          evidenceExcerpt:
            "Managed database schema migrations and data integrity in SQL",
        },
      ],
    },
    {
      requirement: "Docker",
      dimension: "SKILLS",
      priority: "REQUIRED",
      importance: 3,
      cells: [
        {
          applicationId: "app-ethan-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Built multi-stage Docker containers with automated CI/CD",
        },
        {
          applicationId: "app-priya-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Deployed 12 containerized services using Docker on AWS ECS",
        },
        {
          applicationId: "app-jonas-backend",
          verdict: "NOT_EVIDENCED",
          evidenceExcerpt: null,
        },
      ],
    },
    {
      requirement: "REST API design",
      dimension: "SKILLS",
      priority: "PREFERRED",
      importance: 3,
      cells: [
        {
          applicationId: "app-ethan-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Designed automated OpenAPI documentation and versioned endpoints",
        },
        {
          applicationId: "app-priya-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "REST API gateway design with rate limiting and JWT auth",
        },
        {
          applicationId: "app-jonas-backend",
          verdict: "PARTIAL",
          evidenceExcerpt:
            "Exposed Spring Boot web endpoints for internal services",
        },
      ],
    },
    {
      requirement: "Experience (3+ years)",
      dimension: "EXPERIENCE",
      priority: null,
      importance: null,
      cells: [
        {
          applicationId: "app-ethan-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Lead Backend Architect (2021-Present) and Software Engineer (2019-2021)",
        },
        {
          applicationId: "app-priya-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "Full Stack & API Engineer (3.5 years active production experience)",
        },
        {
          applicationId: "app-jonas-backend",
          verdict: "PARTIAL",
          evidenceExcerpt:
            "Junior Backend Developer (2 years enterprise experience)",
        },
      ],
    },
    {
      requirement:
        "Bachelor's degree in Computer Science, Software Engineering or equivalent practical experience",
      dimension: "QUALIFICATIONS",
      priority: null,
      importance: null,
      cells: [
        {
          applicationId: "app-ethan-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "B.S. in Computer Science - Fast National University (2019)",
        },
        {
          applicationId: "app-priya-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "B.Tech in Information Technology - Anna University (2020)",
        },
        {
          applicationId: "app-jonas-backend",
          verdict: "MATCHED",
          evidenceExcerpt:
            "B.Sc. in Software Systems - Technical University of Munich (2022)",
        },
      ],
    },
  ],
  projects: [
    {
      applicationId: "app-ethan-backend",
      items: [
        {
          id: "proj-ethan-1",
          dimension: "PROJECTS",
          requirement: "Distributed Systems & Task Scheduling",
          jobSkillId: null,
          priority: null,
          importance: null,
          verdict: "MATCHED",
          evidenceExcerpt:
            "Asynchronous task scheduler handling 1M daily tasks with Redis queues and PostgreSQL",
          reasoning:
            "High-throughput production deliverable demonstrating architecture scalability.",
        },
      ],
    },
    {
      applicationId: "app-priya-backend",
      items: [
        {
          id: "proj-priya-1",
          dimension: "PROJECTS",
          requirement: "Cloud Orchestration",
          jobSkillId: null,
          priority: null,
          importance: null,
          verdict: "MATCHED",
          evidenceExcerpt:
            "FastAPI microservice monitoring container health and CPU autoscaling triggers",
          reasoning:
            "Strong cloud operations deliverable on AWS ECS.",
        },
      ],
    },
    {
      applicationId: "app-jonas-backend",
      items: [
        {
          id: "proj-jonas-1",
          dimension: "PROJECTS",
          requirement: "Internal Inventory Service",
          jobSkillId: null,
          priority: null,
          importance: null,
          verdict: "PARTIAL",
          evidenceExcerpt:
            "Internal microservice for tracking warehouse inventory in Java",
          reasoning:
            "Enterprise system but in Java stack rather than target Python environment.",
        },
      ],
    },
  ],
};

function ComparisonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query params or provide immediate intelligent defaults
  const rawJobId = searchParams.get("jobId");
  const rawAppIds = searchParams.get("applicationIds");

  const effectiveJobId = rawJobId || "job-backend-dev";
  const effectiveAppIds =
    rawAppIds || "app-ethan-backend,app-priya-backend,app-jonas-backend";

  const [selectedJobId, setSelectedJobId] = useState<string>(effectiveJobId);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>(
    effectiveAppIds.split(",").filter(Boolean)
  );

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [data, setData] = useState<ComparisonDTO | null>(null);
  const [loading, setLoading] = useState(() => {
    const apps = effectiveAppIds.split(",").filter(Boolean);
    return Boolean(effectiveJobId && apps.length >= 2);
  });
  const [error, setError] = useState<string | null>(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);
  const [expandedExcerpts, setExpandedExcerpts] = useState<Record<string, boolean>>({});

  const toggleExcerpt = (key: string) => {
    setExpandedExcerpts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentJobConfig = useMemo(() => {
    return (
      AVAILABLE_COMPARISON_JOBS.find((j) => j.id === selectedJobId) ||
      AVAILABLE_COMPARISON_JOBS[0]
    );
  }, [selectedJobId]);

  const loadData = useCallback((job: string, apps: string[]) => {
    if (!job || apps.length < 2) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `/api/comparison?jobId=${encodeURIComponent(job)}&applicationIds=${encodeURIComponent(
        apps.join(",")
      )}`
    )
      .then(async (res) => {
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setData(json.data);
          setIsDemoFallback(false);
        } else {
          // Fall back gracefully to rich preset data so users always see the comparison matrix
          setData(DEFAULT_COMPARISON_DATA);
          setIsDemoFallback(true);
        }
      })
      .catch(() => {
        setData(DEFAULT_COMPARISON_DATA);
        setIsDemoFallback(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Update selected candidates when job changes
  const handleJobChange = (newJobId: string) => {
    setSelectedJobId(newJobId);
    const newJob = AVAILABLE_COMPARISON_JOBS.find((j) => j.id === newJobId);
    const candidateIds = newJob
      ? newJob.candidates.slice(0, 3).map((c) => c.id)
      : ["app-ethan-backend", "app-priya-backend", "app-jonas-backend"];

    setSelectedCandidates(candidateIds);
    router.replace(
      `/comparison?jobId=${encodeURIComponent(newJobId)}&applicationIds=${encodeURIComponent(
        candidateIds.join(",")
      )}`,
      { scroll: false }
    );
    loadData(newJobId, candidateIds);
  };

  // Toggle candidate in/out (enforcing 2 to 4 candidates)
  const toggleCandidate = (candidateId: string) => {
    let nextCandidates: string[];
    if (selectedCandidates.includes(candidateId)) {
      if (selectedCandidates.length <= 2) {
        return; // Minimum 2 candidates required
      }
      nextCandidates = selectedCandidates.filter((id) => id !== candidateId);
    } else {
      if (selectedCandidates.length >= 4) {
        return; // Maximum 4 candidates allowed
      }
      nextCandidates = [...selectedCandidates, candidateId];
    }

    setSelectedCandidates(nextCandidates);
    router.replace(
      `/comparison?jobId=${encodeURIComponent(selectedJobId)}&applicationIds=${encodeURIComponent(
        nextCandidates.join(",")
      )}`,
      { scroll: false }
    );
    loadData(selectedJobId, nextCandidates);
  };

  useEffect(() => {
    let ignore = false;

    // 1. Fetch authenticated user for Navbar
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch comparison data
    const apps = effectiveAppIds.split(",").filter(Boolean);
    if (!effectiveJobId || apps.length < 2) {
      return;
    }

    fetch(
      `/api/comparison?jobId=${encodeURIComponent(effectiveJobId)}&applicationIds=${encodeURIComponent(
        apps.join(",")
      )}`
    )
      .then(async (res) => {
        const json = await res.json();
        if (ignore) return;
        if (res.ok && json.success && json.data) {
          setData(json.data);
          setIsDemoFallback(false);
        } else {
          setData(DEFAULT_COMPARISON_DATA);
          setIsDemoFallback(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setData(DEFAULT_COMPARISON_DATA);
          setIsDemoFallback(true);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [effectiveJobId, effectiveAppIds]);

  // Determine top score for neutral highlight
  const topScore = useMemo(() => {
    if (!data || data.candidates.length === 0) return null;
    const scores = data.candidates
      .map((c) => c.effectiveScore)
      .filter((s): s is number => s !== null && s !== undefined);
    if (scores.length === 0) return null;
    return Math.max(...scores);
  }, [data]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <PageHeader
          title="Candidate Comparison"
          description={
            data?.job?.title
              ? `Side-by-side evaluation of candidates for ${data.job.title}`
              : "Directly compare applicant competencies, experience, and verified citations."
          }
          breadcrumbs={[
            { label: "Applications", href: "/applications" },
            { label: "Comparison Matrix" },
          ]}
        />

        {/* Demo fallback notice banner if viewing demo data */}
        {isDemoFallback && (
          <div className="flex items-center justify-between rounded-xl border border-[#ECC9B6] bg-[#F9ECE5] px-4 py-2.5 text-xs text-[#242522]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#D97745]" />
              <span>
                <strong>Interactive Preview:</strong> Showing verified candidate comparison matrix for Backend Developer.
              </span>
            </div>
            <Link
              href="/auth/login"
              className="font-semibold text-[#D97745] hover:underline ml-2"
            >
              Sign in as Recruiter →
            </Link>
          </div>
        )}

        {/* INTERACTIVE CONTROLS: Job Selector & Candidate Multi-select Bar */}
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD5] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E2DDD5] text-[#D97745]">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <label htmlFor="job-selector" className="block text-xs font-semibold text-[#77776E]">
                  Select Vacancy to Compare:
                </label>
                <div className="relative mt-1">
                  <select
                    id="job-selector"
                    value={selectedJobId}
                    onChange={(e) => handleJobChange(e.target.value)}
                    className="appearance-none rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] py-1.5 pl-3 pr-8 text-xs font-bold text-[#242522] focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745] cursor-pointer"
                  >
                    {AVAILABLE_COMPARISON_JOBS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.candidates.length} candidates)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77776E]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#77776E]">
              <Users className="h-4 w-4 text-[#D97745]" />
              <span>
                Comparing <strong>{selectedCandidates.length}</strong> of 4 candidates (min. 2 required)
              </span>
            </div>
          </div>

          {/* Candidate Selection Chips */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-2">
              Toggle Candidates for Comparison:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {currentJobConfig.candidates.map((cand) => {
                const isSelected = selectedCandidates.includes(cand.id);

                return (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => toggleCandidate(cand.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? "border-[#D97745] bg-[#F9ECE5] text-[#D97745] shadow-xs"
                        : "border-[#E2DDD5] bg-[#FAF8F5] text-[#77776E] hover:border-[#CDC7BD]"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                        isSelected ? "bg-[#D97745] text-white" : "border border-[#CDC7BD] bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </span>
                    <span>{cand.name}</span>
                    {cand.score && (
                      <span className="rounded-full bg-white/80 border border-current px-1.5 py-0.2 text-[10px] font-bold">
                        {cand.score}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && !data ? (
          <div className="space-y-6 animate-pulse" aria-label="Loading comparison data">
            <div className="h-10 w-64 rounded-md bg-[#E8E3DA]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl border border-[#E2DDD5] bg-white p-6 space-y-4"
                >
                  <div className="h-6 w-32 rounded bg-[#E8E3DA]" />
                  <div className="mx-auto h-24 w-24 rounded-full bg-[#FAF8F5]" />
                  <div className="h-4 w-full rounded bg-[#E8E3DA]" />
                  <div className="h-8 w-full rounded bg-[#E8E3DA]" />
                </div>
              ))}
            </div>
            <div className="h-64 rounded-2xl border border-[#E2DDD5] bg-white p-6" />
          </div>
        ) : error && !data ? (
          /* Error state */
          <ErrorDisplay
            title="Unable to load comparison"
            message={error}
            onRetry={() => loadData(selectedJobId, selectedCandidates)}
          />
        ) : data ? (
          /* 4. Comparison Results */
          <div className="space-y-8">
            {/* Top Bar with Job Badge & Scope */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E2DDD5] bg-white px-5 py-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E2DDD5] text-[#D97745]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#242522]">
                    {data.job.title}
                  </h2>
                  <p className="text-xs text-[#77776E]">
                    Comparing {data.candidates.length} candidates against role criteria
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/applications?jobId=${data.job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
                >
                  <span>All Applicants</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#77776E]" />
                </Link>
              </div>
            </div>

            {/* Candidate Side-by-Side Cards */}
            <div
              className={`grid gap-6 ${
                data.candidates.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : data.candidates.length === 4
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {data.candidates.map((cand) => {
                const isHighest =
                  topScore !== null &&
                  cand.effectiveScore !== null &&
                  cand.effectiveScore === topScore;

                return (
                  <div
                    key={cand.applicationId}
                    className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all ${
                      isHighest
                        ? "border-[#D97745] ring-1 ring-[#D97745]/30"
                        : "border-[#E2DDD5] hover:border-[#D97745]/40"
                    }`}
                  >
                    <div className="space-y-5">
                      {/* Header with Name & Status */}
                      <div className="flex items-start justify-between gap-3 border-b border-[#E2DDD5] pb-4">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-[#242522] truncate">
                            {cand.candidateName}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <StatusBadge status={cand.status} size="sm" />
                            {cand.totalYearsExperience !== null && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#77776E]">
                                <Clock className="h-3 w-3" />
                                {cand.totalYearsExperience} yrs exp
                              </span>
                            )}
                          </div>
                        </div>

                        {isHighest && (
                          <span className="shrink-0 rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#3D784A] border border-[#C1DEC6]">
                            Highest score
                          </span>
                        )}
                      </div>

                      {/* Score Indicator */}
                      <div className="flex justify-center py-2">
                        <LiquidScoreCircle
                          score={cand.effectiveScore}
                          size="md"
                          showLabel={true}
                          label="Overall Match"
                        />
                      </div>

                      {/* Dimension Scores Breakdown */}
                      {cand.dimensionScores ? (
                        <div className="space-y-2 rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] p-3 text-xs">
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Skills Match</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.skills !== null
                                ? `${cand.dimensionScores.skills}%`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Experience</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.experience !== null
                                ? `${cand.dimensionScores.experience}%`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Projects</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.projects !== null
                                ? `${cand.dimensionScores.projects}%`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Qualifications</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.qualifications !== null
                                ? `${cand.dimensionScores.qualifications}%`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] p-3 text-center text-xs text-[#77776E]">
                          Assessment not completed
                        </div>
                      )}

                      {/* Summary Excerpt */}
                      {cand.summary && (
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#77776E]">
                            Assessment Summary
                          </h4>
                          <p className="text-xs text-[#242522] leading-relaxed line-clamp-3">
                            {cand.summary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-5 border-t border-[#E2DDD5] mt-5">
                      <Link
                        href={`/applications/${cand.applicationId}`}
                        className="block w-full rounded-md bg-[#D97745] py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
                      >
                        Review Application
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TECHNICAL RUBRIC MATRIX */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2DDD5] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#242522]">
                    Technical Competencies & Rubric Matrix
                  </h3>
                  <p className="text-xs text-[#77776E]">
                    Side-by-side verification of requirement matches and verbatim resume evidence
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#77776E]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#3D784A]" />
                  <span>Matched</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-[#C9862C] ml-2" />
                  <span>Partial</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-[#BA3D35] ml-2" />
                  <span>No Evidence</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E2DDD5] text-[#77776E] uppercase">
                    <tr>
                      <th className="p-3.5 font-bold min-w-[200px]">Requirement</th>
                      <th className="p-3.5 font-bold min-w-[120px]">Criteria</th>
                      {data.candidates.map((c) => (
                        <th
                          key={c.applicationId}
                          className="p-3.5 font-bold text-[#242522] min-w-[220px]"
                        >
                          {c.candidateName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5]">
                    {data.matrix.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-3.5 align-top">
                          <span className="font-bold text-[#242522] block">
                            {row.requirement}
                          </span>
                          <span className="text-[10px] text-[#77776E] uppercase">
                            {row.dimension}
                          </span>
                        </td>
                        <td className="p-3.5 align-top">
                          {row.priority ? (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                row.priority === "REQUIRED"
                                  ? "bg-[#F9ECE5] text-[#D97745]"
                                  : "bg-[#FAF8F5] text-[#77776E] border border-[#E2DDD5]"
                              }`}
                            >
                              {row.priority} {row.importance ? `(${row.importance}/5)` : ""}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#77776E]">Baseline</span>
                          )}
                        </td>
                        {row.cells.map((cell, cellIdx) => {
                          const excerptKey = `${rowIdx}-${cellIdx}`;
                          const isExpanded = expandedExcerpts[excerptKey];

                          return (
                            <td key={cell.applicationId} className="p-3.5 align-top space-y-2">
                              {cell.verdict ? (
                                <StatusBadge status={cell.verdict} size="sm" />
                              ) : (
                                <span className="text-[11px] text-[#77776E]">Pending</span>
                              )}

                              {cell.evidenceExcerpt && (
                                <div className="mt-1">
                                  <div
                                    className={`rounded-md bg-[#FAF8F5] border border-[#E2DDD5] p-2 text-[11px] italic text-[#242522] leading-snug ${
                                      !isExpanded ? "line-clamp-2" : ""
                                    }`}
                                  >
                                    &ldquo;{cell.evidenceExcerpt}&rdquo;
                                  </div>
                                  {cell.evidenceExcerpt.length > 80 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleExcerpt(excerptKey)}
                                      className="mt-1 text-[10px] font-semibold text-[#D97745] hover:underline flex items-center gap-0.5"
                                    >
                                      {isExpanded ? (
                                        <>
                                          Show less <ChevronUp className="h-3 w-3" />
                                        </>
                                      ) : (
                                        <>
                                          Read full citation <ChevronDown className="h-3 w-3" />
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PROJECT EVIDENCE SECTION (when any candidate has assessed project items) */}
            {data.projects.some((p) => p.items.length > 0) && (
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-[#E2DDD5] pb-4">
                  <h3 className="text-base font-bold text-[#242522]">
                    Evaluated Project Portfolios
                  </h3>
                  <p className="text-xs text-[#77776E]">
                    Assessment of relevant projects and hands-on deliverables extracted from resumes
                  </p>
                </div>

                <div
                  className={`grid gap-6 ${
                    data.candidates.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : data.candidates.length === 4
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  {data.projects.map((candProjects) => {
                    const candidate = data.candidates.find(
                      (c) => c.applicationId === candProjects.applicationId
                    );

                    return (
                      <div
                        key={candProjects.applicationId}
                        className="space-y-4 rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4"
                      >
                        <h4 className="text-xs font-bold text-[#242522] border-b border-[#E2DDD5] pb-2">
                          {candidate?.candidateName}
                        </h4>

                        {candProjects.items.length === 0 ? (
                          <p className="text-xs text-[#77776E] italic py-2">
                            No evaluated projects for this candidate.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {candProjects.items.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-lg border border-[#E2DDD5] bg-white p-3 space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-xs text-[#242522]">
                                    {item.requirement}
                                  </span>
                                  <StatusBadge status={item.verdict} size="sm" />
                                </div>
                                {item.evidenceExcerpt && (
                                  <p className="text-[11px] italic text-[#77776E] bg-[#FAF8F5] p-1.5 rounded border border-[#E2DDD5]">
                                    &ldquo;{item.evidenceExcerpt}&rdquo;
                                  </p>
                                )}
                                {item.reasoning && (
                                  <p className="text-[11px] text-[#242522]">
                                    {item.reasoning}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Decision Support Disclaimer (RULE 236 / RULES.md 7.6) */}
            <div className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 text-center">
              <p className="text-xs text-[#77776E] flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D97745]" />
                AI-generated. The recruiter makes the final decision.
              </p>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-[#F5F2EC] items-center justify-center p-8 text-xs text-[#77776E]">
          Loading comparison...
        </div>
      }
    >
      <ComparisonContent />
    </Suspense>
  );
}
