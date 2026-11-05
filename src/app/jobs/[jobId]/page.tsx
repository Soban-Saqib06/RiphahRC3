"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Briefcase,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { ApplyModal } from "@/components/candidate/apply-modal";
import type { JobDetailDTO, UserDTO } from "@/lib/dto";

function JobDetailContent() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [job, setJob] = useState<JobDetailDTO | null>(null);
  const [myApplication, setMyApplication] = useState<{ id: string; status: string } | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success) setCurrentUser(json.data.user);
      })
      .catch(() => {});

    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  const loadJob = () => {
    setLoading(true);
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.job) {
          setJob(json.data.job);
          if (json.data.myApplication) {
            setMyApplication(json.data.myApplication);
          }
        } else {
          setError(json.error?.message || "Failed to load vacancy");
        }
      })
      .catch(() => setError("Network error loading job details"))
      .finally(() => setLoading(false));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const handleToggleStatus = async () => {
    if (!job) return;
    const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Failed to update status");
      } else {
        setJob(json.data.job);
      }
    } catch {
      setError("Network error updating status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    if (!confirm("Are you sure you want to delete this vacancy?")) return;

    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Failed to delete vacancy");
      } else {
        router.push("/jobs");
      }
    } catch {
      setError("Network error deleting vacancy");
    } finally {
      setActionLoading(false);
    }
  };

  const isRecruiter = currentUser?.role === "RECRUITER";

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} onLogout={handleLogout} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#D97745] border-t-transparent" />
          </div>
        ) : !job ? (
          <div className="rounded-xl border border-[#EFC6C3] bg-[#F8ECEB] p-6 text-center text-sm text-[#BA3D35]">
            <p className="font-semibold">{error || "Vacancy not found"}</p>
            <Link
              href="/jobs"
              className="mt-3 inline-block rounded-md bg-[#BA3D35] px-4 py-1.5 text-xs font-semibold text-white"
            >
              Back to Vacancies
            </Link>
          </div>
        ) : (
          <>
            <PageHeader
              title={job.title}
              description={`Requisition ID: ${job.id} • Posted by ${job.recruiter?.name ?? "Recruitment Team"}`}
              breadcrumbs={[
                { label: "Jobs", href: "/jobs" },
                { label: job.title },
              ]}
              actions={
                <div className="flex items-center gap-3">
                  <StatusBadge status={job.status} />

                  {isRecruiter && (
                    <>
                      <button
                        type="button"
                        onClick={handleToggleStatus}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#CDC7BD] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                      >
                        {job.status === "OPEN" ? (
                          <>
                            <Lock className="h-3.5 w-3.5 text-[#BA3D35]" />
                            <span>Close Vacancy</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3.5 w-3.5 text-[#3D784A]" />
                            <span>Reopen Vacancy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={actionLoading}
                        className="p-1.5 text-[#77776E] hover:text-[#BA3D35] transition-colors cursor-pointer"
                        title="Delete vacancy"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <Link
                        href={`/applications?jobId=${job.id}`}
                        className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
                      >
                        Review Applicants ({job.applicantCount})
                      </Link>
                    </>
                  )}

                  {!isRecruiter && (
                    myApplication ? (
                      <span className="rounded-md bg-[#FAF8F5] border border-[#E2DDD5] px-3 py-1.5 text-xs font-semibold text-[#3D784A]">
                        Applied: {myApplication.status}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsApplyModalOpen(true)}
                        className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors cursor-pointer"
                      >
                        Apply for Position
                      </button>
                    )
                  )}
                </div>
              }
            />

            {error && (
              <div className="mb-6 rounded-xl border border-[#EFC6C3] bg-[#F8ECEB] p-4 text-xs text-[#BA3D35]">
                {error}
              </div>
            )}

            {/* METRICS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-1">
                  Total Applicants
                </p>
                <h3 className="text-3xl font-extrabold text-[#242522]">
                  {job.applicantCount}
                </h3>
                <p className="text-xs text-[#77776E] mt-1">Submitted applications</p>
              </div>

              <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5]/60 p-6 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#D97745] mb-1">
                  Required Skills
                </p>
                <h3 className="text-3xl font-extrabold text-[#D97745]">
                  {job.skills.filter((s) => s.priority === "REQUIRED").length}
                </h3>
                <p className="text-xs text-[#77776E] mt-1">Key technical requirements</p>
              </div>

              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-1">
                  Experience Target
                </p>
                <h3 className="text-3xl font-extrabold text-[#242522]">
                  {job.minYearsExperience}+ yrs
                </h3>
                <p className="text-xs text-[#77776E] mt-1">Minimum professional experience</p>
              </div>
            </div>

            {/* DETAILS WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#242522] mb-3">
                      Job Specifications
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-[#FAF8F5] border border-[#E2DDD5] rounded-xl p-4">
                      <div>
                        <span className="text-[#77776E] block">Department:</span>
                        <span className="font-bold text-[#242522]">{job.department}</span>
                      </div>
                      <div>
                        <span className="text-[#77776E] block">Location:</span>
                        <span className="font-bold text-[#242522]">{job.location}</span>
                      </div>
                      <div>
                        <span className="text-[#77776E] block">Employment:</span>
                        <span className="font-bold text-[#242522]">{job.employmentType.replace("_", " ")}</span>
                      </div>
                      <div>
                        <span className="text-[#77776E] block">Min Experience:</span>
                        <span className="font-bold text-[#242522]">{job.minYearsExperience} Years</span>
                      </div>
                      <div>
                        <span className="text-[#77776E] block">Compensation:</span>
                        <span className="font-bold text-[#242522]">
                          {job.salaryMin && job.salaryMax
                            ? `${job.salaryCurrency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                            : "Negotiable"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#77776E] block">Created:</span>
                        <span className="font-bold text-[#242522]">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#242522] mb-2">Description</h4>
                    <p className="text-sm text-[#77776E] leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#242522] mb-2">Required Qualifications</h4>
                    <p className="text-sm text-[#77776E]">
                      {job.requiredQualifications || "None specified"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#242522] mb-3">Skills &amp; Importance Weights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {job.skills.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#D97745]" />
                            <span className="font-bold text-[#242522]">{s.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                s.priority === "REQUIRED"
                                  ? "bg-[#D97745] text-white"
                                  : "bg-[#E8E3DA] text-[#242522]"
                              }`}
                            >
                              {s.priority}
                            </span>
                            <span className="text-[10px] text-[#77776E]">
                              Weight {s.importance}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Rail */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5] p-6 text-center space-y-3">
                  <Sparkles className="h-6 w-6 text-[#D97745] mx-auto" />
                  <h4 className="text-sm font-bold text-[#242522]">AI Talent Intelligence</h4>
                  <p className="text-xs text-[#77776E] leading-relaxed">
                    Evaluates applicant resumes against the {job.skills.length} skills and qualifications configured for this requisition.
                  </p>
                  {isRecruiter && (
                    <Link
                      href={`/applications?jobId=${job.id}`}
                      className="w-full inline-block rounded-md bg-[#D97745] py-2 text-xs font-bold text-white hover:bg-[#C46332] transition-colors"
                    >
                      Inspect Applicant Match Scores
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {job && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            setIsApplyModalOpen(false);
            loadJob();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC]">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#D97745] border-t-transparent" />
        </div>
      }
    >
      <JobDetailContent />
    </Suspense>
  );
}
