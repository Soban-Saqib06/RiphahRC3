"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorDisplay } from "@/components/shared/error-display";
import type { InterviewListItemDTO, InterviewStatus, UserDTO } from "@/lib/dto";

export default function InterviewsPage() {
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [interviews, setInterviews] = useState<InterviewListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = statusFilter !== "ALL"
        ? `/api/interviews?status=${statusFilter}`
        : "/api/interviews";
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load interviews");
      }
      setInterviews(json.data.interviews || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to retrieve interviews schedule");
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    loadInterviews();
  }, [loadInterviews]);

  const filteredInterviews = useMemo(() => {
    if (!searchQuery.trim()) return interviews;
    const q = searchQuery.toLowerCase();
    return interviews.filter(
      (inv) =>
        inv.candidate.name.toLowerCase().includes(q) ||
        inv.job.title.toLowerCase().includes(q) ||
        inv.interviewerName.toLowerCase().includes(q) ||
        inv.type.toLowerCase().includes(q)
    );
  }, [interviews, searchQuery]);

  const handleCancelInterview = async (interviewId: string) => {
    try {
      const res = await fetch(`/api/interviews/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to cancel interview");
      }
      setInterviews((prev) =>
        prev.map((i) => (i.id === interviewId ? { ...i, status: "CANCELLED" } : i))
      );
      setActionNotice("Interview session marked as cancelled.");
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleCompleteInterview = async (interviewId: string) => {
    setSavingFeedback(true);
    try {
      const res = await fetch(`/api/interviews/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          feedbackNotes: feedbackNotes.trim() || "Interview conducted successfully.",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to complete interview");
      }
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === interviewId
            ? {
                ...i,
                status: "COMPLETED",
                feedbackNotes: feedbackNotes.trim() || "Interview conducted successfully.",
              }
            : i
        )
      );
      setCompletingId(null);
      setFeedbackNotes("");
      setActionNotice("Interview marked as completed with feedback recorded.");
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSavingFeedback(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <PageHeader
          title="Interview Schedule"
          description="Track, coordinate, and review scheduled candidate evaluations across all active job openings."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Interviews" },
          ]}
          actions={
            <Link
              href="/applications"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
            >
              Browse Applicants to Schedule
            </Link>
          }
        />

        {actionNotice && (
          <div className="rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-3 text-xs font-semibold text-[#3D784A]">
            {actionNotice}
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-[#E2DDD5] bg-white p-4 shadow-2xs">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Sessions" },
              { id: "SCHEDULED", label: "Scheduled" },
              { id: "COMPLETED", label: "Completed" },
              { id: "CANCELLED", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-[#242522] text-white"
                    : "text-[#77776E] hover:text-[#242522] hover:bg-[#FAF8F5]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#77776E]" />
            <input
              type="text"
              placeholder="Filter by candidate or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#E2DDD5] bg-white pl-8 pr-3 py-1.5 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
            />
          </div>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadInterviews} />}

        {/* Content list */}
        {loading ? (
          <div className="space-y-4 animate-pulse" aria-label="Loading interview schedule">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl border border-[#E2DDD5] bg-white p-5" />
            ))}
          </div>
        ) : filteredInterviews.length === 0 ? (
          <EmptyState
            title="No Interviews Found"
            description={
              statusFilter !== "ALL"
                ? `No interviews currently in ${statusFilter.toLowerCase()} state.`
                : "No candidate interviews scheduled yet. Shortlist applicants to begin coordinating interview sessions."
            }
            icon={Calendar}
            actionLabel="View Applications"
            actionHref="/applications"
          />
        ) : (
          <div className="space-y-4">
            {filteredInterviews.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs hover:border-[#D97745]/40 transition-all space-y-4"
              >
                {/* Header: Candidate, Role, Type and Status */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E2DDD5] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/applications/${inv.applicationId}`}
                        className="text-base font-bold text-[#242522] hover:text-[#D97745] transition-colors inline-flex items-center gap-1.5"
                      >
                        {inv.candidate.name}
                        <ExternalLink className="h-3.5 w-3.5 text-[#77776E]" />
                      </Link>
                      <span className="rounded bg-[#FAF8F5] border border-[#E2DDD5] px-2 py-0.5 text-[11px] font-semibold text-[#77776E]">
                        {inv.job.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#77776E] mt-0.5">
                      Session Format: <strong className="text-[#242522]">{inv.type.replace("_", " ")}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={inv.status} size="md" />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#77776E]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#D97745] shrink-0" />
                    <div>
                      <span className="font-semibold text-[#242522] block">
                        {new Date(inv.scheduledAt).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>
                        {new Date(inv.scheduledAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        ({inv.durationMinutes} min)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#CDC7BD] shrink-0" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider block">Interviewer</span>
                      <strong className="text-[#242522]">{inv.interviewerName}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#CDC7BD] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[11px] uppercase tracking-wider block">Location / Link</span>
                      <span className="text-[#242522] truncate block">
                        {inv.location || "Online Meeting"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feedback Notes (if completed) */}
                {inv.feedbackNotes && (
                  <div className="rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] p-3 text-xs text-[#242522] space-y-1">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-[#77776E] block">
                      Evaluator Feedback Notes
                    </span>
                    <p className="leading-relaxed">{inv.feedbackNotes}</p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2DDD5]">
                  <Link
                    href={`/questions?applicationId=${inv.applicationId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97745] hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Open Interview Question Kit
                  </Link>

                  {inv.status === "SCHEDULED" && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCancelInterview(inv.id)}
                        className="rounded border border-[#E2DDD5] bg-white px-2.5 py-1 text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors"
                      >
                        Cancel Session
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCompletingId(inv.id);
                          setFeedbackNotes("");
                        }}
                        className="rounded bg-[#3D784A] px-3 py-1 text-xs font-bold text-white hover:bg-[#34663e] transition-colors"
                      >
                        Complete with Feedback
                      </button>
                    </div>
                  )}
                </div>

                {/* Completion Feedback Drawer */}
                {completingId === inv.id && (
                  <div className="rounded-xl border border-[#3D784A]/30 bg-[#FAF8F5] p-4 text-xs space-y-3">
                    <h5 className="font-bold text-[#242522]">Record Candidate Feedback</h5>
                    <textarea
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="Enter evaluation summary, recommendations, technical strengths or concerns..."
                      rows={3}
                      maxLength={2000}
                      className="w-full rounded-md border border-[#E2DDD5] bg-white p-2.5 text-xs text-[#242522] focus:border-[#3D784A] focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setCompletingId(null)}
                        className="rounded border border-[#E2DDD5] bg-white px-3 py-1 text-xs text-[#242522]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingFeedback}
                        onClick={() => handleCompleteInterview(inv.id)}
                        className="rounded bg-[#3D784A] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#34663e] disabled:opacity-50"
                      >
                        {savingFeedback ? "Saving..." : "Save Evaluation"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
