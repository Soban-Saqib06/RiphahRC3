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
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ProfileDTO, ResumeSummaryDTO } from "@/lib/dto";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileDTO | null>(null);
  const [latestResume, setLatestResume] = useState<ResumeSummaryDTO | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProfile(json.data.profile);
          setLatestResume(json.data.latestResume);
        }
      })
      .catch(() => {});
  }, []);

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setUploadError(json.error?.message || "Failed to process resume");
      } else {
        setUploadSuccess("Resume successfully uploaded and parsed by AI!");
        setLatestResume(json.data.resume);
      }
    } catch {
      setUploadError("An error occurred during resume upload.");
    } finally {
      setUploading(false);
    }
  };

  const displayProfile = profile || {
    id: "profile-ethan",
    userId: "user-ethan",
    name: "Ethan Calder",
    email: "candidate1@demo.example",
    headline: "Senior Backend Engineer • 5+ years experience",
    location: "Lahore, Pakistan",
    phone: "+92 300 1234567",
    summary:
      "Results-driven backend software engineer specializing in scalable Python/Django distributed microservices and PostgreSQL database tuning.",
    linkedinUrl: "https://linkedin.com/in/ethan-calder",
    githubUrl: "https://github.com/ethan-calder",
    profileCompleteness: 100,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EC]">
      <Navbar
        user={{
          id: "candidate-ethan",
          name: displayProfile.name,
          email: displayProfile.email,
          role: "CANDIDATE",
        }}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Candidate Profile &amp; Resume"
          description="Manage your profile credentials and upload your PDF resume for AI parsing and job applications."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "My Profile" },
          ]}
        />

        {uploadSuccess && (
          <div className="mb-6 rounded-lg border border-[#C1DEC6] bg-[#EAF3EC] p-4 text-xs font-semibold text-[#3D784A]">
            {uploadSuccess}
          </div>
        )}

        {uploadError && (
          <div className="mb-6 rounded-lg border border-[#EFC6C3] bg-[#F8ECEB] p-4 text-xs font-semibold text-[#BA3D35]">
            {uploadError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Card & Completeness (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8E3DA] text-xl font-bold text-[#242522]">
                  {displayProfile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#242522]">
                    {displayProfile.name}
                  </h3>
                  <p className="text-xs text-[#77776E]">{displayProfile.headline}</p>
                </div>
              </div>

              {/* Completeness Bar */}
              <div className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4">
                <div className="flex justify-between text-xs font-semibold text-[#242522] mb-1.5">
                  <span>Profile Completeness</span>
                  <span className="text-[#D97745] font-bold">
                    {displayProfile.profileCompleteness}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E8E3DA] overflow-hidden">
                  <div
                    className="h-full bg-[#D97745]"
                    style={{ width: `${displayProfile.profileCompleteness}%` }}
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2 text-xs text-[#77776E] pt-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#CDC7BD]" />
                  <span>{displayProfile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#CDC7BD]" />
                  <span>{displayProfile.phone || "Not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#CDC7BD]" />
                  <span>{displayProfile.location || "Not set"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resume Upload & Parsed Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Upload Box */}
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#242522]">
                Upload PDF Resume
              </h3>
              <p className="text-xs text-[#77776E]">
                Upload your resume in PDF format (up to 5 MB). Our Gemini AI extractor parses work history, technical skills, and projects automatically.
              </p>

              <div className="rounded-xl border-2 border-dashed border-[#DDD8CE] bg-[#FAF8F5] p-8 text-center">
                <Upload className="h-8 w-8 text-[#D97745] mx-auto mb-3" />
                <p className="text-xs font-semibold text-[#242522]">
                  {uploading ? "Extracting and parsing with AI..." : "Click to select a PDF resume"}
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  disabled={uploading}
                  onChange={handleFileUpload}
                  className="mt-4 block w-full text-xs text-[#77776E] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#D97745] file:text-white hover:file:bg-[#C46332] cursor-pointer"
                />
              </div>

              {/* Active / Latest Resume */}
              <div className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-[#D97745]" />
                  <div>
                    <p className="text-xs font-bold text-[#242522]">
                      {latestResume?.originalFileName || "Ethan_Calder_Backend_Resume.pdf"}
                    </p>
                    <p className="text-[10px] text-[#77776E]">
                      Status: {latestResume?.parseStatus || "PARSED"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={latestResume?.parseStatus || "PARSED"} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
