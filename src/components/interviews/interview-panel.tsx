"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Video,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileEdit,
  MapPin,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorDisplay } from "@/components/shared/error-display";
import type {
  InterviewDTO,
  InterviewType,
  InterviewStatus,
  ApplicationStatus,
} from "@/lib/dto";

interface InterviewPanelProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  candidateName?: string;
  onStatusChanged?: (newStatus: ApplicationStatus) => void;
}

export function InterviewPanel({
  applicationId,
  currentStatus,
  candidateName,
  onStatusChanged,
}: InterviewPanelProps) {
  const [interviews, setInterviews] = useState<InterviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Scheduling Form State
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledAtDate, setScheduledAtDate] = useState("");
  const [scheduledAtTime, setScheduledAtTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [type, setType] = useState<InterviewType>("TECHNICAL");
  const [interviewerName, setInterviewerName] = useState("Maya Hartwell");
  const [location, setLocation] = useState("Google Meet (meet.google.com/talent-eval)");
  const [submitting, setSubmitting] = useState(false);

  // Complete & Feedback Modal State
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [savingFeedback, setSavingFeedback] = useState(false);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/interviews?applicationId=${applicationId}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load interviews");
      }
      setInterviews(json.data.interviews || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const canSchedule = currentStatus === "SHORTLISTED" || currentStatus === "INTERVIEW";

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAtDate || !scheduledAtTime) return;

    const isoString = new Date(`${scheduledAtDate}T${scheduledAtTime}`).toISOString();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          scheduledAt: isoString,
          durationMinutes,
          type,
          interviewerName,
          location: location.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to schedule interview");
      }

      setInterviews((prev) => [...prev, json.data.interview]);
      setShowScheduleForm(false);
      setFeedbackMsg("Interview successfully scheduled.");
      setTimeout(() => setFeedbackMsg(null), 4000);

      if (json.data.applicationStatus && onStatusChanged) {
        onStatusChanged(json.data.applicationStatus);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
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
        throw new Error(json.error?.message || "Failed to update interview");
      }

      setInterviews((prev) =>
        prev.map((inv) => (inv.id === interviewId ? json.data.interview : inv))
      );
      setCompletingId(null);
      setFeedbackNotes("");
      setFeedbackMsg("Interview marked as completed with feedback.");
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSavingFeedback(false);
    }
  };

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
        prev.map((inv) => (inv.id === interviewId ? json.data.interview : inv))
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E2DDD5] bg-[#FAF8F5] p-5 shadow-2xs">
        <div>
          <h3 className="font-heading text-base font-bold text-[#242522] flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#D97745]" />
            Interview Coordination
          </h3>
          <p className="text-xs text-[#77776E] mt-0.5">
            Schedule candidate discussions, assign interviewers, and document post-interview evaluations.
          </p>
        </div>

        {canSchedule && (
          <button
            type="button"
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Interview
          </button>
        )}
      </div>

      {!canSchedule && (
        <div className="rounded-xl border border-[#F3DCB7] bg-[#FAF2E6] p-4 text-xs text-[#C9862C] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Candidate is currently <strong>{currentStatus}</strong>. Shortlist the applicant first before scheduling an interview.
          </span>
        </div>
      )}

      {feedbackMsg && (
        <div className="rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-3 text-xs font-semibold text-[#3D784A]">
          {feedbackMsg}
        </div>
      )}

      {error && <ErrorDisplay message={error} onRetry={fetchInterviews} />}

      {/* Schedule Form */}
      {showScheduleForm && (
        <form
          onSubmit={handleScheduleSubmit}
          className="rounded-2xl border border-[#D97745]/40 bg-white p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-2">
            <h4 className="text-xs font-bold text-[#242522]">
              Schedule New Interview Session
            </h4>
            <button
              type="button"
              onClick={() => setShowScheduleForm(false)}
              className="text-[#77776E] hover:text-[#242522]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Interview Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InterviewType)}
                className="w-full rounded-md border border-[#E2DDD5] bg-white p-2 text-xs text-[#242522]"
              >
                <option value="PHONE_SCREEN">Phone Screen (15-30m)</option>
                <option value="TECHNICAL">Technical Deep Dive</option>
                <option value="HR">HR Culture & Alignment</option>
                <option value="PANEL">Panel / Leadership Review</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Duration (minutes)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-md border border-[#E2DDD5] bg-white p-2 text-xs text-[#242522]"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Date (Future)
              </label>
              <input
                type="date"
                required
                value={scheduledAtDate}
                onChange={(e) => setScheduledAtDate(e.target.value)}
                className="w-full rounded-md border border-[#E2DDD5] bg-white p-2 text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={scheduledAtTime}
                onChange={(e) => setScheduledAtTime(e.target.value)}
                className="w-full rounded-md border border-[#E2DDD5] bg-white p-2 text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Interviewer Name
              </label>
              <input
                type="text"
                required
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                className="w-full rounded-md border border-[#E2DDD5] bg-white p-2 text-xs text-[#242522]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1">
                Location or Video Link
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. meet.google.com/xyz or Room 402"
                className="w-full rounded-md border border-[#E2DDD5] bg-white p-2 text-xs text-[#242522]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
            <button
              type="button"
              onClick={() => setShowScheduleForm(false)}
              className="rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#D97745] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#C46332] disabled:opacity-50"
            >
              {submitting ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </form>
      )}

      {/* Interviews List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl border border-[#E2DDD5] bg-white p-4" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#DDD8CE] bg-[#FAF8F5] p-8 text-center text-xs text-[#77776E]">
          No interviews scheduled yet for this applicant.
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((inv) => (
            <div
              key={inv.id}
              className="rounded-xl border border-[#E2DDD5] bg-white p-5 shadow-2xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DDD5] pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-bold text-sm text-[#242522]">
                    {inv.type.replace("_", " ")}
                  </span>
                  <StatusBadge status={inv.status} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#77776E]">
                  <Clock className="h-3.5 w-3.5 text-[#D97745]" />
                  <span>{new Date(inv.scheduledAt).toLocaleString()} ({inv.durationMinutes} min)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#77776E]">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-[#CDC7BD]" />
                  <span>Interviewer: <strong className="text-[#242522]">{inv.interviewerName}</strong></span>
                </div>
                {inv.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#CDC7BD]" />
                    <span className="truncate">{inv.location}</span>
                  </div>
                )}
              </div>

              {inv.feedbackNotes && (
                <div className="rounded-lg bg-[#FAF8F5] border border-[#E2DDD5] p-3 text-xs text-[#242522] space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#77776E] block">
                    Evaluator Feedback
                  </span>
                  <p>{inv.feedbackNotes}</p>
                </div>
              )}

              {/* Status Actions */}
              {inv.status === "SCHEDULED" && (
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#E2DDD5]">
                  <button
                    type="button"
                    onClick={() => handleCancelInterview(inv.id)}
                    className="rounded border border-[#E2DDD5] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors"
                  >
                    Cancel Session
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCompletingId(inv.id);
                      setFeedbackNotes("");
                    }}
                    className="rounded bg-[#3D784A] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#34663e] transition-colors"
                  >
                    Complete & Add Feedback
                  </button>
                </div>
              )}

              {/* Feedback Input Drawer */}
              {completingId === inv.id && (
                <div className="rounded-xl border border-[#3D784A]/30 bg-[#FAF8F5] p-4 text-xs space-y-3">
                  <h5 className="font-bold text-[#242522]">Record Interview Evaluation</h5>
                  <textarea
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Enter interview evaluation notes, candidate strengths, and recommendations..."
                    rows={3}
                    maxLength={2000}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white p-2.5 text-xs text-[#242522] focus:border-[#3D784A] focus:outline-hidden"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCompletingId(null)}
                      className="rounded border border-[#E2DDD5] bg-white px-2.5 py-1 text-xs text-[#242522]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingFeedback}
                      onClick={() => handleCompleteInterview(inv.id)}
                      className="rounded bg-[#3D784A] px-3 py-1 text-xs font-bold text-white hover:bg-[#34663e]"
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
    </div>
  );
}
