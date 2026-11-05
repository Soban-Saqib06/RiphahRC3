import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleError } from "@/lib/api";
import { getResumeFile } from "@/lib/features/resumes/service";


export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ resumeId: string }> }
) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return auth.response;

    const { resumeId } = await context.params;
    const { buffer, originalFileName } = await getResumeFile(resumeId, auth.user);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(originalFileName)}"`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
