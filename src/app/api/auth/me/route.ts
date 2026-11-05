import { ok, fail, handleError } from "@/lib/api";
import { getCurrentUser } from "@/lib/features/auth/service";


export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return fail("UNAUTHENTICATED", "Authentication required", 401);
    }
    return ok({ user });
  } catch (error) {
    return handleError(error);
  }
}
