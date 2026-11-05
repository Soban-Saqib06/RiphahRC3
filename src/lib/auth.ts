import { cookies } from "next/headers";
import crypto from "crypto";
import { promisify } from "util";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fail, ApiErrorResponse } from "@/lib/api";
import { Role, UserDTO } from "@/lib/dto";

const scryptAsync = promisify(crypto.scrypt);

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Hash password using Node built-in crypto.scrypt.
 * Output format: scrypt$<saltHex>$<hashHex>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}

/**
 * Verify password against stored scrypt$<saltHex>$<hashHex> string.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }

  const salt = Buffer.from(parts[1], "hex");
  const originalKey = Buffer.from(parts[2], "hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;

  if (originalKey.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalKey, derivedKey);
}

/**
 * Hash raw token with SHA-256 for database lookup.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new session in DB and set the HTTP-only session cookie.
 */
export async function createSession(
  userId: string
): Promise<{ token: string; expiresAt: Date }> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  // Clean up any existing expired sessions for this user
  await prisma.session
    .deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    })
    .catch(() => {});

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return { token, expiresAt };
}

/**
 * Destroy the current session by deleting it from DB and removing the cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashToken(token);
    await prisma.session
      .deleteMany({
        where: { tokenHash },
      })
      .catch(() => {});
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get current session user from the incoming request cookie.
 */
export async function getSessionUser(): Promise<UserDTO | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  // If expired, clean up and return null
  if (session.expiresAt < new Date()) {
    await prisma.session
      .delete({
        where: { id: session.id },
      })
      .catch(() => {});
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role as Role,
  };
}

export type RequireUserResult =
  | { ok: true; user: UserDTO }
  | { ok: false; response: NextResponse<ApiErrorResponse> };

/**
 * Authorize route handlers against optional allowed roles.
 */
export async function requireUser(
  allowedRoles?: Role[]
): Promise<RequireUserResult> {
  const user = await getSessionUser();

  if (!user) {
    return {
      ok: false,
      response: fail("UNAUTHENTICATED", "Authentication required", 401),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      ok: false,
      response: fail("FORBIDDEN", "Insufficient permissions to perform this action.", 403),
    };
  }

  return { ok: true, user };
}
