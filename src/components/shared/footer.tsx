import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E2DDD5] bg-[#FAF8F5] text-[#242522]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D97745] text-white">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-[#242522]">
                TalentPilot
              </span>
            </div>
            <p className="max-w-sm text-sm text-[#77776E] leading-relaxed">
              Empowering recruiters with AI-driven intelligence for fairer, faster hiring.
              Evidence-based evaluation with full human decision control.
            </p>
            <div className="pt-2 text-xs text-[#77776E]">
              &copy; 2026 TalentPilot Systems. Academic Prototype.
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
              Product
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-[#77776E]">
              <li>
                <Link href="/#capabilities" className="hover:text-[#D97745] transition-colors">
                  Resume Parsing
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-[#D97745] transition-colors">
                  AI Matching Engine
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#D97745] transition-colors">
                  Interview Builder
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#D97745] transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
              Workflows
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-[#77776E]">
              <li>
                <Link href="/jobs" className="hover:text-[#D97745] transition-colors">
                  Job Requisitions
                </Link>
              </li>
              <li>
                <Link href="/applications" className="hover:text-[#D97745] transition-colors">
                  Candidate Pipelines
                </Link>
              </li>
              <li>
                <Link href="/comparison" className="hover:text-[#D97745] transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link href="/interviews" className="hover:text-[#D97745] transition-colors">
                  Schedule Interviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Ethics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522]">
              AI Ethics
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-[#77776E]">
              <li>Verbatim Evidence</li>
              <li>Anti-Bias Safeguards</li>
              <li>Recruiter Authority</li>
              <li>Explainable Scores</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#E2DDD5] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77776E] gap-4">
          <p>Built for the RC3 Web Development Competition.</p>
          <div className="flex gap-6">
            <span>Next.js App Router</span>
            <span>Prisma MySQL</span>
            <span>Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
