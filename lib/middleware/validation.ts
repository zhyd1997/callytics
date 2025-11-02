/**
 * Validation Middleware
 * Provides reusable validation utilities for requests and data
 */

import { z, ZodError, ZodSchema } from "zod";
import { ValidationError, ErrorFactory } from "@/lib/errors";
import { createLogger } from "@/lib/logging/logger";
import type { Result } from "@/lib/utils/result";
import { ok, err } from "@/lib/utils/result";

const logger = createLogger("middleware:validation");

/**
 * Validates data against a Zod schema and returns Result
 */
export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: string,
): Result<T, ValidationError> {
  try {
    const validated = schema.parse(data);
    return ok(validated);
  } catch (error) {
    if (error instanceof ZodError) {
      const contextStr = context ? ` in ${context}` : "";
      logger.warn(`Validation failed${contextStr}`, undefined, error);
      
      return err(
        ErrorFactory.validation(
          `Validation failed${contextStr}`,
          error.flatten(),
        ),
      );
    }

    logger.error("Unexpected error during validation", error, { context });
    return err(ErrorFactory.validation("Validation error", error));
  }
}

/**
 * Validates data and throws on error (for use in contexts where Result pattern isn't used)
 */
export function validateOrThrow<T>(
  schema: ZodSchema<T>,
  data: unknown,
  context?: string,
): T {
  const result = validate(schema, data, context);
  
  if (!result.success) {
    throw result.error;
  }
  
  return result.data;
}

/**
 * Creates a validation middleware function for specific schema
 */
export function createValidator<T>(schema: ZodSchema<T>, context?: string) {
  return (data: unknown): Result<T, ValidationError> => {
    return validate(schema, data, context);
  };
}

/**
 * Validates pagination parameters
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * Validates and normalizes pagination parameters
 */
export function validatePagination(
  data: unknown,
): Result<PaginationParams, ValidationError> {
  return validate(paginationSchema, data, "pagination");
}

/**
 * Converts page-based pagination to skip/take format
 */
export function paginationToSkipTake(pagination: PaginationParams): {
  skip: number;
  take: number;
} {
  return {
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  };
}
