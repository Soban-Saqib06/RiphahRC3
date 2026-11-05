"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Sparkles,
  Award,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import type { ApplicationStatus, StatusEventDTO } from "@/lib/dto";

interface StatusActionsProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  onStatusChanged: (newStatus: ApplicationStatus, event: StatusEventDTO) => void;
}

export function StatusActions({
  applicationId,
  currentStatus,
  onStatusChanged,
}: StatusActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<ApplicationStatus | null>(null);
  const [transitionNote, setTransitionNote] = useState("");

  const executeTransition = async (targetStatus: ApplicationStatus) => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          note: transitionNote.trim() || null,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error?.message || `Failed to transition status to ${targetStatus}`
        );
      }

      setConfirmTarget(null);
      setTransitionNote("");
      onStatusChanged(targetStatus, json.data.statusEvent);
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Terminal states have no further transitions
  if (currentStatus === "SELECTED") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#EAF3EC] border border-[#C1DEC6] px-3 py-1.5 text-xs font-semibold text-[#3D784A]">
        <Award className="h-4 w-4" />
        Candidate Selected
      </div>
    );
  }

  if (currentStatus === "REJECTED") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#F8ECEB] border border-[#EFC6C3] px-3 py-1.5 text-xs font-semibold text-[#BA3D35]">
        <XCircle className="h-4 w-4" />
        Application Rejected
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-2 text-xs text-[#BA3D35]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Confirmation Dialog / Drawer */}
      {confirmTarget && (
        <div className="rounded-xl border border-[#D97745]/30 bg-[#FAF8F5] p-3 text-xs space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#242522]">
              Confirm Transition to:{" "}
              <span className="text-[#D97745]">{confirmTarget}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setConfirmTarget(null);
                setTransitionNote("");
                setError(null);
              }}
              className="text-[#77776E] hover:text-[#242522] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <input
            type="text"
            value={transitionNote}
            onChange={(e) => setTransitionNote(e.target.value)}
            placeholder="Optional transition note (e.g. Passed initial screening)"
            maxLength={500}
            className="w-full rounded-md border border-[#E2DDD5] bg-white px-2.5 py-1.5 text-xs text-[#242522] placeholder-[#77776E] focus:border-[#D97745] focus:outline-hidden"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirmTarget(null);
                setTransitionNote("");
              }}
              className="rounded-md border border-[#E2DDD5] bg-white px-2.5 py-1 text-xs font-semibold text-[#77776E] hover:bg-[#FAF8F5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => executeTransition(confirmTarget)}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-3 py-1 text-xs font-bold text-white hover:bg-[#C46332] disabled:opacity-50 cursor-pointer"
            >
              {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
              Confirm
            </button>
          </div>
        </div>
      )}

      {!confirmTarget && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Transitions from PARSED or ASSESSED */}
          {(currentStatus === "PARSED" || currentStatus === "ASSESSED") && (
            <>
              <button
                type="button"
                onClick={() => setConfirmTarget("IN_REVIEW")}
                className="rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                Mark In Review
              </button>
              <button
                type="button"
                onClick={() => setConfirmTarget("SHORTLISTED")}
                className="rounded-md bg-[#D97745] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors cursor-pointer"
              >
                Shortlist
              </button>
              <button
                type="button"
                onClick={() => setConfirmTarget("REJECTED")}
                className="rounded-md border border-[#EFC6C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          )}

          {/* Transitions from IN_REVIEW */}
          {currentStatus === "IN_REVIEW" && (
            <>
              <button
                type="button"
                onClick={() => setConfirmTarget("SHORTLISTED")}
                className="rounded-md bg-[#D97745] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors cursor-pointer"
              >
                Shortlist
              </button>
              <button
                type="button"
                onClick={() => setConfirmTarget("REJECTED")}
                className="rounded-md border border-[#EFC6C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          )}

          {/* Transitions from SHORTLISTED */}
          {currentStatus === "SHORTLISTED" && (
            <>
              <Link
                href={`/interviews?applicationId=${applicationId}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5" />
                Schedule Interview
              </Link>
              <button
                type="button"
                onClick={() => setConfirmTarget("REJECTED")}
                className="rounded-md border border-[#EFC6C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          )}

          {/* Transitions from INTERVIEW */}
          {currentStatus === "INTERVIEW" && (
            <>
              <button
                type="button"
                onClick={() => setConfirmTarget("SELECTED")}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#3D784A] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#32623C] transition-colors cursor-pointer"
              >
                <Award className="h-3.5 w-3.5" />
                Select Candidate
              </button>
              <button
                type="button"
                onClick={() => setConfirmTarget("REJECTED")}
                className="rounded-md border border-[#EFC6C3] bg-white px-3 py-1.5 text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB] transition-colors cursor-pointer"
              >
                Reject
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
