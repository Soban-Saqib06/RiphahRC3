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
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import type { ApplicationDetailDTO } from "@/lib/dto";

export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params?.applicationId as string;
  const [application, setApplication] = useState<ApplicationDetailDTO | null>(null);
  const [activeTab, setActiveTab] = useState<"assessment" | "questions" | "resume">("assessment");
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    fetch(`/api/applications/${applicationId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.application) {
          setApplication(json.data.application);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [applicationId]);

  // Demo fallback candidate matching wireframe Ro7 and competition scenario
  const candidate = {
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
        question: "In your distributed Python microservices project, how did you handle service discovery, failover, and inter-service transaction integrity?",
        rationale: "Validates high-throughput architecture experience.",
      },
      {
        category: "ROLE_FIT",
        question: "Tell us about your experience with asynchronous Python frameworks (such as FastAPI or asyncio) when building low-latency endpoints.",
        rationale: "Clarifies the unevidenced async framework requirement neutrally.",
      },
    ],
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccess(`Candidate successfully moved to ${newStatus}`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch {}
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar
        user={{
          id: "recruiter-maya",
          name: "Maya Hartwell",
          email: "recruiter@demo.example",
          role: "RECRUITER",
        }}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title={candidate.name}
          description={`Applicant for ${candidate.jobTitle} • ID: ${applicationId}`}
          breadcrumbs={[
            { label: "Candidates", href: "/applications" },
            { label: candidate.name },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <StatusBadge status={candidate.status} />
              <button
                type="button"
                onClick={() => handleStatusChange("SHORTLISTED")}
                className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
              >
                Shortlist Candidate
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("REJECTED")}
                className="rounded-md border border-[#EFC6C3] bg-white px-3 py-2 text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors"
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

        {/* TWO-COLUMN CANDIDATE SCREEN (Wireframe Ro7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Summary, Score & Signals (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Candidate Summary Card */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8E3DA] text-xl font-bold text-[#242522]">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#242522]">
                    {candidate.name}
                  </h3>
                  <p className="text-xs text-[#77776E]">{candidate.headline}</p>
                </div>
              </div>

              {/* AI Match Score with Signature Liquid Wave Circle */}
              <div className="rounded-xl border border-[#ECC9B6] bg-[#F9ECE5]/50 p-5 text-center">
                <div className="flex items-center justify-center mb-3">
                  <LiquidScoreCircle
                    score={candidate.overallScore}
                    size="lg"
                    label="AI Overall Match"
                  />
                </div>

                {/* Weighted Rubric Breakdown Bars */}
                <div className="space-y-2.5 pt-3 text-left text-xs border-t border-[#ECC9B6]/60">
                  <div>
                    <div className="flex justify-between font-semibold text-[#242522] mb-1">
                      <span>Skills Match (50%)</span>
                      <span className="font-bold text-[#D97745]">{candidate.skillsScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                      <div className="h-full bg-[#D97745]" style={{ width: `${candidate.skillsScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#242522] mb-1">
                      <span>Experience Relevance (25%)</span>
                      <span className="font-bold text-[#D97745]">{candidate.experienceScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                      <div className="h-full bg-[#D97745]" style={{ width: `${candidate.experienceScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#242522] mb-1">
                      <span>Project Relevance (15%)</span>
                      <span className="font-bold text-[#D97745]">{candidate.projectsScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                      <div className="h-full bg-[#D97745]" style={{ width: `${candidate.projectsScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#242522] mb-1">
                      <span>Qualifications (10%)</span>
                      <span className="font-bold text-[#D97745]">{candidate.qualificationsScore}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                      <div className="h-full bg-[#D97745]" style={{ width: `${candidate.qualificationsScore}%` }} />
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-[10px] text-[#77776E] italic">
                  AI-assisted recommendation. Recruiter makes final decision.
                </p>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522] mb-2">
                  Verified Strengths
                </h4>
                <div className="space-y-1.5">
                  {candidate.strengths.map((str, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#242522]">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A] shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Gaps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9862C] mb-2">
                  Evidence Gaps (Needs Verification)
                </h4>
                <div className="space-y-1.5">
                  {candidate.gaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-[#F3DCB7] bg-[#FAF2E6] p-2.5 text-xs text-[#242522]"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#C9862C]">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>{gap.requirement}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#77776E]">{gap.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Interview Link */}
              <Link
                href="/interviews"
                className="w-full flex items-center justify-center gap-1.5 rounded-md bg-[#D97745] py-2 text-xs font-bold text-white hover:bg-[#C46332] transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Interview</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Assessment, Evidence & Questions Tabs (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E2DDD5] pb-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("assessment")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "assessment"
                    ? "bg-[#D97745] text-white"
                    : "text-[#77776E] hover:text-[#242522]"
                }`}
              >
                Assessment &amp; Resume Evidence
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("questions")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "questions"
                    ? "bg-[#D97745] text-white"
                    : "text-[#77776E] hover:text-[#242522]"
                }`}
              >
                Interview Questions Kit
              </button>
            </div>

            {/* TAB 1: EVIDENCE VIEW (Wireframe Ro7) */}
            {activeTab === "assessment" && (
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#242522]">
                      Verbatim Resume Evidence
                    </h3>
                    <p className="text-xs text-[#77776E]">
                      Extracted and verified against job requirements with direct citations
                    </p>
                  </div>
                  <span className="rounded-md border border-[#E2DDD5] bg-[#FAF8F5] px-3 py-1 text-xs text-[#77776E]">
                    Source: PDF Extracted Text
                  </span>
                </div>

                <div className="space-y-4">
                  {candidate.evidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 space-y-2 hover:border-[#D97745]/60 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#242522]">
                          {item.requirement}
                        </span>
                        <StatusBadge status={item.verdict} size="sm" />
                      </div>

                      {/* Verbatim quote */}
                      <div className="rounded-md bg-white border border-[#E2DDD5] p-3 text-xs italic text-[#242522] border-l-4 border-l-[#D97745]">
                        &ldquo;{item.excerpt}&rdquo;
                      </div>

                      <p className="text-xs text-[#77776E]">
                        <strong>Recruiter Note:</strong> {item.reasoning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: QUESTIONS KIT (Wireframe R08) */}
            {activeTab === "questions" && (
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#242522]">
                      Interview Kit Builder
                    </h3>
                    <p className="text-xs text-[#77776E]">
                      AI-generated questions probing candidate evidence and identified gaps
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#D97745]" />
                    Regenerate Questions
                  </button>
                </div>

                <div className="space-y-4">
                  {candidate.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#D97745]">
                          {q.category}
                        </span>
                        <span className="text-[11px] text-[#77776E]">Question #{idx + 1}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#242522]">{q.question}</p>
                      <p className="text-xs text-[#77776E]">
                        <strong>Evaluation Rationale:</strong> {q.rationale}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Interviewer Notes Box per wireframe R08 */}
                <div className="pt-4 border-t border-[#E2DDD5] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
                    Interviewer Notes &amp; Observations
                  </h4>
                  <textarea
                    rows={3}
                    placeholder="Add observations, key takeaways, or areas for further probing during interview..."
                    className="w-full rounded-md border border-[#E2DDD5] bg-white p-3 text-xs text-[#242522] focus:border-[#D97745] focus:outline-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white hover:bg-[#C46332]"
                    >
                      Save Interview Kit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
