"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  ExternalLink,
  Briefcase,
  FileText,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorDisplay } from "@/components/shared/error-display";
import type { ComparisonDTO, UserDTO } from "@/lib/dto";

function ComparisonContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const applicationIdsParam = searchParams.get("applicationIds");

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [data, setData] = useState<ComparisonDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedExcerpts, setExpandedExcerpts] = useState<Record<string, boolean>>({});

  const toggleExcerpt = (key: string) => {
    setExpandedExcerpts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const loadData = () => {
    if (!jobId || !applicationIdsParam) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `/api/comparison?jobId=${encodeURIComponent(jobId)}&applicationIds=${encodeURIComponent(
        applicationIdsParam
      )}`
    )
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(
            json?.error?.message || "Failed to load candidate comparison data"
          );
        }
        setData(json.data);
      })
      .catch((err) => {
        setError(err.message || "An unexpected error occurred");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // 1. Fetch authenticated user for Navbar
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});

    // 2. Fetch comparison data
    loadData();
  }, [jobId, applicationIdsParam]);

  // Determine top score for neutral highlight
  const topScore = useMemo(() => {
    if (!data || data.candidates.length === 0) return null;
    const scores = data.candidates
      .map((c) => c.effectiveScore)
      .filter((s): s is number => s !== null && s !== undefined);
    if (scores.length === 0) return null;
    return Math.max(...scores);
  }, [data]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <PageHeader
          title="Candidate Comparison"
          description={
            data?.job?.title
              ? `Side-by-side evaluation of candidates for ${data.job.title}`
              : "Directly compare applicant competencies, experience, and verified citations."
          }
          breadcrumbs={[
            { label: "Applications", href: "/applications" },
            { label: "Comparison Matrix" },
          ]}
        />

        {/* 1. Missing query params empty state */}
        {!jobId || !applicationIdsParam ? (
          <EmptyState
            title="Select Candidates to Compare"
            description="Select 2 to 4 candidates from the applications list to compare their verified skills, experience, and citations side-by-side."
            icon={BarChart3}
            actionLabel="View Applications"
            actionHref="/applications"
          />
        ) : loading ? (
          /* 2. Loading Skeleton */
          <div className="space-y-6 animate-pulse" aria-label="Loading comparison data">
            <div className="h-10 w-64 rounded-md bg-[#E8E3DA]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl border border-[#E2DDD5] bg-white p-6 space-y-4"
                >
                  <div className="h-6 w-32 rounded bg-[#E8E3DA]" />
                  <div className="mx-auto h-24 w-24 rounded-full bg-[#FAF8F5]" />
                  <div className="h-4 w-full rounded bg-[#E8E3DA]" />
                  <div className="h-8 w-full rounded bg-[#E8E3DA]" />
                </div>
              ))}
            </div>
            <div className="h-64 rounded-2xl border border-[#E2DDD5] bg-white p-6" />
          </div>
        ) : error ? (
          /* 3. Error state */
          <ErrorDisplay
            title="Unable to load comparison"
            message={error}
            onRetry={loadData}
          />
        ) : data ? (
          /* 4. Comparison Results */
          <div className="space-y-8">
            {/* Top Bar with Job Badge & Scope */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E2DDD5] bg-white px-5 py-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF8F5] border border-[#E2DDD5] text-[#D97745]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#242522]">
                    {data.job.title}
                  </h2>
                  <p className="text-xs text-[#77776E]">
                    Comparing {data.candidates.length} candidates against role criteria
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/applications?jobId=${data.job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
                >
                  <span>All Applicants</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#77776E]" />
                </Link>
              </div>
            </div>

            {/* Candidate Side-by-Side Cards */}
            <div
              className={`grid gap-6 ${
                data.candidates.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : data.candidates.length === 4
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {data.candidates.map((cand) => {
                const isHighest =
                  topScore !== null &&
                  cand.effectiveScore !== null &&
                  cand.effectiveScore === topScore;

                return (
                  <div
                    key={cand.applicationId}
                    className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all ${
                      isHighest
                        ? "border-[#D97745] ring-1 ring-[#D97745]/30"
                        : "border-[#E2DDD5] hover:border-[#D97745]/40"
                    }`}
                  >
                    <div className="space-y-5">
                      {/* Header with Name & Status */}
                      <div className="flex items-start justify-between gap-3 border-b border-[#E2DDD5] pb-4">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-[#242522] truncate">
                            {cand.candidateName}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <StatusBadge status={cand.status} size="sm" />
                            {cand.totalYearsExperience !== null && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#77776E]">
                                <Clock className="h-3 w-3" />
                                {cand.totalYearsExperience} yrs exp
                              </span>
                            )}
                          </div>
                        </div>

                        {isHighest && (
                          <span className="shrink-0 rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#3D784A] border border-[#C1DEC6]">
                            Highest score
                          </span>
                        )}
                      </div>

                      {/* Score Indicator */}
                      <div className="flex justify-center py-2">
                        <LiquidScoreCircle
                          score={cand.effectiveScore}
                          size="md"
                          showLabel={true}
                          label="Overall Match"
                        />
                      </div>

                      {/* Dimension Scores Breakdown */}
                      {cand.dimensionScores ? (
                        <div className="space-y-2 rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] p-3 text-xs">
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Skills Match</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.skills !== null
                                ? `${cand.dimensionScores.skills}%`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Experience</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.experience !== null
                                ? `${cand.dimensionScores.experience}%`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Projects</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.projects !== null
                                ? `${cand.dimensionScores.projects}%`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[#242522]">
                            <span className="text-[#77776E]">Qualifications</span>
                            <span className="font-semibold">
                              {cand.dimensionScores.qualifications !== null
                                ? `${cand.dimensionScores.qualifications}%`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] p-3 text-center text-xs text-[#77776E]">
                          Assessment not completed
                        </div>
                      )}

                      {/* Summary Excerpt */}
                      {cand.summary && (
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#77776E]">
                            Assessment Summary
                          </h4>
                          <p className="text-xs text-[#242522] leading-relaxed line-clamp-3">
                            {cand.summary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-5 border-t border-[#E2DDD5] mt-5">
                      <Link
                        href={`/applications/${cand.applicationId}`}
                        className="block w-full rounded-md bg-[#D97745] py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
                      >
                        Review Application
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TECHNICAL RUBRIC MATRIX */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2DDD5] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#242522]">
                    Technical Competencies & Rubric Matrix
                  </h3>
                  <p className="text-xs text-[#77776E]">
                    Side-by-side verification of requirement matches and verbatim resume evidence
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#77776E]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#3D784A]" />
                  <span>Matched</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-[#C9862C] ml-2" />
                  <span>Partial</span>
                  <span className="inline-block h-2 w-2 rounded-full bg-[#BA3D35] ml-2" />
                  <span>No Evidence</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E2DDD5] text-[#77776E] uppercase">
                    <tr>
                      <th className="p-3.5 font-bold min-w-[200px]">Requirement</th>
                      <th className="p-3.5 font-bold min-w-[120px]">Criteria</th>
                      {data.candidates.map((c) => (
                        <th
                          key={c.applicationId}
                          className="p-3.5 font-bold text-[#242522] min-w-[220px]"
                        >
                          {c.candidateName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5]">
                    {data.matrix.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-3.5 align-top">
                          <span className="font-bold text-[#242522] block">
                            {row.requirement}
                          </span>
                          <span className="text-[10px] text-[#77776E] uppercase">
                            {row.dimension}
                          </span>
                        </td>
                        <td className="p-3.5 align-top">
                          {row.priority ? (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                row.priority === "REQUIRED"
                                  ? "bg-[#F9ECE5] text-[#D97745]"
                                  : "bg-[#FAF8F5] text-[#77776E] border border-[#E2DDD5]"
                              }`}
                            >
                              {row.priority} {row.importance ? `(${row.importance}/5)` : ""}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#77776E]">Baseline</span>
                          )}
                        </td>
                        {row.cells.map((cell, cellIdx) => {
                          const excerptKey = `${rowIdx}-${cellIdx}`;
                          const isExpanded = expandedExcerpts[excerptKey];

                          return (
                            <td key={cell.applicationId} className="p-3.5 align-top space-y-2">
                              {cell.verdict ? (
                                <StatusBadge status={cell.verdict} size="sm" />
                              ) : (
                                <span className="text-[11px] text-[#77776E]">Pending</span>
                              )}

                              {cell.evidenceExcerpt && (
                                <div className="mt-1">
                                  <div
                                    className={`rounded-md bg-[#FAF8F5] border border-[#E2DDD5] p-2 text-[11px] italic text-[#242522] leading-snug ${
                                      !isExpanded ? "line-clamp-2" : ""
                                    }`}
                                  >
                                    &ldquo;{cell.evidenceExcerpt}&rdquo;
                                  </div>
                                  {cell.evidenceExcerpt.length > 80 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleExcerpt(excerptKey)}
                                      className="mt-1 text-[10px] font-semibold text-[#D97745] hover:underline flex items-center gap-0.5"
                                    >
                                      {isExpanded ? (
                                        <>
                                          Show less <ChevronUp className="h-3 w-3" />
                                        </>
                                      ) : (
                                        <>
                                          Read full citation <ChevronDown className="h-3 w-3" />
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PROJECT EVIDENCE SECTION (when any candidate has assessed project items) */}
            {data.projects.some((p) => p.items.length > 0) && (
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-[#E2DDD5] pb-4">
                  <h3 className="text-base font-bold text-[#242522]">
                    Evaluated Project Portfolios
                  </h3>
                  <p className="text-xs text-[#77776E]">
                    Assessment of relevant projects and hands-on deliverables extracted from resumes
                  </p>
                </div>

                <div
                  className={`grid gap-6 ${
                    data.candidates.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : data.candidates.length === 4
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  {data.projects.map((candProjects) => {
                    const candidate = data.candidates.find(
                      (c) => c.applicationId === candProjects.applicationId
                    );

                    return (
                      <div
                        key={candProjects.applicationId}
                        className="space-y-4 rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4"
                      >
                        <h4 className="text-xs font-bold text-[#242522] border-b border-[#E2DDD5] pb-2">
                          {candidate?.candidateName}
                        </h4>

                        {candProjects.items.length === 0 ? (
                          <p className="text-xs text-[#77776E] italic py-2">
                            No evaluated projects for this candidate.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {candProjects.items.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-lg border border-[#E2DDD5] bg-white p-3 space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-xs text-[#242522]">
                                    {item.requirement}
                                  </span>
                                  <StatusBadge status={item.verdict} size="sm" />
                                </div>
                                {item.evidenceExcerpt && (
                                  <p className="text-[11px] italic text-[#77776E] bg-[#FAF8F5] p-1.5 rounded border border-[#E2DDD5]">
                                    &ldquo;{item.evidenceExcerpt}&rdquo;
                                  </p>
                                )}
                                {item.reasoning && (
                                  <p className="text-[11px] text-[#242522]">
                                    {item.reasoning}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Decision Support Disclaimer (RULE 236 / RULES.md 7.6) */}
            <div className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 text-center">
              <p className="text-xs text-[#77776E] flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D97745]" />
                AI-generated. The recruiter makes the final decision.
              </p>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-[#F5F2EC] items-center justify-center p-8 text-xs text-[#77776E]">
          Loading comparison...
        </div>
      }
    >
      <ComparisonContent />
    </Suspense>
  );
}
