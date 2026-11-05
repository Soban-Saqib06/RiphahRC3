import React from "react";

export type StatusVariant =
  | "OPEN"
  | "CLOSED"
  | "DRAFT"
  | "SUBMITTED"
  | "PARSED"
  | "ASSESSED"
  | "IN_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED"
  | "MATCHED"
  | "PARTIAL"
  | "NOT_EVIDENCED";

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  // Job statuses
  OPEN: {
    label: "Active",
    bg: "bg-[#EAF3EC]",
    text: "text-[#3D784A]",
    dot: "bg-[#3D784A]",
    border: "border-[#C1DEC6]",
  },
  CLOSED: {
    label: "Closed",
    bg: "bg-[#E8E3DA]",
    text: "text-[#77776E]",
    dot: "bg-[#77776E]",
    border: "border-[#DDD8CE]",
  },
  DRAFT: {
    label: "Draft",
    bg: "bg-[#FAF2E6]",
    text: "text-[#C9862C]",
    dot: "bg-[#C9862C]",
    border: "border-[#F3DCB7]",
  },

  // Application statuses
  SUBMITTED: {
    label: "Submitted",
    bg: "bg-[#EDF3F7]",
    text: "text-[#4A6B82]",
    dot: "bg-[#4A6B82]",
    border: "border-[#BED1DF]",
  },
  PARSED: {
    label: "Parsed",
    bg: "bg-[#EDF3F7]",
    text: "text-[#4A6B82]",
    dot: "bg-[#4A6B82]",
    border: "border-[#BED1DF]",
  },
  ASSESSED: {
    label: "Assessed",
    bg: "bg-[#FAF2E6]",
    text: "text-[#C9862C]",
    dot: "bg-[#C9862C]",
    border: "border-[#F3DCB7]",
  },
  IN_REVIEW: {
    label: "In Review",
    bg: "bg-[#FAF2E6]",
    text: "text-[#C9862C]",
    dot: "bg-[#C9862C]",
    border: "border-[#F3DCB7]",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    bg: "bg-[#F9ECE5]",
    text: "text-[#D97745]",
    dot: "bg-[#D97745]",
    border: "border-[#ECC9B6]",
  },
  INTERVIEW: {
    label: "Interview",
    bg: "bg-[#F9ECE5]",
    text: "text-[#D97745]",
    dot: "bg-[#D97745]",
    border: "border-[#ECC9B6]",
  },
  SELECTED: {
    label: "Selected",
    bg: "bg-[#EAF3EC]",
    text: "text-[#3D784A]",
    dot: "bg-[#3D784A]",
    border: "border-[#C1DEC6]",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-[#F8ECEB]",
    text: "text-[#BA3D35]",
    dot: "bg-[#BA3D35]",
    border: "border-[#EFC6C3]",
  },

  // Evidence Verdicts
  MATCHED: {
    label: "Matched",
    bg: "bg-[#EAF3EC]",
    text: "text-[#3D784A]",
    dot: "bg-[#3D784A]",
    border: "border-[#C1DEC6]",
  },
  PARTIAL: {
    label: "Partial Evidence",
    bg: "bg-[#FAF2E6]",
    text: "text-[#C9862C]",
    dot: "bg-[#C9862C]",
    border: "border-[#F3DCB7]",
  },
  NOT_EVIDENCED: {
    label: "No Evidence",
    bg: "bg-[#F8ECEB]",
    text: "text-[#BA3D35]",
    dot: "bg-[#BA3D35]",
    border: "border-[#EFC6C3]",
  },
};

export function StatusBadge({
  status,
  label,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const normalized = status.toUpperCase();
  const config = statusConfig[normalized] || {
    label: status,
    bg: "bg-[#E8E3DA]",
    text: "text-[#242522]",
    dot: "bg-[#77776E]",
    border: "border-[#DDD8CE]",
  };

  const displayText = label || config.label;
  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span>{displayText}</span>
    </span>
  );
}
