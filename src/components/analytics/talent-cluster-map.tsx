"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Filter,
  List,
  ScatterChart as ScatterIcon,
  ChevronDown,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type {
  TalentClusterMapDTO,
  CandidateClusterPoint,
  ClusterCategory,
} from "@/types/analytics";

interface TalentClusterMapProps {
  clusterMapData?: TalentClusterMapDTO;
  className?: string;
}

export function TalentClusterMap({
  clusterMapData,
  className = "",
}: TalentClusterMapProps) {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCluster, setSelectedCluster] =
    useState<ClusterCategory | "ALL">("ALL");
  const [hoveredCandidate, setHoveredCandidate] =
    useState<CandidateClusterPoint | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Default cluster definitions per wireframe R10
  const defaultClusters = [
    {
      id: "STRONG_MATCH" as ClusterCategory,
      label: "Strong Matches",
      color: "#D97745",
      description: "Candidates with strong technical and experience alignment.",
      count: 5,
    },
    {
      id: "TRANSFERABLE_SKILLS" as ClusterCategory,
      label: "Transferable Skills",
      color: "#8A9A4A",
      description: "Candidates with relevant adjacent skills and senior experience.",
      count: 4,
    },
    {
      id: "PARTIAL_MATCH" as ClusterCategory,
      label: "Partial Matches",
      color: "#B0A89C",
      description: "Candidates who satisfy some requirements with notable gaps.",
      count: 3,
    },
    {
      id: "INSUFFICIENT_EVIDENCE" as ClusterCategory,
      label: "Insufficient Evidence",
      color: "#64748B",
      description: "Resumes lacking verifiable technical or duration evidence.",
      count: 3,
    },
  ];

  // Fallback demo candidates matching wireframe R10
  const defaultCandidates: CandidateClusterPoint[] = [
    {
      id: "c1",
      candidateId: "cand-1",
      name: "Alex Mercer",
      role: "Senior Backend Developer",
      technicalSkillFit: 84,
      experienceFit: 78,
      overallMatch: 94,
      cluster: "STRONG_MATCH",
      evidenceCoverage: 90,
      summaryExcerpt: "Strong Python & PostgreSQL, 5 yrs FastAPI experience",
      status: "SHORTLISTED",
      topSkills: ["Python", "FastAPI", "PostgreSQL"],
    },
    {
      id: "c2",
      candidateId: "cand-2",
      name: "Tariq Mahmood",
      role: "Distributed Systems Lead",
      technicalSkillFit: 88,
      experienceFit: 85,
      overallMatch: 92,
      cluster: "STRONG_MATCH",
      evidenceCoverage: 88,
      summaryExcerpt: "Microservice event queues and Docker clustering",
      status: "SHORTLISTED",
      topSkills: ["Python", "Docker", "PostgreSQL"],
    },
    {
      id: "c3",
      candidateId: "cand-3",
      name: "Siddharth Rao",
      role: "Core API Engineer",
      technicalSkillFit: 80,
      experienceFit: 82,
      overallMatch: 89,
      cluster: "STRONG_MATCH",
      evidenceCoverage: 85,
      summaryExcerpt: "Extensive relational schema tuning & test automation",
      status: "SHORTLISTED",
      topSkills: ["Django", "PostgreSQL"],
    },
    {
      id: "c4",
      candidateId: "cand-4",
      name: "Chloe Dupont",
      role: "Platform Backend Specialist",
      technicalSkillFit: 86,
      experienceFit: 76,
      overallMatch: 91,
      cluster: "STRONG_MATCH",
      evidenceCoverage: 84,
      summaryExcerpt: "High-concurrency RESTful APIs in Django and Flask",
      status: "SHORTLISTED",
      topSkills: ["Python", "Django", "Docker"],
    },
    {
      id: "c5",
      candidateId: "cand-5",
      name: "Zainab Al-Hassan",
      role: "Senior Infrastructure Engineer",
      technicalSkillFit: 76,
      experienceFit: 88,
      overallMatch: 88,
      cluster: "STRONG_MATCH",
      evidenceCoverage: 86,
      summaryExcerpt: "Docker orchestration and PostgreSQL replication expert",
      status: "SHORTLISTED",
      topSkills: ["Docker", "PostgreSQL", "Linux"],
    },
    // Transferable Skills
    {
      id: "c6",
      candidateId: "cand-6",
      name: "Vikram Malhotra",
      role: "Senior Java/Enterprise Developer",
      technicalSkillFit: 36,
      experienceFit: 82,
      overallMatch: 75,
      cluster: "TRANSFERABLE_SKILLS",
      evidenceCoverage: 80,
      summaryExcerpt: "10 yrs enterprise Spring Boot; rapid transition to Python",
      status: "IN_REVIEW",
      topSkills: ["Java", "Docker", "SQL"],
    },
    {
      id: "c7",
      candidateId: "cand-7",
      name: "Elena Rostova",
      role: "Full Stack Node Architect",
      technicalSkillFit: 44,
      experienceFit: 74,
      overallMatch: 72,
      cluster: "TRANSFERABLE_SKILLS",
      evidenceCoverage: 75,
      summaryExcerpt: "Deep database design and Docker; TypeScript background",
      status: "IN_REVIEW",
      topSkills: ["Node.js", "Docker", "PostgreSQL"],
    },
    {
      id: "c8",
      candidateId: "cand-8",
      name: "David Kim",
      role: "C++ Systems Engineer",
      technicalSkillFit: 32,
      experienceFit: 86,
      overallMatch: 70,
      cluster: "TRANSFERABLE_SKILLS",
      evidenceCoverage: 78,
      summaryExcerpt: "High-performance memory optimization and Linux server admin",
      status: "IN_REVIEW",
      topSkills: ["C++", "Linux", "Networking"],
    },
    {
      id: "c9",
      candidateId: "cand-9",
      name: "Fatima Noor",
      role: "Golang Microservices Dev",
      technicalSkillFit: 46,
      experienceFit: 68,
      overallMatch: 73,
      cluster: "TRANSFERABLE_SKILLS",
      evidenceCoverage: 70,
      summaryExcerpt: "Containerized networking and scalable REST architectures",
      status: "IN_REVIEW",
      topSkills: ["Go", "Docker", "PostgreSQL"],
    },
    // Partial Matches
    {
      id: "c10",
      candidateId: "cand-10",
      name: "Omar Farooq",
      role: "Junior Python Programmer",
      technicalSkillFit: 68,
      experienceFit: 36,
      overallMatch: 64,
      cluster: "PARTIAL_MATCH",
      evidenceCoverage: 60,
      summaryExcerpt: "Solid Python/Django fundamentals; needs production scaling",
      status: "IN_REVIEW",
      topSkills: ["Python", "Django"],
    },
    {
      id: "c11",
      candidateId: "cand-11",
      name: "Liam O'Connor",
      role: "Associate API Developer",
      technicalSkillFit: 72,
      experienceFit: 42,
      overallMatch: 66,
      cluster: "PARTIAL_MATCH",
      evidenceCoverage: 65,
      summaryExcerpt: "Hands-on PostgreSQL querying and Docker dev containers",
      status: "IN_REVIEW",
      topSkills: ["PostgreSQL", "Docker", "Python"],
    },
    {
      id: "c12",
      candidateId: "cand-12",
      name: "Maya Lin",
      role: "Backend Intern Graduate",
      technicalSkillFit: 62,
      experienceFit: 28,
      overallMatch: 58,
      cluster: "PARTIAL_MATCH",
      evidenceCoverage: 55,
      summaryExcerpt: "University capstone in Django REST; strong theoretical basics",
      status: "IN_REVIEW",
      topSkills: ["Python", "Django"],
    },
    // Insufficient Evidence
    {
      id: "c13",
      candidateId: "cand-13",
      name: "Haris Qureshi",
      role: "Web Developer",
      technicalSkillFit: 26,
      experienceFit: 22,
      overallMatch: 38,
      cluster: "INSUFFICIENT_EVIDENCE",
      evidenceCoverage: 30,
      summaryExcerpt: "Resume lacks detail on backend frameworks or database scale",
      status: "SUBMITTED",
      topSkills: ["HTML/CSS", "JavaScript"],
    },
    {
      id: "c14",
      candidateId: "cand-14",
      name: "Samira Khan",
      role: "Junior Technical Analyst",
      technicalSkillFit: 20,
      experienceFit: 26,
      overallMatch: 35,
      cluster: "INSUFFICIENT_EVIDENCE",
      evidenceCoverage: 25,
      summaryExcerpt: "Brief overview without project citations or verifiable repos",
      status: "SUBMITTED",
      topSkills: ["SQL", "Analytics"],
    },
    {
      id: "c15",
      candidateId: "cand-15",
      name: "Lucas Bennett",
      role: "Software Trainee",
      technicalSkillFit: 18,
      experienceFit: 18,
      overallMatch: 30,
      cluster: "INSUFFICIENT_EVIDENCE",
      evidenceCoverage: 20,
      summaryExcerpt: "Unformatted PDF with missing experience duration data",
      status: "SUBMITTED",
      topSkills: ["Python"],
    },
  ];

  const jobTitle = clusterMapData?.job?.title || "Backend Developer";
  const jobSkills = clusterMapData?.job?.skills?.length
    ? clusterMapData.job.skills
    : ["Python", "Django", "PostgreSQL", "Docker"];

  const clusters = clusterMapData?.clusters?.length
    ? clusterMapData.clusters
    : defaultClusters;

  const rawCandidates = clusterMapData?.candidates?.length
    ? clusterMapData.candidates
    : defaultCandidates;

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return rawCandidates.filter((cand) => {
      const matchesCluster =
        selectedCluster === "ALL" || cand.cluster === selectedCluster;
      const matchesScore = cand.overallMatch >= minScoreFilter;
      return matchesCluster && matchesScore;
    });
  }, [rawCandidates, selectedCluster, minScoreFilter]);

  // Coordinate Mapping
  // viewBox: 0 0 740 500
  // X axis: 65 -> 710 (width 645)
  // Y axis: 435 -> 25 (height 410)
  const toSvgX = (val: number) => 65 + (Math.max(0, Math.min(100, val)) / 100) * 645;
  const toSvgY = (val: number) => 435 - (Math.max(0, Math.min(100, val)) / 100) * 410;

  const getClusterColor = (clusterId: ClusterCategory) => {
    const c = clusters.find((item) => item.id === clusterId);
    return c?.color || "#77776E";
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-xs transition-shadow hover:shadow-sm ${className}`}
    >
      {/* Top Header Row matching wireframe R10 */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E3DA] pb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#242522]">
              Talent Cluster Map
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-[#77776E]">
                {jobTitle}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 ml-1">
                {jobSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#E8E3DA]/60 border border-[#DDD8CE] px-2.5 py-0.5 text-[11px] font-medium text-[#242522]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Controls: View Switcher & Filters Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View switcher: Map vs List */}
            <div className="flex items-center rounded-lg border border-[#E2DDD5] bg-[#F5F2EC] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === "map"
                    ? "bg-[#242522] text-white shadow-xs"
                    : "text-[#77776E] hover:text-[#242522]"
                }`}
                title="Scatter Cluster Map"
              >
                <span>All</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  viewMode === "list"
                    ? "bg-[#242522] text-white shadow-xs"
                    : "text-[#77776E] hover:text-[#242522]"
                }`}
                title="Candidate List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Filters Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                  selectedCluster !== "ALL" || minScoreFilter > 0
                    ? "border-[#D97745] bg-[#FDF7F4] text-[#D97745]"
                    : "border-[#E2DDD5] bg-white text-[#242522] hover:bg-[#F5F2EC]"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Filters</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {filterDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-30 w-56 rounded-xl border border-[#E2DDD5] bg-white p-3 shadow-xl">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-2">
                    Filter by Cluster
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCluster("ALL");
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left rounded-md px-2 py-1 text-xs transition-colors ${
                        selectedCluster === "ALL"
                          ? "bg-[#D97745] text-white font-semibold"
                          : "text-[#242522] hover:bg-[#F5F2EC]"
                      }`}
                    >
                      All Clusters ({rawCandidates.length})
                    </button>
                    {clusters.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCluster(c.id);
                          setFilterDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between w-full rounded-md px-2 py-1 text-xs transition-colors ${
                          selectedCluster === c.id
                            ? "bg-[#F5F2EC] font-bold text-[#242522]"
                            : "text-[#242522] hover:bg-[#FAF8F5]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          <span>{c.label}</span>
                        </span>
                        <span className="text-[11px] text-[#77776E]">
                          {c.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#E8E3DA]">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#77776E] mb-1.5">
                      Min Match Score
                    </div>
                    <div className="flex items-center gap-1">
                      {[0, 60, 75, 85].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => {
                            setMinScoreFilter(score);
                            setFilterDropdownOpen(false);
                          }}
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${
                            minScoreFilter === score
                              ? "border-[#D97745] bg-[#D97745] text-white"
                              : "border-[#E2DDD5] bg-[#F5F2EC] text-[#242522] hover:bg-white"
                          }`}
                        >
                          {score === 0 ? "Any" : `${score}%+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(selectedCluster !== "ALL" || minScoreFilter > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCluster("ALL");
                        setMinScoreFilter(0);
                        setFilterDropdownOpen(false);
                      }}
                      className="mt-3 w-full rounded-md bg-[#FAF8F5] border border-[#E2DDD5] py-1 text-center text-xs font-semibold text-[#BA3D35] hover:bg-[#F8ECEB]"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend Row matching wireframe R10 */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs">
            {clusters.map((c) => {
              const isSelected = selectedCluster === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setSelectedCluster(isSelected ? "ALL" : c.id)
                  }
                  className={`flex items-center gap-1.5 transition-all rounded-md px-2 py-0.5 ${
                    isSelected
                      ? "bg-[#242522] text-white font-semibold shadow-xs"
                      : "text-[#242522] hover:bg-[#F5F2EC]"
                  }`}
                  title={`Filter by ${c.label}`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active filter pill */}
          {selectedCluster !== "ALL" && (
            <div className="flex items-center gap-1.5 rounded-full bg-[#F5F2EC] border border-[#E2DDD5] px-2.5 py-0.5 text-xs text-[#242522]">
              <span>Active filter:</span>
              <span className="font-semibold text-[#D97745]">
                {clusters.find((c) => c.id === selectedCluster)?.label}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCluster("ALL")}
                className="text-[#77776E] hover:text-[#BA3D35] ml-1"
                title="Reset cluster filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main View Area: 2D Coordinate Plane or Candidate List */}
      {viewMode === "map" ? (
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox="0 0 740 500"
            className="w-full h-auto overflow-visible"
            aria-label="Talent Cluster Coordinate Map"
          >
            {/* Grid Lines */}
            {[0, 20, 40, 60, 80, 100].map((tick) => {
              const gx = toSvgX(tick);
              const gy = toSvgY(tick);

              return (
                <g key={tick}>
                  {/* Vertical grid line */}
                  <line
                    x1={gx}
                    y1="25"
                    x2={gx}
                    y2="435"
                    stroke={tick === 0 ? "#77776E" : "#EDE8DF"}
                    strokeWidth={tick === 0 ? "1.5" : "1"}
                  />
                  {/* Horizontal grid line */}
                  <line
                    x1="65"
                    y1={gy}
                    x2="710"
                    y2={gy}
                    stroke={tick === 0 ? "#77776E" : "#EDE8DF"}
                    strokeWidth={tick === 0 ? "1.5" : "1"}
                  />
                  {/* X axis tick label */}
                  <text
                    x={gx}
                    y="454"
                    textAnchor="middle"
                    className="text-[11px] font-medium fill-[#77776E]"
                  >
                    {tick}
                  </text>
                  {/* Y axis tick label */}
                  <text
                    x="52"
                    y={gy + 4}
                    textAnchor="end"
                    className="text-[11px] font-medium fill-[#77776E]"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Main Label */}
            <text
              x="387"
              y="488"
              textAnchor="middle"
              className="text-[12px] font-semibold fill-[#242522] tracking-wide"
            >
              Technical Skill Fit (0-100)
            </text>

            {/* Y-Axis Main Label (Rotated) */}
            <text
              transform="rotate(-90)"
              x="-230"
              y="20"
              textAnchor="middle"
              className="text-[12px] font-semibold fill-[#242522] tracking-wide"
            >
              Experience Fit (0-100)
            </text>

            {/* Shaded Cluster Blobs behind candidates matching wireframe R10 */}
            {/* 1. Transferable Skills Blob (Olive Green, Mid-Left/Top) */}
            <path
              d="M 195,140 C 185,75 255,55 330,55 C 410,55 425,115 410,165 C 390,210 320,230 255,225 C 195,220 200,180 195,140 Z"
              fill="#8A9A4A"
              fillOpacity={
                selectedCluster === "ALL" || selectedCluster === "TRANSFERABLE_SKILLS"
                  ? 0.14
                  : 0.04
              }
              stroke="#8A9A4A"
              strokeWidth={
                selectedCluster === "TRANSFERABLE_SKILLS" ? "2.5" : "1.2"
              }
              className="transition-all duration-300"
            />

            {/* 2. Strong Matches Blob (Terracotta, Top Right) */}
            <path
              d="M 460,125 C 470,55 560,35 635,40 C 695,45 705,100 690,150 C 675,185 585,185 510,175 C 465,170 450,155 460,125 Z"
              fill="#D97745"
              fillOpacity={
                selectedCluster === "ALL" || selectedCluster === "STRONG_MATCH"
                  ? 0.14
                  : 0.04
              }
              stroke="#D97745"
              strokeWidth={
                selectedCluster === "STRONG_MATCH" ? "2.5" : "1.2"
              }
              className="transition-all duration-300"
            />

            {/* 3. Partial Matches Blob (Taupe/Tan, Mid-Right/Lower) */}
            <path
              d="M 390,270 C 395,205 480,188 555,205 C 620,220 620,290 585,330 C 540,370 460,360 415,325 C 390,305 388,290 390,270 Z"
              fill="#B0A89C"
              fillOpacity={
                selectedCluster === "ALL" || selectedCluster === "PARTIAL_MATCH"
                  ? 0.16
                  : 0.04
              }
              stroke="#B0A89C"
              strokeWidth={
                selectedCluster === "PARTIAL_MATCH" ? "2.5" : "1.2"
              }
              className="transition-all duration-300"
            />

            {/* 4. Insufficient Evidence Blob (Slate Blue, Bottom Left) */}
            <path
              d="M 135,350 C 140,285 215,268 280,280 C 335,290 330,360 300,395 C 255,425 190,425 155,398 C 135,380 130,365 135,350 Z"
              fill="#64748B"
              fillOpacity={
                selectedCluster === "ALL" || selectedCluster === "INSUFFICIENT_EVIDENCE"
                  ? 0.14
                  : 0.04
              }
              stroke="#64748B"
              strokeWidth={
                selectedCluster === "INSUFFICIENT_EVIDENCE" ? "2.5" : "1.2"
              }
              className="transition-all duration-300"
            />

            {/* Candidate Dots */}
            {rawCandidates.map((cand) => {
              const cx = toSvgX(cand.technicalSkillFit);
              const cy = toSvgY(cand.experienceFit);
              const radius = 5.5 + (cand.evidenceCoverage / 100) * 3.5;
              const color = getClusterColor(cand.cluster);
              const isSelected =
                selectedCluster === "ALL" || selectedCluster === cand.cluster;
              const isScoreMatch = cand.overallMatch >= minScoreFilter;
              const isHovered = hoveredCandidate?.id === cand.id;

              if (!isScoreMatch) return null;

              return (
                <g
                  key={cand.id}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredCandidate(cand)}
                  onMouseLeave={() => setHoveredCandidate(null)}
                >
                  {/* Outer ring on hover matching wireframe R10 */}
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius + 4}
                      fill="none"
                      stroke="#242522"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Candidate Circle Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    opacity={isSelected ? 1 : 0.2}
                    className="transition-transform duration-150 hover:scale-125 drop-shadow-xs"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card matching wireframe R10 */}
          {hoveredCandidate && (
            <div
              className="pointer-events-auto absolute z-40 w-64 rounded-xl border border-[#3E403B] bg-[#242522] p-3.5 text-white shadow-2xl transition-all"
              style={(() => {
                const cx = toSvgX(hoveredCandidate.technicalSkillFit);
                const cy = toSvgY(hoveredCandidate.experienceFit);
                const xPercent = (cx / 740) * 100;
                const yPercent = (cy / 500) * 100;

                const isRightHalf = xPercent > 55;
                const isBottomHalf = yPercent > 55;

                return {
                  left: isRightHalf ? undefined : `${xPercent + 2}%`,
                  right: isRightHalf ? `${100 - xPercent + 2}%` : undefined,
                  top: isBottomHalf ? undefined : `${yPercent + 2}%`,
                  bottom: isBottomHalf ? `${100 - yPercent + 2}%` : undefined,
                };
              })()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading text-sm font-bold text-white">
                    Candidate: {hoveredCandidate.name}
                  </h4>
                  <p className="text-[11px] text-[#A6A29A]">
                    {hoveredCandidate.role}
                  </p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                  style={{
                    backgroundColor: getClusterColor(hoveredCandidate.cluster),
                  }}
                >
                  {hoveredCandidate.cluster.replace("_", " ")}
                </span>
              </div>

              {/* Overall Match Progress Bar */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-xs text-[#E8E3DA]">
                  <span>Overall Match:</span>
                  <span className="font-bold text-[#D97745]">
                    {hoveredCandidate.overallMatch}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#3E403B]">
                  <div
                    className="h-full rounded-full bg-[#D97745] transition-all duration-300"
                    style={{ width: `${hoveredCandidate.overallMatch}%` }}
                  />
                </div>
              </div>

              {/* Coordinates details */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#C5BAA9] border-t border-[#3E403B] pt-1.5">
                <span>Tech Fit: {hoveredCandidate.technicalSkillFit}%</span>
                <span>Exp Fit: {hoveredCandidate.experienceFit}%</span>
              </div>

              {/* Summary excerpt per wireframe R10 */}
              <p className="mt-2 text-[11px] text-[#E8E3DA] leading-relaxed line-clamp-2 italic">
                &ldquo;{hoveredCandidate.summaryExcerpt}&rdquo;
              </p>

              {/* Link to Application */}
              <Link
                href={`/applications/${hoveredCandidate.id}`}
                className="mt-3 flex items-center justify-between text-xs font-semibold text-[#D97745] hover:text-[#E88C5D] transition-colors border-t border-[#3E403B] pt-2"
              >
                <span>View Candidate Details</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Alternative Candidate List / Table View */
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-xs text-[#242522]">
            <thead>
              <tr className="border-b border-[#E8E3DA] text-[11px] font-bold uppercase tracking-wider text-[#77776E]">
                <th className="py-2.5 pr-4">Candidate</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-center">Tech Fit</th>
                <th className="py-2.5 px-3 text-center">Exp Fit</th>
                <th className="py-2.5 px-3 text-center">Overall Match</th>
                <th className="py-2.5 px-3">Cluster</th>
                <th className="py-2.5 pl-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA]">
              {filteredCandidates.map((cand) => (
                <tr
                  key={cand.id}
                  className="hover:bg-[#FAF8F5] transition-colors"
                >
                  <td className="py-2.5 pr-4 font-semibold text-[#242522]">
                    {cand.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#77776E]">{cand.role}</td>
                  <td className="py-2.5 px-3 text-center font-medium">
                    {cand.technicalSkillFit}%
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium">
                    {cand.experienceFit}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block rounded-md bg-[#FDF7F4] border border-[#D97745]/30 px-2 py-0.5 font-bold text-[#D97745]">
                      {cand.overallMatch}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{
                        backgroundColor: getClusterColor(cand.cluster),
                      }}
                    >
                      {cand.cluster.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    <Link
                      href={`/applications/${cand.id}`}
                      className="font-semibold text-[#D97745] hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cluster Map Explanatory Bottom Bar */}
      <div className="mt-4 pt-3 border-t border-[#E8E3DA]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#77776E] gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#D97745]" />
          <span>
            Bubble radius reflects verified evidence coverage. Click any
            candidate to open their evaluation.
          </span>
        </div>
        <span className="font-semibold text-[#242522]">
          Showing {filteredCandidates.length} of {rawCandidates.length} candidates
        </span>
      </div>
    </div>
  );
}
