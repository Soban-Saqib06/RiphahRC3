"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  MessageSquare,
  ChevronRight,
  Download,
  RotateCcw,
  UserCheck,
  UserX,
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import type {
  ApplicationDetailDTO,
  CandidateApplicationDTO,
  UserDTO,
} from "@/lib/dto";

export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params?.applicationId as string;

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [candidateApp, setCandidateApp] = useState<CandidateApplicationDTO | null>(null);
  const [recruiterApp, setRecruiterApp] = useState<ApplicationDetailDTO | null>(null);
  const [activeTab, setActiveTab] = useState<"assessment" | "questions" | "resume">("assessment");
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    // 1. Load current user
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    // 2. Load application
    if (!applicationId) return;
    fetch(`/api/applications/${applicationId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.application) {
          const app = json.data.application;
          if ("displayStatus" in app && "timeline" in app) {
            setCandidateApp(app as CandidateApplicationDTO);
          } else {
            setRecruiterApp(app as ApplicationDetailDTO);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [applicationId]);

  const isCandidate = currentUser?.role === "CANDIDATE";

  // Recruiter Demo fallback candidate matching wireframe
  const demoRecruiterCandidate = {
    name: "Ethan Calder",
    headline: "Senior Backend Engineer • 5+ years experience",
    email: "candidate1@demo.example",
    jobTitle: "Backend Developer",
    status: "PARSED",
    overallScore: 94,
    skillsScore: 96,
    experienceScore: 92,
    projectsScore: 94,
    qualificationsScore: 95,
    strengths: [
      "Advanced Python & Django Architecture (5+ years production)",
      "High-scale PostgreSQL table partitioning & indexing",
      "Containerized microservices orchestration via Docker",
    ],
    gaps: [
      {
        requirement: "FastAPI / Secondary async framework",
        note: "Primary focus is Django/Flask; async experience unverified",
      },
    ],
    evidence: [
      {
        requirement: "Python (Required - Priority 5)",
        verdict: "MATCHED",
        excerpt: "Led design and scaling of core Python distributed services processing 50k requests/min.",
        reasoning: "Demonstrates 5+ years deep language expertise in high-load production environments.",
      },
      {
        requirement: "Django (Required - Priority 5)",
        verdict: "MATCHED",
        excerpt: "Engineered multi-tenant Django applications with custom authentication and middleware.",
        reasoning: "Explicit verbatim evidence of production enterprise Django architecture.",
      },
      {
        requirement: "PostgreSQL (Required - Priority 4)",
        verdict: "MATCHED",
        excerpt: "Optimized complex PostgreSQL queries, partitioning tables with over 20M records.",
        reasoning: "Confirmed advanced PostgreSQL tuning and database modeling proficiency.",
      },
      {
        requirement: "Docker (Required - Priority 3)",
        verdict: "MATCHED",
        excerpt: "Wrote multi-stage Dockerfiles and managed containerized staging and production deployments.",
        reasoning: "Directly matches containerization requirement.",
      },
    ],
    questions: [
      {
        category: "TECHNICAL",
        question: "Walk us through your PostgreSQL query optimization strategy when scaling beyond 20 million records. How did you design table partitioning?",
        rationale: "Probes candidate's claimed database scaling expertise from resume.",
      },
      {
        category: "PROJECT",
        question: "In your distributed Python service, how did you handle asynchronous task failure and message queue retries?",
        rationale: "Evaluates production reliability and distributed systems architecture.",
      },
    ],
  };

  const handleStatusChange = (newStatus: string) => {
    setActionSuccess(`Candidate status updated to ${newStatus}`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#D97745]" />
          </div>
        ) : isCandidate ? (
          /* ======================================================== */
          /* CANDIDATE VIEW: Application Status Tracker               */
          /* ======================================================== */
          <>
            <PageHeader
              title={candidateApp?.job.title || "Application Status"}
              description={`Application Requisition #${applicationId} • ${candidateApp?.job.department}`}
              breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "My Applications", href: "/applications" },
                { label: "Status Tracker" },
              ]}
              actions={
                <Link
                  href="/applications"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#CDC7BD] bg-white px-3.5 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Applications
                </Link>
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Progress Timeline (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Current Status Banner */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Current Stage
                      </span>
                      <h3 className="font-heading text-xl font-bold text-[#242522] mt-0.5">
                        {candidateApp?.displayStatus || "Submitted"}
                      </h3>
                    </div>
                    {candidateApp?.status && (
                      <StatusBadge status={candidateApp.status} size="md" />
                    )}
                  </div>

                  {/* Status Timeline */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-4">
                    Application History
                  </h4>
                  <div className="space-y-4">
                    {candidateApp?.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF3EC] text-[#3D784A] shrink-0 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1 rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs">
                          <div className="flex items-center justify-between font-bold text-[#242522]">
                            <span>{step.displayStatus}</span>
                            <span className="text-[11px] font-normal text-[#77776E]">
                              {new Date(step.at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#77776E] mt-0.5">
                            Status event recorded by recruitment workflow.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Interviews Card */}
                {candidateApp?.upcomingInterviews && candidateApp.upcomingInterviews.length > 0 && (
                  <div className="rounded-2xl border border-[#ECC9B6] bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#D97745] mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>Scheduled Interviews</span>
                    </div>
                    <div className="space-y-3">
                      {candidateApp.upcomingInterviews.map((inv) => (
                        <div
                          key={inv.id}
                          className="rounded-xl border border-[#ECC9B6] bg-[#F9ECE5] p-4 text-xs"
                        >
                          <div className="flex items-start justify-between font-bold text-[#242522]">
                            <span>{inv.type.replace("_", " ")}</span>
                            <span className="rounded bg-white px-2 py-0.5 text-[10px] text-[#D97745]">
                              {inv.durationMinutes} min
                            </span>
                          </div>
                          <p className="text-[#77776E] mt-1">
                            Date: {new Date(inv.scheduledAt).toLocaleString()}
                          </p>
                          {inv.location && (
                            <p className="text-[#77776E] mt-0.5">
                              Format: {inv.location}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Requisition & Cover Note (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Vacancy Summary */}
                {candidateApp?.job && (
                  <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-3 text-xs">
                    <h4 className="font-heading text-sm font-bold text-[#242522] border-b border-[#E2DDD5] pb-2">
                      Position Overview
                    </h4>
                    <div className="space-y-2 text-[#77776E]">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-[#CDC7BD]" />
                        <span>Department: <strong className="text-[#242522]">{candidateApp.job.department}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#CDC7BD]" />
                        <span>Location: <strong className="text-[#242522]">{candidateApp.job.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#CDC7BD]" />
                        <span>Type: <strong className="text-[#242522]">{candidateApp.job.employmentType.replace("_", " ")}</strong></span>
                      </div>
                      {candidateApp.job.salaryMin && candidateApp.job.salaryMax && (
                        <div className="pt-2 border-t border-[#E2DDD5] font-semibold text-[#242522]">
                          Salary Range: {candidateApp.job.salaryCurrency}{" "}
                          {candidateApp.job.salaryMin.toLocaleString()} - {candidateApp.job.salaryMax.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Note */}
                {candidateApp?.coverNote && (
                  <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                    <h4 className="font-heading text-sm font-bold text-[#242522] mb-2 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-[#D97745]" />
                      Attached Cover Note
                    </h4>
                    <p className="text-xs text-[#242522] leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E2DDD5]">
                      {candidateApp.coverNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* ======================================================== */
          /* RECRUITER VIEW: Full Candidate Assessment Review         */
          /* ======================================================== */
          <>
            <PageHeader
              title={demoRecruiterCandidate.name}
              description={`Applicant for ${demoRecruiterCandidate.jobTitle} • ID: ${applicationId}`}
              breadcrumbs={[
                { label: "Candidates", href: "/applications" },
                { label: demoRecruiterCandidate.name },
              ]}
              actions={
                <div className="flex items-center gap-3">
                  <StatusBadge status={demoRecruiterCandidate.status} />
                  <button
                    type="button"
                    onClick={() => handleStatusChange("SHORTLISTED")}
                    className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors cursor-pointer"
                  >
                    Shortlist Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange("REJECTED")}
                    className="rounded-md border border-[#EFC6C3] bg-white px-3 py-2 text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              }
            />

            {actionSuccess && (
              <div className="mb-6 rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-3 text-xs font-semibold text-[#3D784A]">
                {actionSuccess}
              </div>
            )}

            {/* Recruiter Assessment Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: AI Match Score & Rubrics (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8E3DA] text-xl font-bold text-[#242522]">
                      {demoRecruiterCandidate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#242522]">
                        {demoRecruiterCandidate.name}
                      </h3>
                      <p className="text-xs text-[#77776E]">{demoRecruiterCandidate.headline}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#ECC9B6] bg-[#F9ECE5]/50 p-5 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <LiquidScoreCircle
                        score={demoRecruiterCandidate.overallScore}
                        size="lg"
                        label="AI Overall Match"
                      />
                    </div>

                    <div className="space-y-2.5 pt-3 text-left text-xs border-t border-[#ECC9B6]/60">
                      <div>
                        <div className="flex justify-between font-semibold text-[#242522] mb-1">
                          <span>Skills Match (50%)</span>
                          <span className="font-bold text-[#D97745]">{demoRecruiterCandidate.skillsScore}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                          <div className="h-full bg-[#D97745]" style={{ width: `${demoRecruiterCandidate.skillsScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-[#242522] mb-1">
                          <span>Experience Relevance (25%)</span>
                          <span className="font-bold text-[#D97745]">{demoRecruiterCandidate.experienceScore}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                          <div className="h-full bg-[#D97745]" style={{ width: `${demoRecruiterCandidate.experienceScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-[#242522] mb-1">
                          <span>Projects Alignment (15%)</span>
                          <span className="font-bold text-[#D97745]">{demoRecruiterCandidate.projectsScore}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                          <div className="h-full bg-[#D97745]" style={{ width: `${demoRecruiterCandidate.projectsScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold text-[#242522] mb-1">
                          <span>Qualifications (10%)</span>
                          <span className="font-bold text-[#D97745]">{demoRecruiterCandidate.qualificationsScore}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                          <div className="h-full bg-[#D97745]" style={{ width: `${demoRecruiterCandidate.qualificationsScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Evidence & Assessment Tabs (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-[#E2DDD5] pb-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab("assessment")}
                      className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                        activeTab === "assessment"
                          ? "bg-[#D97745] text-white"
                          : "text-[#77776E] hover:text-[#242522]"
                      }`}
                    >
                      AI Match Assessment
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("questions")}
                      className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                        activeTab === "questions"
                          ? "bg-[#D97745] text-white"
                          : "text-[#77776E] hover:text-[#242522]"
                      }`}
                    >
                      Interview Questions
                    </button>
                  </div>

                  {activeTab === "assessment" ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-3">
                          Verified Resume Evidence
                        </h4>
                        <div className="space-y-3">
                          {demoRecruiterCandidate.evidence.map((item, idx) => (
                            <div key={idx} className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 text-xs">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-[#242522]">{item.requirement}</span>
                                <span className="rounded bg-[#EAF3EC] px-2 py-0.5 font-bold text-[#3D784A] text-[10px]">
                                  {item.verdict}
                                </span>
                              </div>
                              <blockquote className="border-l-2 border-[#D97745] pl-3 italic text-[#77776E] my-2">
                                &ldquo;{item.excerpt}&rdquo;
                              </blockquote>
                              <p className="text-[11px] text-[#242522]">{item.reasoning}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {demoRecruiterCandidate.questions.map((q, idx) => (
                        <div key={idx} className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 text-xs">
                          <span className="rounded bg-[#FAF8F5] border border-[#E2DDD5] px-2 py-0.5 text-[10px] font-bold text-[#D97745]">
                            {q.category}
                          </span>
                          <p className="font-semibold text-[#242522] mt-2 mb-1">{q.question}</p>
                          <p className="text-[11px] text-[#77776E]">Rationale: {q.rationale}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
