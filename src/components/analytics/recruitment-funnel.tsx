"use client";

import React, { useState } from "react";
import type { FunnelDTO } from "@/types/analytics";

interface RecruitmentFunnelProps {
  funnelData?: FunnelDTO;
  className?: string;
}

export function RecruitmentFunnel({
  funnelData,
  className = "",
}: RecruitmentFunnelProps) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  // Default values strictly matching wireframe R10
  const appliedCount = funnelData?.applied?.count ?? 250;
  const screenedCount = funnelData?.screened?.count ?? 180;
  const interviewedCount = funnelData?.interviewed?.count ?? 95;
  const offerCount = funnelData?.offer?.count ?? 30;
  const hiredCount = funnelData?.hired?.count ?? 22;

  const convScreened =
    funnelData?.screened?.conversionRate ?? "72% Conversion to Screened";
  const convInterviewed =
    funnelData?.interviewed?.conversionRate ?? "62% Conversion to Screened";
  const convOffer =
    funnelData?.offer?.conversionRate ?? "30% Conversion to Interview";
  const convHired =
    funnelData?.hired?.conversionRate ?? "5% Conversion to Hired";

  const stages = [
    {
      id: "applied",
      label: "Applied",
      count: appliedCount,
      color: "#242522",
      hoverColor: "#181916",
      polygon: "136,20 374,20 354,74 156,74",
      labelY: 48,
      connectorY: 47,
      connectorEndX: 142,
      numberY: 53,
      conversionNext: convScreened,
      conversionY: 94,
      percentageOfApplied: "100%",
    },
    {
      id: "screened",
      label: "Screened",
      count: screenedCount,
      color: "#5E3A24",
      hoverColor: "#4A2D1B",
      polygon: "164,106 346,106 326,160 184,160",
      labelY: 134,
      connectorY: 133,
      connectorEndX: 170,
      numberY: 139,
      conversionNext: convInterviewed,
      conversionY: 180,
      percentageOfApplied: `${Math.round((screenedCount / appliedCount) * 100)}%`,
    },
    {
      id: "interviewed",
      label: "Interviewed",
      count: interviewedCount,
      color: "#A8542B",
      hoverColor: "#8D4421",
      polygon: "190,192 320,192 304,246 206,246",
      labelY: 220,
      connectorY: 219,
      connectorEndX: 194,
      numberY: 225,
      conversionNext: convOffer,
      conversionY: 266,
      percentageOfApplied: `${Math.round((interviewedCount / appliedCount) * 100)}%`,
    },
    {
      id: "offer",
      label: "Offer",
      count: offerCount,
      color: "#D97745",
      hoverColor: "#C26636",
      polygon: "210,278 300,278 288,332 222,332",
      labelY: 306,
      connectorY: 305,
      connectorEndX: 214,
      numberY: 311,
      conversionNext: convHired,
      conversionY: 352,
      percentageOfApplied: `${Math.round((offerCount / appliedCount) * 100)}%`,
    },
    {
      id: "hired",
      label: "Hired",
      count: hiredCount,
      color: "#E88C5D",
      hoverColor: "#D67A4B",
      polygon: "224,364 286,364 280,418 230,418",
      labelY: 392,
      connectorY: 391,
      connectorEndX: 226,
      numberY: 397,
      conversionNext: null,
      conversionY: null,
      percentageOfApplied: `${((hiredCount / appliedCount) * 100).toFixed(1)}%`,
    },
  ];

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs transition-shadow hover:shadow-sm ${className}`}
    >
      <div>
        <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3 mb-2">
          <h3 className="font-heading text-base font-bold text-[#242522]">
            Recruitment Pipeline Funnel
          </h3>
          <span className="text-[11px] font-medium text-[#77776E]">
            Overall: {((hiredCount / appliedCount) * 100).toFixed(1)}% Hired
          </span>
        </div>

        <div className="relative w-full">
          <svg
            viewBox="0 0 380 445"
            className="w-full h-auto select-none overflow-visible"
            aria-label="Recruitment Pipeline Funnel Diagram"
          >
            {stages.map((stage) => {
              const isHovered = hoveredStage === stage.id;

              return (
                <g
                  key={stage.id}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  {/* Left Label & Count */}
                  <text
                    x="76"
                    y={stage.labelY - 5}
                    textAnchor="end"
                    className="text-[12px] font-semibold fill-[#242522]"
                  >
                    {stage.label}
                  </text>
                  <text
                    x="76"
                    y={stage.labelY + 9}
                    textAnchor="end"
                    className="text-[11px] font-medium fill-[#77776E]"
                  >
                    ({stage.count})
                  </text>

                  {/* Horizontal Connector Line */}
                  <line
                    x1="82"
                    y1={stage.connectorY}
                    x2={stage.connectorEndX}
                    y2={stage.connectorY}
                    stroke="#E2DDD5"
                    strokeWidth="1.2"
                    strokeDasharray={isHovered ? "none" : "2,2"}
                  />

                  {/* Trapezoid Funnel Block */}
                  <polygon
                    points={stage.polygon}
                    fill={isHovered ? stage.hoverColor : stage.color}
                    stroke={isHovered ? "#242522" : "transparent"}
                    strokeWidth="1.5"
                    className="transition-all duration-200 drop-shadow-xs"
                  />

                  {/* Centered Number inside Funnel Block */}
                  <text
                    x="255"
                    y={stage.numberY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[15px] font-bold fill-white tracking-wide pointer-events-none"
                  >
                    {stage.count}
                  </text>

                  {/* Conversion Rate Label in between tiers */}
                  {stage.conversionNext && stage.conversionY && (
                    <text
                      x="255"
                      y={stage.conversionY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-medium fill-[#77776E] pointer-events-none"
                    >
                      {stage.conversionNext}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Dynamic Stage Insights Footer */}
      <div className="mt-4 pt-3 border-t border-[#E8E3DA]/80 flex items-center justify-between text-xs text-[#77776E]">
        {hoveredStage ? (
          (() => {
            const current = stages.find((s) => s.id === hoveredStage);
            return (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-[#242522]">
                  {current?.label}: {current?.count} candidates
                </span>
                <span className="text-[#D97745] font-semibold">
                  {current?.percentageOfApplied} of total applicants
                </span>
              </div>
            );
          })()
        ) : (
          <div className="flex items-center justify-between w-full text-[11px]">
            <span>Top of funnel: {appliedCount}</span>
            <span className="text-[#D97745] font-medium">
              Final hires: {hiredCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
