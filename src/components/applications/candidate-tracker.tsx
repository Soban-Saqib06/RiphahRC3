"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MessageSquare,
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import type { CandidateApplicationDTO } from "@/lib/dto";

interface CandidateTrackerProps {
  application: CandidateApplicationDTO;
}

export function CandidateTracker({ application }: CandidateTrackerProps) {
  return (
    <>
      <PageHeader
        title={application.job.title}
        description={`Application #${application.id.slice(0, 8)} • ${application.job.department}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Applications", href: "/applications" },
          { label: "Status Tracker" },
        ]}
        actions={
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#CDC7BD] bg-white px-3.5 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Applications
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                  Current Stage
                </span>
                <h3 className="font-heading text-xl font-bold text-[#242522] mt-0.5">
                  {application.displayStatus}
                </h3>
              </div>
              <StatusBadge status={application.status} size="md" />
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-4">
              Application Progress
            </h4>

            <div className="space-y-4">
              {application.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF3EC] text-[#3D784A] shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#242522]">
                      <span>{step.displayStatus}</span>
                      <span className="text-[11px] font-normal text-[#77776E]">
                        {new Date(step.at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#77776E] mt-0.5">
                      Stage updated in recruitment workflow.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews Card */}
          {application.upcomingInterviews && application.upcomingInterviews.length > 0 && (
            <div className="rounded-2xl border border-[#ECC9B6] bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#D97745] mb-3">
                <Calendar className="h-4 w-4" />
                <span>Scheduled Interviews</span>
              </div>
              <div className="space-y-3">
                {application.upcomingInterviews.map((inv) => (
                  <div
                    key={inv.id}
                    className="rounded-xl border border-[#ECC9B6] bg-[#F9ECE5] p-4 text-xs"
                  >
                    <div className="flex items-start justify-between font-bold text-[#242522]">
                      <span>{inv.type.replace("_", " ")}</span>
                      <span className="rounded bg-white px-2 py-0.5 text-[10px] text-[#D97745]">
                        {inv.durationMinutes} min
                      </span>
                    </div>
                    <p className="text-[#77776E] mt-1">
                      Date: {new Date(inv.scheduledAt).toLocaleString()}
                    </p>
                    {inv.location && (
                      <p className="text-[#77776E] mt-0.5">
                        Location: {inv.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Requisition & Cover Note */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-3 text-xs">
            <h4 className="font-heading text-sm font-bold text-[#242522] border-b border-[#E2DDD5] pb-2">
              Position Overview
            </h4>
            <div className="space-y-2 text-[#77776E]">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-[#CDC7BD]" />
                <span>
                  Department: <strong className="text-[#242522]">{application.job.department}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#CDC7BD]" />
                <span>
                  Location: <strong className="text-[#242522]">{application.job.location}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#CDC7BD]" />
                <span>
                  Type: <strong className="text-[#242522]">{application.job.employmentType.replace("_", " ")}</strong>
                </span>
              </div>
              {application.job.salaryMin && application.job.salaryMax && (
                <div className="pt-2 border-t border-[#E2DDD5] font-semibold text-[#242522]">
                  Salary: {application.job.salaryCurrency}{" "}
                  {application.job.salaryMin.toLocaleString()} - {application.job.salaryMax.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {application.coverNote && (
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
              <h4 className="font-heading text-sm font-bold text-[#242522] mb-2 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#D97745]" />
                Your Cover Note
              </h4>
              <p className="text-xs text-[#242522] leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E2DDD5]">
                {application.coverNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
