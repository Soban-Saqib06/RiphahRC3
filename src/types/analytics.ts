export type ClusterCategory =
  | "STRONG_MATCH"
  | "TRANSFERABLE_SKILLS"
  | "PARTIAL_MATCH"
  | "INSUFFICIENT_EVIDENCE";

export interface CandidateClusterPoint {
  id: string; // applicationId
  candidateId: string;
  name: string;
  role: string;
  technicalSkillFit: number; // 0-100
  experienceFit: number; // 0-100
  overallMatch: number; // 0-100
  cluster: ClusterCategory;
  evidenceCoverage: number; // 0-100 (maps to bubble size)
  summaryExcerpt: string;
  status: string;
  topSkills: string[];
}

export interface ClusterInfo {
  id: ClusterCategory;
  label: string;
  color: string;
  description: string;
  count: number;
}

export interface TalentClusterMapDTO {
  job: {
    id: string;
    title: string;
    skills: string[];
  };
  clusters: ClusterInfo[];
  candidates: CandidateClusterPoint[];
}

export interface FunnelTier {
  count: number;
  label: string;
  conversionRate?: string;
}

export interface FunnelDTO {
  applied: FunnelTier;
  screened: FunnelTier & { conversionRate: string };
  interviewed: FunnelTier & { conversionRate: string };
  offer: FunnelTier & { conversionRate: string };
  hired: FunnelTier & { conversionRate: string };
}

export interface SourcingSlice {
  source: string;
  percentage: number;
  color: string;
}

export interface SourcingDTO {
  totalShare: number;
  breakdown: SourcingSlice[];
}

export interface KpiItem {
  value: number;
  unit: string;
  trend: string;
}

export interface AnalyticsKpis {
  timeToHire: KpiItem;
  applicantConversion: KpiItem;
  aiMatchAccuracy: KpiItem;
  activeRequisitions: KpiItem;
}

export interface AvailableJob {
  id: string;
  title: string;
  applicantCount: number;
}

export interface AnalyticsDTO {
  kpis: AnalyticsKpis;
  funnel: FunnelDTO;
  sourcing: SourcingDTO;
  clusterMap: TalentClusterMapDTO;
  availableJobs: AvailableJob[];
}
