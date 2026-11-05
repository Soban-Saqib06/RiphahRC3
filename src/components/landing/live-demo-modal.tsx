"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Play,
  CheckCircle2,
  Cpu,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Users,
  Loader2,
  Lock,
} from "lucide-react";

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrollToDemo: () => void;
}

export function LiveDemoModal({ isOpen, onClose, onScrollToDemo }: LiveDemoModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<"tour" | "sandbox">("tour");
  const [tourStep, setTourStep] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync open state with native <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Handle native cancel (Esc key)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  // Handle click outside dialog window
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  // Instant 1-click recruiter login
  const handleInstantRecruiterLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "recruiter@demo.example",
          password: "Demo@12345",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onClose();
        router.push("/dashboard");
      } else {
        setLoginError(data.error?.message || "Failed to initialize demo session. Please try regular login.");
      }
    } catch {
      setLoginError("Could not connect to demo server. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Instant 1-click candidate login
  const handleInstantCandidateLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "candidate1@demo.example",
          password: "Demo@12345",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onClose();
        router.push("/jobs");
      } else {
        setLoginError(data.error?.message || "Failed to initialize candidate session.");
      }
    } catch {
      setLoginError("Could not connect to demo server. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const tourSteps = [
    {
      title: "1. Verified Resume Parsing",
      badge: "DATA EXTRACTION",
      icon: FileText,
      description:
        "TalentPilot processes PDF resumes through an optical and semantic parser, extracting verifiable work history, production tech stacks, and quantifiable achievements with exact verbatim quotes.",
      details: [
        "Verbatim text citation mapped directly to resume page numbers",
        "Semantic ontology recognizing FastAPI / Django equivalence",
        "Deterministic data contracts matching Prisma schema",
      ],
      previewSnippet:
        '“Led architecture and development of high-throughput distributed microservices in Python & Django, serving 12M requests/day.”',
      previewCategory: "Backend Architecture",
      previewConfidence: "95% Match",
    },
    {
      title: "2. Transparent 50/25/15/10 Rubric",
      badge: "EXPLAINABLE AI",
      icon: Cpu,
      description:
        "No opaque black boxes. Match scores are strictly computed via the published rubric: 50% Skills, 25% Experience Relevance, 15% Project Depth, and 10% Qualification alignment.",
      details: [
        "Interactive liquid score indicator bound to evidence",
        "Zero arbitrary visual rankings or hallucinations",
        "Recruiter-adjustable role skill priorities and thresholds",
      ],
      previewSnippet:
        '“Architected PostgreSQL database with partitioned tables and optimized indexing for sub-10ms queries.”',
      previewCategory: "Database Engineering",
      previewConfidence: "92% Match",
    },
    {
      title: "3. Evidence-Grounded Verification",
      badge: "FAIRNESS & INTEGRITY",
      icon: ShieldCheck,
      description:
        "Missing information is never fabricated. Gaps are clearly flagged as 'Unverified Evidence', giving the recruiter explicit signal to verify during interviews rather than prematurely rejecting candidates.",
      details: [
        "Anti-bias mitigation through standardized objective rubrics",
        "Unverified skills flagged for recruiter review",
        "Recruiters retain 100% unilateral hiring authority",
      ],
      previewSnippet:
        '“Configured multi-stage Docker builds and automated CI/CD pipelines reducing deployment time by 40%.”',
      previewCategory: "Containerization & DevOps",
      previewConfidence: "90% Match",
    },
    {
      title: "4. AI-Generated Interview Workflows",
      badge: "PIPELINE AUTOMATION",
      icon: Sparkles,
      description:
        "Turn resume evidence gaps into targeted technical interview questions. Automatically generate probing rubrics tailored specifically to candidate weaknesses and key strengths.",
      details: [
        "Tailored behavioural and architecture scenario questions",
        "Candidate comparison matrix with side-by-side gap analysis",
        "Calendar scheduling integration with real-time status updates",
      ],
      previewSnippet:
        '“In your cloud migration project, how did you handle state synchronization across partitioned PostgreSQL tables during active deployment?”',
      previewCategory: "Targeted Interview Question",
      previewConfidence: "Tailored to Evidence Gap",
    },
  ];

  const currentStep = tourSteps[tourStep];

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-labelledby="demo-modal-title"
      className="m-auto w-full max-w-3xl rounded-2xl border border-[#E2DDD5] bg-[#F5F2EC] p-0 text-[#242522] shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm open:flex open:flex-col overscroll-contain"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-[#E2DDD5] bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D97745] text-white">
            <Play className="h-4 w-4 fill-white" />
          </div>
          <div>
            <h2 id="demo-modal-title" className="font-heading text-lg font-bold text-[#242522]">
              TalentPilot Interactive Demo
            </h2>
            <p className="text-xs text-[#77776E]">
              Explore genuine AI workflows, evidence parsing, and real live workspaces.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-[#77776E] hover:bg-[#FAF8F5] hover:text-[#242522] transition-colors"
          aria-label="Close demo modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2DDD5] bg-[#FAF8F5] px-6 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("tour")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "tour"
              ? "border-[#D97745] text-[#D97745]"
              : "border-transparent text-[#77776E] hover:text-[#242522]"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Interactive Product Tour
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sandbox")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "sandbox"
              ? "border-[#D97745] text-[#D97745]"
              : "border-transparent text-[#77776E] hover:text-[#242522]"
          }`}
        >
          <Users className="h-4 w-4" />
          1-Click Live Sandbox
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 overflow-y-auto max-h-[70vh]">
        {activeTab === "tour" && (
          <div className="space-y-6">
            {/* Step Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {tourSteps.map((step, idx) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setTourStep(idx)}
                  className={`flex flex-col items-start rounded-xl p-3 text-left border transition-all ${
                    tourStep === idx
                      ? "border-[#D97745] bg-white shadow-xs"
                      : "border-[#E2DDD5] bg-[#FAF8F5]/80 hover:bg-white text-[#77776E]"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      tourStep === idx ? "text-[#D97745]" : "text-[#77776E]"
                    }`}
                  >
                    Step 0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#242522] line-clamp-1 mt-0.5">
                    {step.title.split(". ")[1]}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Step Showcase Card */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9ECE5] text-[#D97745] border border-[#ECC9B6]">
                    <currentStep.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="inline-block rounded bg-[#F9ECE5] px-2 py-0.5 text-[10px] font-bold text-[#D97745] tracking-wider mb-0.5">
                      {currentStep.badge}
                    </span>
                    <h3 className="text-base font-bold text-[#242522]">
                      {currentStep.title}
                    </h3>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#77776E] font-medium">
                  <span>{tourStep + 1} of {tourSteps.length}</span>
                </div>
              </div>

              <p className="text-sm text-[#77776E] leading-relaxed">
                {currentStep.description}
              </p>

              {/* Verified Evidence Output Box */}
              <div className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#242522]">
                    {currentStep.previewCategory}
                  </span>
                  <span className="rounded bg-[#EAF3EC] border border-[#C1DEC6] px-2 py-0.5 text-[11px] font-semibold text-[#3D784A]">
                    {currentStep.previewConfidence}
                  </span>
                </div>
                <p className="text-xs text-[#242522] italic border-l-2 border-[#D97745] pl-3 py-0.5">
                  {currentStep.previewSnippet}
                </p>
              </div>

              {/* Bullet Highlights */}
              <ul className="space-y-2 pt-1">
                {currentStep.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#242522]">
                    <CheckCircle2 className="h-4 w-4 text-[#3D784A] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tour Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScrollToDemo();
                }}
                className="w-full sm:w-auto text-xs font-semibold text-[#D97745] hover:text-[#C46332] flex items-center justify-center gap-1.5 py-2"
              >
                <span>Jump to Live Interactive Card on Landing Page</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {tourStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setTourStep((s) => s - 1)}
                    className="flex-1 sm:flex-initial rounded-lg border border-[#CDC7BD] bg-white px-4 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
                  >
                    Previous
                  </button>
                )}
                {tourStep < tourSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setTourStep((s) => s + 1)}
                    className="flex-1 sm:flex-initial rounded-lg bg-[#D97745] px-5 py-2 text-xs font-semibold text-white hover:bg-[#C46332] shadow-xs"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab("sandbox")}
                    className="flex-1 sm:flex-initial rounded-lg bg-[#D97745] px-5 py-2 text-xs font-semibold text-white hover:bg-[#C46332] shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Try Real Recruiter Sandbox</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sandbox" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5] p-5">
              <h3 className="text-sm font-bold text-[#D97745] flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Preloaded Demo Environment
              </h3>
              <p className="mt-1 text-xs text-[#242522] leading-relaxed">
                Clicking below will automatically authenticate your session with genuine seed candidates (Ethan Calder, Priya Nandakumar, Jonas Weber) and full recruiter privileges. No manual registration needed.
              </p>
            </div>

            {loginError && (
              <div className="rounded-lg border border-[#F2B8B5] bg-[#FDF3F2] p-3 text-xs text-[#BA3D35]">
                {loginError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recruiter Sandbox Card */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 flex flex-col justify-between space-y-4 hover:border-[#D97745] transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#F9ECE5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D97745]">
                      Primary Demo
                    </span>
                    <Users className="h-4 w-4 text-[#77776E]" />
                  </div>
                  <h4 className="text-base font-bold text-[#242522]">
                    Recruiter Workspace
                  </h4>
                  <p className="text-xs text-[#77776E] leading-relaxed">
                    View the full recruiter dashboard, candidate rankings, liquid score animations, resume evidence breakdown, and vacancy pipeline.
                  </p>
                  <div className="rounded-md bg-[#FAF8F5] border border-[#E2DDD5] p-2 text-[11px] text-[#77776E] space-y-0.5 font-mono">
                    <div>User: recruiter@demo.example</div>
                    <div>Role: Lead Technical Recruiter</div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={handleInstantRecruiterLogin}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#D97745] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#C46332] shadow-sm transition-colors disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Recruiter Session</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Candidate Experience Sandbox Card */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 flex flex-col justify-between space-y-4 hover:border-[#D97745] transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[#E8E3DA] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#242522]">
                      Applicant View
                    </span>
                    <FileText className="h-4 w-4 text-[#77776E]" />
                  </div>
                  <h4 className="text-base font-bold text-[#242522]">
                    Candidate Portal
                  </h4>
                  <p className="text-xs text-[#77776E] leading-relaxed">
                    Experience the candidate portal: browse open requisitions, view application statuses, and inspect verified profile credentials.
                  </p>
                  <div className="rounded-md bg-[#FAF8F5] border border-[#E2DDD5] p-2 text-[11px] text-[#77776E] space-y-0.5 font-mono">
                    <div>User: candidate1@demo.example</div>
                    <div>Profile: Ethan Calder</div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={handleInstantCandidateLogin}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#CDC7BD] bg-white px-4 py-2.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Candidate Session</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#E2DDD5] bg-[#FAF8F5] px-6 py-3.5 text-xs text-[#77776E] gap-2">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-[#3D784A]" />
          <span>Academic Assignment MVP &bull; Zero external cloud telemetry</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-[#77776E] hover:text-[#242522]"
        >
          Close Preview
        </button>
      </div>
    </dialog>
  );
}
