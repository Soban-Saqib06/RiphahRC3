"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import type { SkillPriority, UserDTO } from "@/lib/dto";

export default function NewJobPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);

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

  const [skills, setSkills] = useState<{ name: string; priority: SkillPriority; importance: number }[]>([
    { name: "Python", priority: "REQUIRED" as const, importance: 5 },
    { name: "Django", priority: "REQUIRED" as const, importance: 5 },
    { name: "PostgreSQL", priority: "REQUIRED" as const, importance: 4 },
    { name: "Docker", priority: "REQUIRED" as const, importance: 3 },
  ]);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillPriority, setNewSkillPriority] = useState<"REQUIRED" | "PREFERRED">("REQUIRED");
  const [newSkillImportance, setNewSkillImportance] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success) {
          if (json.data.user.role !== "RECRUITER") {
            router.push("/jobs");
          } else {
            setCurrentUser(json.data.user);
          }
        } else {
          router.push("/auth/login");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setError(`Skill "${newSkillName.trim()}" already exists.`);
      return;
    }
    setSkills([
      ...skills,
      {
        name: newSkillName.trim(),
        priority: newSkillPriority,
        importance: newSkillImportance,
      },
    ]);
    setNewSkillName("");
    setError(null);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: "priority" | "importance", value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
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
          salaryMin: salaryMin ? Number(salaryMin) : null,
          salaryMax: salaryMax ? Number(salaryMax) : null,
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
      <Navbar user={currentUser} onLogout={handleLogout} />

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
                className="rounded-md border border-[#CDC7BD] bg-white px-4 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave("OPEN")}
                disabled={loading}
                className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] transition-colors cursor-pointer"
              >
                {loading ? "Publishing..." : "Publish Vacancy"}
              </button>
            </div>
          }
        />

        {error && (
          <div className="mb-6 rounded-xl border border-[#EFC6C3] bg-[#F8ECEB] p-4 text-xs text-[#BA3D35]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#242522] border-b border-[#E2DDD5] pb-3">
                1. Requisition Details
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#242522] mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
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
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    Min Salary (PKR)
                  </label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">
                    Max Salary (PKR)
                  </label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-2 text-sm text-[#242522] focus:border-[#D97745] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-semibold text-[#242522] mb-1">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    value={requiredQualifications}
                    onChange={(e) => setRequiredQualifications(e.target.value)}
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
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#242522] border-b border-[#E2DDD5] pb-3">
                2. Required Skills & Importance
              </h2>
              <p className="text-xs text-[#77776E]">
                Skills configured here drive the AI candidate match scoring (weight 50%).
              </p>

              <div className="space-y-2.5">
                {skills.map((s, idx) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-2.5 text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#242522] block">{s.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={s.priority}
                          onChange={(e) => updateSkill(idx, "priority", e.target.value)}
                          className="rounded border border-[#E2DDD5] bg-white px-1.5 py-0.5 text-[10px]"
                        >
                          <option value="REQUIRED">Required</option>
                          <option value="PREFERRED">Preferred</option>
                        </select>
                        <select
                          value={s.importance}
                          onChange={(e) => updateSkill(idx, "importance", Number(e.target.value))}
                          className="rounded border border-[#E2DDD5] bg-white px-1.5 py-0.5 text-[10px]"
                        >
                          <option value={5}>Priority 5 (Highest)</option>
                          <option value={4}>Priority 4</option>
                          <option value={3}>Priority 3</option>
                          <option value={2}>Priority 2</option>
                          <option value={1}>Priority 1 (Minor)</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="text-[#77776E] hover:text-[#BA3D35] p-1"
                      title="Remove skill"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Skill row */}
              <div className="pt-2 border-t border-[#E2DDD5] space-y-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="New skill (e.g. Redis)..."
                  className="w-full rounded-md border border-[#E2DDD5] bg-white px-3 py-1.5 text-xs text-[#242522] focus:border-[#D97745] focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={newSkillPriority}
                    onChange={(e) => setNewSkillPriority(e.target.value as any)}
                    className="flex-1 rounded-md border border-[#E2DDD5] bg-white px-2 py-1 text-xs text-[#242522]"
                  >
                    <option value="REQUIRED">Required</option>
                    <option value="PREFERRED">Preferred</option>
                  </select>
                  <select
                    value={newSkillImportance}
                    onChange={(e) => setNewSkillImportance(Number(e.target.value))}
                    className="flex-1 rounded-md border border-[#E2DDD5] bg-white px-2 py-1 text-xs text-[#242522]"
                  >
                    <option value={5}>Importance: 5</option>
                    <option value={4}>Importance: 4</option>
                    <option value={3}>Importance: 3</option>
                    <option value={2}>Importance: 2</option>
                    <option value={1}>Importance: 1</option>
                  </select>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="rounded-md bg-[#D97745] px-3 py-1 text-xs font-bold text-white hover:bg-[#C46332] cursor-pointer"
                  >
                    Add
                  </button>
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
