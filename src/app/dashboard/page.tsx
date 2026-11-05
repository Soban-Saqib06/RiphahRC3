"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  FileCheck,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MetricCard } from "@/components/shared/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import type { DashboardDTO, UserDTO } from "@/lib/dto";

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [dashboard, setDashboard] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiWidgetExpanded, setAiWidgetExpanded] = useState(true);

  useEffect(() => {
    // 1. Fetch current user
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch dashboard data
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDashboard(json.data);
        } else {
          setError(json.error?.message || "Failed to load dashboard data");
        }
      })
      .catch(() => {
        setError("Network error connecting to dashboard");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} onLogout={handleLogout} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#D97745] border-t-transparent" />
              <p className="text-xs text-[#77776E]">Loading recruitment metrics...</p>
            </div>
          </div>
        ) : error ? (
          <div className="my-8 rounded-xl border border-[#EFC6C3] bg-[#F8ECEB] p-6 text-center text-sm text-[#BA3D35]">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-md bg-[#BA3D35] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#9E332C]"
            >
              Retry
            </button>
          </div>
        ) : dashboard?.role === "RECRUITER" ? (
          /* ========================================================= */
          /* RECRUITER DASHBOARD                                       */
          /* ========================================================= */
          <>
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

            {/* KPI CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard
                title="Active Jobs"
                value={dashboard.kpis.activeJobs}
                subtitle="Open vacancies"
                icon={Briefcase}
              />
              <MetricCard
                title="Total Applicants"
                value={dashboard.kpis.totalApplications}
                subtitle="Across all pipelines"
                icon={Users}
              />
              <MetricCard
                title="Pending Reviews"
                value={dashboard.kpis.pendingReview}
                subtitle="Requires recruiter action"
                icon={FileCheck}
              />
              <MetricCard
                title="Scheduled Interviews"
                value={dashboard.kpis.upcomingInterviews}
                subtitle="Upcoming"
                icon={Calendar}
              />
            </div>

            {/* PIPELINE BREAKDOWN BAR */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-[#242522]">
                    Recruitment Funnel & Pipeline
                  </h2>
                  <p className="text-xs text-[#77776E]">
                    Real-time applicant distribution across all stages
                  </p>
                </div>
                {dashboard.kpis.averageMatchScore !== null && (
                  <span className="rounded-full bg-[#F9ECE5] px-3 py-1 text-xs font-bold text-[#D97745]">
                    Avg Match Score: {dashboard.kpis.averageMatchScore}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {dashboard.pipeline.map((stage) => (
                  <div
                    key={stage.status}
                    className="flex flex-col rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-center"
                  >
                    <span className="text-[11px] font-medium text-[#77776E] truncate">
                      {stage.status.replace("_", " ")}
                    </span>
                    <span className="text-lg font-bold text-[#242522] mt-1">
                      {stage.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TWO-COLUMN WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Work Area: Active Jobs (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* Active Jobs Card */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#242522]">
                        Requisitions Overview
                      </h2>
                      <p className="text-xs text-[#77776E]">
                        Pipeline progress and top candidates across published vacancies
                      </p>
                    </div>
                    <Link
                      href="/jobs"
                      className="text-xs font-semibold text-[#D97745] hover:underline inline-flex items-center gap-1"
                    >
                      Manage All Jobs
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {dashboard.jobs.length === 0 ? (
                    <EmptyState
                      title="No vacancies published"
                      description="Create your first job requisition to start receiving candidate applications."
                      actionLabel="Create Vacancy"
                      onAction={() => router.push("/jobs/new")}
                      icon={Briefcase}
                    />
                  ) : (
                    <div className="space-y-3">
                      {dashboard.jobs.map((job) => (
                        <div
                          key={job.jobId}
                          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[#E2DDD5] p-4 bg-[#FAF8F5] gap-3 hover:bg-white transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/jobs/${job.jobId}`}
                                className="text-sm font-bold text-[#242522] hover:text-[#D97745]"
                              >
                                {job.title}
                              </Link>
                              <StatusBadge status={job.status} size="sm" />
                            </div>
                            <p className="text-xs text-[#77776E] mt-1">
                              {job.applicants} applicant{job.applicants === 1 ? "" : "s"} • {job.shortlisted} shortlisted
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {job.topScore !== null ? (
                              <span className="rounded-full bg-[#F9ECE5] px-2.5 py-1 text-xs font-bold text-[#D97745]">
                                Top: {job.topScore}%
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#77776E]">
                                No score yet
                              </span>
                            )}
                            <Link
                              href={`/applications?jobId=${job.jobId}`}
                              className="rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
                            >
                              Applicants
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Interviews Card */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#242522]">
                        Scheduled Interviews
                      </h2>
                      <p className="text-xs text-[#77776E]">
                        Next 5 interviews on the schedule
                      </p>
                    </div>
                    <Link
                      href="/interviews"
                      className="text-xs font-semibold text-[#D97745] hover:underline inline-flex items-center gap-1"
                    >
                      Calendar View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {dashboard.upcomingInterviews.length === 0 ? (
                    <EmptyState
                      title="No upcoming interviews"
                      description="When you shortlist candidates and schedule interviews, they will appear here."
                      icon={Calendar}
                    />
                  ) : (
                    <div className="space-y-3">
                      {dashboard.upcomingInterviews.map((iv) => (
                        <div
                          key={iv.id}
                          className="flex items-center justify-between rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8E3DA] font-bold text-[#242522]">
                              {iv.candidate.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#242522]">{iv.candidate.name}</p>
                              <p className="text-[#77776E]">{iv.job.title} • {iv.type.replace("_", " ")}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#242522]">
                              {new Date(iv.scheduledAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-[11px] text-[#77776E]">
                              {iv.durationMinutes} min {iv.location ? `• ${iv.location}` : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Rail: AI Insight & Activity Feed (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* AI Insight Widget */}
                <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5]/60 p-5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setAiWidgetExpanded(!aiWidgetExpanded)}
                    className="w-full flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D97745] text-white">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97745]">
                        Recruitment Insights
                      </h3>
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
                        <p className="font-bold text-[#D97745]">Evidence Verification</p>
                        <p className="text-[#77776E] leading-relaxed">
                          AI assessments cite verbatim resume excerpts to highlight matching technical strengths and skill gaps without guessing.
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
                    Recent Activity
                  </h3>
                  {dashboard.recentActivity.length === 0 ? (
                    <p className="text-xs text-[#77776E] py-4 text-center">
                      No status events recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {dashboard.recentActivity.map((act) => (
                        <div key={act.id} className="flex items-start gap-2.5 text-xs">
                          <div className="mt-1 h-2 w-2 rounded-full bg-[#D97745] shrink-0" />
                          <div>
                            <p className="font-semibold text-[#242522]">
                              {act.candidateName} &rarr; <span className="font-bold text-[#D97745]">{act.toStatus.replace("_", " ")}</span>
                            </p>
                            <p className="text-[11px] text-[#77776E]">
                              {act.jobTitle} {act.note ? `• ${act.note}` : ""}
                            </p>
                            <p className="text-[10px] text-[#77776E]/70">
                              {new Date(act.at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* CANDIDATE DASHBOARD                                       */
          /* ========================================================= */
          <>
            <PageHeader
              title="Candidate Portal"
              description="Review your active applications, profile status, and interview schedule."
              actions={
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse Vacancies
                </Link>
              }
            />

            {/* Candidate Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MetricCard
                title="Profile Completeness"
                value={`${dashboard?.profileCompleteness ?? 0}%`}
                subtitle={dashboard?.hasParsedResume ? "Resume uploaded & parsed" : "Upload resume to complete"}
                icon={CheckCircle}
              />
              <MetricCard
                title="Applications"
                value={dashboard?.counts.total ?? 0}
                subtitle="Total submitted"
                icon={FileText}
              />
              <MetricCard
                title="Under Review"
                value={dashboard?.counts.underReview ?? 0}
                subtitle="Being evaluated"
                icon={FileCheck}
              />
              <MetricCard
                title="Interviews"
                value={dashboard?.counts.interviews ?? 0}
                subtitle="Scheduled"
                icon={Calendar}
              />
            </div>

            {/* Candidate Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                  <h2 className="text-base font-bold text-[#242522] border-b border-[#E2DDD5] pb-3 mb-4">
                    My Applications
                  </h2>

                  {dashboard?.recentApplications.length === 0 ? (
                    <EmptyState
                      title="No applications yet"
                      description="Browse open vacancies and submit your application with your uploaded resume."
                      actionLabel="Explore Jobs"
                      onAction={() => router.push("/jobs")}
                      icon={Briefcase}
                    />
                  ) : (
                    <div className="space-y-4">
                      {dashboard?.recentApplications.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-bold text-[#242522]">{app.job.title}</h3>
                              <p className="text-xs text-[#77776E]">
                                {app.job.department} • {app.job.location}
                              </p>
                            </div>
                            <span className="rounded-full bg-[#E8E3DA] px-2.5 py-1 text-xs font-semibold text-[#242522]">
                              {app.displayStatus}
                            </span>
                          </div>

                          {/* Timeline */}
                          {app.timeline.length > 0 && (
                            <div className="pt-2 border-t border-[#E2DDD5] flex flex-wrap items-center gap-2 text-[11px] text-[#77776E]">
                              {app.timeline.map((step, idx) => (
                                <span key={idx} className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#D97745]" />
                                  <span>{step.displayStatus}</span>
                                  {idx < app.timeline.length - 1 && <span className="text-[#E2DDD5]">&bull;</span>}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Candidate Upcoming Interviews */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-[#242522] border-b border-[#E2DDD5] pb-3 mb-4">
                    Upcoming Interviews
                  </h3>
                  {dashboard?.upcomingInterviews.length === 0 ? (
                    <p className="text-xs text-[#77776E] py-4 text-center">
                      No interviews scheduled.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {dashboard?.upcomingInterviews.map((iv) => (
                        <div
                          key={iv.id}
                          className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs space-y-1"
                        >
                          <p className="font-bold text-[#242522]">{iv.jobTitle}</p>
                          <p className="text-[#77776E]">{iv.type.replace("_", " ")}</p>
                          <p className="font-semibold text-[#D97745]">
                            {new Date(iv.scheduledAt).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {iv.location && (
                            <p className="text-[11px] text-[#77776E]">Location: {iv.location}</p>
                          )}
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
