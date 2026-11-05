"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Loader2,
} from "lucide-react";
import type { ResumeSummaryDTO } from "@/lib/dto";

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplyModal({
  jobId,
  jobTitle,
  isOpen,
  onClose,
  onSuccess,
}: ApplyModalProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeSummaryDTO[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [coverNote, setCoverNote] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);

    fetch("/api/resumes")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data?.resumes)) {
          const parsed = json.data.resumes.filter(
            (r: ResumeSummaryDTO) => r.parseStatus === "PARSED"
          );
          setResumes(parsed);
          if (parsed.length > 0) {
            setSelectedResumeId(parsed[0].id);
          }
        }
      })
      .catch(() => setError("Failed to load your resumes."))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resumes.length === 0) {
      setError("Please upload and parse a resume on your profile before applying.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          resumeId: selectedResumeId || null,
          coverNote: coverNote.trim() ? coverNote.trim() : null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Failed to submit application.");
      } else {
        onSuccess();
        router.push("/applications");
      }
    } catch {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242522]/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2DDD5] pb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#242522]">
              Apply for {jobTitle}
            </h3>
            <p className="text-xs text-[#77776E] mt-0.5">
              Select your resume and attach an optional cover note.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#77776E] hover:bg-[#F5F2EC] hover:text-[#242522] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-3 text-xs text-[#BA3D35]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#D97745]" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="my-6 rounded-xl border border-dashed border-[#CDC7BD] bg-[#FAF8F5] p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-[#77776E] mb-2" />
            <h4 className="text-sm font-bold text-[#242522]">
              No parsed resume found
            </h4>
            <p className="text-xs text-[#77776E] mt-1 max-w-xs mx-auto">
              You must upload a readable PDF resume before applying to vacancies.
            </p>
            <Link
              href="/profile"
              className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C46332] transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Resume in Profile
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Resume Selector */}
            <div>
              <label className="block text-xs font-bold text-[#242522] mb-1.5">
                Choose Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full rounded-lg border border-[#CDC7BD] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.originalFileName} (Uploaded {new Date(r.uploadedAt).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-[#77776E]">
                This parsed resume will be semantically matched against job requirements.
              </p>
            </div>

            {/* Cover Note */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#242522]">
                  Cover Note <span className="font-normal text-[#77776E]">(optional)</span>
                </label>
                <span className="text-[11px] text-[#77776E]">
                  {coverNote.length}/1500
                </span>
              </div>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value.slice(0, 1500))}
                rows={4}
                placeholder="Share why you are interested in this vacancy and highlight relevant experience..."
                className="w-full rounded-lg border border-[#CDC7BD] bg-white p-3 text-xs text-[#242522] placeholder:text-[#A19D95] focus:border-[#D97745] focus:outline-hidden resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-[#E2DDD5] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-md border border-[#CDC7BD] bg-white px-4 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || resumes.length === 0}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#C46332] disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
