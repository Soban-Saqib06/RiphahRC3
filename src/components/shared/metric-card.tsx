import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon?: LucideIcon;
  variant?: "warm" | "surface";
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = "warm",
  className = "",
}: MetricCardProps) {
  const bgStyle =
    variant === "warm"
      ? "bg-[#E8E3DA]/70 border-[#DDD8CE]"
      : "bg-white border-[#E2DDD5]";

  return (
    <div
      className={`rounded-xl border p-5 transition-shadow hover:shadow-sm ${bgStyle} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#77776E]">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tight text-[#242522]">
              {value}
            </h3>
            {trend && (
              <span className="text-xs font-semibold text-[#D97745]">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#77776E]">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD8CE] bg-white text-[#D97745] shadow-xs">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
