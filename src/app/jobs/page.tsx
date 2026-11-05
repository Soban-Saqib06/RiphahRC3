"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Plus,
  Users,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import type { JobSummaryDTO } from "@/lib/dto";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobSummaryDTO[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.jobs) {
          setJobs(json.data.jobs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayJobs =
    jobs.length > 0
      ? jobs
      : [
          {
            id: "job-backend-dev",
            title: "Backend Developer",
            department: "Engineering",
            location: "Lahore (Hybrid)",
            employmentType: "FULL_TIME" as const,
            salaryMin: 250000,
            salaryMax: 400000,
            salaryCurrency: "PKR",
            status: "OPEN" as const,
            applicantCount: 3,
            createdAt: new Date().toISOString(),
          },
          {
            id: "job-frontend-dev",
            title: "Frontend Developer",
            department: "Engineering",
            location: "Lahore (Remote)",
            employmentType: "FULL_TIME" as const,
            salaryMin: 220000,
            salaryMax: 350000,
            salaryCurrency: "PKR",
            status: "OPEN" as const,
            applicantCount: 2,
            createdAt: new Date().toISOString(),
          },
          {
            id: "job-data-analyst",
            title: "Data Analyst",
            department: "Data & Analytics",
            location: "Islamabad (Onsite)",
            employmentType: "CONTRACT" as const,
            salaryMin: 180000,
            salaryMax: 260000,
            salaryCurrency: "PKR",
            status: "CLOSED" as const,
            applicantCount: 1,
            createdAt: new Date().toISOString(),
          },
        ];

  const filteredJobs = displayJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
  );

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
          title="Job Vacancies"
          description="Manage requisitions, review candidate match distributions, and inspect application pipelines."
          actions={
            <Link
              href="/jobs/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Vacancy
            </Link>
          }
        />

        {/* Filter & Search Bar per wireframe R02 */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#E2DDD5] bg-white p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77776E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, skill, or department..."
              className="w-full rounded-md border border-[#E2DDD5] bg-white py-1.5 pl-9 pr-3 text-xs text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#77776E]">
            <span>Filter by:</span>
            <span className="rounded-md border border-[#E2DDD5] px-2.5 py-1 bg-[#FAF8F5] text-[#242522] font-medium">
              All Statuses
            </span>
            <span className="rounded-md border border-[#E2DDD5] px-2.5 py-1 bg-[#FAF8F5] text-[#242522] font-medium">
              All Departments
            </span>
          </div>
        </div>

        {/* Jobs Card Grid per wireframe R02 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs hover:border-[#D97745]/60 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#242522]">
                    {job.title}
                  </h3>
                  <StatusBadge status={job.status} size="sm" />
                </div>
                <p className="text-xs font-semibold text-[#D97745] mb-4">
                  {job.department}
                </p>

                <div className="space-y-2 text-xs text-[#77776E] mb-6">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#CDC7BD]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#CDC7BD]" />
                    <span>{job.employmentType.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[#242522]">
                    <span>
                      {job.salaryCurrency}{" "}
                      {job.salaryMin?.toLocaleString()} -{" "}
                      {job.salaryMax?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Candidate Overview Stats */}
                <div className="rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs mb-6">
                  <div className="flex justify-between font-semibold text-[#242522] mb-1">
                    <span>Total Applicants:</span>
                    <span className="text-[#D97745] font-bold">
                      {job.applicantCount}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                    <div className="h-full bg-[#D97745] w-2/3 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E2DDD5]">
                <Link
                  href={`/applications?jobId=${job.id}`}
                  className="rounded-md bg-[#D97745] py-2 text-center text-xs font-bold text-white hover:bg-[#C46332] transition-colors"
                >
                  View Applicants
                </Link>
                <Link
                  href={`/jobs/${job.id}`}
                  className="rounded-md border border-[#E2DDD5] bg-white py-2 text-center text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
                >
                  Job Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
