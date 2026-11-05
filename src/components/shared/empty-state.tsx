import React from "react";
import { LucideIcon, FolderSearch } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderSearch,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DDD8CE] bg-[#FAF8F5] p-10 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8E3DA] text-[#D97745] mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#242522]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-[#77776E]">{description}</p>

      {actionLabel && (
        <div className="mt-5">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center rounded-md bg-[#D97745] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center rounded-md bg-[#D97745] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
