"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  FileCheck,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import type { DashboardDTO } from "@/lib/dto";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiWidgetExpanded, setAiWidgetExpanded] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDashboard(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          title="Recruitment Dashboard"
          description="Track active requisitions, review priority candidates, and inspect AI-assisted recommendations."
          actions={
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              New Requisition
            </Link>
          }
        />

        {/* KPI CARDS ROW (Wireframe R01) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Active Jobs"
            value={dashboard?.role === "RECRUITER" ? dashboard.kpis.activeJobs : 2}
            subtitle="Open vacancies"
            trend="+2 this week"
            icon={Briefcase}
          />
          <MetricCard
            title="Total Applicants"
            value={dashboard?.role === "RECRUITER" ? dashboard.kpis.totalApplications : 5}
            subtitle="Across all pipelines"
            icon={Users}
          />
          <MetricCard
            title="Pending Reviews"
            value={dashboard?.role === "RECRUITER" ? dashboard.kpis.pendingReview : 3}
            subtitle="Requires recruiter action"
            trend="Priority"
            icon={FileCheck}
          />
          <MetricCard
            title="Scheduled Interviews"
            value={dashboard?.role === "RECRUITER" ? dashboard.kpis.upcomingInterviews : 1}
            subtitle="Upcoming this week"
            icon={Calendar}
          />
        </div>

        {/* TWO-COLUMN WORKSPACE (Wireframe R01) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Work Area: Pending Reviews & Active Jobs (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Pending Candidate Reviews Card */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#242522]">
                    Pending Candidate Reviews
                  </h2>
                  <p className="text-xs text-[#77776E]">
                    Applicants requiring immediate recruiter assessment
                  </p>
                </div>
                <Link
                  href="/applications"
                  className="text-xs font-semibold text-[#D97745] hover:underline inline-flex items-center gap-1"
                >
                  View All Candidates
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Candidate rows matching R01 */}
              <div className="space-y-3">
                {[
                  {
                    name: "Ethan Calder",
                    job: "Backend Developer (Scenario)",
                    score: 94,
                    id: "app-ethan-backend",
                  },
                  {
                    name: "Priya Nandakumar",
                    job: "Backend Developer (Scenario)",
                    score: 88,
                    id: "app-priya-backend",
                  },
                  {
                    name: "Jonas Weber",
                    job: "Backend Developer (Scenario)",
                    score: 68,
                    id: "app-jonas-backend",
                  },
                ].map((cand) => (
                  <div
                    key={cand.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 gap-3 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8E3DA] text-sm font-bold text-[#242522]">
                        {cand.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#242522]">
                          {cand.name}
                        </p>
                        <p className="text-xs text-[#77776E]">{cand.job}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-[#F9ECE5] px-3 py-1 text-xs font-bold text-[#D97745]">
                        {cand.score}% Match
                      </span>
                      <Link
                        href={`/applications/${cand.id}`}
                        className="rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Jobs Overview Card */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#242522]">
                    Active Jobs Overview
                  </h2>
                  <p className="text-xs text-[#77776E]">
                    Pipeline progress across published requisitions
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-[#D97745] hover:underline inline-flex items-center gap-1"
                >
                  View All Jobs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Backend Developer",
                    dept: "Engineering",
                    applicants: 3,
                    status: "OPEN",
                    progress: 75,
                    id: "job-backend-dev",
                  },
                  {
                    title: "Frontend Developer",
                    dept: "Engineering",
                    applicants: 2,
                    status: "OPEN",
                    progress: 45,
                    id: "job-frontend-dev",
                  },
                ].map((job) => (
                  <div
                    key={job.title}
                    className="rounded-xl border border-[#E2DDD5] p-4 bg-[#FAF8F5]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-sm font-bold text-[#242522] hover:text-[#D97745]"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs text-[#77776E]">{job.dept}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={job.status} size="sm" />
                        <span className="text-xs text-[#77776E]">
                          {job.applicants} applicants
                        </span>
                      </div>
                    </div>
                    {/* Pipeline Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-[#77776E] mb-1">
                        <span>Pipeline Progress</span>
                        <span>{job.progress}% Sourced</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                        <div
                          className="h-full bg-[#D97745] rounded-full"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Activity Feed & AI Insight Widget (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Compact AI Insight Widget (Inline Expandable per DESIGN_DIRECTIONS.md) */}
            <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5]/60 p-5 shadow-xs">
              <button
                type="button"
                onClick={() => setAiWidgetExpanded(!aiWidgetExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D97745] text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97745]">
                      AI Recommendations
                    </h3>
                  </div>
                </div>
                {aiWidgetExpanded ? (
                  <ChevronUp className="h-4 w-4 text-[#D97745]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#D97745]" />
                )}
              </button>

              {aiWidgetExpanded && (
                <div className="mt-4 space-y-3 pt-3 border-t border-[#ECC9B6]/60 text-xs text-[#242522]">
                  <div className="rounded-lg bg-white p-3 border border-[#ECC9B6]/40 space-y-1">
                    <p className="font-bold text-[#D97745]">Priority Action:</p>
                    <p className="text-[#77776E] leading-relaxed">
                      Ethan Calder has a 94% verified match for Backend Developer with strong Python/Django evidence.
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-[#ECC9B6]/40 space-y-1">
                    <p className="font-bold text-[#D97745]">Evidence Alert:</p>
                    <p className="text-[#77776E] leading-relaxed">
                      Priya Nandakumar demonstrated FastAPI proficiency, which serves as a modern semantic equivalent for Django APIs.
                    </p>
                  </div>
                  <p className="text-[10px] text-[#77776E] italic">
                    AI-generated insights. The recruiter makes the final hiring decision.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#242522] border-b border-[#E2DDD5] pb-3 mb-4">
                Recent Recruitment Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Ethan Calder applied for Backend Developer",
                    time: "10 mins ago",
                  },
                  {
                    title: "AI Assessment completed for Priya Nandakumar",
                    time: "1 hour ago",
                  },
                  {
                    title: "Interview scheduled with Lena Okafor",
                    time: "2 hours ago",
                  },
                  {
                    title: "New vacancy 'Backend Developer' published",
                    time: "Yesterday",
                  },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="mt-0.5 flex h-2 w-2 rounded-full bg-[#D97745] shrink-0" />
                    <div>
                      <p className="font-medium text-[#242522]">{act.title}</p>
                      <p className="text-[11px] text-[#77776E]">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
