import { prisma } from "@/lib/db";
import { AppError } from "@/lib/api";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getSessionUser,
} from "@/lib/auth";
import { Role, UserDTO } from "@/lib/dto";
import { RegisterInput, LoginInput } from "./schema";

export async function registerUser(input: RegisterInput): Promise<UserDTO> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError(
      "EMAIL_TAKEN",
      "An account with this email already exists.",
      409
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      ...(input.role === "CANDIDATE"
        ? { candidateProfile: { create: {} } }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  await createSession(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
  };
}

export async function loginUser(input: LoginInput): Promise<UserDTO> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
      401
    );
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError(
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
      401
    );
  }

  await createSession(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role,
  };
}

export async function logoutUser(): Promise<void> {
  await destroySession();
}

export async function getCurrentUser(): Promise<UserDTO | null> {
  return await getSessionUser();
}
