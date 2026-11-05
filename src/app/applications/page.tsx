"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Columns,
  List,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import type { ApplicationSummaryDTO } from "@/lib/dto";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationSummaryDTO[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.applications) {
          setApplications(json.data.applications);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const demoCandidates = [
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
          title="Candidate Pipeline"
          description="Review parsed applicants, inspect match scores, and progress candidates across recruitment stages."
          actions={
            <div className="flex items-center gap-2">
              <Link
                href="/comparison?jobId=job-backend-dev&applicationIds=app-ethan-backend,app-priya-backend,app-jonas-backend"
                className="inline-flex items-center gap-1.5 rounded-md border border-[#CDC7BD] bg-white px-3.5 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
              >
                Compare Candidates
              </Link>
            </div>
          }
        />

        {/* TOOLBAR per wireframe R05 */}
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
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* KANBAN STAGES per wireframe R05 */}
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stage 1: New / In Review */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#77776E] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
                  New Applicants
                </h3>
                <span className="rounded-full bg-[#E8E3DA] px-2 py-0.5 text-[11px] font-bold text-[#77776E]">
                  1
                </span>
              </div>

              <div className="space-y-3">
                {demoCandidates
                  .filter((c) => c.status === "SUBMITTED")
                  .map((cand) => (
                    <CandidateCard key={cand.id} candidate={cand} />
                  ))}
              </div>
            </div>

            {/* Stage 2: AI Screened */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#D97745] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D97745]">
                  AI Screened
                </h3>
                <span className="rounded-full bg-[#F9ECE5] px-2 py-0.5 text-[11px] font-bold text-[#D97745]">
                  2
                </span>
              </div>

              <div className="space-y-3">
                {demoCandidates
                  .filter((c) => c.status === "PARSED")
                  .map((cand) => (
                    <CandidateCard key={cand.id} candidate={cand} />
                  ))}
              </div>
            </div>

            {/* Stage 3: Shortlisted */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#D97745] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
                  Shortlisted
                </h3>
                <span className="rounded-full bg-[#E8E3DA] px-2 py-0.5 text-[11px] font-bold text-[#242522]">
                  1
                </span>
              </div>

              <div className="space-y-3">
                {demoCandidates
                  .filter((c) => c.status === "SHORTLISTED")
                  .map((cand) => (
                    <CandidateCard key={cand.id} candidate={cand} />
                  ))}
              </div>
            </div>

            {/* Stage 4: Interview / Decided */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#3D784A] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D784A]">
                  Interview &amp; Decision
                </h3>
                <span className="rounded-full bg-[#EAF3EC] px-2 py-0.5 text-[11px] font-bold text-[#3D784A]">
                  1
                </span>
              </div>
              <div className="space-y-3">
                {demoCandidates
                  .filter((c) => c.status === "REJECTED")
                  .map((cand) => (
                    <CandidateCard key={cand.id} candidate={cand} />
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="rounded-2xl border border-[#E2DDD5] bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E2DDD5] text-[#77776E] uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-bold">Candidate</th>
                  <th className="p-4 font-bold">Target Vacancy</th>
                  <th className="p-4 font-bold">Match Score</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Applied</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD5]">
                {demoCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#E8E3DA] font-bold flex items-center justify-center text-[#242522]">
                          {cand.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#242522]">{cand.name}</p>
                          <p className="text-[11px] text-[#77776E]">{cand.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#242522]">{cand.jobTitle}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-[#F9ECE5] px-2.5 py-1 text-xs font-bold text-[#D97745]">
                        {cand.matchScore}%
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={cand.status} size="sm" />
                    </td>
                    <td className="p-4 text-[#77776E]">{cand.appliedTime}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/applications/${cand.id}`}
                        className="rounded-md bg-[#D97745] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#C46332]"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: any }) {
  return (
    <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs hover:border-[#D97745]/60 transition-all space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#242522]">{candidate.name}</h4>
          <p className="text-xs text-[#77776E]">{candidate.role}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8E3DA] font-bold text-xs text-[#242522]">
          {candidate.name.charAt(0)}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="rounded-full bg-[#F9ECE5] border border-[#ECC9B6] px-2.5 py-0.5 text-xs font-bold text-[#D97745]">
          {candidate.matchScore}% Match
        </span>
        <span className="text-[10px] text-[#77776E]">{candidate.appliedTime}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {candidate.skills.slice(0, 3).map((s: string) => (
          <span
            key={s}
            className="rounded bg-[#FAF8F5] border border-[#E2DDD5] px-2 py-0.5 text-[10px] font-medium text-[#77776E]"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="pt-2 border-t border-[#E2DDD5]">
        <Link
          href={`/applications/${candidate.id}`}
          className="w-full flex items-center justify-center gap-1 rounded-md bg-[#FAF8F5] border border-[#E2DDD5] py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#D97745] hover:text-white transition-colors"
        >
          <span>Inspect Evidence</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
