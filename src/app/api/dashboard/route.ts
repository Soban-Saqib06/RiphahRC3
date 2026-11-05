import { ok, handleError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/features/dashboard/service";

export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) {
      return auth.response;
    }
    const data = await getDashboardData(auth.user);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
