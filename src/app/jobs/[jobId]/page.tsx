"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import type { JobDetailDTO } from "@/lib/dto";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.jobId as string;
  const [job, setJob] = useState<JobDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.job) {
          setJob(json.data.job);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  const displayJob = job || {
    id: jobId,
    title: "Backend Developer",
    department: "Engineering",
    location: "Lahore (Hybrid)",
    employmentType: "FULL_TIME" as const,
    salaryMin: 250000,
    salaryMax: 400000,
    salaryCurrency: "PKR",
    status: "OPEN" as const,
    description:
      "Design, implement, and maintain high-scale distributed backend services using Python, Django, and PostgreSQL. Deploy multi-container architectures with Docker.",
    minYearsExperience: 3,
    requiredQualifications:
      "Bachelor's degree in Computer Science, Software Engineering or equivalent experience.",
    applicantCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closedAt: null,
    recruiter: { id: "recruiter-maya", name: "Maya Hartwell" },
    skills: [
      { id: "s1", name: "Python", priority: "REQUIRED" as const, importance: 5 },
      { id: "s2", name: "Django", priority: "REQUIRED" as const, importance: 5 },
      { id: "s3", name: "PostgreSQL", priority: "REQUIRED" as const, importance: 4 },
      { id: "s4", name: "Docker", priority: "REQUIRED" as const, importance: 3 },
      { id: "s5", name: "REST API design", priority: "PREFERRED" as const, importance: 3 },
    ],
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
          title={displayJob.title}
          description={`Requisition ID: ${displayJob.id} • Posted by ${displayJob.recruiter.name}`}
          breadcrumbs={[
            { label: "Jobs", href: "/jobs" },
            { label: displayJob.title },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <StatusBadge status={displayJob.status} />
              <Link
                href={`/applications?jobId=${displayJob.id}`}
                className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
              >
                Review Applicants ({displayJob.applicantCount})
              </Link>
            </div>
          }
        />

        {/* METRICS ROW (Wireframe R04) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-1">
              Total Applicants
            </p>
            <h3 className="text-3xl font-extrabold text-[#242522]">
              {displayJob.applicantCount}
            </h3>
            <p className="text-xs text-[#77776E] mt-1">Active applicants in review</p>
          </div>

          <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5]/60 p-6 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D97745] mb-1">
              Top AI Match Score
            </p>
            <h3 className="text-3xl font-extrabold text-[#D97745]">94%</h3>
            <p className="text-xs text-[#77776E] mt-1">Verified with resume citations</p>
          </div>

          <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-1">
              Days Open
            </p>
            <h3 className="text-3xl font-extrabold text-[#242522]">7</h3>
            <p className="text-xs text-[#77776E] mt-1">Active requisition cycle</p>
          </div>
        </div>

        {/* TWO-COLUMN DETAILS WORKSPACE (Wireframe R04) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#242522] mb-3">
                  Job Specifications &amp; Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-4">
                  <div>
                    <span className="text-[#77776E] block">Department:</span>
                    <span className="font-bold text-[#242522]">{displayJob.department}</span>
                  </div>
                  <div>
                    <span className="text-[#77776E] block">Location:</span>
                    <span className="font-bold text-[#242522]">{displayJob.location}</span>
                  </div>
                  <div>
                    <span className="text-[#77776E] block">Employment:</span>
                    <span className="font-bold text-[#242522]">{displayJob.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-[#77776E] block">Min Experience:</span>
                    <span className="font-bold text-[#242522]">{displayJob.minYearsExperience} Years</span>
                  </div>
                  <div>
                    <span className="text-[#77776E] block">Compensation:</span>
                    <span className="font-bold text-[#242522]">
                      {displayJob.salaryCurrency} {displayJob.salaryMin?.toLocaleString()} - {displayJob.salaryMax?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#242522] mb-2">Description</h4>
                <p className="text-sm text-[#77776E] leading-relaxed whitespace-pre-line">
                  {displayJob.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#242522] mb-2">Qualifications</h4>
                <p className="text-sm text-[#77776E]">
                  {displayJob.requiredQualifications || "None specified"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#242522] mb-3">Required Tech Stack &amp; Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {displayJob.skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] border border-[#E2DDD5] px-3 py-1 text-xs font-semibold text-[#242522]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D97745]" />
                      <span>{s.name}</span>
                      <span className="text-[10px] text-[#77776E]">({s.priority})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Rail (4 cols) matching R04 */}
          <div className="lg:col-span-4 space-y-6">
            {/* Candidate Funnel per wireframe R04 */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#242522] mb-4">Candidate Funnel</h3>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg bg-[#E8E3DA] p-2.5 text-center font-bold text-[#242522]">
                  Applied ({displayJob.applicantCount})
                </div>
                <div className="rounded-lg bg-[#D97745] p-2.5 text-center font-bold text-white">
                  Assessed ({displayJob.applicantCount})
                </div>
                <div className="rounded-lg bg-[#C46332] p-2 text-center font-bold text-white">
                  Shortlisted (1)
                </div>
                <div className="rounded-lg bg-[#FAF8F5] border border-[#E2DDD5] p-1.5 text-center font-medium text-[#77776E]">
                  Interview (0)
                </div>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5] p-6 text-center space-y-3">
              <Sparkles className="h-6 w-6 text-[#D97745] mx-auto" />
              <h4 className="text-sm font-bold text-[#242522]">AI Talent Screening Active</h4>
              <p className="text-xs text-[#77776E]">
                Semantic matching evaluates all applicant resumes against requirements automatically.
              </p>
              <Link
                href={`/applications?jobId=${displayJob.id}`}
                className="w-full inline-block rounded-md bg-[#D97745] py-2 text-xs font-bold text-white hover:bg-[#C46332]"
              >
                Inspect Applicants
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
