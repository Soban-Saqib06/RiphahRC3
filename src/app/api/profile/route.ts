import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api";
import { UpdateProfileSchema } from "@/lib/features/profile/schema";
import {
  getProfileForCandidate,
  updateProfileForCandidate,
} from "@/lib/features/profile/service";


export async function GET() {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const result = await getProfileForCandidate(auth.user.id);
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireUser(["CANDIDATE"]);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const validatedData = UpdateProfileSchema.parse(body);

    const result = await updateProfileForCandidate(auth.user.id, validatedData);
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
