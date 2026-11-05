"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Sparkles,
  RotateCcw,
  AlertTriangle,
  FileCheck2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AssessmentDTO, AssessmentItemDTO } from "@/lib/dto";

interface AssessmentPanelProps {
  applicationId: string;
  initialAssessment?: AssessmentDTO | null;
  onAssessmentUpdated?: (assessment: AssessmentDTO) => void;
}

type DimensionFilter = "ALL" | "SKILLS" | "EXPERIENCE" | "PROJECTS" | "QUALIFICATIONS";

export function AssessmentPanel({
  applicationId,
  initialAssessment,
  onAssessmentUpdated,
}: AssessmentPanelProps) {
  const [assessment, setAssessment] = useState<AssessmentDTO | null>(
    initialAssessment || null
  );
  const [loading, setLoading] = useState<boolean>(!initialAssessment);
  const [reassessing, setReassessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Override Form State
  const [showOverrideForm, setShowOverrideForm] = useState<boolean>(false);
  const [overrideScore, setOverrideScore] = useState<number>(
    initialAssessment?.effectiveScore ?? 75
  );
  const [overrideNote, setOverrideNote] = useState<string>(
    initialAssessment?.override?.note ?? ""
  );
  const [savingOverride, setSavingOverride] = useState<boolean>(false);
  const [overrideSuccess, setOverrideSuccess] = useState<boolean>(false);

  // Filter & Evidence Explorer State
  const [selectedFilter, setSelectedFilter] = useState<DimensionFilter>("ALL");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const fetchAssessment = useCallback(async () => {
    if (!applicationId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${applicationId}`);
      const json = await res.json();
      if (json.success && json.data?.assessment) {
        setAssessment(json.data.assessment);
        setOverrideScore(json.data.assessment.effectiveScore ?? 75);
        setOverrideNote(json.data.assessment.override?.note ?? "");
        onAssessmentUpdated?.(json.data.assessment);
      } else if (!json.success && json.error?.code === "NOT_FOUND") {
        setAssessment(null);
      } else {
        setError(json.error?.message || "Failed to load candidate assessment.");
      }
    } catch {
      setError("Network error while loading assessment.");
    } finally {
      setLoading(false);
    }
  }, [applicationId, onAssessmentUpdated]);

  useEffect(() => {
    if (!initialAssessment) {
      fetchAssessment();
    }
  }, [fetchAssessment, initialAssessment]);

  const handleRunAssessment = async () => {
    setReassessing(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${applicationId}`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success && json.data?.assessment) {
        setAssessment(json.data.assessment);
        setOverrideScore(json.data.assessment.effectiveScore ?? 75);
        setOverrideNote(json.data.assessment.override?.note ?? "");
        onAssessmentUpdated?.(json.data.assessment);
      } else {
        setError(
          json.error?.message || "AI matching assessment failed. Please try again."
        );
      }
    } catch {
      setError("Network error while generating AI assessment.");
    } finally {
      setReassessing(false);
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOverride(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${applicationId}/override`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overrideScore: Number(overrideScore),
          overrideNote: overrideNote.trim() || null,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.assessment) {
        setAssessment(json.data.assessment);
        setShowOverrideForm(false);
        setOverrideSuccess(true);
        setTimeout(() => setOverrideSuccess(false), 3000);
        onAssessmentUpdated?.(json.data.assessment);
      } else {
        setError(json.error?.message || "Failed to save score override.");
      }
    } catch {
      setError("Network error while saving override.");
    } finally {
      setSavingOverride(false);
    }
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Filter items
  const filteredItems = (assessment?.items || []).filter((item: AssessmentItemDTO) => {
    if (selectedFilter === "ALL") return true;
    return item.dimension === selectedFilter;
  });

  // Calculate verified strengths and gaps
  const verifiedStrengths = (assessment?.items || []).filter(
    (i) => i.verdict === "MATCHED" && i.evidenceExcerpt
  );
  const evidenceGaps = (assessment?.items || []).filter(
    (i) => i.verdict === "NOT_EVIDENCED" || i.verdict === "PARTIAL"
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-xs">
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#D97745]" />
          <div>
            <h4 className="text-sm font-bold text-[#242522]">
              Loading AI Candidate Assessment...
            </h4>
            <p className="text-xs text-[#77776E] mt-1">
              Analyzing candidate evidence against vacancy requirements
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty / Not Assessed State
  if (!assessment) {
    return (
      <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-xs text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF2E6] text-[#D97745] mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[#242522]">
          No AI Assessment Generated Yet
        </h3>
        <p className="mx-auto max-w-md text-xs text-[#77776E] mt-1.5 mb-6">
          Compare candidate resume evidence with job requirements using semantic
          matching and the weighted 4-dimension evaluation rubric.
        </p>

        {error && (
          <div className="mx-auto max-w-md mb-6 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-3 text-xs text-[#BA3D35] flex items-center gap-2 text-left">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleRunAssessment}
          disabled={reassessing}
          className="inline-flex items-center gap-2 rounded-md bg-[#D97745] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] disabled:opacity-50 transition-colors"
        >
          {reassessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing Resume Evidence...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Run AI Candidate Matching</span>
            </>
          )}
        </button>
      </div>
    );
  }

  const isOverridden = assessment.override.score !== null;

  return (
    <div className="space-y-6">
      {/* Top Notification Alerts */}
      {error && (
        <div className="rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-3 text-xs font-semibold text-[#BA3D35] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRunAssessment}
            className="underline hover:text-[#9A2D26]"
          >
            Retry
          </button>
        </div>
      )}

      {overrideSuccess && (
        <div className="rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-3 text-xs font-semibold text-[#3D784A] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Recruiter score override saved successfully.</span>
        </div>
      )}

      {/* Two-Column Card: Left Score Breakdown + Right Recruiter Actions */}
      <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2DDD5] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#242522]">
                AI Candidate Match Assessment
              </h3>
              {isOverridden ? (
                <span className="rounded-full bg-[#FAF2E6] border border-[#F3DCB7] px-2.5 py-0.5 text-[10px] font-bold text-[#C9862C]">
                  Recruiter Overridden
                </span>
              ) : (
                <span className="rounded-full bg-[#EAF3EC] border border-[#C1DEC6] px-2.5 py-0.5 text-[10px] font-bold text-[#3D784A]">
                  AI Verified
                </span>
              )}
            </div>
            <p className="text-xs text-[#77776E] mt-0.5">
              Weighted semantic evaluation across 4 dimensions with verbatim resume citations
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOverrideForm(!showOverrideForm)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
            >
              <Sliders className="h-3.5 w-3.5 text-[#D97745]" />
              <span>{showOverrideForm ? "Close Override" : "Override Score"}</span>
            </button>

            <button
              type="button"
              onClick={handleRunAssessment}
              disabled={reassessing}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] disabled:opacity-50 transition-colors"
            >
              {reassessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              <span>{reassessing ? "Analyzing..." : "Re-run AI Matching"}</span>
            </button>
          </div>
        </div>

        {/* Inline Score Override Drawer */}
        {showOverrideForm && (
          <form
            onSubmit={handleSaveOverride}
            className="rounded-xl border border-[#ECC9B6] bg-[#F9ECE5]/40 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522] flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-[#D97745]" />
                Recruiter Manual Score Override
              </h4>
              <span className="text-[11px] text-[#77776E]">
                Original AI score: {assessment.overallScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="overrideScoreInput"
                  className="block text-xs font-semibold text-[#242522] mb-1"
                >
                  Adjusted Score (0–100)
                </label>
                <input
                  id="overrideScoreInput"
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-sm font-bold text-[#242522] focus:border-[#D97745] focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="overrideNoteInput"
                  className="block text-xs font-semibold text-[#242522] mb-1"
                >
                  Recruiter Justification / Decision Rationale
                </label>
                <input
                  id="overrideNoteInput"
                  type="text"
                  placeholder="e.g., Candidate demonstrated equivalent production async experience in technical screening"
                  value={overrideNote}
                  onChange={(e) => setOverrideNote(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#ECC9B6]/60">
              <button
                type="button"
                onClick={() => setShowOverrideForm(false)}
                className="rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#77776E] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingOverride}
                className="rounded-md bg-[#D97745] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#C46332] disabled:opacity-50"
              >
                {savingOverride ? "Saving..." : "Apply Override"}
              </button>
            </div>
          </form>
        )}

        {/* Visual Score Row: Liquid Circle + 4 Breakdown Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Circular Liquid Wave Meter */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl border border-[#ECC9B6]/60 bg-[#F9ECE5]/30">
            <LiquidScoreCircle
              score={assessment.effectiveScore}
              size="lg"
              label={isOverridden ? "EFFECTIVE OVERRIDE" : "OVERALL AI MATCH"}
            />
            {isOverridden && (
              <p className="mt-2 text-[11px] text-[#C9862C] font-semibold text-center">
                AI calculated: {assessment.overallScore}% • Overridden by {assessment.override.by?.name || "Recruiter"}
              </p>
            )}
            {assessment.override.note && (
              <p className="mt-1 text-[11px] italic text-[#77776E] text-center max-w-xs">
                &ldquo;{assessment.override.note}&rdquo;
              </p>
            )}
          </div>

          {/* 4 Rubric Breakdown Bars */}
          <div className="md:col-span-8 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#242522] mb-1">
                <span>1. Skills Match (50% weight)</span>
                <span className="font-bold text-[#D97745]">
                  {assessment.dimensionScores.skills ?? 0}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                <div
                  className="h-full bg-[#D97745] transition-all duration-500"
                  style={{ width: `${assessment.dimensionScores.skills ?? 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#242522] mb-1">
                <span>2. Experience Relevance (25% weight)</span>
                <span className="font-bold text-[#D97745]">
                  {assessment.dimensionScores.experience ?? 0}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                <div
                  className="h-full bg-[#D97745] transition-all duration-500"
                  style={{ width: `${assessment.dimensionScores.experience ?? 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#242522] mb-1">
                <span>3. Project Relevance (15% weight)</span>
                <span className="font-bold text-[#D97745]">
                  {assessment.dimensionScores.projects ?? 0}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                <div
                  className="h-full bg-[#D97745] transition-all duration-500"
                  style={{ width: `${assessment.dimensionScores.projects ?? 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#242522] mb-1">
                <span>4. Qualifications Alignment (10% weight)</span>
                <span className="font-bold text-[#D97745]">
                  {assessment.dimensionScores.qualifications ?? 0}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                <div
                  className="h-full bg-[#D97745] transition-all duration-500"
                  style={{ width: `${assessment.dimensionScores.qualifications ?? 0}%` }}
                />
              </div>
            </div>

            {/* AI Summary Statement */}
            {assessment.summary && (
              <div className="pt-2 text-xs text-[#242522] bg-[#FAF8F5] p-3 rounded-lg border border-[#E2DDD5]">
                <span className="font-bold text-[#77776E] uppercase text-[10px] tracking-wider block mb-1">
                  Executive AI Summary
                </span>
                <p className="leading-relaxed">{assessment.summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Strengths & Evidence Gaps Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Verified Strengths */}
          <div className="rounded-xl border border-[#C1DEC6] bg-[#EAF3EC]/40 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D784A] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Verified Resume Strengths ({verifiedStrengths.length})
            </h4>
            <div className="space-y-1.5">
              {verifiedStrengths.length > 0 ? (
                verifiedStrengths.slice(0, 4).map((s) => (
                  <div key={s.id} className="text-xs text-[#242522] flex items-start gap-1.5">
                    <span className="text-[#3D784A] font-bold">•</span>
                    <span>
                      <strong>{s.requirement}</strong>: {s.reasoning}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#77776E]">No explicit match evidence identified.</p>
              )}
            </div>
          </div>

          {/* Evidence Gaps */}
          <div className="rounded-xl border border-[#F3DCB7] bg-[#FAF2E6]/40 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9862C] flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Evidence Gaps (Needs Verification) ({evidenceGaps.length})
            </h4>
            <div className="space-y-1.5">
              {evidenceGaps.length > 0 ? (
                evidenceGaps.slice(0, 4).map((g) => (
                  <div key={g.id} className="text-xs text-[#242522] flex items-start gap-1.5">
                    <span className="text-[#C9862C] font-bold">•</span>
                    <span>
                      <strong>{g.requirement}</strong>: {g.reasoning}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#77776E]">All vacancy criteria have supporting evidence.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verbatim Evidence Explorer with Dimension Filters */}
      <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2DDD5] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#242522]">
              Verbatim Evidence Trail &amp; Requirement Checks
            </h3>
            <p className="text-xs text-[#77776E]">
              Every claim is traceable to direct excerpts in the uploaded candidate resume
            </p>
          </div>

          {/* Dimension Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E2DDD5]">
            {(
              [
                ["ALL", "All"],
                ["SKILLS", "Skills"],
                ["EXPERIENCE", "Experience"],
                ["PROJECTS", "Projects"],
                ["QUALIFICATIONS", "Qualifications"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedFilter(key)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedFilter === key
                    ? "bg-[#D97745] text-white shadow-xs"
                    : "text-[#77776E] hover:text-[#242522]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#77776E]">
              No evaluation items found for this dimension.
            </div>
          ) : (
            filteredItems.map((item: AssessmentItemDTO) => {
              const isExpanded = expandedItems[item.id] ?? true;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 transition-all hover:border-[#D97745]/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#77776E] bg-white px-2 py-0.5 rounded border border-[#E2DDD5]">
                          {item.dimension}
                        </span>

                        {item.priority && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              item.priority === "REQUIRED"
                                ? "bg-[#F9ECE5] text-[#D97745]"
                                : "bg-[#E8E3DA] text-[#77776E]"
                            }`}
                          >
                            {item.priority} (Weight: {item.importance}/5)
                          </span>
                        )}

                        <span className="font-bold text-sm text-[#242522]">
                          {item.requirement}
                        </span>
                      </div>

                      <p className="text-xs text-[#77776E] mt-1">
                        <strong>Recruiter Note:</strong> {item.reasoning}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={item.verdict} size="sm" />
                      <button
                        type="button"
                        onClick={() => toggleItemExpanded(item.id)}
                        className="p-1 text-[#77776E] hover:text-[#242522]"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Verbatim Excerpt */}
                  {isExpanded && item.evidenceExcerpt && (
                    <div className="mt-3 rounded-md bg-white border border-[#E2DDD5] p-3 text-xs italic text-[#242522] border-l-4 border-l-[#D97745]">
                      &ldquo;{item.evidenceExcerpt}&rdquo;
                      <span className="block not-italic text-[10px] text-[#77776E] mt-1 font-medium">
                        Verified verbatim citation from resume text
                      </span>
                    </div>
                  )}

                  {isExpanded && !item.evidenceExcerpt && item.verdict === "NOT_EVIDENCED" && (
                    <div className="mt-2 text-[11px] text-[#77776E] italic">
                      No explicit verbatim statement found in candidate resume.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* AI Disclaimer */}
        <div className="pt-3 border-t border-[#E2DDD5] flex items-center justify-between text-[11px] text-[#77776E]">
          <div className="flex items-center gap-1.5 italic">
            <Info className="h-3.5 w-3.5 text-[#D97745]" />
            <span>AI-generated recommendation. The recruiter makes the final hiring decision.</span>
          </div>
          <span>Model: {assessment.modelId || "Gemini"}</span>
        </div>
      </div>
    </div>
  );
}

export default AssessmentPanel;
