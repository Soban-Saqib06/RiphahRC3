"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LiquidScoreCircle } from "@/components/shared/liquid-score-circle";

export default function ComparisonPage() {
  const candidates = [
    {
      id: "app-ethan-backend",
      name: "Ethan Calder",
      role: "Senior Backend Engineer",
      score: 94,
      skillsScore: 96,
      experienceScore: 92,
      projectsScore: 94,
      qualificationsScore: 95,
      strengths: [
        "Deep Python & Django Architecture",
        "Large-Scale PostgreSQL Optimization",
        "Containerized Microservices (Docker)",
      ],
      evidence: [
        "Led distributed system architecture processing 50k req/min",
        "Partitioned PostgreSQL tables exceeding 20M rows",
        "Configured multi-stage Docker builds and automated CI/CD",
      ],
      recommendation: "Highly Recommended for Final Round",
    },
    {
      id: "app-priya-backend",
      name: "Priya Nandakumar",
      role: "Full Stack & API Engineer",
      score: 88,
      skillsScore: 86,
      experienceScore: 90,
      projectsScore: 88,
      qualificationsScore: 88,
      strengths: [
        "FastAPI & Modern Async Python",
        "Cloud-native Deployments",
        "High-performance REST API Design",
      ],
      evidence: [
        "Built asynchronous REST APIs in FastAPI with auto-generated OpenAPI",
        "Engineered scalable MySQL schema and index strategies",
        "Deployed 12 containerized services using Docker on AWS",
      ],
      recommendation: "Recommended for Technical Deep Dive",
    },
    {
      id: "app-jonas-backend",
      name: "Jonas Weber",
      role: "Backend Developer",
      score: 68,
      skillsScore: 65,
      experienceScore: 70,
      projectsScore: 68,
      qualificationsScore: 75,
      strengths: [
        "Enterprise Architecture (Java/Spring)",
        "Relational Database Management",
        "Clean Code & Unit Testing",
      ],
      evidence: [
        "Developed banking enterprise microservices in Java/Spring",
        "Created utility Python automation scripts",
        "Managed database schema migrations and integrity",
      ],
      recommendation: "Candidate for Secondary Evaluation",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar
        user={{
          id: "recruiter-maya",
          name: "Maya Hartwell",
          email: "recruiter@demo.example",
          role: "RECRUITER",
        }}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Side-by-Side Candidate Comparison"
          description="Directly compare top applicants for Backend Developer across skills, experience, and verified citations."
          breadcrumbs={[
            { label: "Candidates", href: "/applications" },
            { label: "Comparison Matrix" },
          ]}
        />

        {/* COMPARISON MATRIX per wireframe R06 */}
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#242522]">
                Technical Competencies Matrix
              </h2>
              <p className="text-xs text-[#77776E]">
                Comparing verified candidate capabilities against the job requirement rubric
              </p>
            </div>
            <span className="rounded-full bg-[#F9ECE5] px-3 py-1 text-xs font-bold text-[#D97745]">
              Target: Backend Developer
            </span>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E2DDD5] text-[#77776E] uppercase">
                <tr>
                  <th className="p-3.5 font-bold">Requirement</th>
                  <th className="p-3.5 font-bold">Priority</th>
                  {candidates.map((c) => (
                    <th key={c.id} className="p-3.5 font-bold text-[#242522]">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD5]">
                <tr>
                  <td className="p-3.5 font-bold text-[#242522]">Python Programming</td>
                  <td className="p-3.5"><span className="text-[#D97745] font-semibold">Required (5)</span></td>
                  <td className="p-3.5"><StatusBadge status="MATCHED" label="Matched (5+ yrs)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="MATCHED" label="Matched (3 yrs)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="PARTIAL" label="Partial (Scripts)" size="sm" /></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#242522]">Django Framework</td>
                  <td className="p-3.5"><span className="text-[#D97745] font-semibold">Required (5)</span></td>
                  <td className="p-3.5"><StatusBadge status="MATCHED" label="Matched (Advanced)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="PARTIAL" label="FastAPI (Semantic)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="NOT_EVIDENCED" label="No Evidence" size="sm" /></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#242522]">PostgreSQL Tuning</td>
                  <td className="p-3.5"><span className="text-[#D97745] font-semibold">Required (4)</span></td>
                  <td className="p-3.5"><StatusBadge status="MATCHED" label="Matched (20M rows)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="PARTIAL" label="MySQL (Equivalent)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="PARTIAL" label="SQL (Spring ORM)" size="sm" /></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#242522]">Docker Containerization</td>
                  <td className="p-3.5"><span className="text-[#D97745] font-semibold">Required (3)</span></td>
                  <td className="p-3.5"><StatusBadge status="MATCHED" label="Matched (Multi-stage)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="MATCHED" label="Matched (12 services)" size="sm" /></td>
                  <td className="p-3.5"><StatusBadge status="NOT_EVIDENCED" label="No Evidence" size="sm" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CANDIDATE DETAIL CARDS SIDE-BY-SIDE per wireframe R06 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs hover:border-[#D97745]/60 transition-all space-y-6"
            >
              <div>
                <div className="flex items-start justify-between border-b border-[#E2DDD5] pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#242522]">{cand.name}</h3>
                    <p className="text-xs text-[#77776E]">{cand.role}</p>
                  </div>
                  <LiquidScoreCircle score={cand.score} size="sm" showLabel={false} />
                </div>

                {/* Key Strengths */}
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#242522] mb-2">
                    Key Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#242522]">
                    {cand.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#3D784A] shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verified Resume Evidence */}
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-2">
                    Verified Evidence
                  </h4>
                  <div className="space-y-2">
                    {cand.evidence.map((ev, idx) => (
                      <p
                        key={idx}
                        className="rounded-md bg-[#FAF8F5] border border-[#E2DDD5] p-2 text-[11px] italic text-[#242522]"
                      >
                        &ldquo;{ev}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-[#E2DDD5]">
                <div className="rounded-lg bg-[#FAF8F5] p-2 text-center text-xs font-semibold text-[#D97745]">
                  {cand.recommendation}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/applications/${cand.id}`}
                    className="rounded-md border border-[#E2DDD5] bg-white py-2 text-center text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
                  >
                    Full Profile
                  </Link>
                  <Link
                    href="/interviews"
                    className="rounded-md bg-[#D97745] py-2 text-center text-xs font-bold text-white hover:bg-[#C46332]"
                  >
                    Interview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
