"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Search,
  Plus,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import type { JobStatus, JobSummaryDTO, UserDTO } from "@/lib/dto";

export default function JobsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success) setCurrentUser(json.data.user);
      })
      .catch(() => {});

    loadJobs();
  }, []);

  const loadJobs = () => {
    setLoading(true);
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.jobs) {
          setJobs(json.data.jobs);
        } else {
          setError(json.error?.message || "Failed to load jobs");
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const isRecruiter = currentUser?.role === "RECRUITER";

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} onLogout={handleLogout} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title={isRecruiter ? "Requisition Management" : "Open Vacancies"}
          description={
            isRecruiter
              ? "Manage published vacancies, monitor stage distributions, and review candidates."
              : "Explore available positions and submit your profile for review."
          }
          actions={
            isRecruiter ? (
              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Vacancy
              </Link>
            ) : undefined
          }
        />

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#E2DDD5] bg-white p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, dept, or location..."
              className="w-full rounded-md border border-[#E2DDD5] bg-white py-1.5 pl-9 pr-3 text-xs text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none"
            />
          </div>

          {isRecruiter && (
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#77776E]">
              <span>Status:</span>
              {(["ALL", "OPEN", "DRAFT", "CLOSED"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    statusFilter === st
                      ? "border-[#D97745] bg-[#F9ECE5] text-[#D97745]"
                      : "border-[#E2DDD5] bg-[#FAF8F5] text-[#77776E] hover:text-[#242522]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#D97745] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[#EFC6C3] bg-[#F8ECEB] p-4 text-center text-xs text-[#BA3D35]">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            title="No vacancies found"
            description={
              search
                ? "No positions matched your search criteria."
                : "There are currently no vacancies matching this filter."
            }
            actionLabel={isRecruiter ? "Create New Vacancy" : undefined}
            onAction={isRecruiter ? () => router.push("/jobs/new") : undefined}
            icon={Briefcase}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs hover:border-[#D97745]/60 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-[#242522] leading-snug">
                      {job.title}
                    </h3>
                    <StatusBadge status={job.status} size="sm" />
                  </div>

                  <p className="text-xs font-semibold text-[#D97745] mb-4">
                    {job.department}
                  </p>

                  <div className="space-y-2 text-xs text-[#77776E] mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{job.employmentType?.replace("_", " ")}</span>
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#242522]">
                          {job.salaryCurrency}{" "}
                          {job.salaryMin.toLocaleString()} -{" "}
                          {job.salaryMax.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recruiter Stage Counts pill row */}
                  {isRecruiter && job.stageCounts && (
                    <div className="pt-3 border-t border-[#E2DDD5] mb-4 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="rounded bg-[#FAF8F5] border border-[#E2DDD5] px-1.5 py-0.5 text-[#77776E]">
                        Review: {job.stageCounts.IN_REVIEW + job.stageCounts.ASSESSED + job.stageCounts.PARSED}
                      </span>
                      <span className="rounded bg-[#FAF8F5] border border-[#E2DDD5] px-1.5 py-0.5 text-[#D97745] font-semibold">
                        Shortlisted: {job.stageCounts.SHORTLISTED}
                      </span>
                      <span className="rounded bg-[#FAF8F5] border border-[#E2DDD5] px-1.5 py-0.5 text-[#77776E]">
                        Interview: {job.stageCounts.INTERVIEW}
                      </span>
                    </div>
                  )}

                  {!isRecruiter && job.hasApplied && (
                    <div className="mb-4 rounded-md bg-[#FAF8F5] border border-[#E2DDD5] p-2 text-center text-xs font-semibold text-[#3D784A]">
                      &check; Application Submitted
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#E2DDD5] pt-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#77776E]">
                    <Users className="h-3.5 w-3.5" />
                    <span>
                      {job.applicantCount}{" "}
                      {job.applicantCount === 1 ? "applicant" : "applicants"}
                    </span>
                  </div>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97745] hover:underline"
                  >
                    View Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
