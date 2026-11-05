import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { LoginInputSchema } from "@/lib/features/auth/schema";
import { loginUser } from "@/lib/features/auth/service";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoginInputSchema.parse(body);
    const user = await loginUser(validated);
    return ok({ user });
  } catch (error) {
    return handleError(error);
  }
}
