"use client";

import React, { useState } from "react";
import type { SourcingDTO } from "@/types/analytics";

interface SourcingBreakdownProps {
  sourcingData?: SourcingDTO;
  className?: string;
}

export function SourcingBreakdown({
  sourcingData,
  className = "",
}: SourcingBreakdownProps) {
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  // Default breakdown strictly matching wireframe R10
  const defaultBreakdown = [
    { source: "LinkedIn", percentage: 45, color: "#D97745" },
    { source: "Career Page", percentage: 25, color: "#242522" },
    { source: "Referrals", percentage: 15, color: "#C5BAA9" },
    { source: "Agencies", percentage: 10, color: "#7A8599" },
    { source: "Job Boards", percentage: 5, color: "#5A6B82" },
  ];

  const breakdown = sourcingData?.breakdown?.length
    ? sourcingData.breakdown
    : defaultBreakdown;

  const totalShare = sourcingData?.totalShare ?? 45;

  // Donut geometry constants
  const cx = 120;
  const cy = 120;
  const outerR = 88;
  const innerR = 54;

  let currentAngle = -Math.PI / 2; // start from top (12 o'clock)

  const slices = breakdown.map((item) => {
    const sweep = (item.percentage / 100) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle;

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);

    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const largeArc = sweep > Math.PI ? 1 : 0;
    const pathData = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    return {
      ...item,
      pathData,
      startAngle,
      endAngle,
    };
  });

  const activeItem = hoveredSource
    ? breakdown.find((s) => s.source === hoveredSource)
    : null;

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs transition-shadow hover:shadow-sm ${className}`}
    >
      <div>
        <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3 mb-2">
          <h3 className="font-heading text-base font-bold text-[#242522]">
            Sourcing Breakdown
          </h3>
          <span className="text-[11px] font-medium text-[#77776E]">
            Top channel: LinkedIn
          </span>
        </div>

        {/* Title above chart per wireframe R10 */}
        <p className="mt-2 text-center text-xs font-semibold text-[#77776E]">
          Source of Hires
        </p>

        {/* Donut Chart */}
        <div className="relative mx-auto mt-2 flex items-center justify-center">
          <svg
            viewBox="0 0 240 240"
            className="w-52 h-52 select-none overflow-visible"
            aria-label="Sourcing Breakdown Donut Chart"
          >
            {slices.map((slice) => {
              const isHovered = hoveredSource === slice.source;

              return (
                <path
                  key={slice.source}
                  d={slice.pathData}
                  fill={slice.color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered
                      ? "drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                      : "none",
                    opacity: hoveredSource && !isHovered ? 0.65 : 1,
                  }}
                  onMouseEnter={() => setHoveredSource(slice.source)}
                  onMouseLeave={() => setHoveredSource(null)}
                />
              );
            })}

            {/* Central Donut Hole Text matching wireframe R10 "Total (45%)" */}
            {activeItem ? (
              <g className="pointer-events-none transition-all">
                <text
                  x={cx}
                  y={cy - 7}
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-[#77776E]"
                >
                  {activeItem.source}
                </text>
                <text
                  x={cx}
                  y={cy + 13}
                  textAnchor="middle"
                  className="text-base font-extrabold fill-[#242522]"
                >
                  {activeItem.percentage}%
                </text>
              </g>
            ) : (
              <text
                x={cx}
                y={cy + 5}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-bold fill-[#242522] pointer-events-none tracking-tight"
              >
                Total ({totalShare}%)
              </text>
            )}
          </svg>
        </div>

        {/* Legend matching wireframe R10 */}
        <div className="mt-5 space-y-2.5">
          {breakdown.map((item) => {
            const isHovered = hoveredSource === item.source;

            return (
              <div
                key={item.source}
                onMouseEnter={() => setHoveredSource(item.source)}
                onMouseLeave={() => setHoveredSource(null)}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                  isHovered ? "bg-[#F5F2EC]" : "hover:bg-[#FAF8F5]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full flex-shrink-0 transition-transform"
                    style={{
                      backgroundColor: item.color,
                      transform: isHovered ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                  <span
                    className={`font-medium ${
                      isHovered ? "text-[#242522] font-semibold" : "text-[#242522]"
                    }`}
                  >
                    {item.source} ({item.percentage}%)
                  </span>
                </div>
                {isHovered && (
                  <span className="text-[11px] text-[#D97745] font-semibold">
                    Primary
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E8E3DA]/80 text-[11px] text-[#77776E] flex justify-between">
        <span>Direct Sourced: 70%</span>
        <span>Third-Party: 30%</span>
      </div>
    </div>
  );
}
