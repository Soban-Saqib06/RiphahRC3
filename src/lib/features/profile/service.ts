import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import { ProfileDTO, ResumeSummaryDTO } from "@/lib/dto";
import { UpdateProfileInput } from "./schema";

/**
 * Compute candidate profile completeness score (0-100%).
 * Count of the 6 items present / 6:
 * 1. headline
 * 2. phone
 * 3. location
 * 4. summary
 * 5. linkedinUrl or githubUrl
 * 6. at least one PARSED resume
 */
export function calculateProfileCompleteness(
  profile: {
    headline: string | null;
    phone: string | null;
    location: string | null;
    summary: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
  },
  hasParsedResume: boolean
): number {
  let count = 0;
  if (profile.headline && profile.headline.trim().length > 0) count++;
  if (profile.phone && profile.phone.trim().length > 0) count++;
  if (profile.location && profile.location.trim().length > 0) count++;
  if (profile.summary && profile.summary.trim().length > 0) count++;
  if (
    (profile.linkedinUrl && profile.linkedinUrl.trim().length > 0) ||
    (profile.githubUrl && profile.githubUrl.trim().length > 0)
  ) {
    count++;
  }
  if (hasParsedResume) count++;

  return Math.round((100 * count) / 6);
}

/**
 * Retrieve a candidate's profile and latest resume summary.
 */
export async function getProfileForCandidate(userId: string): Promise<{
  profile: ProfileDTO;
  latestResume: ResumeSummaryDTO | null;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      candidateProfile: {
        include: {
          resumes: {
            orderBy: { uploadedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!user || user.role !== "CANDIDATE") {
    throw new AppError("NOT_FOUND", "Candidate profile not found.", 404);
  }

  // Ensure candidate profile exists
  let candidateProfile = user.candidateProfile;
  if (!candidateProfile) {
    candidateProfile = await prisma.candidateProfile.create({
      data: { userId: user.id },
      include: {
        resumes: {
          orderBy: { uploadedAt: "desc" },
          take: 1,
        },
      },
    });
  }

  // Check if candidate has at least one PARSED resume
  const parsedResumeCount = await prisma.resume.count({
    where: {
      candidateId: candidateProfile.id,
      parseStatus: "PARSED",
    },
  });

  const completeness = calculateProfileCompleteness(
    candidateProfile,
    parsedResumeCount > 0
  );

  const profileDTO: ProfileDTO = {
    id: candidateProfile.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    headline: candidateProfile.headline,
    phone: candidateProfile.phone,
    location: candidateProfile.location,
    summary: candidateProfile.summary,
    linkedinUrl: candidateProfile.linkedinUrl,
    githubUrl: candidateProfile.githubUrl,
    profileCompleteness: completeness,
  };

  const rawResume = candidateProfile.resumes[0];
  const latestResumeDTO: ResumeSummaryDTO | null = rawResume
    ? {
        id: rawResume.id,
        originalFileName: rawResume.originalFileName,
        fileSizeBytes: rawResume.fileSizeBytes,
        parseStatus: rawResume.parseStatus as any,
        parseError: rawResume.parseError,
        uploadedAt: rawResume.uploadedAt.toISOString(),
        parsedAt: rawResume.parsedAt ? rawResume.parsedAt.toISOString() : null,
      }
    : null;

  return { profile: profileDTO, latestResume: latestResumeDTO };
}

/**
 * Update candidate profile and name.
 */
export async function updateProfileForCandidate(
  userId: string,
  data: UpdateProfileInput
): Promise<{ profile: ProfileDTO }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { candidateProfile: true },
  });

  if (!user || user.role !== "CANDIDATE") {
    throw new AppError("NOT_FOUND", "Candidate profile not found.", 404);
  }

  // Ensure candidate profile exists
  let profileRecord = user.candidateProfile;
  if (!profileRecord) {
    profileRecord = await prisma.candidateProfile.create({
      data: { userId: user.id },
    });
  }

  // Update user name if provided
  if (data.name !== undefined) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });
  }

  // Update candidate profile fields
  const updatedCandidateProfile = await prisma.candidateProfile.update({
    where: { id: profileRecord.id },
    data: {
      headline: data.headline !== undefined ? data.headline : undefined,
      phone: data.phone !== undefined ? data.phone : undefined,
      location: data.location !== undefined ? data.location : undefined,
      summary: data.summary !== undefined ? data.summary : undefined,
      linkedinUrl: data.linkedinUrl !== undefined ? (data.linkedinUrl || null) : undefined,
      githubUrl: data.githubUrl !== undefined ? (data.githubUrl || null) : undefined,
    },
  });

  const parsedResumeCount = await prisma.resume.count({
    where: {
      candidateId: updatedCandidateProfile.id,
      parseStatus: "PARSED",
    },
  });

  const completeness = calculateProfileCompleteness(
    updatedCandidateProfile,
    parsedResumeCount > 0
  );

  const updatedUser = await prisma.user.findUnique({ where: { id: userId } });

  const profileDTO: ProfileDTO = {
    id: updatedCandidateProfile.id,
    userId: user.id,
    name: updatedUser?.name ?? user.name,
    email: user.email,
    headline: updatedCandidateProfile.headline,
    phone: updatedCandidateProfile.phone,
    location: updatedCandidateProfile.location,
    summary: updatedCandidateProfile.summary,
    linkedinUrl: updatedCandidateProfile.linkedinUrl,
    githubUrl: updatedCandidateProfile.githubUrl,
    profileCompleteness: completeness,
  };

  return { profile: profileDTO };
}
