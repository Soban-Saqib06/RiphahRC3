"use client";

import React from "react";

interface LiquidScoreCircleProps {
  score: number | null | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function LiquidScoreCircle({
  score,
  size = "md",
  showLabel = true,
  label = "OVERALL MATCH",
  className = "",
}: LiquidScoreCircleProps) {
  const validScore = score !== null && score !== undefined && !isNaN(score)
    ? Math.max(0, Math.min(100, Math.round(score)))
    : null;

  // Dimensions
  const sizeMap = {
    sm: { dimension: 72, fontSize: "text-lg", labelSize: "text-[9px]" },
    md: { dimension: 104, fontSize: "text-2xl", labelSize: "text-[10px]" },
    lg: { dimension: 136, fontSize: "text-3xl", labelSize: "text-xs" },
    xl: { dimension: 168, fontSize: "text-4xl", labelSize: "text-xs" },
  };

  const config = sizeMap[size];
  const fillPercent = validScore ?? 0;
  // Invert fill for SVG coordinate system: y goes from top (100) down to bottom (0)
  const waveTopY = 100 - fillPercent;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative rounded-full overflow-hidden border-[2.5px] border-[#D97745]/30 bg-white shadow-sm flex items-center justify-center select-none"
        style={{
          width: `${config.dimension}px`,
          height: `${config.dimension}px`,
        }}
        role="meter"
        aria-valuenow={validScore ?? 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Match score: ${validScore !== null ? `${validScore}%` : "Not assessed"}`}
      >
        {/* Liquid Container */}
        {validScore !== null && (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-700 ease-out"
            style={{
              clipPath: "circle(50% at 50% 50%)",
            }}
          >
            {/* Liquid Fill with Dual Sine Waves */}
            <svg
              className="absolute w-[200%] h-full left-0 bottom-0 pointer-events-none animate-liquid-wave opacity-85"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              style={{
                top: `${waveTopY}%`,
                height: "100%",
              }}
            >
              <path
                d="M 0,0 C 25,6 35,-6 50,0 C 65,6 75,-6 100,0 C 125,6 135,-6 150,0 C 165,6 175,-6 200,0 L 200,100 L 0,100 Z"
                fill="#D97745"
              />
            </svg>
            <svg
              className="absolute w-[200%] h-full left-0 bottom-0 pointer-events-none animate-liquid-wave-slow opacity-60"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              style={{
                top: `${waveTopY + 2}%`,
                height: "100%",
              }}
            >
              <path
                d="M 0,0 C 20,-5 35,5 50,0 C 65,-5 80,5 100,0 C 115,-5 130,5 150,0 C 165,-5 180,5 200,0 L 200,100 L 0,100 Z"
                fill="#C46332"
              />
            </svg>
          </div>
        )}

        {/* Central Score Text Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-1">
          {validScore !== null ? (
            <span
              className={`${config.fontSize} font-bold tracking-tight ${
                fillPercent > 55 ? "text-white drop-shadow-sm" : "text-[#242522]"
              }`}
            >
              {validScore}%
            </span>
          ) : (
            <span className="text-sm font-semibold text-[#77776E]">N/A</span>
          )}
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-2 font-medium tracking-wider text-[#77776E] uppercase ${config.labelSize}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
