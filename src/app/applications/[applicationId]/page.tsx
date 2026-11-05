"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FileText,
  Sparkles,
  Calendar,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { AssessmentPanel } from "@/components/assessments/assessment-panel";
import { RecruiterNotes } from "@/components/applications/recruiter-notes";
import { StatusActions } from "@/components/applications/status-actions";
import { StatusTimeline } from "@/components/applications/status-timeline";
import { ResumeViewer } from "@/components/applications/resume-viewer";
import { CandidateTracker } from "@/components/applications/candidate-tracker";
import type {
  ApplicationDetailDTO,
  CandidateApplicationDTO,
  UserDTO,
  ApplicationStatus,
  StatusEventDTO,
} from "@/lib/dto";

type TabKey = "assessment" | "resume" | "timeline" | "interviews";

function ApplicationDetailContent() {
  const params = useParams();
  const applicationId = params?.applicationId as string;

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [candidateApp, setCandidateApp] = useState<CandidateApplicationDTO | null>(null);
  const [recruiterApp, setRecruiterApp] = useState<ApplicationDetailDTO | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("assessment");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    if (!applicationId) return;
    try {
      const res = await fetch(`/api/applications/${applicationId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load application");
      }

      const app = json.data?.application;
      if ("displayStatus" in app && "timeline" in app) {
        setCandidateApp(app as CandidateApplicationDTO);
      } else {
        setRecruiterApp(app as ApplicationDetailDTO);
      }
    } catch (err: any) {
      setError(err.message || "Could not retrieve application details");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    // 1. Fetch authenticated user
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch application
    fetchApplication();
  }, [fetchApplication]);

  const handleStatusChanged = (
    newStatus: ApplicationStatus,
    newEvent: StatusEventDTO
  ) => {
    setRecruiterApp((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: newStatus,
        statusEvents: [newEvent, ...prev.statusEvents],
      };
    });
    setFeedback(`Application status transitioned to ${newStatus}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const isCandidate = currentUser?.role === "CANDIDATE";

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#D97745]" />
            <p className="text-xs text-[#77776E]">Loading application requisition...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#EFC6C3] bg-white p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8ECEB] text-[#BA3D35]">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-[#242522]">
              Application Not Found
            </h3>
            <p className="text-xs text-[#77776E] max-w-md mx-auto">{error}</p>
            <Link
              href="/applications"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#242522] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#3A3B37]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Applications
            </Link>
          </div>
        ) : isCandidate && candidateApp ? (
          <CandidateTracker application={candidateApp} />
        ) : recruiterApp ? (
          <>
            <PageHeader
              title={recruiterApp.profile?.name || recruiterApp.candidate.name}
              description={`Applicant for ${recruiterApp.job.title} • Submitted ${new Date(recruiterApp.submittedAt).toLocaleDateString()}`}
              breadcrumbs={[
                { label: "Candidates", href: `/applications?jobId=${recruiterApp.jobId}` },
                { label: recruiterApp.profile?.name || recruiterApp.candidate.name },
              ]}
              actions={
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={recruiterApp.status} size="md" />
                  <StatusActions
                    applicationId={applicationId}
                    currentStatus={recruiterApp.status}
                    onStatusChanged={handleStatusChanged}
                  />
                </div>
              }
            />

            {feedback && (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-3 text-xs font-semibold text-[#3D784A]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Candidate Info & Private Notes (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Candidate Profile Summary */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3.5 border-b border-[#E2DDD5] pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8E3DA] text-lg font-bold text-[#242522]">
                      {(recruiterApp.profile?.name || recruiterApp.candidate.name).charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[#242522]">
                        {recruiterApp.profile?.name || recruiterApp.candidate.name}
                      </h3>
                      <p className="text-xs text-[#77776E]">
                        {recruiterApp.profile?.headline || "Applicant"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#77776E]">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#CDC7BD]" />
                      <span className="text-[#242522]">{recruiterApp.candidate.email}</span>
                    </div>

                    {recruiterApp.profile?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#CDC7BD]" />
                        <span className="text-[#242522]">{recruiterApp.profile.phone}</span>
                      </div>
                    )}

                    {recruiterApp.profile?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#CDC7BD]" />
                        <span className="text-[#242522]">{recruiterApp.profile.location}</span>
                      </div>
                    )}

                    {(recruiterApp.profile?.linkedinUrl || recruiterApp.profile?.githubUrl) && (
                      <div className="flex items-center gap-3 pt-2 border-t border-[#E2DDD5]">
                        {recruiterApp.profile?.linkedinUrl && (
                          <a
                            href={recruiterApp.profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97745] hover:underline"
                          >
                            LinkedIn <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {recruiterApp.profile?.githubUrl && (
                          <a
                            href={recruiterApp.profile.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97745] hover:underline"
                          >
                            GitHub <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile completeness bar */}
                  {recruiterApp.profile?.profileCompleteness !== undefined && (
                    <div className="pt-2 border-t border-[#E2DDD5]">
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span className="text-[#77776E]">Profile Completeness</span>
                        <span className="text-[#242522]">{recruiterApp.profile.profileCompleteness}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                        <div
                          className="h-full bg-[#3D784A]"
                          style={{ width: `${recruiterApp.profile.profileCompleteness}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Link Card */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#77776E]">
                      Position Applied
                    </span>
                    <Link
                      href={`/jobs/${recruiterApp.job.id}`}
                      className="text-[11px] font-semibold text-[#D97745] hover:underline"
                    >
                      View Job Details
                    </Link>
                  </div>
                  <h4 className="font-bold text-[#242522] text-sm">
                    {recruiterApp.job.title}
                  </h4>
                  <p className="text-[#77776E]">
                    {recruiterApp.job.department} • {recruiterApp.job.location} • {recruiterApp.job.employmentType.replace("_", " ")}
                  </p>
                </div>

                {/* Recruiter Private Notes Component */}
                <RecruiterNotes
                  applicationId={applicationId}
                  initialNotes={recruiterApp.recruiterNotes}
                  onNotesUpdated={(notes) =>
                    setRecruiterApp((prev) => (prev ? { ...prev, recruiterNotes: notes } : null))
                  }
                />
              </div>

              {/* Right Column: Tabbed Evidence, Assessment, Resume & History (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Tab Navigation */}
                <div className="rounded-2xl border border-[#E2DDD5] bg-white p-2 shadow-xs">
                  <div className="flex flex-wrap gap-1.5 border-b border-[#E2DDD5] pb-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("assessment")}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "assessment"
                          ? "bg-[#D97745] text-white"
                          : "text-[#77776E] hover:text-[#242522] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Match Assessment
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("resume")}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "resume"
                          ? "bg-[#D97745] text-white"
                          : "text-[#77776E] hover:text-[#242522] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Resume & Details
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("timeline")}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "timeline"
                          ? "bg-[#D97745] text-white"
                          : "text-[#77776E] hover:text-[#242522] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Status History ({recruiterApp.statusEvents?.length || 0})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("interviews")}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        activeTab === "interviews"
                          ? "bg-[#D97745] text-white"
                          : "text-[#77776E] hover:text-[#242522] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Interviews & Questions
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="p-2">
                    {activeTab === "assessment" && (
                      <AssessmentPanel
                        applicationId={applicationId}
                        initialAssessment={recruiterApp.assessment}
                        onAssessmentUpdated={(updated) =>
                          setRecruiterApp((prev) =>
                            prev ? { ...prev, assessment: updated } : null
                          )
                        }
                      />
                    )}

                    {activeTab === "resume" && (
                      <ResumeViewer
                        resume={recruiterApp.resume}
                        coverNote={recruiterApp.coverNote}
                      />
                    )}

                    {activeTab === "timeline" && (
                      <StatusTimeline events={recruiterApp.statusEvents || []} />
                    )}

                    {activeTab === "interviews" && (
                      <div className="space-y-6">
                        <div className="rounded-2xl border border-[#E2DDD5] bg-[#FAF8F5] p-5 text-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-[#242522]">
                              Interview Preparation & Questions
                            </h4>
                            <span className="rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-[#D97745] border border-[#E2DDD5]">
                              {recruiterApp.questionCount} Questions Available
                            </span>
                          </div>
                          <p className="text-[#77776E] leading-relaxed">
                            Generate and review structured interview questions tailored to this candidate&apos;s verified resume evidence and assessment gaps.
                          </p>
                          <div className="pt-2">
                            <Link
                              href={`/questions?applicationId=${applicationId}`}
                              className="inline-flex items-center gap-1.5 rounded-md bg-[#242522] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#3A3B37]"
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                              Open Question Generator
                            </Link>
                          </div>
                        </div>

                        {/* Scheduled Interviews List */}
                        {recruiterApp.interviews && recruiterApp.interviews.length > 0 ? (
                          <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs space-y-3">
                            <h4 className="font-bold text-xs text-[#242522] border-b border-[#E2DDD5] pb-2">
                              Scheduled Interviews ({recruiterApp.interviews.length})
                            </h4>
                            <div className="space-y-2">
                              {recruiterApp.interviews.map((inv) => (
                                <div
                                  key={inv.id}
                                  className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs space-y-1"
                                >
                                  <div className="flex justify-between items-center font-bold text-[#242522]">
                                    <span>{inv.type.replace("_", " ")}</span>
                                    <span className="text-[11px] font-normal text-[#77776E]">
                                      {new Date(inv.scheduledAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#77776E]">
                                    Interviewer: {inv.interviewerName || "Unassigned"} • Duration: {inv.durationMinutes} min
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-center text-xs text-[#77776E]">
                            No interviews scheduled yet. Shortlist this candidate to schedule an interview.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default function ApplicationDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-[#F5F2EC] items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#D97745]" />
            <p className="text-xs text-[#77776E]">Loading application...</p>
          </div>
        </div>
      }
    >
      <ApplicationDetailContent />
    </Suspense>
  );
}
