import { ok, handleError } from "@/lib/api";
import { logoutUser } from "@/lib/features/auth/service";


export async function POST() {
  try {
    await logoutUser();
    return ok({ loggedOut: true });
  } catch (error) {
    return handleError(error);
  }
}
