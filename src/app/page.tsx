"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Cpu,
  GitPullRequest,
  CheckCircle2,
  Play,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  Layers,
  Search,
  Filter,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";
import { HeroVectorGraphic } from "@/components/landing/hero-vector-graphic";
import { HumanRobotIllustration } from "@/components/landing/human-robot-illustration";
import { LiveDemoModal } from "@/components/landing/live-demo-modal";

export default function LandingPage() {
  const [activeDemoCandidate, setActiveDemoCandidate] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Demo candidates strictly matching wireframe landing.jpeg
  const demoCandidates = [
    {
      name: "Elias Thorne",
      role: "Senior Software Engineer",
      matchScore: 94,
      skillsMatch: 92,
      experienceRelevance: 95,
      cultureFit: 85,
      evidence: [
        {
          quote:
            "Led a team of 5 developers on a cloud migration project, and developed asynchronous microservices in Python & FastAPI.",
          category: "Leadership",
          confidence: "95% Confidence",
          reason: "Matched based on 'Led a team' and 'cloud migration project' experience",
        },
        {
          quote:
            "Architected PostgreSQL database with partitioned tables and optimized indexing for sub-10ms queries.",
          category: "Cloud Computing",
          confidence: "90% Confidence",
          reason: "Matched based on 'cloud migration project' and scalable systems experience",
        },
        {
          quote:
            "Configured multi-stage Docker builds and automated CI/CD pipelines reducing deployment time by 40%.",
          category: "DevOps & Systems",
          confidence: "92% Confidence",
          reason: "Directly satisfies containerization and cloud deployment requirements",
        },
      ],
    },
    {
      name: "Sofia Kosta",
      role: "Full Stack & API Engineer",
      matchScore: 89,
      skillsMatch: 88,
      experienceRelevance: 90,
      cultureFit: 86,
      evidence: [
        {
          quote:
            "Built asynchronous RESTful APIs using Python and FastAPI with automated OpenAPI schema generation.",
          category: "API Architecture",
          confidence: "90% Match",
          reason: "Directly matches high-throughput microservices requirements",
        },
        {
          quote:
            "Containerized core services using Docker and managed cloud deployments with automated monitoring.",
          category: "Cloud & Containerization",
          confidence: "88% Match",
          reason: "Demonstrated production container workflow matching rubric",
        },
      ],
    },
    {
      name: "Kenji Sato",
      role: "Backend Developer",
      matchScore: 87,
      skillsMatch: 85,
      experienceRelevance: 88,
      cultureFit: 84,
      evidence: [
        {
          quote:
            "Engineered backend microservices in Python, managing PostgreSQL schemas and distributed Redis caching.",
          category: "System Design",
          confidence: "88% Match",
          reason: "Strong alignment with backend service architecture and query optimization",
        },
        {
          quote:
            "Automated unit and integration test suites achieving 92% code coverage with CI test runners.",
          category: "Code Quality & Testing",
          confidence: "85% Match",
          reason: "Satisfies verification requirements for robust production systems",
        },
      ],
    },
  ];

  const currentCandidate = demoCandidates[activeDemoCandidate];

  const scrollToDemo = () => {
    const el = document.getElementById("interactive-demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          {/* Wireframe Vector Background Graphic on the right */}
          <HeroVectorGraphic />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Professional Left-Aligned Hero Content */}
            <div className="max-w-3xl text-left">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ECC9B6] bg-[#F9ECE5] px-3.5 py-1 text-xs font-semibold text-[#D97745] mb-6 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Generation Recruitment Intelligence</span>
              </div>

              {/* Main Headline strictly matching wireframe */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#242522] leading-[1.12]">
                AI-Assisted Recruitment &amp;{" "}
                <br className="hidden sm:inline" />
                <span className="text-[#D97745]">Talent Intelligence</span>
              </h1>

              {/* Subhead */}
              <p className="mt-6 text-lg sm:text-xl text-[#77776E] max-w-2xl leading-relaxed">
                Explainable candidate matching, resume evidence parsing, and streamlined
                interview workflows while keeping recruiters in complete control.
              </p>

              {/* Action Buttons strictly matching wireframe */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#D97745] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#C46332] transition-colors"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#CDC7BD] bg-white px-6 py-3 text-sm font-semibold text-[#242522] shadow-2xs hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <Play className="h-4 w-4 text-[#D97745] fill-[#D97745]" />
                  Watch Demo
                </button>
              </div>

              {/* Editorial Trust Signals */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#77776E] font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3D784A]" />
                  Transparent 50/25/15/10 rubric
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3D784A]" />
                  Verifiable resume excerpts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3D784A]" />
                  Recruiter retains 100% authority
                </span>
              </div>
            </div>

            {/* INTERACTIVE HERO MOCKUP CARD matching wireframe landing.jpeg */}
            <div
              id="interactive-demo"
              className="mt-16 mx-auto max-w-5xl rounded-2xl border border-[#E2DDD5] bg-white shadow-lg overflow-hidden text-left"
            >
              {/* Mockup Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-[#E2DDD5] bg-[#FAF8F5] px-6 py-3.5 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D97745] text-white">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#242522]">
                      Job Position: Senior Software Engineer
                    </h2>
                    <p className="text-xs text-[#77776E]">
                      Required: Python &bull; FastAPI &bull; PostgreSQL &bull; Cloud Infrastructure
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="hidden sm:inline font-medium text-[#77776E]">Interactive Preview</span>
                  <button
                    type="button"
                    onClick={() => setIsDemoModalOpen(true)}
                    className="rounded bg-[#D97745] px-3 py-1 font-semibold text-white hover:bg-[#C46332] transition-colors"
                  >
                    Open Full Demo
                  </button>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E2DDD5]">
                {/* Left: Top Applicants List */}
                <div className="md:col-span-4 p-5 bg-[#FAF8F5]/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                      Top Applicants ({demoCandidates.length})
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#77776E] bg-white border border-[#E2DDD5] rounded px-2 py-0.5">
                      <Filter className="h-3 w-3" />
                      Match ▾
                    </span>
                  </div>

                  {demoCandidates.map((candidate, idx) => (
                    <button
                      key={candidate.name}
                      type="button"
                      onClick={() => setActiveDemoCandidate(idx)}
                      className={`w-full text-left rounded-xl p-3 border transition-all ${
                        activeDemoCandidate === idx
                          ? "border-[#D97745] bg-white shadow-xs"
                          : "border-[#E2DDD5] bg-white/70 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8E3DA] border border-[#E2DDD5] font-bold text-xs text-[#242522]">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#242522]">
                              {idx + 1}. {candidate.name}
                            </p>
                            <p className="text-xs text-[#77776E]">
                              {candidate.role}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-[#F9ECE5] px-2 py-0.5 text-xs font-bold text-[#D97745]">
                          {candidate.matchScore}%
                        </span>
                      </div>
                      {/* Match Progress Bar */}
                      <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                        <div
                          className="h-full bg-[#D97745] rounded-full transition-all duration-300"
                          style={{ width: `${candidate.matchScore}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Candidate Assessment & Evidence Breakdown */}
                <div className="md:col-span-8 p-6 space-y-6">
                  {/* Candidate Header & Liquid Match Score */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD5]">
                    <div>
                      <h3 className="text-xl font-bold text-[#242522]">
                        {currentCandidate.name}
                      </h3>
                      <p className="text-sm text-[#77776E]">
                        {currentCandidate.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] px-3 py-1.5">
                          <span className="block text-[10px] text-[#77776E] uppercase font-semibold">
                            Skills
                          </span>
                          <span className="text-sm font-bold text-[#242522]">
                            {currentCandidate.skillsMatch}%
                          </span>
                        </div>
                        <div className="rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] px-3 py-1.5">
                          <span className="block text-[10px] text-[#77776E] uppercase font-semibold">
                            Exp.
                          </span>
                          <span className="text-sm font-bold text-[#242522]">
                            {currentCandidate.experienceRelevance}%
                          </span>
                        </div>
                        <div className="rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] px-3 py-1.5">
                          <span className="block text-[10px] text-[#77776E] uppercase font-semibold">
                            Culture
                          </span>
                          <span className="text-sm font-bold text-[#242522]">
                            {currentCandidate.cultureFit}%
                          </span>
                        </div>
                      </div>

                      {/* Signature Animated Liquid Score Circle */}
                      <LiquidScoreCircle
                        score={currentCandidate.matchScore}
                        size="md"
                        showLabel={false}
                      />
                    </div>
                  </div>

                  {/* Verbatim Evidence Breakdown strictly matching wireframe */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                        Resume Evidence Breakdown
                      </h4>
                      <div className="text-[11px] text-[#77776E] hidden sm:flex gap-4">
                        <span>Relevant Texts</span>
                        <span>Explainable Reasoning</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {currentCandidate.evidence.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#242522]">
                              {item.category}
                            </span>
                            <span className="rounded bg-[#EAF3EC] border border-[#C1DEC6] px-2 py-0.5 text-[11px] font-semibold text-[#3D784A]">
                              {item.confidence}
                            </span>
                          </div>
                          <p className="text-xs text-[#242522] italic border-l-2 border-[#D97745] pl-2.5">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                          <p className="text-[11px] text-[#77776E]">
                            <strong>AI Reasoning:</strong> {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEY CAPABILITIES strictly matching wireframe */}
        <section id="capabilities" className="py-16 sm:py-24 border-t border-[#E2DDD5] bg-[#FAF8F5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Left-Aligned Section Header */}
            <div className="text-left max-w-2xl mb-12">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97745] bg-[#F9ECE5] px-2.5 py-1 rounded-md border border-[#ECC9B6] inline-block mb-3">
                Core Capabilities
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#242522]">
                Key Capabilities
              </h2>
              <p className="mt-3 text-base text-[#77776E] leading-relaxed">
                Built to elevate the recruiter experience with explainable intelligence and zero guesswork.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capability 1: Resume Parsing */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 transition-all hover:shadow-md hover:border-[#D97745]/40 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9ECE5] text-[#D97745] border border-[#ECC9B6] mb-5">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Resume Parsing
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Advanced parsing of resumes in any format, extracting key data points with high accuracy.
                </p>
              </div>

              {/* Capability 2: Explainable AI Matching */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 transition-all hover:shadow-md hover:border-[#D97745]/40 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9ECE5] text-[#D97745] border border-[#ECC9B6] mb-5">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Explainable AI Matching
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Transparent, fair matching algorithms with clear reasoning behind every candidate.
                </p>
              </div>

              {/* Capability 3: Candidate Pipeline */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 transition-all hover:shadow-md hover:border-[#D97745]/40 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9ECE5] text-[#D97745] border border-[#ECC9B6] mb-5">
                  <GitPullRequest className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Candidate Pipeline
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Efficiently manage, track, and nurture your candidate pipeline from sourcing to hire.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS: 3-STEP PROCESS strictly matching wireframe */}
        <section id="how-it-works" className="py-16 sm:py-24 border-t border-[#E2DDD5] bg-[#F5F2EC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Left-Aligned Section Header */}
            <div className="text-left max-w-2xl mb-12">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97745] bg-[#F9ECE5] px-2.5 py-1 rounded-md border border-[#ECC9B6] inline-block mb-3">
                Execution Workflow
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#242522]">
                How It Works: 3-Step Process
              </h2>
              <p className="mt-3 text-base text-[#77776E] leading-relaxed">
                Streamlined workflow designed for speed, fairness, and precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-[#E2DDD5] bg-white p-8 text-left transition-all hover:shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97745] text-white text-xs font-bold shadow-2xs">
                    1
                  </span>
                  <Layers className="h-5 w-5 text-[#77776E]" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Integrate &amp; Connect
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Seamlessly connect your ATS and HRIS. Import your job descriptions and existing candidate data.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-[#E2DDD5] bg-white p-8 text-left transition-all hover:shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97745] text-white text-xs font-bold shadow-2xs">
                    2
                  </span>
                  <Cpu className="h-5 w-5 text-[#77776E]" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  AI Analysis &amp; Matching
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  TalentPilot analyzes requirements, parses resumes, and uses explainable AI to surface the best candidates with evidence.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-[#E2DDD5] bg-white p-8 text-left transition-all hover:shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97745] text-white text-xs font-bold shadow-2xs">
                    3
                  </span>
                  <Users className="h-5 w-5 text-[#77776E]" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Interview &amp; Hire
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Conduct interviews with AI assistance, compare top candidates objectively, and make informed hiring decisions faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HUMAN-LED CALLOUT strictly matching wireframe */}
        <section id="benefits" className="py-16 sm:py-20 border-t border-[#E2DDD5] bg-[#E8E3DA]/50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#DDD8CE] bg-white p-8 sm:p-12 shadow-sm text-left">
              <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                {/* Custom Human + Robot SVG Illustration per wireframe */}
                <div className="shrink-0 flex items-center justify-center">
                  <HumanRobotIllustration className="w-52 h-40 sm:w-60 sm:h-44" />
                </div>

                <div className="space-y-3.5 flex-1 text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#242522]">
                    Human-Led, AI-Empowered Hiring
                  </h3>
                  <ul className="space-y-2.5 pt-1 text-sm font-medium text-[#242522]">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A] shrink-0" />
                      <span>Reduce unconscious bias with transparent matching.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A] shrink-0" />
                      <span>Save hours on resume screening and data entry.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A] shrink-0" />
                      <span>Improve candidate experience with faster responses.</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A] shrink-0" />
                      <span>Make data-driven decisions, keeping control in human hands.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER strictly matching wireframe */}
        <section className="bg-[#D97745] text-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-left">
              <div className="space-y-3 max-w-2xl">
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Start Building Your Winning Team Today.
                </h2>
                <p className="text-base text-white/90 leading-relaxed">
                  Experience the future of recruitment with TalentPilot. Request your personalised demo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                <Link
                  href="/auth/register"
                  className="rounded-md bg-white px-7 py-3 text-sm font-bold text-[#D97745] shadow-sm hover:bg-[#FAF8F5] transition-colors text-center"
                >
                  Get Started
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="rounded-md border border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors text-center cursor-pointer"
                >
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Accessible Interactive Live Demo Dialog Modal */}
      <LiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onScrollToDemo={scrollToDemo}
      />
    </div>
  );
}
