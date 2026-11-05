import { NextRequest } from "next/server";
import { ok, handleError } from "@/lib/api";
import { RegisterInputSchema } from "@/lib/features/auth/schema";
import { registerUser } from "@/lib/features/auth/service";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterInputSchema.parse(body);
    const user = await registerUser(validated);
    return ok({ user }, 201);
  } catch (error) {
    return handleError(error);
  }
}
