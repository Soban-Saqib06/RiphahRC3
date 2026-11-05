"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  RotateCcw,
  Edit3,
  Download,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ProfileDTO, ResumeDTO, ResumeSummaryDTO, UserDTO, ParsedResume } from "@/lib/dto";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [latestResume, setLatestResume] = useState<ResumeDTO | null>(null);
  const [allResumes, setAllResumes] = useState<ResumeSummaryDTO[]>([]);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    phone: "",
    location: "",
    summary: "",
    linkedinUrl: "",
    githubUrl: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Resume Upload State
  const [uploading, setUploading] = useState(false);
  const [reparsing, setReparsing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual Resume Edit Modal State
  const [isEditingResumeData, setIsEditingResumeData] = useState(false);
  const [editParsedData, setEditParsedData] = useState<ParsedResume | null>(null);
  const [savingResumeData, setSavingResumeData] = useState(false);

  // Initial load
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success) setCurrentUser(json.data.user);
      })
      .catch(() => {});

    loadProfileAndResumes();
  }, []);

  const loadProfileAndResumes = async () => {
    try {
      const [profileRes, resumesRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/resumes"),
      ]);

      const profileJson = await profileRes.json();
      if (profileJson.success && profileJson.data?.profile) {
        const p = profileJson.data.profile;
        setProfile(p);
        setFormData({
          name: p.name || "",
          headline: p.headline || "",
          phone: p.phone || "",
          location: p.location || "",
          summary: p.summary || "",
          linkedinUrl: p.linkedinUrl || "",
          githubUrl: p.githubUrl || "",
        });

        // Load full details for latest resume if present
        if (profileJson.data.latestResume) {
          const detailRes = await fetch(`/api/resumes/${profileJson.data.latestResume.id}`);
          const detailJson = await detailRes.json();
          if (detailJson.success && detailJson.data?.resume) {
            setLatestResume(detailJson.data.resume);
          } else {
            setLatestResume(profileJson.data.latestResume);
          }
        } else {
          setLatestResume(null);
        }
      }

      const resumesJson = await resumesRes.json();
      if (resumesJson.success && Array.isArray(resumesJson.data?.resumes)) {
        setAllResumes(resumesJson.data.resumes);
      }
    } catch {
      // Handled silently
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          headline: formData.headline || null,
          phone: formData.phone || null,
          location: formData.location || null,
          summary: formData.summary || null,
          linkedinUrl: formData.linkedinUrl || null,
          githubUrl: formData.githubUrl || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setUploadError(json.error?.message || "Failed to update profile.");
      } else {
        setProfile(json.data.profile);
        setIsEditingProfile(false);
        setUploadSuccess("Profile updated successfully!");
        setTimeout(() => setUploadSuccess(null), 4000);
      }
    } catch {
      setUploadError("Network error updating profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        // AI parsing or upload failed: automatically open manual entry modal without showing error
        await loadProfileAndResumes();
        openManualEditor();
      } else {
        setLatestResume(json.data.resume);
        await loadProfileAndResumes();
        if (json.data.resume.parseStatus === "FAILED") {
          // Do not show error: open manual entry modal immediately
          openManualEditor(json.data.resume);
        } else {
          setUploadSuccess("Resume successfully parsed and structured by AI!");
          setTimeout(() => setUploadSuccess(null), 4000);
        }
      }
    } catch {
      // Do not show error: open manual entry modal immediately
      openManualEditor();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleReparse = async (resumeId: string) => {
    setReparsing(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/reparse`, {
        method: "POST",
      });

      const json = await res.json();
      if (!res.ok || !json.success || json.data?.resume?.parseStatus === "FAILED") {
        // AI parse failed: open manual entry modal automatically without showing error
        if (json.data?.resume) {
          setLatestResume(json.data.resume);
        }
        await loadProfileAndResumes();
        openManualEditor(json.data?.resume);
      } else {
        setLatestResume(json.data.resume);
        setUploadSuccess("Resume re-parsed successfully!");
        setTimeout(() => setUploadSuccess(null), 4000);
        await loadProfileAndResumes();
      }
    } catch {
      openManualEditor();
    } finally {
      setReparsing(false);
    }
  };

  const openManualEditor = (resumeOverride?: ResumeDTO) => {
    const resume = resumeOverride || latestResume;
    const initialParsed: ParsedResume = resume?.parsedData || {
      fullName: profile?.name || currentUser?.name || null,
      email: profile?.email || currentUser?.email || null,
      phone: profile?.phone || null,
      location: profile?.location || null,
      summary: profile?.summary || null,
      totalYearsExperience: null,
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
    };
    setEditParsedData(initialParsed);
    setIsEditingResumeData(true);
  };

  const handleSaveManualResume = async () => {
    if (!latestResume || !editParsedData) return;
    setSavingResumeData(true);
    setUploadError(null);

    try {
      const res = await fetch(`/api/resumes/${latestResume.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedData: editParsedData }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setUploadError(json.error?.message || "Failed to save resume details.");
      } else {
        setLatestResume(json.data.resume);
        setIsEditingResumeData(false);
        setUploadSuccess("Resume details successfully updated!");
        setTimeout(() => setUploadSuccess(null), 4000);
        await loadProfileAndResumes();
      }
    } catch {
      setUploadError("Network error saving resume details.");
    } finally {
      setSavingResumeData(false);
    }
  };

  // Safe fallback if profile loading
  const displayProfile: ProfileDTO = profile || {
    id: "profile-candidate",
    userId: currentUser?.id || "user-candidate",
    name: currentUser?.name || "Candidate User",
    email: currentUser?.email || "candidate@demo.example",
    headline: "Software Engineer",
    location: "Lahore, Pakistan",
    phone: null,
    summary: null,
    linkedinUrl: null,
    githubUrl: null,
    profileCompleteness: 0,
  };

  const parsedData = latestResume?.parsedData;

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar user={currentUser} />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Candidate Profile &amp; Resume"
          description="Manage your professional profile, upload your PDF resume for AI parsing, and review extracted credentials."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Profile" },
          ]}
          actions={
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#D97745] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#C46332] transition-colors"
            >
              <Briefcase className="h-3.5 w-3.5" />
              Browse Vacancies
            </Link>
          }
        />

        {uploadSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-4 text-xs font-semibold text-[#3D784A]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-4 text-xs font-semibold text-[#BA3D35]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Profile Overview & Edit (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4 border-b border-[#E2DDD5] pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8E3DA] text-xl font-bold text-[#242522]">
                    {displayProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#242522]">
                      {displayProfile.name}
                    </h3>
                    <p className="text-xs text-[#77776E] line-clamp-1">
                      {displayProfile.headline || "No headline set"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="rounded-md border border-[#CDC7BD] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  {isEditingProfile ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Completeness Card */}
              <div className="my-5 rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4">
                <div className="flex justify-between items-center text-xs font-semibold text-[#242522] mb-2">
                  <span>Profile Completeness</span>
                  <span className="text-[#D97745] font-bold text-sm">
                    {displayProfile.profileCompleteness}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#E8E3DA] overflow-hidden mb-3">
                  <div
                    className="h-full bg-[#D97745] transition-all duration-500 rounded-full"
                    style={{ width: `${displayProfile.profileCompleteness}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#77776E]">
                  <span className={displayProfile.headline ? "text-[#3D784A] font-medium" : ""}>
                    {displayProfile.headline ? "✓ Headline" : "○ Headline"}
                  </span>
                  <span className={displayProfile.phone ? "text-[#3D784A] font-medium" : ""}>
                    {displayProfile.phone ? "✓ Phone" : "○ Phone"}
                  </span>
                  <span className={displayProfile.location ? "text-[#3D784A] font-medium" : ""}>
                    {displayProfile.location ? "✓ Location" : "○ Location"}
                  </span>
                  <span className={displayProfile.summary ? "text-[#3D784A] font-medium" : ""}>
                    {displayProfile.summary ? "✓ Bio Summary" : "○ Bio Summary"}
                  </span>
                  <span className={displayProfile.linkedinUrl || displayProfile.githubUrl ? "text-[#3D784A] font-medium" : ""}>
                    {displayProfile.linkedinUrl || displayProfile.githubUrl ? "✓ Social link" : "○ Social link"}
                  </span>
                  <span className={latestResume?.parseStatus === "PARSED" ? "text-[#3D784A] font-medium" : ""}>
                    {latestResume?.parseStatus === "PARSED" ? "✓ Parsed Resume" : "○ Parsed Resume"}
                  </span>
                </div>
              </div>

              {/* View / Edit Mode */}
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3.5 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#242522] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-[#CDC7BD] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#242522] mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Backend Engineer • 5+ years"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full rounded-lg border border-[#CDC7BD] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#242522] mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border border-[#CDC7BD] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#242522] mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Lahore, Pakistan"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full rounded-lg border border-[#CDC7BD] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#242522] mb-1">
                      Professional Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief overview of your background and technical strengths..."
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full rounded-lg border border-[#CDC7BD] bg-white p-2.5 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#242522] mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full rounded-lg border border-[#CDC7BD] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#242522] mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="w-full rounded-lg border border-[#CDC7BD] bg-white px-3 py-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      disabled={savingProfile}
                      className="rounded-md border border-[#CDC7BD] bg-white px-3 py-1.5 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="rounded-md bg-[#D97745] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#C46332] disabled:opacity-50"
                    >
                      {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center gap-2.5 text-[#77776E]">
                    <Mail className="h-4 w-4 text-[#CDC7BD] shrink-0" />
                    <span>{displayProfile.email}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[#77776E]">
                    <Phone className="h-4 w-4 text-[#CDC7BD] shrink-0" />
                    <span>{displayProfile.phone || <span className="italic text-[#A19D95]">Phone not provided</span>}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[#77776E]">
                    <MapPin className="h-4 w-4 text-[#CDC7BD] shrink-0" />
                    <span>{displayProfile.location || <span className="italic text-[#A19D95]">Location not provided</span>}</span>
                  </div>

                  {displayProfile.summary && (
                    <div className="pt-2 border-t border-[#E2DDD5]">
                      <p className="text-[11px] font-bold uppercase text-[#77776E] mb-1">Bio Summary</p>
                      <p className="text-[#242522] leading-relaxed">{displayProfile.summary}</p>
                    </div>
                  )}

                  {(displayProfile.linkedinUrl || displayProfile.githubUrl) && (
                    <div className="pt-2 border-t border-[#E2DDD5] flex flex-wrap gap-3">
                      {displayProfile.linkedinUrl && (
                        <a
                          href={displayProfile.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#D97745] hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          LinkedIn
                        </a>
                      )}
                      {displayProfile.githubUrl && (
                        <a
                          href={displayProfile.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#D97745] hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resume History List */}
            {allResumes.length > 1 && (
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#77776E] mb-3">
                  Upload History
                </h4>
                <div className="space-y-2">
                  {allResumes.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-[#77776E] shrink-0" />
                        <span className="truncate font-medium text-[#242522]">
                          {r.originalFileName}
                        </span>
                      </div>
                      <StatusBadge status={r.parseStatus} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Resume Upload & Extracted AI Data (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Upload Box */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-[#242522]">
                    Resume Document &amp; AI Parsing
                  </h3>
                  <p className="text-xs text-[#77776E] mt-0.5">
                    Upload your resume in PDF format (up to 5 MB) for automated semantic skill extraction.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="relative rounded-xl border-2 border-dashed border-[#CDC7BD] bg-[#FAF8F5] p-6 text-center hover:border-[#D97745]/60 transition-colors">
                <Upload className="mx-auto h-7 w-7 text-[#D97745] mb-2" />
                <p className="text-xs font-bold text-[#242522]">
                  {uploading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Extracting text and running Gemini AI parsing...
                    </span>
                  ) : (
                    "Upload a PDF Resume"
                  )}
                </p>
                <p className="text-[11px] text-[#77776E] mt-0.5">
                  PDF format only, maximum 5 MB
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  disabled={uploading}
                  onChange={handleFileUpload}
                  className="mt-3 block w-full text-xs text-[#77776E] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#D97745] file:text-white hover:file:bg-[#C46332] cursor-pointer"
                />
              </div>

              {/* Active Resume Status Card */}
              {latestResume && (
                <div className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#E2DDD5]">
                        <FileText className="h-5 w-5 text-[#D97745]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#242522]">
                          {latestResume.originalFileName}
                        </p>
                        <p className="text-[11px] text-[#77776E]">
                          Uploaded {new Date(latestResume.uploadedAt).toLocaleDateString()} • {(latestResume.fileSizeBytes / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={latestResume.parseStatus} size="sm" />
                      <a
                        href={`/api/resumes/${latestResume.id}/file`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-[#CDC7BD] bg-white px-2.5 py-1 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
                        title="View PDF"
                      >
                        <Download className="h-3 w-3" />
                        PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => handleReparse(latestResume.id)}
                        disabled={reparsing}
                        className="inline-flex items-center gap-1 rounded-md border border-[#CDC7BD] bg-white px-2.5 py-1 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5] disabled:opacity-50 cursor-pointer"
                        title="Reparse with AI"
                      >
                        <RotateCcw className={`h-3 w-3 ${reparsing ? "animate-spin" : ""}`} />
                        Reparse
                      </button>
                      <button
                        type="button"
                        onClick={() => openManualEditor()}
                        className="inline-flex items-center gap-1 rounded-md bg-[#D97745] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#C46332] cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit Data
                      </button>
                    </div>
                  </div>

                  {latestResume.parseStatus === "FAILED" && !parsedData && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs text-[#77776E]">
                      <span>Manual profile details entry ready.</span>
                      <button
                        type="button"
                        onClick={() => openManualEditor()}
                        className="rounded-md bg-[#D97745] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#C46332] cursor-pointer"
                      >
                        Enter details manually
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Extracted Structured Data Display */}
            {parsedData && (
              <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3">
                  <h4 className="font-heading text-sm font-bold text-[#242522]">
                    Extracted Resume Details
                  </h4>
                  <span className="text-[11px] text-[#77776E]">
                    AI-parsed evidence
                  </span>
                </div>

                {/* Skills */}
                <div>
                  <h5 className="text-xs font-bold text-[#242522] mb-2">
                    Technical Skills ({parsedData.skills?.length || 0})
                  </h5>
                  {parsedData.skills && parsedData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-[#E2DDD5] bg-[#FAF8F5] px-2.5 py-1 text-xs font-medium text-[#242522]"
                          title={s.evidence || undefined}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#77776E] italic">No skills extracted.</p>
                  )}
                </div>

                {/* Work Experience */}
                {parsedData.experience && parsedData.experience.length > 0 && (
                  <div className="border-t border-[#E2DDD5] pt-4">
                    <h5 className="text-xs font-bold text-[#242522] mb-3 flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-[#D97745]" />
                      Work Experience
                    </h5>
                    <div className="space-y-4">
                      {parsedData.experience.map((exp, idx) => (
                        <div key={idx} className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3.5 text-xs">
                          <div className="flex items-start justify-between font-bold text-[#242522]">
                            <span>{exp.title}</span>
                            <span className="text-[11px] font-normal text-[#77776E]">
                              {exp.startDate || "N/A"} - {exp.isCurrent ? "Present" : exp.endDate || "N/A"}
                            </span>
                          </div>
                          <p className="font-medium text-[#D97745] text-[11px] mb-1.5">
                            {exp.company}
                          </p>
                          {exp.description && (
                            <p className="text-[#242522] leading-relaxed mb-2">
                              {exp.description}
                            </p>
                          )}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {exp.technologies.map((t, tidx) => (
                                <span
                                  key={tidx}
                                  className="rounded bg-white border border-[#E2DDD5] px-1.5 py-0.5 text-[10px] text-[#77776E]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {parsedData.projects && parsedData.projects.length > 0 && (
                  <div className="border-t border-[#E2DDD5] pt-4">
                    <h5 className="text-xs font-bold text-[#242522] mb-3 flex items-center gap-1.5">
                      <FolderGit2 className="h-3.5 w-3.5 text-[#D97745]" />
                      Featured Projects
                    </h5>
                    <div className="space-y-3">
                      {parsedData.projects.map((proj, idx) => (
                        <div key={idx} className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs">
                          <p className="font-bold text-[#242522]">{proj.name}</p>
                          <p className="text-[#77776E] text-[11px] mt-0.5">{proj.description}</p>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {proj.technologies.map((t, tidx) => (
                                <span
                                  key={tidx}
                                  className="rounded bg-white border border-[#E2DDD5] px-1.5 py-0.5 text-[10px] text-[#77776E]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {parsedData.education && parsedData.education.length > 0 && (
                  <div className="border-t border-[#E2DDD5] pt-4">
                    <h5 className="text-xs font-bold text-[#242522] mb-3 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-[#D97745]" />
                      Education
                    </h5>
                    <div className="space-y-2">
                      {parsedData.education.map((edu, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs">
                          <div>
                            <p className="font-bold text-[#242522]">{edu.institution}</p>
                            <p className="text-[11px] text-[#77776E]">
                              {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                            </p>
                          </div>
                          {(edu.startYear || edu.endYear) && (
                            <span className="text-[11px] text-[#77776E]">
                              {edu.startYear || ""} - {edu.endYear || ""}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Manual Resume Edit Modal */}
      {isEditingResumeData && editParsedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#242522]/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-3 mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-[#242522]">
                  Edit Parsed Resume Data
                </h3>
                <p className="text-xs text-[#77776E]">
                  Manually adjust extracted skills, summary, and experience.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingResumeData(false)}
                className="rounded-lg p-1 text-[#77776E] hover:bg-[#F5F2EC]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#242522] mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editParsedData.skills.map((s) => s.name).join(", ")}
                  onChange={(e) => {
                    const list = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    setEditParsedData({
                      ...editParsedData,
                      skills: list.map((name) => ({ name, evidence: null })),
                    });
                  }}
                  className="w-full rounded-lg border border-[#CDC7BD] bg-white p-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#242522] mb-1">
                  Summary
                </label>
                <textarea
                  rows={3}
                  value={editParsedData.summary || ""}
                  onChange={(e) =>
                    setEditParsedData({ ...editParsedData, summary: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#CDC7BD] bg-white p-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#242522] mb-1">
                  Total Professional Experience (Years)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={editParsedData.totalYearsExperience ?? ""}
                  onChange={(e) =>
                    setEditParsedData({
                      ...editParsedData,
                      totalYearsExperience: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  className="w-full rounded-lg border border-[#CDC7BD] bg-white p-2 text-xs text-[#242522] focus:border-[#D97745] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#E2DDD5] pt-4">
              <button
                type="button"
                onClick={() => setIsEditingResumeData(false)}
                className="rounded-md border border-[#CDC7BD] bg-white px-4 py-2 text-xs font-semibold text-[#242522] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingResumeData}
                onClick={handleSaveManualResume}
                className="rounded-md bg-[#D97745] px-4 py-2 text-xs font-bold text-white hover:bg-[#C46332] disabled:opacity-50"
              >
                {savingResumeData ? "Saving..." : "Save Corrections"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
