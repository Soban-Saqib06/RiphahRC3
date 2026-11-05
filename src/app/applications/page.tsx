"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Columns,
  List,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Briefcase,
  Calendar,
  FileText,
  CheckCircle2,
  Check,
  CheckSquare,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import type {
  ApplicationSummaryDTO,
  CandidateApplicationDTO,
  UserDTO,
} from "@/lib/dto";

// Recruiter Demo fallback candidate matching wireframe
const DEMO_RECRUITER_CANDIDATES = [
  {
    id: "app-ethan-backend",
    name: "Ethan Calder",
    role: "Senior Backend Developer",
    jobTitle: "Backend Developer",
    matchScore: 94,
    status: "PARSED" as const,
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    appliedTime: "2 hours ago",
  },
  {
    id: "app-priya-backend",
    name: "Priya Nandakumar",
    role: "Full Stack & API Engineer",
    jobTitle: "Backend Developer",
    matchScore: 88,
    status: "PARSED" as const,
    skills: ["FastAPI", "Python", "MySQL", "Docker"],
    appliedTime: "5 hours ago",
  },
  {
    id: "app-jonas-backend",
    name: "Jonas Weber",
    role: "Backend Developer",
    jobTitle: "Backend Developer",
    matchScore: 68,
    status: "SUBMITTED" as const,
    skills: ["Java", "Spring Boot", "SQL"],
    appliedTime: "1 day ago",
  },
  {
    id: "app-lena-frontend",
    name: "Lena Okafor",
    role: "Senior Frontend Specialist",
    jobTitle: "Frontend Developer",
    matchScore: 92,
    status: "SHORTLISTED" as const,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    appliedTime: "3 days ago",
  },
  {
    id: "app-marco-frontend",
    name: "Marco Silva",
    role: "Junior Web Developer",
    jobTitle: "Frontend Developer",
    matchScore: 54,
    status: "REJECTED" as const,
    skills: ["HTML", "CSS", "JavaScript"],
    appliedTime: "4 days ago",
  },
];

export default function ApplicationsPage() {
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [candidateApps, setCandidateApps] = useState<CandidateApplicationDTO[]>([]);
  const [recruiterApps, setRecruiterApps] = useState<ApplicationSummaryDTO[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([
    "app-ethan-backend",
    "app-priya-backend",
    "app-jonas-backend",
  ]);

  const toggleCompareCandidate = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  useEffect(() => {
    // 1. Fetch current user
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch applications
    fetch("/api/applications")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (Array.isArray(json.data.applications)) {
            // Check if items have candidate vs recruiter shape
            if (json.data.applications.length > 0 && "job" in json.data.applications[0]) {
              setCandidateApps(json.data.applications);
            } else {
              setRecruiterApps(json.data.applications);
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isCandidate = currentUser?.role === "CANDIDATE";

  const displayRecruiterCandidates = useMemo(() => {
    if (recruiterApps.length > 0) {
      return recruiterApps.map((app) => ({
        id: app.id,
        name: app.candidate.name,
        role: app.candidate.headline || "Applicant",
        jobTitle: app.jobId,
        matchScore: app.assessment?.effectiveScore ?? 80,
        status: app.status,
        skills: ["Verified Applicant"],
        appliedTime: new Date(app.submittedAt).toLocaleDateString(),
      }));
    }
    return DEMO_RECRUITER_CANDIDATES;
  }, [recruiterApps]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ======================================================== */}
        {/* CANDIDATE VIEW: My Applications                          */}
        {/* ======================================================== */}
        {isCandidate ? (
          <>
            <PageHeader
              title="My Applications"
              description="Track your active job applications, status transitions, and scheduled interviews."
              breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "My Applications" },
              ]}
              actions={
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  Browse Vacancies
                </Link>
              }
            />

            {/* Candidate Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-1">
                  Active Applications
                </p>
                <h3 className="text-2xl font-extrabold text-[#242522]">
                  {candidateApps.length}
                </h3>
                <p className="text-xs text-[#77776E] mt-0.5">Submitted to vacancies</p>
              </div>

              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-1">
                  Under Review
                </p>
                <h3 className="text-2xl font-extrabold text-[#242522]">
                  {candidateApps.filter((a) => a.displayStatus === "Under review").length}
                </h3>
                <p className="text-xs text-[#77776E] mt-0.5">Currently evaluated</p>
              </div>

              <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5]/60 p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#D97745] mb-1">
                  Scheduled Interviews
                </p>
                <h3 className="text-2xl font-extrabold text-[#D97745]">
                  {candidateApps.reduce((acc, a) => acc + (a.upcomingInterviews?.length || 0), 0)}
                </h3>
                <p className="text-xs text-[#77776E] mt-0.5">Upcoming interview rounds</p>
              </div>
            </div>

            {/* Applications List */}
            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#D97745] border-t-transparent" />
              </div>
            ) : candidateApps.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#CDC7BD] bg-white p-12 text-center shadow-xs">
                <FileText className="mx-auto h-12 w-12 text-[#A19D95] mb-3" />
                <h3 className="text-base font-bold text-[#242522]">
                  No job applications yet
                </h3>
                <p className="text-xs text-[#77776E] mt-1 max-w-sm mx-auto">
                  Browse our open requisitions and submit an application with your parsed resume.
                </p>
                <Link
                  href="/jobs"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C46332] transition-colors"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  Browse Vacancies
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {candidateApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs hover:border-[#D97745]/60 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2DDD5] pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading text-lg font-bold text-[#242522]">
                            {app.job.title}
                          </h3>
                          <StatusBadge status={app.status} size="sm" />
                        </div>
                        <p className="text-xs font-medium text-[#D97745] mt-1">
                          {app.job.department} • {app.job.location} • {app.job.employmentType.replace("_", " ")}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-semibold text-[#77776E] block">
                          Applied: {new Date(app.submittedAt).toLocaleDateString()}
                        </span>
                        <span className="text-[11px] text-[#A19D95]">
                          Last update: {new Date(app.statusUpdatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Timeline stepper */}
                    <div className="pt-4 pb-2">
                      <p className="text-xs font-bold text-[#77776E] mb-2 uppercase tracking-wider">
                        Status Progress
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {app.timeline.map((step, idx) => (
                          <React.Fragment key={idx}>
                            <div className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-[#FAF8F5] px-3 py-1 text-xs font-semibold text-[#242522]">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#3D784A]" />
                              <span>{step.displayStatus}</span>
                              <span className="text-[10px] text-[#77776E] ml-1">
                                ({new Date(step.at).toLocaleDateString()})
                              </span>
                            </div>
                            {idx < app.timeline.length - 1 && (
                              <ChevronRight className="h-3.5 w-3.5 text-[#CDC7BD]" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming interview notice */}
                    {app.upcomingInterviews && app.upcomingInterviews.length > 0 && (
                      <div className="mt-4 rounded-xl border border-[#ECC9B6] bg-[#F9ECE5] p-3.5 text-xs text-[#242522]">
                        <div className="flex items-center gap-2 font-bold text-[#D97745] mb-1">
                          <Calendar className="h-4 w-4" />
                          <span>Interview Scheduled</span>
                        </div>
                        <p className="text-[11px] text-[#77776E]">
                          {app.upcomingInterviews[0].type.replace("_", " ")} •{" "}
                          {new Date(app.upcomingInterviews[0].scheduledAt).toLocaleString()} •{" "}
                          {app.upcomingInterviews[0].durationMinutes} minutes
                          {app.upcomingInterviews[0].location && ` • ${app.upcomingInterviews[0].location}`}
                        </p>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-5 flex items-center justify-between border-t border-[#E2DDD5] pt-4">
                      <span className="text-xs text-[#77776E]">
                        Requisition ID: {app.job.id}
                      </span>
                      <Link
                        href={`/applications/${app.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
                      >
                        <span>View Status &amp; Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ======================================================== */
          /* ======================================================== */
          /* RECRUITER VIEW: Candidate Pipeline                       */
          /* ======================================================== */
          <>
            <PageHeader
              title="Candidate Pipeline"
              description="Review parsed applicants, inspect match scores, and progress candidates across recruitment stages."
              breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Candidates" },
              ]}
              actions={
                <div className="flex items-center gap-2">
                  <Link
                    href={
                      selectedForComparison.length >= 2
                        ? `/comparison?jobId=job-backend-dev&applicationIds=${selectedForComparison.join(",")}`
                        : "/comparison"
                    }
                    className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-semibold transition-colors shadow-xs ${
                      selectedForComparison.length >= 2
                        ? "bg-[#D97745] text-white hover:bg-[#C46332]"
                        : "border border-[#CDC7BD] bg-white text-[#242522] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>
                      Compare Candidates {selectedForComparison.length > 0 ? `(${selectedForComparison.length})` : ""}
                    </span>
                  </Link>
                </div>
              }
            />

            {/* TOOLBAR */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#E2DDD5] bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#77776E]">AI Score Filter:</span>
                <select className="rounded-md border border-[#E2DDD5] bg-[#FAF8F5] px-2.5 py-1 text-xs font-semibold text-[#242522]">
                  <option>All Candidates</option>
                  <option>Match &gt;= 90% (Strong Match)</option>
                  <option>Match &gt;= 75% (Potential Match)</option>
                </select>
              </div>

              <div className="flex items-center gap-1 self-end sm:self-auto rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 font-semibold transition-all ${
                    viewMode === "kanban"
                      ? "bg-[#D97745] text-white shadow-2xs"
                      : "text-[#77776E] hover:text-[#242522]"
                  }`}
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span>Kanban</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 font-semibold transition-all ${
                    viewMode === "table"
                      ? "bg-[#D97745] text-white shadow-2xs"
                      : "text-[#77776E] hover:text-[#242522]"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>

            {/* Recruiter Kanban View */}
            {viewMode === "kanban" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* 1. Review Column */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                      Under Review
                    </span>
                    <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-xs font-bold text-[#D97745]">
                      3
                    </span>
                  </div>
                  <div className="space-y-4">
                    {displayRecruiterCandidates.slice(0, 3).map((candidate) => {
                      const isSelected = selectedForComparison.includes(candidate.id);
                      return (
                        <div
                          key={candidate.id}
                          className={`rounded-xl border bg-[#FAF8F5] p-4 transition-all hover:shadow-xs ${
                            isSelected ? "border-[#D97745] ring-1 ring-[#D97745]/40" : "border-[#E2DDD5] hover:border-[#D97745]/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link
                              href={`/applications/${candidate.id}`}
                              className="font-heading text-sm font-bold text-[#242522] hover:text-[#D97745]"
                            >
                              {candidate.name}
                            </Link>
                            <span className="rounded bg-white border border-[#E2DDD5] px-2 py-0.5 text-[11px] font-bold text-[#D97745]">
                              {candidate.matchScore}%
                            </span>
                          </div>
                          <p className="text-[11px] text-[#77776E] mb-3">{candidate.role}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {candidate.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-white border border-[#E2DDD5] px-1.5 py-0.5 text-[10px] text-[#77776E]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between border-t border-[#E2DDD5]/60 pt-2.5">
                            <button
                              type="button"
                              onClick={(e) => toggleCompareCandidate(candidate.id, e)}
                              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#D97745] text-white shadow-2xs"
                                  : "bg-white border border-[#E2DDD5] text-[#77776E] hover:border-[#D97745] hover:text-[#242522]"
                              }`}
                            >
                              <CheckSquare className="h-3 w-3" />
                              <span>{isSelected ? "Selected" : "Compare"}</span>
                            </button>
                            <Link
                              href={`/applications/${candidate.id}`}
                              className="text-[11px] font-medium text-[#77776E] hover:text-[#D97745]"
                            >
                              Details →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Shortlisted Column */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                      Shortlisted
                    </span>
                    <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-xs font-bold text-[#D97745]">
                      1
                    </span>
                  </div>
                  <div className="space-y-4">
                    {displayRecruiterCandidates.slice(3, 4).map((candidate) => {
                      const isSelected = selectedForComparison.includes(candidate.id);
                      return (
                        <div
                          key={candidate.id}
                          className={`rounded-xl border bg-[#FAF8F5] p-4 transition-all hover:shadow-xs ${
                            isSelected ? "border-[#D97745] ring-1 ring-[#D97745]/40" : "border-[#E2DDD5] hover:border-[#D97745]/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link
                              href={`/applications/${candidate.id}`}
                              className="font-heading text-sm font-bold text-[#242522] hover:text-[#D97745]"
                            >
                              {candidate.name}
                            </Link>
                            <span className="rounded bg-white border border-[#E2DDD5] px-2 py-0.5 text-[11px] font-bold text-[#D97745]">
                              {candidate.matchScore}%
                            </span>
                          </div>
                          <p className="text-[11px] text-[#77776E] mb-3">{candidate.role}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {candidate.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-white border border-[#E2DDD5] px-1.5 py-0.5 text-[10px] text-[#77776E]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between border-t border-[#E2DDD5]/60 pt-2.5">
                            <button
                              type="button"
                              onClick={(e) => toggleCompareCandidate(candidate.id, e)}
                              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#D97745] text-white shadow-2xs"
                                  : "bg-white border border-[#E2DDD5] text-[#77776E] hover:border-[#D97745] hover:text-[#242522]"
                              }`}
                            >
                              <CheckSquare className="h-3 w-3" />
                              <span>{isSelected ? "Selected" : "Compare"}</span>
                            </button>
                            <Link
                              href={`/applications/${candidate.id}`}
                              className="text-[11px] font-medium text-[#77776E] hover:text-[#D97745]"
                            >
                              Details →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Interview Column */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                      Interview
                    </span>
                    <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-xs font-bold text-[#D97745]">
                      0
                    </span>
                  </div>
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#CDC7BD] p-4 text-center">
                    <p className="text-xs text-[#77776E]">No candidates in this stage</p>
                  </div>
                </div>

                {/* 4. Decision Column */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                      Rejected / Archive
                    </span>
                    <span className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-xs font-bold text-[#D97745]">
                      1
                    </span>
                  </div>
                  <div className="space-y-4">
                    {displayRecruiterCandidates.slice(4, 5).map((candidate) => {
                      const isSelected = selectedForComparison.includes(candidate.id);
                      return (
                        <div
                          key={candidate.id}
                          className={`rounded-xl border bg-[#FAF8F5] p-4 transition-all opacity-85 hover:opacity-100 ${
                            isSelected ? "border-[#D97745] ring-1 ring-[#D97745]/40" : "border-[#E2DDD5] hover:border-[#D97745]/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link
                              href={`/applications/${candidate.id}`}
                              className="font-heading text-sm font-bold text-[#242522] hover:text-[#D97745]"
                            >
                              {candidate.name}
                            </Link>
                            <span className="rounded bg-white border border-[#E2DDD5] px-2 py-0.5 text-[11px] font-bold text-[#77776E]">
                              {candidate.matchScore}%
                            </span>
                          </div>
                          <p className="text-[11px] text-[#77776E] mb-3">{candidate.role}</p>
                          <div className="flex items-center justify-between border-t border-[#E2DDD5]/60 pt-2.5">
                            <button
                              type="button"
                              onClick={(e) => toggleCompareCandidate(candidate.id, e)}
                              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#D97745] text-white shadow-2xs"
                                  : "bg-white border border-[#E2DDD5] text-[#77776E] hover:border-[#D97745] hover:text-[#242522]"
                              }`}
                            >
                              <CheckSquare className="h-3 w-3" />
                              <span>{isSelected ? "Selected" : "Compare"}</span>
                            </button>
                            <Link
                              href={`/applications/${candidate.id}`}
                              className="text-[11px] font-medium text-[#77776E] hover:text-[#D97745]"
                            >
                              Details →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#E2DDD5] bg-white shadow-xs">
                <table className="min-w-full divide-y divide-[#E2DDD5]">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="w-12 px-4 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Compare
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Candidate
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Role
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Match Score
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Stage
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5] bg-white">
                    {displayRecruiterCandidates.map((candidate) => {
                      const isSelected = selectedForComparison.includes(candidate.id);
                      return (
                        <tr
                          key={candidate.id}
                          className={`transition-colors ${
                            isSelected ? "bg-[#FAF8F5]" : "hover:bg-[#FAF8F5]"
                          }`}
                        >
                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleCompareCandidate(candidate.id)}
                              className={`inline-flex items-center justify-center h-5 w-5 rounded border transition-colors cursor-pointer ${
                                isSelected
                                  ? "border-[#D97745] bg-[#D97745] text-white"
                                  : "border-[#CDC7BD] bg-white text-transparent hover:border-[#D97745]"
                              }`}
                              title="Select to compare"
                            >
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#242522]">
                            {candidate.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-[#77776E]">
                            {candidate.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-[#D97745]">
                            {candidate.matchScore}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={candidate.status} size="sm" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                            <Link
                              href={`/applications/${candidate.id}`}
                              className="font-bold text-[#D97745] hover:underline"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Floating Sticky Comparison Bar */}
            {selectedForComparison.length >= 2 && (
              <aside
                aria-label="Candidate Comparison Bar"
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 rounded-2xl border border-[#ECC9B6] bg-[#242522] text-white px-5 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D97745] text-xs font-bold text-white">
                    {selectedForComparison.length}
                  </span>
                  <span className="text-xs font-medium text-[#FAF8F5]">
                    Candidates selected for side-by-side comparison (max 4)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedForComparison([])}
                    className="rounded-lg px-2.5 py-1 text-xs text-[#A19D95] hover:text-white transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <Link
                    href={`/comparison?jobId=job-backend-dev&applicationIds=${selectedForComparison.join(",")}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#D97745] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#C46332] transition-colors shadow-xs"
                  >
                    <span>Compare Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </aside>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
