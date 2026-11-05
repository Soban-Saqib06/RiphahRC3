"use client";

import React from "react";
import {
  FileText,
  Download,
  ExternalLink,
  MessageSquare,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import type { ResumeDTO } from "@/lib/dto";

interface ResumeViewerProps {
  resume: ResumeDTO;
  coverNote?: string | null;
}

export function ResumeViewer({ resume, coverNote }: ResumeViewerProps) {
  const parsed = resume.parsedData;
  const sizeFormatted = (resume.fileSizeBytes / 1024).toFixed(0);

  return (
    <div className="space-y-6">
      {/* 1. Original PDF Attachment Card */}
      <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E2DDD5] text-[#D97745] shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#242522]">
              {resume.originalFileName}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-[#77776E] mt-0.5">
              <span>{sizeFormatted} KB</span>
              <span>•</span>
              <span>Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="font-semibold text-[#3D784A]">
                {resume.parseStatus}
              </span>
            </div>
          </div>
        </div>

        <a
          href={`/api/resumes/${resume.id}/file`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#242522] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#3A3B37] transition-colors shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          Download Original PDF
        </a>
      </div>

      {/* 2. Cover Note (if provided) */}
      {coverNote && (
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#242522]">
            <MessageSquare className="h-4 w-4 text-[#D97745]" />
            <span>Candidate Cover Note</span>
          </div>
          <p className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3.5 text-xs text-[#242522] leading-relaxed italic">
            &ldquo;{coverNote}&rdquo;
          </p>
        </div>
      )}

      {/* 3. Parsed Data Sections */}
      {parsed ? (
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E2DDD5] pb-3">
            <h3 className="font-heading text-sm font-bold text-[#242522]">
              Parsed Resume Details
            </h3>
            <p className="text-xs text-[#77776E]">
              Information extracted via AI parsing pipeline
            </p>
          </div>

          {/* Candidate Summary */}
          {parsed.summary && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                Professional Summary
              </h5>
              <p className="text-xs text-[#242522] leading-relaxed">
                {parsed.summary}
              </p>
            </div>
          )}

          {/* Skills Badges */}
          {parsed.skills && parsed.skills.length > 0 && (
            <div className="space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#77776E]">
                Extracted Skills ({parsed.skills.length})
              </h5>
              <div className="flex flex-wrap gap-2">
                {parsed.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center rounded-lg border border-[#E2DDD5] bg-[#FAF8F5] px-2.5 py-1 text-xs text-[#242522]"
                    title={skill.evidence || undefined}
                  >
                    <span className="font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {parsed.experience && parsed.experience.length > 0 && (
            <div className="space-y-3.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#77776E] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#D97745]" />
                Work Experience
              </h5>
              <div className="space-y-3">
                {parsed.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3.5 text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-xs font-bold text-[#242522]">
                        {exp.title}
                      </strong>
                      <span className="text-[11px] text-[#77776E]">
                        {exp.startDate || "N/A"} - {exp.isCurrent ? "Present" : exp.endDate || "N/A"}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#D97745]">
                      {exp.company}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-[#242522] leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
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

          {/* Education */}
          {parsed.education && parsed.education.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#77776E] flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#D97745]" />
                Education
              </h5>
              <div className="space-y-2">
                {parsed.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs flex justify-between items-start"
                  >
                    <div>
                      <div className="font-bold text-[#242522]">
                        {edu.degree || "Degree"} {edu.field ? `in ${edu.field}` : ""}
                      </div>
                      <div className="text-[11px] text-[#77776E]">
                        {edu.institution}
                      </div>
                    </div>
                    {(edu.startYear || edu.endYear) && (
                      <span className="text-[11px] text-[#77776E]">
                        {edu.startYear || ""} - {edu.endYear || "N/A"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {parsed.projects && parsed.projects.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#77776E] flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-[#D97745]" />
                Projects
              </h5>
              <div className="space-y-2">
                {parsed.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E2DDD5] bg-[#FAF8F5] p-3 text-xs space-y-1"
                  >
                    <div className="font-bold text-[#242522]">{proj.name}</div>
                    <p className="text-xs text-[#242522] leading-relaxed">
                      {proj.description}
                    </p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
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
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-center text-xs text-[#77776E]">
          No parsed resume details available.
        </div>
      )}
    </div>
  );
}
