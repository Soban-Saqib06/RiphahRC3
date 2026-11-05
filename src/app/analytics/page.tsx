"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  Filter as FunnelIcon,
  Brain,
  ListChecks,
  TrendingUp,
  Minus,
  Briefcase,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { RecruitmentFunnel } from "@/components/analytics/recruitment-funnel";
import { SourcingBreakdown } from "@/components/analytics/sourcing-breakdown";
import { TalentClusterMap } from "@/components/analytics/talent-cluster-map";
import type { AnalyticsDTO } from "@/types/analytics";
import type { UserDTO } from "@/lib/dto";

export default function AnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch current user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json?.success && json.data?.user) {
          setCurrentUser(json.data.user);
        }
      })
      .catch(() => {});
  }, [router]);

  // 2. Fetch analytics data for current job selection
  const fetchAnalytics = useCallback(async (jobId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = jobId
        ? `/api/analytics?jobId=${encodeURIComponent(jobId)}`
        : "/api/analytics";

      const res = await fetch(url);
      const json = await res.json();

      if (json.success && json.data) {
        setAnalyticsData(json.data);
      } else {
        setError(json.error?.message || "Failed to load analytics data");
      }
    } catch {
      setError("Network error connecting to analytics service");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(selectedJobId);
  }, [fetchAnalytics, selectedJobId]);

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    if (jobId) {
      router.replace(`/analytics?jobId=${encodeURIComponent(jobId)}`, {
        scroll: false,
      });
    } else {
      router.replace("/analytics", { scroll: false });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch {
      router.push("/auth/login");
    }
  };

  // Safe defaults matching wireframe R10 in case of partial payloads
  const kpis = analyticsData?.kpis || {
    timeToHire: { value: 34, unit: "Days", trend: "+5% from last month" },
    applicantConversion: { value: 22, unit: "%", trend: "+2% from last month" },
    aiMatchAccuracy: { value: 88, unit: "%", trend: "+3% from last month" },
    activeRequisitions: { value: 45, unit: "", trend: "Stable" },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      {/* Top Navbar */}
      <Navbar user={currentUser} onLogout={handleLogout} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header matching wireframe R10 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242522]">
              Recruitment &amp; Talent Analytics
            </h1>
            <p className="mt-1 text-sm text-[#77776E]">
              Insights and Performance Overview
            </p>
          </div>

          {/* Job Filter Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedJobId}
                onChange={(e) => handleJobChange(e.target.value)}
                className="appearance-none rounded-xl border border-[#E2DDD5] bg-white py-2 pl-3.5 pr-9 text-xs font-semibold text-[#242522] shadow-xs focus:border-[#D97745] focus:outline-none focus:ring-1 focus:ring-[#D97745]"
              >
                <option value="">All Requisitions (Overview)</option>
                {analyticsData?.availableJobs?.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.applicantCount} applicants)
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#77776E]" />
            </div>

            <button
              type="button"
              onClick={() => fetchAnalytics(selectedJobId)}
              className="flex items-center gap-1.5 rounded-xl border border-[#E2DDD5] bg-white px-3 py-2 text-xs font-semibold text-[#77776E] shadow-xs hover:bg-[#F5F2EC] hover:text-[#242522] transition-colors"
              title="Refresh Analytics"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !analyticsData ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#D97745] border-t-transparent" />
              <p className="text-xs text-[#77776E]">
                Analyzing recruitment pipeline &amp; talent clusters...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="my-8 rounded-2xl border border-[#EFC6C3] bg-[#F8ECEB] p-8 text-center text-sm text-[#BA3D35]">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => fetchAnalytics(selectedJobId)}
              className="mt-4 rounded-lg bg-[#BA3D35] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9E332C] transition-colors"
            >
              Retry Loading Analytics
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top 4 KPI Cards (Wireframe R10) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Card 1: Time to Hire */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#77776E]">
                    Time to Hire
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D97745]/30 bg-[#FDF7F4] text-[#D97745]">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-extrabold tracking-tight text-[#242522]">
                    {kpis.timeToHire.value}{" "}
                    <span className="text-xl font-bold text-[#77776E]">
                      {kpis.timeToHire.unit}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#D97745]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{kpis.timeToHire.trend}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Applicant Conversion */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#77776E]">
                    Applicant Conversion
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D97745]/30 bg-[#FDF7F4] text-[#D97745]">
                    <FunnelIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-extrabold tracking-tight text-[#242522]">
                    {kpis.applicantConversion.value}
                    {kpis.applicantConversion.unit}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#D97745]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{kpis.applicantConversion.trend}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: AI Match Accuracy */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#77776E]">
                    AI Match Accuracy
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D97745]/30 bg-[#FDF7F4] text-[#D97745]">
                    <Brain className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-extrabold tracking-tight text-[#242522]">
                    {kpis.aiMatchAccuracy.value}
                    {kpis.aiMatchAccuracy.unit}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#D97745]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{kpis.aiMatchAccuracy.trend}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Active Requisitions */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs transition-shadow hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold text-[#77776E]">
                    Active Requisitions
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D97745]/30 bg-[#FDF7F4] text-[#D97745]">
                    <ListChecks className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-extrabold tracking-tight text-[#242522]">
                    {kpis.activeRequisitions.value}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#77776E]">
                    <Minus className="h-3.5 w-3.5" />
                    <span>{kpis.activeRequisitions.trend}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Visualizations Grid (Wireframe R10) */}
            {/* Left: Pipeline Funnel (1 col) | Middle: Sourcing (1 col) | Right: Talent Cluster Map (2 cols) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Funnel Card */}
              <div className="lg:col-span-1">
                <RecruitmentFunnel funnelData={analyticsData?.funnel} />
              </div>

              {/* Sourcing Breakdown Card */}
              <div className="lg:col-span-1">
                <SourcingBreakdown sourcingData={analyticsData?.sourcing} />
              </div>

              {/* Talent Cluster Map (takes 2 cols in desktop layout) */}
              <div className="lg:col-span-2">
                <TalentClusterMap clusterMapData={analyticsData?.clusterMap} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
