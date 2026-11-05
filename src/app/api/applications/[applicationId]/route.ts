import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { prisma } from "@/lib/db";
import {
  getApplicationForUser,
  toCandidateApplicationDTO,
  toApplicationSummary,
} from "@/lib/features/applications/service";
import { calculateProfileCompleteness } from "@/lib/features/profile/service";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ applicationId: string }> }
) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    const { applicationId } = await context.params;
    const app = await getApplicationForUser(applicationId, auth.user);

    // If Candidate: return strictly candidate DTO (no internal recruiter notes, assessment scores, questions)
    if (auth.user.role === "CANDIDATE") {
      const candidateDTO = toCandidateApplicationDTO(app);
      return ok({ application: candidateDTO });
    }

    // If Recruiter: return full ApplicationDetailDTO
    const questionCount = await prisma.interviewQuestion.count({
      where: { applicationId: app.id },
    });

    const parsedResumeCount = await prisma.resume.count({
      where: {
        candidateId: app.candidate.id,
        parseStatus: "PARSED",
      },
    });

    const completeness = calculateProfileCompleteness(
      app.candidate,
      parsedResumeCount > 0
    );

    const detailDTO = {
      ...toApplicationSummary(app),
      coverNote: app.coverNote,
      recruiterNotes: app.recruiterNotes,
      job: {
        id: app.job.id,
        title: app.job.title,
        department: app.job.department,
        location: app.job.location,
        employmentType: app.job.employmentType,
        salaryMin: app.job.salaryMin,
        salaryMax: app.job.salaryMax,
        salaryCurrency: app.job.salaryCurrency,
        status: app.job.status,
        createdAt: app.job.createdAt.toISOString(),
        updatedAt: app.job.updatedAt.toISOString(),
        closedAt: app.job.closedAt ? app.job.closedAt.toISOString() : null,
        description: app.job.description,
        minYearsExperience: app.job.minYearsExperience,
        requiredQualifications: app.job.requiredQualifications,
        applicantCount: app.job._count?.applications ?? 0,
        recruiter: app.job.recruiter,
        skills: app.job.skills.map((s: any) => ({
          id: s.id,
          name: s.name,
          priority: s.priority,
          importance: s.importance,
        })),
      },
      profile: {
        id: app.candidate.id,
        userId: app.candidate.user.id,
        name: app.candidate.user.name,
        email: app.candidate.user.email,
        headline: app.candidate.headline,
        phone: app.candidate.phone,
        location: app.candidate.location,
        summary: app.candidate.summary,
        linkedinUrl: app.candidate.linkedinUrl,
        githubUrl: app.candidate.githubUrl,
        profileCompleteness: completeness,
      },
      resume: {
        id: app.resume.id,
        originalFileName: app.resume.originalFileName,
        fileSizeBytes: app.resume.fileSizeBytes,
        parseStatus: app.resume.parseStatus,
        parseError: app.resume.parseError,
        uploadedAt: app.resume.uploadedAt.toISOString(),
        parsedAt: app.resume.parsedAt ? app.resume.parsedAt.toISOString() : null,
        parsedData: app.resume.parsedData,
      },
      assessment: app.assessment
        ? {
            id: app.assessment.id,
            applicationId: app.assessment.applicationId,
            status: app.assessment.status,
            overallScore: app.assessment.overallScore,
            effectiveScore: app.assessment.overrideScore ?? app.assessment.overallScore,
            dimensionScores: {
              skills: app.assessment.skillsScore,
              experience: app.assessment.experienceScore,
              projects: app.assessment.projectsScore,
              qualifications: app.assessment.qualificationsScore,
            },
            weights: app.assessment.weights,
            summary: app.assessment.summary,
            modelId: app.assessment.modelId,
            errorMessage: app.assessment.errorMessage,
            generatedAt: app.assessment.generatedAt
              ? app.assessment.generatedAt.toISOString()
              : null,
            override: {
              score: app.assessment.overrideScore,
              note: app.assessment.overrideNote,
              at: app.assessment.overriddenAt
                ? app.assessment.overriddenAt.toISOString()
                : null,
              by: app.assessment.overriddenBy,
            },
            items: app.assessment.items.map((it: any) => ({
              id: it.id,
              dimension: it.dimension,
              requirement: it.requirement,
              jobSkillId: it.jobSkillId,
              priority: it.priority,
              importance: it.importance,
              verdict: it.verdict,
              evidenceExcerpt: it.evidenceExcerpt,
              reasoning: it.reasoning,
            })),
          }
        : null,
      statusEvents: app.statusEvents.map((ev: any) => ({
        id: ev.id,
        fromStatus: ev.fromStatus,
        toStatus: ev.toStatus,
        note: ev.note,
        changedBy: ev.changedBy,
        createdAt: ev.createdAt.toISOString(),
      })),
      interviews: app.interviews.map((inv: any) => ({
        id: inv.id,
        applicationId: inv.applicationId,
        scheduledAt: inv.scheduledAt.toISOString(),
        durationMinutes: inv.durationMinutes,
        type: inv.type,
        interviewerName: inv.interviewerName,
        location: inv.location,
        status: inv.status,
        feedbackNotes: inv.feedbackNotes,
        createdAt: inv.createdAt.toISOString(),
      })),
      questionCount,
    };

    return ok({ application: detailDTO });
  } catch (error) {
    return handleError(error);
  }
}
