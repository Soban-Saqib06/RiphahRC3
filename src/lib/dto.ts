/**
 * Shared DTOs and Type Definitions for Recruitment & Talent Intelligence Platform.
 * Derived from docs/API_CONTRACT.md and docs/DATA_MODEL.md.
 */

export type Role = "RECRUITER" | "CANDIDATE";
export type JobStatus = "DRAFT" | "OPEN" | "CLOSED";
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";
export type SkillPriority = "REQUIRED" | "PREFERRED";
export type ParseStatus = "PENDING" | "PARSED" | "FAILED";
export type ApplicationStatus =
  | "SUBMITTED"
  | "PARSED"
  | "ASSESSED"
  | "IN_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";
export type AssessmentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type Dimension =
  | "SKILLS"
  | "EXPERIENCE"
  | "PROJECTS"
  | "QUALIFICATIONS";
export type Verdict = "MATCHED" | "PARTIAL" | "NOT_EVIDENCED";
export type QuestionCategory =
  | "TECHNICAL"
  | "PROJECT"
  | "BEHAVIORAL"
  | "ROLE_FIT";
export type QuestionSource = "AI" | "RECRUITER";
export type InterviewType = "PHONE_SCREEN" | "TECHNICAL" | "HR" | "PANEL";
export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface JobSkillDTO {
  id: string;
  name: string;
  priority: SkillPriority;
  importance: number; // 1-5
}

export interface JobSummaryDTO {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  status: JobStatus;
  createdAt: string;
  applicantCount: number;
}

export interface JobDetailDTO extends JobSummaryDTO {
  description: string;
  minYearsExperience: number;
  requiredQualifications: string | null;
  skills: JobSkillDTO[];
  updatedAt: string;
  closedAt: string | null;
  recruiter: { id: string; name: string };
}

export interface CandidateBriefDTO {
  id: string; // CandidateProfile id
  userId: string;
  name: string;
  email: string;
  headline: string | null;
  location: string | null;
}

export interface ProfileDTO extends CandidateBriefDTO {
  phone: string | null;
  summary: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  profileCompleteness: number; // 0-100
}

export interface ParsedResume {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  summary: string | null;
  totalYearsExperience: number | null;
  skills: { name: string; evidence: string | null }[];
  experience: {
    company: string;
    title: string;
    startDate: string | null;
    endDate: string | null;
    isCurrent: boolean;
    description: string;
    technologies: string[];
  }[];
  education: {
    institution: string;
    degree: string | null;
    field: string | null;
    startYear: number | null;
    endYear: number | null;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];
  certifications: string[];
}

export interface ResumeSummaryDTO {
  id: string;
  originalFileName: string;
  fileSizeBytes: number;
  parseStatus: ParseStatus;
  parseError: string | null;
  uploadedAt: string;
  parsedAt: string | null;
}

export interface ResumeDTO extends ResumeSummaryDTO {
  parsedData: ParsedResume | null;
  extractedText?: string;
}

export interface AssessmentSummaryDTO {
  status: AssessmentStatus;
  overallScore: number | null;
  effectiveScore: number | null;
  overridden: boolean;
  generatedAt: string | null;
}

export interface AssessmentItemDTO {
  id: string;
  dimension: Dimension;
  requirement: string;
  jobSkillId: string | null;
  priority: SkillPriority | null;
  importance: number | null;
  verdict: Verdict;
  evidenceExcerpt: string | null;
  reasoning: string;
}

export interface AssessmentDTO {
  id: string;
  applicationId: string;
  status: AssessmentStatus;
  overallScore: number | null;
  effectiveScore: number | null;
  dimensionScores: {
    skills: number | null;
    experience: number | null;
    projects: number | null;
    qualifications: number | null;
  };
  weights: {
    skills: number;
    experience: number;
    projects: number;
    qualifications: number;
  };
  summary: string | null;
  modelId: string | null;
  errorMessage: string | null;
  generatedAt: string | null;
  override: {
    score: number | null;
    note: string | null;
    at: string | null;
    by: { id: string; name: string } | null;
  };
  items: AssessmentItemDTO[];
}

export interface StatusEventDTO {
  id: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string | null;
  changedBy: { id: string; name: string } | null;
  createdAt: string;
}

export interface InterviewDTO {
  id: string;
  applicationId: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  interviewerName: string;
  location: string | null;
  status: InterviewStatus;
  feedbackNotes: string | null;
  createdAt: string;
}

export interface InterviewListItemDTO extends InterviewDTO {
  candidate: { id: string; name: string };
  job: { id: string; title: string };
}

export interface QuestionDTO {
  id: string;
  applicationId: string;
  category: QuestionCategory;
  question: string;
  rationale: string | null;
  source: QuestionSource;
  sortOrder: number;
  updatedAt: string;
}

export interface ApplicationSummaryDTO {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  submittedAt: string;
  statusUpdatedAt: string;
  candidate: CandidateBriefDTO;
  resumeId: string;
  assessment: AssessmentSummaryDTO | null;
}

export type ApplicationDetailDTO = Omit<ApplicationSummaryDTO, "assessment"> & {
  job: JobDetailDTO;
  coverNote: string | null;
  recruiterNotes: string | null;
  profile: ProfileDTO;
  resume: ResumeDTO;
  assessment: AssessmentDTO | null;
  statusEvents: StatusEventDTO[];
  interviews: InterviewDTO[];
  questionCount: number;
};

export interface CandidateApplicationDTO {
  id: string;
  status: ApplicationStatus;
  displayStatus: string;
  submittedAt: string;
  statusUpdatedAt: string;
  coverNote: string | null;
  job: JobSummaryDTO;
  timeline: { displayStatus: string; at: string }[];
  upcomingInterviews: {
    id: string;
    scheduledAt: string;
    durationMinutes: number;
    type: InterviewType;
    location: string | null;
  }[];
}

export interface ComparisonCandidateDTO {
  applicationId: string;
  candidateName: string;
  status: ApplicationStatus;
  assessmentStatus: AssessmentStatus | null;
  effectiveScore: number | null;
  dimensionScores: {
    skills: number | null;
    experience: number | null;
    projects: number | null;
    qualifications: number | null;
  } | null;
  summary: string | null;
  totalYearsExperience: number | null;
}

export interface ComparisonMatrixRowDTO {
  requirement: string;
  dimension: Dimension;
  priority: SkillPriority | null;
  importance: number | null;
  cells: {
    applicationId: string;
    verdict: Verdict | null;
    evidenceExcerpt: string | null;
  }[];
}

export interface ComparisonDTO {
  job: { id: string; title: string };
  candidates: ComparisonCandidateDTO[];
  matrix: ComparisonMatrixRowDTO[];
  projects: { applicationId: string; items: AssessmentItemDTO[] }[];
}

export interface RecruiterDashboardDTO {
  role: "RECRUITER";
  kpis: {
    activeJobs: number;
    totalApplications: number;
    pendingReview: number;
    shortlisted: number;
    upcomingInterviews: number;
    averageMatchScore: number | null;
  };
  pipeline: { status: ApplicationStatus; count: number }[];
  jobs: {
    jobId: string;
    title: string;
    status: JobStatus;
    applicants: number;
    shortlisted: number;
    topScore: number | null;
  }[];
  upcomingInterviews: InterviewListItemDTO[];
  recentActivity: {
    id: string;
    at: string;
    candidateName: string;
    jobTitle: string;
    toStatus: ApplicationStatus;
    note: string | null;
  }[];
}

export interface CandidateDashboardDTO {
  role: "CANDIDATE";
  profileCompleteness: number;
  hasParsedResume: boolean;
  counts: {
    total: number;
    underReview: number;
    shortlisted: number;
    interviews: number;
    notSelected: number;
  };
  recentApplications: CandidateApplicationDTO[];
  upcomingInterviews: {
    id: string;
    applicationId: string;
    jobTitle: string;
    scheduledAt: string;
    type: InterviewType;
    location: string | null;
  }[];
}

export type DashboardDTO = RecruiterDashboardDTO | CandidateDashboardDTO;
