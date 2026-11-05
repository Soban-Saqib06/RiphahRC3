import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly fields?: Record<string, string>;

  constructor(
    code: string,
    message: string,
    statusCode = 400,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export function ok<T>(data: T, status = 200, headers?: HeadersInit): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status, headers }
  );
}

export function fail(
  code: string,
  message: string,
  status = 400,
  fields?: Record<string, string>
): NextResponse<ApiErrorResponse> {
  const errorPayload: ApiErrorResponse["error"] = {
    code,
    message,
  };

  if (fields && Object.keys(fields).length > 0) {
    errorPayload.fields = fields;
  }

  return NextResponse.json(
    {
      success: false,
      error: errorPayload,
    },
    { status }
  );
}

export const successResponse = ok;
export const errorResponse = fail;

export function handleError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return fail(error.code, error.message, error.statusCode, error.fields);
  }

  if (error instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of error.issues) {
      const fieldPath = issue.path.join(".");
      if (fieldPath && !fields[fieldPath]) {
        fields[fieldPath] = issue.message;
      }
    }
    const firstErrorMessage =
      error.issues[0]?.message || "Input failed validation.";

    return fail("VALIDATION_ERROR", firstErrorMessage, 400, fields);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta?.target.join(", ")
        : "record";
      return fail(
        "CONFLICT",
        `A record with this ${target} already exists.`,
        409
      );
    }
    if (error.code === "P2025") {
      return fail("NOT_FOUND", "The requested record was not found.", 404);
    }
  }

  console.error("Unhandled API Error:", error);
  return fail(
    "INTERNAL_ERROR",
    "An unexpected error occurred. Please try again.",
    500
  );
}
