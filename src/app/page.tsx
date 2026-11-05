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
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";

export default function LandingPage() {
  const [activeDemoCandidate, setActiveDemoCandidate] = useState(0);

  const demoCandidates = [
    {
      name: "Ethan Calder",
      role: "Senior Backend Developer",
      matchScore: 94,
      skillsMatch: 95,
      experienceRelevance: 92,
      qualifications: 95,
      evidence: [
        {
          quote: "Led architecture and development of high-throughput distributed microservices in Python & Django.",
          category: "Backend Architecture",
          confidence: "95% Match",
          reason: "Directly matches Python & Django required proficiency",
        },
        {
          quote: "Architected PostgreSQL database with partitioned tables and optimized indexing for sub-10ms queries.",
          category: "Database Engineering",
          confidence: "92% Match",
          reason: "Matches PostgreSQL production performance requirement",
        },
        {
          quote: "Configured multi-stage Docker builds and automated CI/CD pipelines reducing deployment time by 40%.",
          category: "Containerization",
          confidence: "90% Match",
          reason: "Matches Docker containerization & orchestration needs",
        },
      ],
    },
    {
      name: "Priya Nandakumar",
      role: "Full Stack & API Engineer",
      matchScore: 88,
      skillsMatch: 86,
      experienceRelevance: 90,
      qualifications: 88,
      evidence: [
        {
          quote: "Built asynchronous RESTful APIs using Python and FastAPI with automated OpenAPI schema generation.",
          category: "API Engineering",
          confidence: "88% Match",
          reason: "FastAPI is semantic equivalent for Django REST architecture",
        },
        {
          quote: "Containerized 12 core services using Docker and managed cloud deployments on AWS ECS.",
          category: "DevOps & Cloud",
          confidence: "90% Match",
          reason: "Verifiable Docker experience in enterprise production",
        },
      ],
    },
    {
      name: "Jonas Weber",
      role: "Backend Developer",
      matchScore: 68,
      skillsMatch: 65,
      experienceRelevance: 70,
      qualifications: 75,
      evidence: [
        {
          quote: "Developed enterprise banking microservices using Java and Spring Boot with relational databases.",
          category: "Enterprise Systems",
          confidence: "65% Partial",
          reason: "Strong backend background; requires transition to Python stack",
        },
      ],
    },
  ];

  const currentCandidate = demoCandidates[activeDemoCandidate];

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ECC9B6] bg-[#F9ECE5] px-3.5 py-1 text-xs font-semibold text-[#D97745] mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Generation Recruitment Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#242522] max-w-4xl mx-auto leading-[1.12]">
              AI-Assisted Recruitment &amp;{" "}
              <span className="text-[#D97745]">Talent Intelligence</span>
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-lg sm:text-xl text-[#77776E] max-w-2xl mx-auto leading-relaxed">
              Explainable candidate matching, resume evidence parsing, and streamlined
              interview workflows while keeping recruiters in complete control.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#D97745] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#C46332] transition-colors"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-[#CDC7BD] bg-white px-6 py-3 text-sm font-semibold text-[#242522] shadow-2xs hover:bg-[#FAF8F5] transition-colors"
              >
                <Play className="h-4 w-4 text-[#D97745] fill-[#D97745]" />
                Explore Live Demo
              </Link>
            </div>

            {/* INTERACTIVE HERO MOCKUP CARD */}
            <div className="mt-16 mx-auto max-w-5xl rounded-2xl border border-[#E2DDD5] bg-white shadow-lg overflow-hidden text-left">
              {/* Mockup Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-[#E2DDD5] bg-[#FAF8F5] px-6 py-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D97745] text-white">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#242522]">
                      Position: Backend Developer
                    </h2>
                    <p className="text-xs text-[#77776E]">
                      Required: Python &bull; Django &bull; PostgreSQL &bull; Docker
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-[#77776E]">Interactive Demo Preview</span>
                  <Link
                    href="/dashboard"
                    className="rounded bg-[#D97745] px-3 py-1 font-semibold text-white hover:bg-[#C46332] transition-colors"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E2DDD5]">
                {/* Left: Candidate List */}
                <div className="md:col-span-4 p-5 bg-[#FAF8F5]/60 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                    Top Applicants ({demoCandidates.length})
                  </p>
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
                        <div>
                          <p className="text-sm font-bold text-[#242522]">
                            {candidate.name}
                          </p>
                          <p className="text-xs text-[#77776E]">
                            {candidate.role}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#F9ECE5] px-2 py-0.5 text-xs font-bold text-[#D97745]">
                          {candidate.matchScore}%
                        </span>
                      </div>
                      {/* Mini Bar */}
                      <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                        <div
                          className="h-full bg-[#D97745] rounded-full"
                          style={{ width: `${candidate.matchScore}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Candidate Assessment & Evidence */}
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
                            Qual.
                          </span>
                          <span className="text-sm font-bold text-[#242522]">
                            {currentCandidate.qualifications}%
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

                  {/* Verbatim Evidence Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-3">
                      Resume Evidence Breakdown (Verbatim Excerpts)
                    </h4>
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

        {/* KEY CAPABILITIES */}
        <section id="capabilities" className="py-16 sm:py-24 border-t border-[#E2DDD5] bg-[#FAF8F5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#242522] sm:text-4xl">
                Key Capabilities
              </h2>
              <p className="mt-3 text-base text-[#77776E]">
                Built to elevate the recruiter experience with explainable intelligence and zero guesswork.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Capability 1 */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 transition-shadow hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8E3DA] text-[#D97745] mb-5">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Resume Parsing
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Advanced parsing of PDF resumes, extracting verified work histories, project technologies,
                  and skills with verbatim citation.
                </p>
              </div>

              {/* Capability 2 */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 transition-shadow hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8E3DA] text-[#D97745] mb-5">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Explainable AI Matching
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Transparent weighted scoring (50% skills, 25% experience, 15% projects, 10% qualifications)
                  with verifiable evidence for every signal.
                </p>
              </div>

              {/* Capability 3 */}
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 transition-shadow hover:shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8E3DA] text-[#D97745] mb-5">
                  <GitPullRequest className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Candidate Pipeline
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Seamlessly organize applicants from submission to interview scheduling, generating
                  tailored interview questions along the way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-16 sm:py-24 border-t border-[#E2DDD5] bg-[#F5F2EC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[#242522] sm:text-4xl">
                How It Works: 3-Step Process
              </h2>
              <p className="mt-3 text-base text-[#77776E]">
                Streamlined workflow designed for speed, fairness, and precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-[#E2DDD5] bg-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97745] text-white text-xs font-bold">
                    1
                  </span>
                  <Layers className="h-5 w-5 text-[#77776E]" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Integrate &amp; Connect
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Post vacancies with custom required skills and weights. Receive candidate applications and resumes
                  directly into your central talent portal.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-[#E2DDD5] bg-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97745] text-white text-xs font-bold">
                    2
                  </span>
                  <Cpu className="h-5 w-5 text-[#77776E]" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  AI Analysis &amp; Matching
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  TalentPilot extracts candidate credentials and evaluates their evidence against the job rubric,
                  surfacing matched strengths and evidence gaps.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-[#E2DDD5] bg-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97745] text-white text-xs font-bold">
                    3
                  </span>
                  <Users className="h-5 w-5 text-[#77776E]" />
                </div>
                <h3 className="text-lg font-bold text-[#242522]">
                  Interview &amp; Hire
                </h3>
                <p className="mt-2 text-sm text-[#77776E] leading-relaxed">
                  Generate tailored interview questions targeting specific skill gaps, coordinate interview
                  schedules, and make informed hiring decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HUMAN-LED CALLOUT */}
        <section id="benefits" className="py-16 sm:py-20 border-t border-[#E2DDD5] bg-[#E8E3DA]/60">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-[#DDD8CE] bg-white p-8 sm:p-12 shadow-xs">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F9ECE5] text-[#D97745] border border-[#ECC9B6]">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#242522]">
                    Human-Led, AI-Empowered Hiring
                  </h3>
                  <p className="text-sm text-[#77776E]">
                    The platform never makes unilateral hiring decisions. AI assists with evidence extraction and candidate comparison; the recruiter retains complete authority.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-medium text-[#242522]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A]" />
                      <span>Reduce unconscious bias with transparent criteria</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A]" />
                      <span>Save hours on manual resume screening</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A]" />
                      <span>Objective candidate-to-candidate comparison</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3D784A]" />
                      <span>Evidence gaps clearly marked as unverified</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-[#D97745] text-white py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start Building Your Winning Team Today
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
              Experience the future of talent evaluation with preloaded demo data and genuine AI workflows.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto rounded-md bg-white px-6 py-3 text-sm font-bold text-[#D97745] shadow-sm hover:bg-[#FAF8F5] transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Sign In to Demo Recruiter
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
