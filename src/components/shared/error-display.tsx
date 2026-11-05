import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorDisplayProps) {
  return (
    <div
      className={`rounded-xl border border-[#EFC6C3] bg-[#F8ECEB] p-6 text-center ${className}`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#BA3D35]/15 text-[#BA3D35] mb-3">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-[#BA3D35]">{title}</h3>
      <p className="mt-1 text-xs text-[#77776E] max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-[#E2DDD5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#242522] shadow-2xs hover:bg-[#FAF8F5] transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#D97745]" />
          Try Again
        </button>
      )}
    </div>
  );
}
