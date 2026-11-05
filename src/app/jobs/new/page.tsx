"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Senior Backend Developer");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Lahore (Hybrid)");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [salaryMin, setSalaryMin] = useState("250000");
  const [salaryMax, setSalaryMax] = useState("400000");
  const [minYearsExperience, setMinYearsExperience] = useState(3);
  const [requiredQualifications, setRequiredQualifications] = useState(
    "Bachelor's degree in Computer Science, Software Engineering or equivalent experience"
  );
  const [description, setDescription] = useState(
    "We are seeking an experienced Backend Developer to design, scale, and maintain our high-throughput distributed APIs. You will work closely with frontend and platform teams to build resilient microservices."
  );

  const [skills, setSkills] = useState([
    { name: "Python", priority: "REQUIRED", importance: 5 },
    { name: "Django", priority: "REQUIRED", importance: 5 },
    { name: "PostgreSQL", priority: "REQUIRED", importance: 4 },
    { name: "Docker", priority: "REQUIRED", importance: 3 },
  ]);

  const [newSkillName, setNewSkillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([
      ...skills,
      { name: newSkillName.trim(), priority: "REQUIRED", importance: 4 },
    ]);
    setNewSkillName("");
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async (status: "DRAFT" | "OPEN") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          department,
          location,
          employmentType,
          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),
          salaryCurrency: "PKR",
          description,
          minYearsExperience: Number(minYearsExperience),
          requiredQualifications,
          status,
          skills,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message || "Failed to create vacancy");
      } else {
        router.push("/jobs");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

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
          title="Create Job Requisition"
          breadcrumbs={[
            { label: "Jobs", href: "/jobs" },
            { label: "Create Vacancy" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave("DRAFT")}
                disabled={loading}
                className="rounded-md border border-[#CDC7BD] bg-white px-4 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave("OPEN")}
                disabled={loading}
                className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors"
              >
                {loading ? "Publishing..." : "Publish Vacancy"}
              </button>
            </div>
          }
        />

        {error && (
          <div className="mb-6 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-4 text-xs text-[#BA3D35]">
            {error}
          </div>
        )}

        {/* 3-Column Layout Matching Wireframe R03 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Stepper (2 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-4">
                Creation Steps
              </p>
              <ul className="space-y-4 text-xs font-semibold">
                <li className="flex items-center gap-2.5 text-[#D97745]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D97745] text-white text-xs">
                    1
                  </span>
                  <span>Job Basics</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#242522]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E2DDD5] bg-[#FAF8F5] text-xs text-[#77776E]">
                    2
                  </span>
                  <span>Required Skills</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#77776E]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E2DDD5] bg-[#FAF8F5] text-xs">
                    3
                  </span>
                  <span>Qualifications</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#77776E]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E2DDD5] bg-[#FAF8F5] text-xs">
                    4
                  </span>
                  <span>AI Matching Criteria</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Form (6 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#242522] border-b border-[#E2DDD5] pb-3">
                1. Job Basics
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">
                    Min Years Experience
                  </label>
                  <input
                    type="number"
                    value={minYearsExperience}
                    onChange={(e) => setMinYearsExperience(Number(e.target.value))}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Job Description *
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Skills & AI Matching Criteria (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 2. Required Skills Card matching wireframe R03 */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#242522] border-b border-[#E2DDD5] pb-3">
                2. Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-1 rounded-full bg-[#F9ECE5] border border-[#ECC9B6] px-3 py-1 text-xs font-bold text-[#D97745]"
                  >
                    <span>{s.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="hover:text-[#BA3D35]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add skill (e.g. Redis)..."
                  className="flex-1 rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-md bg-[#D97745] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#C46332]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* 4. AI Matching Criteria Weights per DATA_MODEL.md & wireframe R03 */}
            <div className="rounded-2xl border border-[#ECC9B6] bg-[#F9ECE5]/50 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#ECC9B6]/60 pb-3">
                <Sparkles className="h-4 w-4 text-[#D97745]" />
                <h3 className="text-sm font-bold text-[#242522]">
                  4. AI Matching Rubric
                </h3>
              </div>
              <p className="text-xs text-[#77776E]">
                Weighted multi-dimensional scoring enforced per academic competition baseline:
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-[#242522] mb-1">
                    <span>Skills Assessment</span>
                    <span className="text-[#D97745] font-bold">50%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                    <div className="h-full bg-[#D97745] w-1/2 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#242522] mb-1">
                    <span>Experience Relevance</span>
                    <span className="text-[#D97745] font-bold">25%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                    <div className="h-full bg-[#D97745] w-1/4 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#242522] mb-1">
                    <span>Project Relevance</span>
                    <span className="text-[#D97745] font-bold">15%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                    <div className="h-full bg-[#D97745] w-[15%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#242522] mb-1">
                    <span>Qualifications</span>
                    <span className="text-[#D97745] font-bold">10%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                    <div className="h-full bg-[#D97745] w-[10%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
