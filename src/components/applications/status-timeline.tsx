"use client";

import React from "react";
import { Clock, CheckCircle2, User, ArrowRight, FileText } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import type { StatusEventDTO } from "@/lib/dto";

interface StatusTimelineProps {
  events: StatusEventDTO[];
}

export function StatusTimeline({ events }: StatusTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 text-center text-xs text-[#77776E]">
        No status events recorded yet.
      </div>
    );
  }

  // Display newest first
  const sorted = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3">
        <h3 className="font-heading text-sm font-bold text-[#242522]">
          Application Status History
        </h3>
        <span className="text-xs text-[#77776E]">{events.length} event{events.length === 1 ? "" : "s"}</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-[#E2DDD5]">
        {sorted.map((ev, idx) => (
          <div key={ev.id || idx} className="relative flex flex-col gap-1.5">
            {/* Dot */}
            <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-[#D97745]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#D97745]" />
            </div>

            {/* Event Header */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {ev.fromStatus ? (
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={ev.fromStatus} size="sm" />
                  <ArrowRight className="h-3 w-3 text-[#77776E]" />
                  <StatusBadge status={ev.toStatus} size="sm" />
                </div>
              ) : (
                <StatusBadge status={ev.toStatus} size="sm" />
              )}

              <span className="text-[11px] text-[#77776E] ml-auto">
                {new Date(ev.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Event Details */}
            <div className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs space-y-1 mt-1">
              {ev.note ? (
                <p className="text-[#242522] leading-relaxed italic">
                  &ldquo;{ev.note}&rdquo;
                </p>
              ) : (
                <p className="text-[11px] text-[#77776E]">No note provided with this status change.</p>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-[#77776E] pt-1 border-t border-[#E2DDD5]/60">
                <User className="h-3 w-3" />
                <span>
                  Updated by:{" "}
                  <strong className="text-[#242522]">
                    {ev.changedBy?.name || "System Pipeline"}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
